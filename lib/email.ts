import crypto from "crypto";

const BREVO_API_KEY = process.env.BREVO_API_KEY;
const EMAIL_FROM = process.env.EMAIL_FROM || "noreply@formitect.app";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

function isEmailConfigured(): boolean {
  return Boolean(BREVO_API_KEY && BREVO_API_KEY.trim().length > 0);
}

function parseSender(raw: string): { name: string; email: string } {
  const m = raw.match(/^\s*(.*?)\s*<([^>]+)>\s*$/);
  if (m) return { name: m[1], email: m[2] };
  return { name: "Formitect", email: raw };
}

async function sendEmail(to: string, subject: string, html: string) {
  if (!isEmailConfigured()) {
    console.warn("[Formitect] Email not configured (BREVO_API_KEY missing). Email not sent.");
    console.warn(`[Formitect] Email preview — To: ${to} | Subject: ${subject}`);
    console.warn(`[Formitect] HTML preview:\n${html}`);
    throw new Error("Email is not configured. Set BREVO_API_KEY in your environment.");
  }

  const sender = parseSender(EMAIL_FROM);

  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "api-key": BREVO_API_KEY!,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      sender,
      to: [{ email: to }],
      subject,
      htmlContent: html,
    }),
  });

  if (!res.ok) {
    const error = await res.text().catch(() => "unknown");
    throw new Error(`Failed to send email: ${error}`);
  }
}

function brandHeader(): string {
  return `
<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px 0;">
  <div style="margin-bottom: 24px;">
    <span style="display: inline-flex; align-items: center; justify-content: center; width: 36px; height: 36px; border-radius: 8px; background: #4f46e5; color: white; font-size: 14px; font-weight: 900;">F</span>
  </div>
`;
}

function brandFooter(): string {
  return `
<div style="margin-top: 32px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #9ca3af; line-height: 1.6;">
  You received this email from <strong>Formitect</strong>. If you didn't request this, you can safely ignore it.<br>
  <a href="${APP_URL}" style="color: #6366f1;">formitect.app</a>
</div>
</div>`;
}

export async function sendPasswordResetEmail(to: string, token: string, userName: string | null) {
  const resetUrl = `${APP_URL}/reset-password?token=${token}`;
  const displayName = userName || "there";
  const html = `
${brandHeader()}
<div style="font-size: 15px; line-height: 1.6; color: #111827;">
  <p>Hi ${displayName},</p>
  <p>We received a request to reset the password for your Formitect account (<strong>${to}</strong>).</p>
  <p>Click the button below to set a new password. This link expires in <strong>1 hour</strong>.</p>
  <div style="margin: 24px 0;">
    <a href="${resetUrl}" style="display: inline-block; padding: 12px 28px; background: #4f46e5; color: white; font-weight: 600; font-size: 14px; border-radius: 12px; text-decoration: none;">
      Reset password
    </a>
  </div>
  <p style="font-size: 13px; color: #6b7280;">
    If the button doesn't work, copy and paste this link into your browser:<br>
    <a href="${resetUrl}" style="color: #4f46e5; word-break: break-all;">${resetUrl}</a>
  </p>
  <p style="font-size: 13px; color: #6b7280; margin-top: 16px;">
    If you didn't request a password reset, your account is safe — no action needed.
  </p>
</div>
${brandFooter()}`;

  await sendEmail(to, "Reset your Formitect password", html);
}

export async function sendVerificationEmail(to: string, token: string, userName: string | null) {
  const verifyUrl = `${APP_URL}/verify-email?token=${token}`;
  const displayName = userName || "there";
  const html = `
${brandHeader()}
<div style="font-size: 15px; line-height: 1.6; color: #111827;">
  <p>Hi ${displayName},</p>
  <p>Welcome to Formitect! Please verify your email address to get started.</p>
  <p>Click the button below to verify. This link expires in <strong>24 hours</strong>.</p>
  <div style="margin: 24px 0;">
    <a href="${verifyUrl}" style="display: inline-block; padding: 12px 28px; background: #4f46e5; color: white; font-weight: 600; font-size: 14px; border-radius: 12px; text-decoration: none;">
      Verify email
    </a>
  </div>
  <p style="font-size: 13px; color: #6b7280;">
    If the button doesn't work, copy and paste this link into your browser:<br>
    <a href="${verifyUrl}" style="color: #4f46e5; word-break: break-all;">${verifyUrl}</a>
  </p>
</div>
${brandFooter()}`;

  await sendEmail(to, "Verify your Formitect email", html);
}

export async function sendContactNotification(
  adminEmails: string[],
  contactName: string,
  contactEmail: string,
  subject: string,
  message: string
) {
  if (!isEmailConfigured() || adminEmails.length === 0) return;

  const html = `
${brandHeader()}
<div style="font-size: 15px; line-height: 1.6; color: #111827;">
  <p>New message from the <strong>Contact</strong> form on Formitect.</p>
  <div style="background: #f9fafb; border-radius: 12px; padding: 16px; margin: 16px 0;">
    <p><strong>From:</strong> ${contactName} &lt;${contactEmail}&gt;</p>
    <p><strong>Subject:</strong> ${subject || "(none)"}</p>
    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 12px 0;">
    <p style="white-space: pre-wrap;">${message}</p>
  </div>
  <p style="font-size: 13px; color: #6b7280;">
    Reply directly from your inbox to respond to ${contactName}.
  </p>
</div>
${brandFooter()}`;

  await sendEmail(adminEmails[0], `New contact message: ${subject || "Formitect"}`, html);
}

export async function sendSubmissionNotification(
  ownerEmail: string,
  ownerName: string | null,
  formTitle: string,
  submissionCount: number
) {
  if (!isEmailConfigured()) return;

  const html = `
${brandHeader()}
<div style="font-size: 15px; line-height: 1.6; color: #111827;">
  <p>Hi ${ownerName || "there"},</p>
  <p>Your form <strong>${formTitle}</strong> just received a new submission (#${submissionCount}).</p>
  <div style="margin: 24px 0;">
    <a href="${APP_URL}/dashboard" style="display: inline-block; padding: 12px 28px; background: #4f46e5; color: white; font-weight: 600; font-size: 14px; border-radius: 12px; text-decoration: none;">
      View responses
    </a>
  </div>
</div>
${brandFooter()}`;

  await sendEmail(ownerEmail, `New response on "${formTitle}"`, html);
}

export { isEmailConfigured, generateToken, hashToken };

function generateToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}
