import Image from 'next/image';
import Link from 'next/link';
import type { TrainingItem as TrainingItemType } from '@/types';

interface TrainingItemProps {
  item: TrainingItemType;
}

function parseProgress(progress: string): { current: number; total: number } {
  const match = progress.match(/^(\d+)\s*\/\s*(\d+)$/);
  if (!match) return { current: 0, total: 1 };
  return { current: parseInt(match[1], 10), total: Math.max(1, parseInt(match[2], 10)) };
}

type ItemState = 'not_started' | 'in_progress' | 'completed';

function getState(item: TrainingItemType): ItemState {
  const { current, total } = parseProgress(item.progress);
  if (current >= total && total > 0) return 'completed';
  if (current > 0) return 'in_progress';
  return 'not_started';
}

const solidButtonClass =
  'rounded-full bg-otto-burgundy px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90';
const outlineButtonClass =
  'rounded-full border border-otto-burgundy bg-white px-4 py-2 text-sm font-medium text-otto-burgundy transition-colors hover:bg-otto-burgundy hover:text-white';
const completedPillClass =
  'rounded-[10px] border border-otto-burgundy bg-otto-burgundy/10 px-3 py-1.5 text-sm font-medium text-otto-burgundy';

export function TrainingItem({ item }: TrainingItemProps) {
  const state = getState(item);
  const { current, total } = parseProgress(item.progress);
  const progressPercent = total > 0 ? Math.min(100, (current / total) * 100) : 0;

  return (
    <div className="flex min-h-[100px] flex-col overflow-hidden rounded-[10px] bg-[#f8f8f8] sm:flex-row sm:items-stretch">
      <div className="relative h-32 w-full flex-shrink-0 overflow-hidden rounded-t-[10px] bg-gray-100 sm:h-auto sm:w-36 sm:rounded-l-[10px] sm:rounded-tr-none">
        <Image
          src={item.thumbnail}
          alt={item.title}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, 144px"
        />
      </div>
      <div className="flex min-w-0 flex-1 flex-col justify-center gap-2 px-5 py-4 sm:py-5">
        <h3 className="font-sans text-base font-normal text-otto-burgundy">{item.title}</h3>
        <div className="min-h-[52px] space-y-1">
          <div className="flex items-center justify-between text-xs text-otto-burgundy/70">
            <span>Progress</span>
            <span>
              {current}/{total}
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-otto-burgundy/15">
            <div
              className="h-full rounded-full bg-otto-burgundy transition-[width]"
              style={{ width: `${progressPercent}%` }}
              aria-hidden
            />
          </div>
        </div>
      </div>
      <div className="flex min-h-[44px] w-full flex-shrink-0 flex-wrap items-center gap-2 p-3 sm:min-h-[40px] sm:w-[280px] sm:flex-shrink-0 sm:py-4 sm:pl-3 sm:pr-4">
        {state === 'not_started' && (
          <Link
            href={`/courses/${item.id}`}
            className={outlineButtonClass}
          >
            Start Learning
          </Link>
        )}
        {state === 'in_progress' && (
          <Link
            href={`/courses/${item.id}`}
            className={outlineButtonClass}
          >
            Continue Learning
          </Link>
        )}
        {state === 'completed' && (
          <>
            <Link
              href={`/courses/${item.id}`}
              className={solidButtonClass + ' cursor-pointer transition-opacity hover:opacity-90'}
            >
              Completed
            </Link>
            <button type="button" className={solidButtonClass}>
              View Certificate
            </button>
          </>
        )}
      </div>
    </div>
  );
}
