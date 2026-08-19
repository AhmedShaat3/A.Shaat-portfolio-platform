import { put, del } from '@vercel/blob';
import type { StorageAdapter, StorageFolder, UploadResult } from './types';

export const vercelBlobAdapter: StorageAdapter = {
  async upload(params: {
    buffer: Buffer;
    filename: string;
    folder: StorageFolder;
    mimeType: string;
  }): Promise<UploadResult> {
    const { buffer, filename, folder, mimeType } = params;
    
    const path = `${folder}/${filename}`;
    
    const blob = await put(path, buffer, {
      access: 'public',
      contentType: mimeType,
      token: process.env.BLOB_READ_WRITE_TOKEN,
      addRandomSuffix: true,
    });

    return {
      url: blob.url,
      filename: blob.pathname.split('/').pop() || filename,
      size: buffer.length,
    };
  },

  async delete(url: string): Promise<void> {
    await del(url, {
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });
  },
};