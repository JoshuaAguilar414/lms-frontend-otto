import { AuthGuard } from '@/components/auth';
import { MyPurchasesCard, OtherProductsCard } from '@/components/dashboard';
import { isMockModeEnabled, mockPurchases } from '@/lib/mockData';

export default function ProductsPage() {
  return (
    <AuthGuard>
      <div className="bg-white">
        <div className="mx-auto max-w-full px-4 py-8 lg:px-[3.333rem]">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[7.5fr_2.5fr]">
            <MyPurchasesCard purchases={isMockModeEnabled ? mockPurchases : undefined} />
            <OtherProductsCard />
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
