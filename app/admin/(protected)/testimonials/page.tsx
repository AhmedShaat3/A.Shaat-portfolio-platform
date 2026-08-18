import { getAllTestimonialsAdmin } from "@/lib/data/admin";
import { TestimonialsManager } from "@/components/admin/testimonials-manager";

export const metadata = { title: "Testimonials" };

export default async function TestimonialsAdminPage() {
  const items = await getAllTestimonialsAdmin();
  return <TestimonialsManager items={items} />;
}
