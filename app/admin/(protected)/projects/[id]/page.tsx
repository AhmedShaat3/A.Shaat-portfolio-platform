import { notFound } from "next/navigation";
import { db } from "@/db/client";
import { projects } from "@/db/schema";
import { eq } from "drizzle-orm";
import { ProjectEditor } from "@/components/admin/project-editor";

export const metadata = { title: "Edit Project" };

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [project] = await db.select().from(projects).where(eq(projects.id, id)).limit(1);
  if (!project) notFound();
  return <ProjectEditor project={project} />;
}
