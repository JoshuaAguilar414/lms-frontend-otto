import { NextResponse } from 'next/server';
import { saveLogoUpload } from '@/lib/adminStorage';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('logo');

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'Logo file is required.' }, { status: 400 });
    }

    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const logoUrl = await saveLogoUpload({
      fileName: file.name,
      fileBuffer,
    });

    return NextResponse.json({
      message: 'Logo uploaded successfully.',
      logoUrl,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to upload logo.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
