import { notFound } from "next/navigation";
import { db } from "@/db/client";
import { projects } from "@/db/schema";
import { eq } from "drizzle-orm";
import { ProjectEditor } from "@/components/admin/project-editor";
// ✅ استيراد النوع الصحيح للوحة التحكم
import type { AdminProject } from "@/lib/types"; 

export const metadata = { title: "Edit Project" };

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  
  // جلب المشروع من قاعدة البيانات (البيانات خام)
  const [project] = await db.select().from(projects).where(eq(projects.id, id)).limit(1);
  
  if (!project) notFound();
  
  // ✅ تمرير المشروع إلى المكون. TypeScript الآن يعرف أن هذا المشروع هو AdminProject
  return <ProjectEditor project={project as AdminProject} />;
}