import { NextResponse } from 'next/server';
import { saveScormUpload } from '@/lib/adminStorage';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const productId = String(formData.get('productId') || '').trim();
    const title = String(formData.get('title') || '').trim();
    const tag = String(formData.get('tag') || '').trim();
    const description = String(formData.get('description') || '').trim();
    const image = formData.get('image');
    const file = formData.get('file');

    if (!productId || !title || !tag || !description) {
      return NextResponse.json(
        { error: 'productId, title, tag, and description are required.' },
        { status: 400 }
      );
    }
    if (!(image instanceof File)) {
      return NextResponse.json({ error: 'Product image file is required.' }, { status: 400 });
    }
    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'SCORM file is required.' }, { status: 400 });
    }
    if (!file.name.toLowerCase().endsWith('.zip')) {
      return NextResponse.json(
        { error: 'SCORM file must be a .zip package.' },
        { status: 400 }
      );
    }

    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const imageFileBuffer = Buffer.from(await image.arrayBuffer());
    const savedCourse = await saveScormUpload({
      productId,
      title,
      tag,
      description,
      imageFileName: image.name,
      imageFileBuffer,
      fileName: file.name,
      fileBuffer,
    });

    return NextResponse.json({
      message: 'SCORM uploaded successfully.',
      course: savedCourse,
      scormUrl: savedCourse.scormUrl,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Failed to upload SCORM package.';
    console.error('SCORM upload error:', error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
