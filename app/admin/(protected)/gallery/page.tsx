import { getAllGalleryAdmin } from "@/lib/data/admin";
import { GalleryManager } from "@/components/admin/gallery-manager";

export const metadata = { title: "Gallery" };

export default async function GalleryAdminPage() {
  const items = await getAllGalleryAdmin();
  return <GalleryManager items={items} />;
}
