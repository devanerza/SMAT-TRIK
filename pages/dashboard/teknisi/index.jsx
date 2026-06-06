import { useState } from 'react';
import { useRouter } from 'next/router';
import ProtectedRoute from '../../../components/shared/ProtectedRoute';
import DashboardLayout from '../../../components/shared/DashboardLayout';
import OrderTable from '../../../components/dashboard/OrderTable';
import { useOrders } from '../../../hooks/useOrders';

function TeknisiDashboardPage() {
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState('');
  const [dateStart, setDateStart] = useState('');
  const [dateEnd, setDateEnd] = useState('');

  const { orders, loading } = useOrders({
    status: statusFilter || undefined,
    startDate: dateStart || undefined,
    endDate: dateEnd || undefined,
  });

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Dashboard Teknisi</h1>
        <p className="text-sm text-slate-500 mt-1">
          Menampilkan pesanan yang ditugaskan ke tim Anda.
        </p>
      </div>
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <OrderTable
          orders={orders}
          statusFilter={statusFilter}
          dateStart={dateStart}
          dateEnd={dateEnd}
          onStatusFilter={setStatusFilter}
          onDateStartChange={setDateStart}
          onDateEndChange={setDateEnd}
          onOrderClick={(id) => router.push(`/dashboard/teknisi/orders/${id}`)}
          loading={loading}
        />
      </div>
    </DashboardLayout>
  );
}

export default function TeknisiDashboardPageProtected() {
  return (
    <ProtectedRoute allowedRole="teknisi">
      <TeknisiDashboardPage />
    </ProtectedRoute>
  );
}
