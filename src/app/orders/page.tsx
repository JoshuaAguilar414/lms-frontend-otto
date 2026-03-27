import { AuthGuard } from '@/components/auth';
import { MyCoursesCard, OtherProductsCard } from '@/components/dashboard';
import { isMockModeEnabled, mockOrders } from '@/lib/mockData';

export default function OrdersPage() {
  return (
    <AuthGuard>
      <div className="bg-white">
        <div className="mx-auto max-w-full px-4 py-8 lg:px-[3.333rem]">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[7.5fr_2.5fr]">
            <MyCoursesCard orders={isMockModeEnabled ? mockOrders : undefined} />
            <OtherProductsCard />
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
