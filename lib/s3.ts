import { S3Client, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export const S3_BUCKET = process.env.S3_BUCKET_NAME ?? "";
const S3_ENDPOINT = process.env.S3_ENDPOINT ?? "";
const S3_ACCESS_KEY = process.env.S3_ACCESS_KEY_ID ?? "";
const S3_SECRET_KEY = process.env.S3_SECRET_ACCESS_KEY ?? "";
const S3_REGION = process.env.S3_REGION ?? "us-east-1";

export function isS3Configured() {
  return Boolean(S3_BUCKET && S3_ENDPOINT && S3_ACCESS_KEY && S3_SECRET_KEY);
}

export function getS3Client() {
  return new S3Client({
    endpoint: S3_ENDPOINT,
    region: S3_REGION,
    forcePathStyle: true,
    credentials: {
      accessKeyId: S3_ACCESS_KEY,
      secretAccessKey: S3_SECRET_KEY,
    },
  });
}

export function getS3Bucket() {
  return S3_BUCKET;
}

/** Generate a short-lived signed GET URL for an object (works on private buckets). */
export async function presignedObjectUrl(
  key: string,
  opts?: { download?: boolean; name?: string }
) {
  const safeName = (opts?.name ?? "file").replace(/[^a-zA-Z0-9._-]/g, "_");
  const command = new GetObjectCommand({
    Bucket: S3_BUCKET,
    Key: key,
    ResponseContentDisposition: opts?.download
      ? `attachment; filename="${safeName}"`
      : "inline",
  });
  return getSignedUrl(getS3Client(), command, { expiresIn: 3600 });
}

export { PutObjectCommand };