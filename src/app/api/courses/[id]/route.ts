import { NextResponse } from 'next/server';
import { getUploadedCourseById } from '@/lib/adminStorage';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_: Request, { params }: RouteParams) {
  const { id } = await params;
  const course = await getUploadedCourseById(id);
  if (!course) {
    return NextResponse.json({ error: 'Course not found' }, { status: 404 });
  }
  return NextResponse.json(course);
}
