import { NextResponse } from 'next/server';
import { deleteUploadedCourse, updateUploadedCourse } from '@/lib/adminStorage';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PUT(req: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = (await req.json().catch(() => ({}))) as {
      title?: string;
      tag?: string;
      description?: string;
    };

    const title = String(body.title || '').trim();
    const tag = String(body.tag || '').trim();
    const description = String(body.description || '').trim();

    if (!title || !tag || !description) {
      return NextResponse.json(
        { error: 'title, tag, and description are required.' },
        { status: 400 }
      );
    }

    const course = await updateUploadedCourse(id, { title, tag, description });
    return NextResponse.json({
      message: 'Product updated successfully.',
      course,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update product.';
    const status = message.toLowerCase().includes('not found') ? 404 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}

export async function DELETE(_: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    await deleteUploadedCourse(id);
    return NextResponse.json({
      message: 'Product deleted successfully.',
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to delete product.';
    const status = message.toLowerCase().includes('not found') ? 404 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
