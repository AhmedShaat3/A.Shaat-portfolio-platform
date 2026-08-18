import { getProfile } from "@/lib/data/public";
import { getAllContentAllLocales } from "@/lib/data/content";
import { getAllStatisticsAdmin, getAllSocialLinksAdmin } from "@/lib/data/admin";
import { ContentAdminTabs } from "@/components/admin/content-admin-tabs";

export const metadata = { title: "Website Content" };

export default async function ContentAdminPage() {
  const [profile, blocks, stats, social] = await Promise.all([
    getProfile(),
    getAllContentAllLocales(),
    getAllStatisticsAdmin(),
    getAllSocialLinksAdmin(),
  ]);

  return <ContentAdminTabs profile={profile} blocks={blocks} stats={stats} social={social} />;
}
