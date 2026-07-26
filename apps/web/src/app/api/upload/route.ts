import { NextRequest, NextResponse } from 'next/server';
import { storageService } from '@/lib/storage/StorageService';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const folder = formData.get('folder') as string || 'general';

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 });
    }

    const fileUrl = await storageService.uploadFile(file, folder);

    return NextResponse.json({ success: true, url: fileUrl }, { status: 200 });
  } catch (error: any) {
    console.error('Upload Error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
