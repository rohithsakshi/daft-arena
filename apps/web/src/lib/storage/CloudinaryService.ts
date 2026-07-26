import { v2 as cloudinary } from 'cloudinary';
import { config } from '../config';

cloudinary.config({
  cloud_name: config.CLOUDINARY_CLOUD_NAME,
  api_key: config.CLOUDINARY_API_KEY,
  api_secret: config.CLOUDINARY_API_SECRET,
});

export type CloudinaryFolder = 'profiles' | 'tournaments' | 'organizations' | 'sponsors' | 'certificates' | 'payments' | 'documents' | 'medical' | 'qr' | 'temp';

export class CloudinaryService {
  async uploadImage(buffer: Buffer, folder: CloudinaryFolder): Promise<{ public_id: string, secure_url: string }> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { 
          folder: `daft-arena/${folder}`,
          fetch_format: 'auto',
          quality: 'auto',
          responsive_breakpoints: [{
            create_derived: true,
            bytes_step: 20000,
            min_width: 200,
            max_width: 1000
          }]
        },
        (error, result) => {
          if (error || !result) reject(error || new Error('Upload failed'));
          else resolve({ public_id: result.public_id, secure_url: result.secure_url });
        }
      );
      uploadStream.end(buffer);
    });
  }

  async uploadDocument(buffer: Buffer, folder: CloudinaryFolder): Promise<{ public_id: string, secure_url: string }> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { 
          folder: `daft-arena/${folder}`,
          resource_type: 'raw' // Preserve original document format
        },
        (error, result) => {
          if (error || !result) reject(error || new Error('Upload failed'));
          else resolve({ public_id: result.public_id, secure_url: result.secure_url });
        }
      );
      uploadStream.end(buffer);
    });
  }

  async deleteFile(publicId: string): Promise<boolean> {
    try {
      const result = await cloudinary.uploader.destroy(publicId);
      return result.result === 'ok';
    } catch (error) {
      console.error('Error deleting file:', error);
      return false;
    }
  }

  async deleteFolder(folderPath: string): Promise<boolean> {
    try {
      await cloudinary.api.delete_resources_by_prefix(folderPath);
      await cloudinary.api.delete_folder(folderPath);
      return true;
    } catch (error) {
      console.error('Error deleting folder:', error);
      return false;
    }
  }

  async replaceFile(publicId: string, buffer: Buffer, folder: CloudinaryFolder, isImage = true): Promise<{ public_id: string, secure_url: string }> {
    await this.deleteFile(publicId);
    return isImage ? this.uploadImage(buffer, folder) : this.uploadDocument(buffer, folder);
  }
}

export const cloudinaryService = new CloudinaryService();
