import fs from 'fs';
import path from 'path';

export class StorageService {
  private baseDir: string;

  constructor() {
    // Default to a public uploads folder
    this.baseDir = path.join(process.cwd(), 'public', 'uploads');
    this.ensureDirectoryExists();
  }

  private ensureDirectoryExists() {
    if (!fs.existsSync(this.baseDir)) {
      fs.mkdirSync(this.baseDir, { recursive: true });
    }
  }

  /**
   * Uploads a file to the local storage mechanism.
   * Future phases can abstract this to upload to S3/Cloudinary.
   */
  async uploadFile(file: File, folder: string = 'general'): Promise<string> {
    const targetDir = path.join(this.baseDir, folder);
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    const extension = file.name.split('.').pop() || 'tmp';
    const filename = `${crypto.randomUUID()}.${extension}`;
    const filePath = path.join(targetDir, filename);

    const buffer = Buffer.from(await file.arrayBuffer());
    fs.writeFileSync(filePath, buffer);

    // Return the public URL path
    return `/uploads/${folder}/${filename}`;
  }

  async deleteFile(fileUrl: string): Promise<boolean> {
    try {
      if (!fileUrl.startsWith('/uploads/')) return false;
      const relativePath = fileUrl.replace('/uploads/', '');
      const filePath = path.join(this.baseDir, relativePath);
      
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error deleting file:', error);
      return false;
    }
  }
}

export const storageService = new StorageService();
