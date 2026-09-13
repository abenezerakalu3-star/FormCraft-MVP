import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import FormViewer from "@/components/form-viewer";

export default async function PublicFormPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const form = await prisma.form.findUnique({
    where: { slug },
    include: { fields: { orderBy: { order: "asc" } } },
  });

  if (!form || !form.published) notFound();

  return <FormViewer form={JSON.parse(JSON.stringify(form))} />;
}