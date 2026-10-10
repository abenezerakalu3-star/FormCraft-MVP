import { requireUser } from "@/lib/auth";
import DashboardWarningBanner from "@/components/dashboard-warning-banner";
import EmailVerificationBanner from "@/components/email-verification-banner";
import DashboardSidebar from "@/components/dashboard-sidebar";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();
  const warnings =
    (user.warnings as unknown as { message: string; by: string; at: string }[] | null) || [];

  return (
    <>
      {warnings.length > 0 && <DashboardWarningBanner message={warnings[warnings.length - 1].message} />}
      <EmailVerificationBanner
        emailVerified={user.emailVerified}
        email={user.email}
      />
      <DashboardSidebar name={user.name} email={user.email}>
        <div className="mx-auto max-w-5xl px-4 py-8 md:px-8">{children}</div>
      </DashboardSidebar>
    </>
  );
}
