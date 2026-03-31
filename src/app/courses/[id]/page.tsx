import { notFound } from 'next/navigation';
import { AuthGuard } from '@/components/auth';
import { Card } from '@/components/ui';
import { ScormEmbed } from '@/components/embed/ScormEmbed';
import { RelatedCoursesSlider } from '@/components/courses/RelatedCoursesSlider';
import type { RelatedCourse } from '@/types';
import { isMockModeEnabled, mockCourseCatalog } from '@/lib/mockData';
import { getUploadedCourseById, getUploadedCourses } from '@/lib/adminStorage';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const MARKETPLACE_BASE = 'https://www.ottogroup.com';

function marketplaceProductUrl(handle: string): string {
  return `${MARKETPLACE_BASE}/products/${handle}`;
}

function buildScormUrl(course: {
  scormUrl?: string | null;
  admissionId?: string | null;
}): string | undefined {
  if (course.scormUrl) return course.scormUrl;
  if (course.admissionId) return `/scorm-player?admissionId=${course.admissionId}`;
  return (
    process.env.NEXT_PUBLIC_SCORM_SAMPLE_URL ||
    '/scorm/index.html'
  );
}

interface ApiCourse {
  _id: string;
  title: string;
  tag?: string;
  description?: string;
  thumbnail?: string;
  handle?: string;
  scormUrl?: string;
  admissionId?: string;
  totalLessons?: number;
}

async function fetchCourse(id: string): Promise<ApiCourse | null> {
  const uploaded = await getUploadedCourseById(id);
  if (uploaded) return uploaded;
  if (isMockModeEnabled) {
    return mockCourseCatalog.find((course) => course._id === id) ?? null;
  }

  try {
    const res = await fetch(`${API_BASE}/api/courses/${id}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

async function fetchCourses(): Promise<ApiCourse[]> {
  const uploadedCourses = await getUploadedCourses();
  if (uploadedCourses.length > 0) return uploadedCourses;
  if (isMockModeEnabled) {
    return mockCourseCatalog;
  }

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

function toRelatedCourse(c: ApiCourse): RelatedCourse {
  return {
    id: c._id,
    title: c.title,
    description: c.description ?? '',
    thumbnail: c.thumbnail ?? 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=250&fit=crop',
    tag: c.tag || 'Course',
    price: '',
    href: c.handle ? marketplaceProductUrl(c.handle) : `/courses/${c._id}`,
  };
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function CourseProgressPage({ params }: PageProps) {
  const { id } = await params;

  const [course, allCourses] = await Promise.all([
    fetchCourse(id),
    fetchCourses(),
  ]);

  if (!course) notFound();

  const scormUrl = buildScormUrl(course);

  const relatedCourses: RelatedCourse[] = allCourses
    .filter((c) => c._id !== id)
    .slice(0, 8)
    .map(toRelatedCourse);

  return (
    <AuthGuard>
    <div className="bg-[#ffffff]">
      <div className="mx-auto max-w-full px-4 py-8 lg:px-[3.333rem]">
        {scormUrl ? (
          <Card className="mt-4 overflow-hidden bg-[#f8f8f8] p-0">
            <ScormEmbed
              src={scormUrl}
              title={course.title}
              minHeight={900}
            />
          </Card>
        ) : (
          <Card className="mt-8 bg-[#f8f8f8]">
            <h2 className="mb-4 text-lg font-semibold text-otto-burgundy">Course content</h2>
            <div className="flex min-h-[320px] items-center justify-center rounded-lg bg-[#f8f8f8] text-otto-burgundy/70">
              <p className="text-center text-sm">
                No SCORM package URL configured for this course.
                <br />
                Set <code className="rounded bg-otto-burgundy/10 px-1 text-otto-burgundy">scormUrl</code> or{' '}
                <code className="rounded bg-otto-burgundy/10 px-1 text-otto-burgundy">admissionId</code> on the course, or{' '}
                <code className="rounded bg-otto-burgundy/10 px-1 text-otto-burgundy">NEXT_PUBLIC_SCORM_SAMPLE_URL</code> in .env.
              </p>
            </div>
          </Card>
        )}
        <Card className="mb-4 mt-4 bg-[#f8f8f8] pb-8">
          <RelatedCoursesSlider courses={relatedCourses} />
        </Card>
      </div>
    </div>
    </AuthGuard>
  );
}
