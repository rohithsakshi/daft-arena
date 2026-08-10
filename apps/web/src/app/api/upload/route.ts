import { NextRequest, NextResponse } from 'next/server';
import { cloudinaryService, CloudinaryFolder } from '@/lib/storage/CloudinaryService';
import { config } from '@/lib/config';
import fs from 'fs';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const folder = (formData.get('folder') as string || 'temp') as CloudinaryFolder;

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const isImage = file.type.startsWith('image/');
    
    const isCloudinaryConfigured = !!(
      config.CLOUDINARY_CLOUD_NAME &&
      config.CLOUDINARY_API_KEY &&
      config.CLOUDINARY_API_SECRET
    );

    if (isCloudinaryConfigured) {
      try {
        const result = isImage 
          ? await cloudinaryService.uploadImage(buffer, folder)
          : await cloudinaryService.uploadDocument(buffer, folder);

        return NextResponse.json({ success: true, url: result.secure_url, public_id: result.public_id }, { status: 200 });
      } catch (cloudinaryError: any) {
        console.warn('Cloudinary upload failed, falling back to local file storage:', cloudinaryError?.message || cloudinaryError);
      }
    }

    // Local file storage fallback for development
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads', folder);
    await fs.promises.mkdir(uploadsDir, { recursive: true });

    const sanitizeFilename = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filename = `${Date.now()}-${sanitizeFilename}`;
    const filePath = path.join(uploadsDir, filename);

    await fs.promises.writeFile(filePath, buffer);

    const publicUrl = `/uploads/${folder}/${filename}`;
    return NextResponse.json({
      success: true,
      url: publicUrl,
      public_id: `local-${folder}-${filename}`,
    }, { status: 200 });

  } catch (error: any) {
    console.error('Upload Error:', error);
    return NextResponse.json({ success: false, error: error?.message || 'Upload failed' }, { status: 500 });
  }
}
