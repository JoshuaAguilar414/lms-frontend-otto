import { AuthGuard } from '@/components/auth';
import { MyTrainingsCard, OtherProductsCard } from '@/components/dashboard';
import { isMockModeEnabled, mockTrainings } from '@/lib/mockData';

export default function DashboardPage() {
  return (
    <AuthGuard>
    <div className="bg-white">
      <div className="mx-auto max-w-full px-4 py-8 lg:px-[3.333rem]">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[7.5fr_2.5fr]">
          <MyTrainingsCard trainings={isMockModeEnabled ? mockTrainings : undefined} />
          <OtherProductsCard />
        </div>
      </div>
    </div>
    </AuthGuard>
  );
}
