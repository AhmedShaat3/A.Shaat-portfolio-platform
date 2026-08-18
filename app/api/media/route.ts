import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { db } from "@/db/client";
import { media } from "@/db/schema";
import { eq } from "drizzle-orm";
import { storage } from "@/lib/storage";
import { logActivity } from "@/lib/activity";

export async function DELETE(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await request.json();
  if (!id) {
    return NextResponse.json({ error: "Missing id." }, { status: 400 });
  }

  const [record] = await db.select().from(media).where(eq(media.id, id)).limit(1);
  if (!record) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  await storage.delete(record.url);
  await db.delete(media).where(eq(media.id, id));
  await logActivity({
    userId: user.id,
    action: "media.deleted",
    entityType: "media",
    entityId: id,
  });

  return NextResponse.json({ ok: true });
}
