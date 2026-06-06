import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '@/lib/supabaseClient';
import ProtectedRoute from '../../../../components/shared/ProtectedRoute';
import DashboardLayout from '../../../../components/shared/DashboardLayout';
import OrderDetail from '../../../../components/dashboard/OrderDetail';
import StatusUpdateModal from '../../../../components/dashboard/StatusUpdateModal';

function TeknisiOrderDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);

  const fetchOrder = useCallback(async () => {
    if (!id) return;
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch(`/api/orders/${id}`, {
        headers: headers
      });
      if (!res.ok) {
        setError('Pesanan tidak ditemukan atau akses ditolak');
        return;
      }
      const data = await res.json();
      setOrder(data);
    } catch {
      setError('Gagal memuat data pesanan');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  const handleStatusConfirm = async (orderId, newStatus) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;
      
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'update_status', status: newStatus }),
      });
      if (!res.ok) {
        const data = await res.json();
        alert(data.error || 'Gagal memperbarui status');
        return;
      }
      const updated = await res.json();
      setOrder(updated);
      setShowStatusModal(false);
    } catch {
      alert('Gagal memperbarui status');
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center py-12">
          <span className="loading loading-spinner loading-lg text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="alert alert-error max-w-md mx-auto">
          <span>{error}</span>
        </div>
        <div className="text-center mt-4">
          <button className="btn btn-ghost" onClick={() => router.push('/dashboard/teknisi')}>
            Kembali ke Dashboard
          </button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <OrderDetail
        order={order}
        onBack={() => router.push('/dashboard/teknisi')}
      />

      <div className="divider" />

      <div className="card bg-base-100 border border-base-300">
        <div className="card-body">
          <h3 className="card-title text-lg mb-4">Aksi</h3>

          {order.status === 'Proses' && (
            <button
              className="btn btn-success btn-sm"
              onClick={() => setShowStatusModal(true)}
            >
              Tandai Selesai
            </button>
          )}

          {order.status === 'Selesai' && (
            <p className="text-sm text-base-content/50">
              Pesanan ini telah selesai.
            </p>
          )}

          {order.status === 'Pending' && (
            <p className="text-sm text-base-content/50">
              Menunggu konfirmasi admin.
            </p>
          )}

          {order.status === 'Batal' && (
            <p className="text-sm text-base-content/50">
              Pesanan ini telah dibatalkan.
            </p>
          )}
        </div>
      </div>

      {showStatusModal && (
        <StatusUpdateModal
          order={order}
          newStatus="Selesai"
          onConfirm={handleStatusConfirm}
          onClose={() => setShowStatusModal(false)}
        />
      )}
    </DashboardLayout>
  );
}

export default function TeknisiOrderDetailPageProtected() {
  return (
    <ProtectedRoute allowedRole="teknisi">
      <TeknisiOrderDetailPage />
    </ProtectedRoute>
  );
}
