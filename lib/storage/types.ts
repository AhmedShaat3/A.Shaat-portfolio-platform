export type StorageFolder =
  | "profile"
  | "projects"
  | "certificates"
  | "gallery"
  | "logos"
  | "other"
  | "cv";

export interface UploadResult {
  url: string;
  filename: string;
  size: number;
}

export interface StorageAdapter {
  /** Persist a file buffer and return its public URL. */
  upload(params: {
    buffer: Buffer;
    filename: string;
    folder: StorageFolder;
    mimeType: string;
  }): Promise<UploadResult>;

  /** Delete a previously uploaded file by its public URL. */
  delete(url: string): Promise<void>;
}
