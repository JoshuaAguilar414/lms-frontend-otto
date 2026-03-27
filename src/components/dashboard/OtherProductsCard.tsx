import Link from 'next/link';
import { Card, CardHeader } from '@/components/ui';
import { ShoppingCartIcon, ArrowRightIcon } from '@/components/icons';


const outlineButtonClass =
  'rounded-full border border-otto-burgundy bg-white px-4 py-2 text-sm font-medium text-otto-burgundy transition-colors hover:bg-otto-burgundy hover:text-white';


export function OtherProductsCard() {
  return (
    <Card className="flex flex-col self-start bg-[#f8f8f8]">
      <CardHeader title="Looking for Other Courses?" icon={<ShoppingCartIcon className="h-5 w-5 text-otto-burgundy" />} />
      <p className="mb-6 font-sans text-otto-burgundy/80">
      Explore more products on the Otto Group to build job-relevant skills across roles. Learn ESG, sustainability, and compliance essentials.
      </p>
      <div className="w-full">
        <Link
          href="https://www.ottogroup.com/collections/courses"
          className={`flex w-full items-center justify-center rounded-full gap-2 text-[14px] font-semibold leading-none ${outlineButtonClass}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          View All Courses
          <ArrowRightIcon className="h-5 w-5" />
        </Link>
      </div>
    </Card>
  );
}
