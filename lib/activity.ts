import "server-only";
import { db } from "@/db/client";
import { activityLog } from "@/db/schema";
import { nanoid } from "@/lib/utils/id";

export async function logActivity(params: {
  userId?: string;
  action: string;
  entityType?: string;
  entityId?: string;
  details?: string;
}) {
  try {
    await db.insert(activityLog).values({
      id: nanoid(),
      userId: params.userId,
      action: params.action,
      entityType: params.entityType,
      entityId: params.entityId,
      details: params.details,
    });
  } catch {
    // Activity logging must never break the primary action.
  }
}
