import Link from 'next/link';
import Image from 'next/image';
import type { RelatedCourse } from '@/types';

interface RelatedCourseCardProps {
  course: RelatedCourse;
}

export function RelatedCourseCard({ course }: RelatedCourseCardProps) {
  return (
    <article className="flex h-full min-w-[280px] max-w-[320px] flex-shrink-0 flex-col overflow-hidden rounded-lg bg-[#f8f8f8]">
      <div className="relative p-4 py-2">
        <span className="inline-block rounded-full bg-otto-burgundy/10 px-2.5 py-0.5 text-xs font-medium text-otto-burgundy">
          {course.tag}
        </span>
      </div>
      <div className="overflow-hidden px-4">
        <Image
          src={course.thumbnail}
          alt=""
          width={320}
          height={200}
          className="w-full rounded-lg object-cover"
          sizes="(max-width: 400px) 280px, 320px"
        />
      </div>
      <div className="flex flex-1 flex-col p-4 pt-3">
        <h3 className="mb-2 line-clamp-2 text-base font-semibold text-otto-burgundy">
          {course.title}
        </h3>
        <p className="mb-4 line-clamp-2 flex-1 text-sm text-otto-burgundy/70">
          {course.description}
        </p>
        <div className="mt-auto flex items-center justify-between gap-2">
          <span className="text-sm font-medium text-otto-burgundy">{course.price}</span>
          <Link
            href={course.href}
            className="inline-flex items-center rounded-full border border-otto-burgundy bg-white px-3 py-1.5 text-sm font-medium text-otto-burgundy shadow-sm transition-colors hover:bg-otto-burgundy hover:text-white"
          >
            View
          </Link>
        </div>
      </div>
    </article>
  );
}
