import { getAllExperiencesAdmin } from "@/lib/data/admin";
import { ExperienceManager } from "@/components/admin/experience-manager";

export const metadata = { title: "Experience" };

export default async function ExperienceAdminPage() {
  const items = await getAllExperiencesAdmin();
  return <ExperienceManager items={items} />;
}
