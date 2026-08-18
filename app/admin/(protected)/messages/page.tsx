import { getAllMessagesAdmin } from "@/lib/data/admin";
import { MessagesInbox } from "@/components/admin/messages-inbox";

export const metadata = { title: "Messages" };

export default async function MessagesAdminPage() {
  const items = await getAllMessagesAdmin();
  return <MessagesInbox items={items} />;
}
