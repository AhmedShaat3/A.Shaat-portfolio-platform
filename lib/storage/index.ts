import "server-only";
import { localStorageAdapter } from "./local";
import { vercelBlobAdapter } from "./vercel-blob-adapter";
import type { StorageAdapter } from "./types";

/**
 * STORAGE ABSTRACTION LAYER
 * -----------------------------------------------------------------------
 * All uploads in this app go through this single `storage` object, so the
 * backing provider can be swapped with one environment variable and no
 * changes to application code.
 *
 * STORAGE_DRIVER=local         -> writes to /public/uploads (default)
 * STORAGE_DRIVER=vercel-blob   -> requires `npm install @vercel/blob` and
 *                                 BLOB_READ_WRITE_TOKEN
 * STORAGE_DRIVER=s3            -> requires `npm install @aws-sdk/client-s3`
 * STORAGE_DRIVER=cloudinary    -> requires `npm install cloudinary`
 * -----------------------------------------------------------------------
 */

function resolveAdapter(): StorageAdapter {
  // Force Vercel Blob in production
  if (process.env.NODE_ENV === "production") {
    console.log("🔍 Production mode: forcing vercel-blob");
    return vercelBlobAdapter;
  }

  const driver = process.env.STORAGE_DRIVER ?? "local";

  switch (driver) {
    case "local":
      return localStorageAdapter;
    case "vercel-blob":
      return vercelBlobAdapter;
    case "s3":
    case "cloudinary":
      throw new Error(
        `STORAGE_DRIVER="${driver}" is not implemented in this build. ` +
          `Implement lib/storage/${driver}.ts against the StorageAdapter ` +
          `interface (see lib/storage/types.ts) and register it in ` +
          `lib/storage/index.ts. See SETUP.md for provider-specific steps.`
      );
    default:
      return localStorageAdapter;
  }
}

export const storage = resolveAdapter();
export * from "./types";