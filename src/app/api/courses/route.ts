import { NextResponse } from 'next/server';
import { getUploadedCourses } from '@/lib/adminStorage';

export async function GET() {
  const courses = await getUploadedCourses();
  return NextResponse.json(courses);
}
