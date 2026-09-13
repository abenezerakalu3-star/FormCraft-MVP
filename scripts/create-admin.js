/* eslint-disable @typescript-eslint/no-require-imports */
const bcrypt = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME || "Super Admin";

  if (!email || !password) {
    console.error("Missing credentials — set ADMIN_EMAIL and ADMIN_PASSWORD");
    process.exit(1);
  }
  if (password.length < 8) {
    console.error("ADMIN_PASSWORD must be at least 8 characters");
    process.exit(1);
  }

  const admin = await prisma.user.upsert({
    where: { email },
    update: { role: "admin", name, password: await bcrypt.hash(password, 10), blocked: false },
    create: { email, role: "admin", name, password: await bcrypt.hash(password, 10) },
  });

  console.log(`Super admin ready — ${admin.email} (${admin.role})`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());