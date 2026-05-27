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
      <h1 className="text-2xl font-bold mb-6">Dashboard Teknisi</h1>
      <p className="text-sm text-base-content/60 mb-4">
        Menampilkan pesanan yang ditugaskan ke tim Anda.
      </p>
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
