import { IStorageProvider } from './IStorageProvider';

export class DefaultStorageProvider implements IStorageProvider {
  async uploadFile(file: Buffer, fileName: string, mimeType: string): Promise<string> {
    return `https://storage.daftarena.com/mock/${fileName}`;
  }
  async deleteFile(fileUrl: string): Promise<boolean> {
    return true;
  }
  async getSignedUrl(fileUrl: string, expiresIn?: number): Promise<string> {
    return `${fileUrl}?signed=true`;
  }
}
