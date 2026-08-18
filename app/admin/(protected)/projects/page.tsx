import { getAllProjectsAdmin } from "@/lib/data/admin";
import { ProjectsList } from "@/components/admin/projects-list";

export const metadata = { title: "Projects" };

export default async function ProjectsAdminPage() {
  const items = await getAllProjectsAdmin();
  return <ProjectsList items={items} />;
}
