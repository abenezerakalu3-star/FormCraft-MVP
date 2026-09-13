import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import FormBuilder from "@/components/form-builder";

export default async function BuilderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await requireUser();
  const { id } = await params;

  const form = await prisma.form.findFirst({
    where: { id, userId: user.id },
    include: { fields: { orderBy: { order: "asc" } } },
  });

  if (!form) notFound();

  return <FormBuilder form={JSON.parse(JSON.stringify(form))} />;
}