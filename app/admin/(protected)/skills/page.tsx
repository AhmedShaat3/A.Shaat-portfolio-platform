import { getAllSkillsAdmin } from "@/lib/data/admin";
import { SkillsManager } from "@/components/admin/skills-manager";

export const metadata = { title: "Skills" };

export default async function SkillsAdminPage() {
  const items = await getAllSkillsAdmin();
  return <SkillsManager items={items} />;
}
