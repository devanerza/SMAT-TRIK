import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '@/lib/supabaseClient';
import ProtectedRoute from '../../../../components/shared/ProtectedRoute';
import DashboardLayout from '../../../../components/shared/DashboardLayout';
import OrderDetail from '../../../../components/dashboard/OrderDetail';
import StatusUpdateModal from '../../../../components/dashboard/StatusUpdateModal';
import { useToast } from '../../../../components/shared/Toast';

function TeknisiOrderDetailPage() {
  const router = useRouter();
  const toast = useToast();
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
        headers,
        body: JSON.stringify({ action: 'update_status', status: newStatus }),
      });
      if (!res.ok) {
        const data = await res.json();
        toast(data.error || 'Gagal memperbarui status', 'error');
        return;
      }
      const updated = await res.json();
      setOrder(updated);
      setShowStatusModal(false);
    } catch {
      toast('Gagal memperbarui status', 'error');
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center py-12">
          <span className="loading loading-spinner loading-lg text-orange-500" />
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 max-w-md mx-auto">
          <p className="text-red-700 text-sm font-medium">{error}</p>
        </div>
        <div className="text-center mt-4">
          <button className="inline-flex items-center justify-center px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-semibold text-sm rounded-lg shadow-sm hover:shadow transition-all duration-200" onClick={() => router.push('/dashboard/teknisi')}>
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

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 mt-6">
        <div className="p-6">
          <h3 className="text-lg font-extrabold text-slate-900 mb-4">Aksi</h3>

          {order.status === 'Proses' && (
            <button
              className="inline-flex items-center justify-center px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-lg shadow-sm hover:shadow transition-all duration-200"
              onClick={() => setShowStatusModal(true)}
            >
              Tandai Selesai
            </button>
          )}

          {order.status === 'Selesai' && (
            <p className="text-sm text-slate-400">
              Pesanan ini telah selesai.
            </p>
          )}

          {order.status === 'Pending' && (
            <p className="text-sm text-slate-400">
              Menunggu konfirmasi admin.
            </p>
          )}

          {order.status === 'Batal' && (
            <p className="text-sm text-slate-400">
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
