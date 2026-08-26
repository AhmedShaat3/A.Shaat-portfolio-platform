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
    
    // قراءة المتغيرات مع التحقق من وجودها
    const token = process.env.BLOB_READ_WRITE_TOKEN;
    const storeId = process.env.BLOB_STORE_ID;
    
    console.log("🔍 Token exists:", !!token);
    console.log("🔍 StoreId exists:", !!storeId);
    
    if (!token) {
      throw new Error("BLOB_READ_WRITE_TOKEN is not set");
    }
    
    const blob = await put(path, buffer, {
      access: 'public',
      contentType: mimeType,
      token: token,
      storeId: storeId || undefined,
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