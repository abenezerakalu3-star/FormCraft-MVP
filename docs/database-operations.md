# Formitect — Database Operations

Reference for backing up, restoring, and safely changing the Postgres
database used by Formitect (Prisma, provider `postgresql`).

## Connection

`DATABASE_URL` in `.env` points at the Neon pooler host. Prisma reads it
from the environment. Never hardcode credentials in the repo.

## Migrations

Migrations live in `prisma/migrations/`. After pulling new code on any
environment:

```bash
npm install
npx prisma migrate deploy   # applies pending migrations, no prompt
npx prisma generate         # regenerates the client to match the schema
```

`prisma migrate dev` is for local development only — it can prompt and can
reset data. Never run it against production.

### Existing databases created before migrations existed

If an environment was originally set up with `prisma db push` (no migration
history), the manual migrations in `prisma/migrations/` are *additive only*
(new columns, new tables, unique indexes) and can be applied safely on top.
Verify with:

```bash
npx prisma migrate status   # should report "Database schema is up to date!"
```

If it reports un-applied migrations while the database already has the
columns (schema drift), reconcile manually — do **not** blindly run
`migrate reset`.

## Backups

Postgres bases its durability model on WAL (Write-Ahead Log). The database
is the only irreplaceable state in Formitect: users, session data, forms,
submissions, contact messages, blog posts, settings.

### Logical backup (portable, for everything)

```bash
# Full dump, all schemas, plain SQL
pg_dump "$DATABASE_URL" > formitect_$(date +%F).sql

# Restore into an empty database
createdb "$DATABASE_URL" -h host -p 5432 formitect_restore
psql "$DATABASE_URL" -h host -p 5432 -d formitect_restore < formitect_2026-09-16.sql
```

### Hosted providers (Neon, RDS, Supabase)

Use the provider's managed snapshots/point-in-time recovery as the primary
backup — they handle WAL archiving and PITR for you. Keep logical `pg_dump`
backups as a second, provider-independent copy (e.g. nightly to object
storage: `S3_BUCKET` or a separate backup bucket).

### File uploads

Uploaded files are stored either on S3 (if `S3_*` vars are set) or on local
disk under `public/uploads` (dev fallback). Back up the S3 bucket with
bucket versioning, and the local dir with your snapshot tooling. The DB
stores only keys/URLs, so the DB + storage together make a complete backup.

## Safety checklist

- [ ] Backups automated and verified to restore at least twice a year
- [ ] `BACKUP_SCHEDULE` documented by provider (default: nightly logical + provider snapshots)
- [ ] Migrations are additive-only unless explicitly reviewed
- [ ] `prisma migrate dev` never run on production
- [ ] `.env` holds no credentials (only `.env.local`/secrets manager)
- [ ] `DATABASE_URL` uses the pooled connection string in production

## Restore drill

1. Take a fresh `pg_dump` of current state (so nothing is lost on the way back).
2. Restore into a scratch database and validate: user count, latest form/submission timestamps.
3. Only then promote: point `DATABASE_URL` at the restored database.
4. Update `prisma migrate status` to match, and re-run `prisma generate`.