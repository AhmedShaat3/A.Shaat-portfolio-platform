import "server-only";
import { localStorageAdapter } from "./local";
import type { StorageAdapter } from "./types";

/**
 * STORAGE ABSTRACTION LAYER
 * -----------------------------------------------------------------------
 * All uploads in this app go through this single `storage` object, so the
 * backing provider can be swapped with one environment variable and no
 * changes to application code.
 *
 * STORAGE_DRIVER=local     -> writes to /public/uploads (default, works
 *                              out of the box, fine for a single-instance
 *                              deployment or local dev)
 * STORAGE_DRIVER=vercel-blob -> requires `npm install @vercel/blob` and
 *                              BLOB_READ_WRITE_TOKEN. See SETUP.md.
 * STORAGE_DRIVER=s3          -> requires `npm install @aws-sdk/client-s3`
 *                              and AWS_* env vars. See SETUP.md.
 * STORAGE_DRIVER=cloudinary  -> requires `npm install cloudinary` and
 *                              CLOUDINARY_* env vars. See SETUP.md.
 *
 * Only `local` is wired up with a real implementation in this delivery,
 * because the other three require live credentials for services this
 * environment has no access to. The interface (lib/storage/types.ts) is
 * final — implementing any of the other adapters is a matter of writing
 * one file that satisfies `StorageAdapter` and adding it to the switch
 * below. Local storage IS production-viable if you deploy to a host with
 * a persistent filesystem; on Vercel specifically, uploads must use Blob
 * or S3 since the filesystem is ephemeral there.
 * -----------------------------------------------------------------------
 */

function resolveAdapter(): StorageAdapter {
  const driver = process.env.STORAGE_DRIVER ?? "local";

  switch (driver) {
    case "local":
      return localStorageAdapter;
    case "vercel-blob":
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
