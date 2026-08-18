import { getAllMediaAdmin } from "@/lib/data/admin";
import { MediaLibrary } from "@/components/admin/media-library";

export const metadata = { title: "Media Library" };

export default async function MediaAdminPage() {
  const items = await getAllMediaAdmin();
  return <MediaLibrary items={items} />;
}
