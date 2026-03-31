import Link from 'next/link';
import { AuthGuard } from '@/components/auth';
import { Card } from '@/components/ui';
import { isMockModeEnabled, mockCourseCatalog } from '@/lib/mockData';
import { getUploadedCourses } from '@/lib/adminStorage';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const FALLBACK_COURSE_IMAGE =
  'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=500&fit=crop';

interface ApiCourse {
  _id: string;
  title: string;
  tag?: string;
  description?: string;
  thumbnail?: string;
}

async function fetchCourses(): Promise<ApiCourse[]> {
  const uploadedCourses = await getUploadedCourses();
  if (uploadedCourses.length > 0) return uploadedCourses;
  if (isMockModeEnabled) return mockCourseCatalog;
  try {
    const res = await fetch(`${API_BASE}/api/courses`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export default async function CoursesPage() {
  const courses = await fetchCourses();

  return (
    <AuthGuard>
      <div className="bg-white">
        <div className="mx-auto max-w-full px-4 py-8 lg:px-[3.333rem]">
          <h1 className="text-2xl font-semibold text-otto-burgundy lg:text-3xl">Training Courses</h1>
          <p className="mt-2 text-sm text-otto-burgundy/70">
            Browse uploaded courses and open any course to start learning.
          </p>

          {courses.length === 0 ? (
            <Card className="mt-6 bg-[#f8f8f8]">
              <p className="text-sm text-otto-burgundy/70">No uploaded courses found yet.</p>
            </Card>
          ) : (
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {courses.map((course) => (
                <Card key={course._id} className="flex h-full flex-col justify-between bg-[#f8f8f8]">
                  <div>
                    <div className="mb-4 overflow-hidden rounded-lg bg-white">
                      <img
                        src={course.thumbnail || FALLBACK_COURSE_IMAGE}
                        alt={course.title}
                        className="h-44 w-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-otto-burgundy/60">
                      {course.tag || 'Course'}
                    </p>
                    <h2 className="mt-2 line-clamp-2 text-lg font-semibold text-otto-burgundy">{course.title}</h2>
                    <p className="mt-2 line-clamp-3 text-sm text-otto-burgundy/70">
                      {course.description || 'Uploaded training course.'}
                    </p>
                  </div>
                  <Link
                    href={`/courses/${course._id}`}
                    className="mt-5 inline-flex w-fit items-center rounded-full border border-otto-burgundy bg-white px-4 py-2 text-sm font-medium text-otto-burgundy transition-colors hover:bg-otto-burgundy hover:text-white"
                  >
                    Open Course
                  </Link>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </AuthGuard>
  );
}
