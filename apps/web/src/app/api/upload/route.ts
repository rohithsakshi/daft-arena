import { NextRequest, NextResponse } from 'next/server';
import { cloudinaryService, CloudinaryFolder } from '@/lib/storage/CloudinaryService';

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
    
    const result = isImage 
      ? await cloudinaryService.uploadImage(buffer, folder)
      : await cloudinaryService.uploadDocument(buffer, folder);

    return NextResponse.json({ success: true, url: result.secure_url, public_id: result.public_id }, { status: 200 });
  } catch (error: any) {
    console.error('Upload Error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
