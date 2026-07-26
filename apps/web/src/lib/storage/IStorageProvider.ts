export interface IStorageProvider {
  uploadFile(file: Buffer, fileName: string, mimeType: string): Promise<string>;
  deleteFile(fileUrl: string): Promise<boolean>;
  getSignedUrl(fileUrl: string, expiresIn?: number): Promise<string>;
}
