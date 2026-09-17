import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { planLimitsFor } from "@/lib/entitlements";
import FormViewer from "@/components/form-viewer";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const form = await prisma.form
    .findUnique({
      where: { slug },
      select: { title: true, description: true, published: true },
    })
    .catch(() => null);
  if (!form || !form.published) return { title: "Form not found" };
  return {
    title: form.title,
    description: form.description || `Fill out this form and submit your response.`,
    alternates: { canonical: `/form/${slug}` },
    robots: { index: false, follow: false },
  };
}

export default async function PublicFormPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const form = await prisma.form.findUnique({
    where: { slug },
    include: {
      fields: { orderBy: { order: "asc" } },
      user: {
        select: {
          blocked: true,
          plan: true,
          planStatus: true,
          currentPeriodEnd: true,
        },
      },
    },
  });

  if (!form || !form.published || form.user.blocked) notFound();

  const showBranding = !planLimitsFor(form.user).removeBranding;

  return (
    <FormViewer
      form={JSON.parse(JSON.stringify(form))}
      showBranding={showBranding}
    />
  );
}