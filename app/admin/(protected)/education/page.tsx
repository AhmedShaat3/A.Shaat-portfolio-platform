import { getAllEducationAdmin } from "@/lib/data/admin";
import { EducationManager } from "@/components/admin/education-manager";

export const metadata = { title: "Education" };

export default async function EducationAdminPage() {
  const items = await getAllEducationAdmin();
  return <EducationManager items={items} />;
}
