import "server-only";
import { writeFile, unlink } from "node:fs/promises";
import path from "node:path";
import { nanoid } from "@/lib/utils/id";
import type { StorageAdapter, StorageFolder } from "./types";

const UPLOAD_ROOT = path.join(process.cwd(), "public", "uploads");

function sanitizeFilename(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9.\-]/g, "-")
    .replace(/-+/g, "-");
}

export const localStorageAdapter: StorageAdapter = {
  async upload({ buffer, filename, folder, mimeType: _mimeType }) {
    const ext = path.extname(filename) || "";
    const safeBase = sanitizeFilename(path.basename(filename, ext));
    const finalName = `${safeBase}-${nanoid(8)}${ext}`;
    const dir = path.join(UPLOAD_ROOT, folder);
    const filePath = path.join(dir, finalName);

    await writeFile(filePath, buffer);

    return {
      url: `/uploads/${folder}/${finalName}`,
      filename: finalName,
      size: buffer.byteLength,
    };
  },

  async delete(url: string) {
    if (!url.startsWith("/uploads/")) return; // don't touch external/CDN urls
    const filePath = path.join(process.cwd(), "public", url);
    try {
      await unlink(filePath);
    } catch {
      // File may already be gone — non-fatal.
    }
  },
};
