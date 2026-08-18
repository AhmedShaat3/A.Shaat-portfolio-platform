import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { storage, type StorageFolder } from "@/lib/storage";
import { db } from "@/db/client";
import { media } from "@/db/schema";
import { nanoid } from "@/lib/utils/id";
import { logActivity } from "@/lib/activity";

const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
]);
const ALLOWED_DOC_TYPES = new Set(["application/pdf"]);
const MAX_SIZE_BYTES = 8 * 1024 * 1024; // 8MB

const VALID_FOLDERS: StorageFolder[] = [
  "profile",
  "projects",
  "certificates",
  "gallery",
  "logos",
  "other",
  "cv",
];

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");
  const folderRaw = formData.get("folder")?.toString() ?? "other";
  const altText = formData.get("altText")?.toString();

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided." }, { status: 400 });
  }

  const folder = VALID_FOLDERS.includes(folderRaw as StorageFolder)
    ? (folderRaw as StorageFolder)
    : "other";

  const isPdf = ALLOWED_DOC_TYPES.has(file.type);
  const isImage = ALLOWED_IMAGE_TYPES.has(file.type);

  if (!isPdf && !isImage) {
    return NextResponse.json(
      { error: "Unsupported file type. Allowed: JPEG, PNG, WebP, GIF, SVG, PDF." },
      { status: 400 }
    );
  }

  if (file.size > MAX_SIZE_BYTES) {
    return NextResponse.json(
      { error: "File exceeds the 8MB size limit." },
      { status: 400 }
    );
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const result = await storage.upload({
    buffer,
    filename: file.name,
    folder,
    mimeType: file.type,
  });

  const [record] = await db
    .insert(media)
    .values({
      id: nanoid(),
      filename: result.filename,
      originalName: file.name,
      url: result.url,
      mimeType: file.type,
      size: result.size,
      altText: altText || null,
      folder,
    })
    .returning();

  await logActivity({
    userId: user.id,
    action: "media.uploaded",
    entityType: "media",
    entityId: record.id,
  });

  return NextResponse.json({ media: record });
}
