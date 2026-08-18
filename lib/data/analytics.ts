import "server-only";
import { db } from "@/db/client";
import { projects, certificates, analyticsEvents } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { nanoid } from "@/lib/utils/id";
import { headers } from "next/headers";

function detectDeviceType(userAgent: string | null): string {
  if (!userAgent) return "unknown";
  if (/mobile/i.test(userAgent)) return "mobile";
  if (/tablet|ipad/i.test(userAgent)) return "tablet";
  return "desktop";
}

export async function recordPageView(path: string) {
  try {
    const hdrs = await headers();
    await db.insert(analyticsEvents).values({
      id: nanoid(),
      type: "page_view",
      path,
      referrer: hdrs.get("referer") ?? null,
      deviceType: detectDeviceType(hdrs.get("user-agent")),
    });
  } catch {
    // Analytics must never break page rendering.
  }
}

export async function recordProjectView(projectId: string) {
  try {
    await db
      .update(projects)
      .set({ viewCount: sql`${projects.viewCount} + 1` })
      .where(eq(projects.id, projectId));
    const hdrs = await headers();
    await db.insert(analyticsEvents).values({
      id: nanoid(),
      type: "project_view",
      refId: projectId,
      referrer: hdrs.get("referer") ?? null,
      deviceType: detectDeviceType(hdrs.get("user-agent")),
    });
  } catch {
    // Non-fatal.
  }
}

export async function recordCertificateView(certificateId: string) {
  try {
    await db
      .update(certificates)
      .set({ viewCount: sql`${certificates.viewCount} + 1` })
      .where(eq(certificates.id, certificateId));
  } catch {
    // Non-fatal.
  }
}
