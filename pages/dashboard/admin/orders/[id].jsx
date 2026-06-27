import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '@/lib/supabaseClient';
import ProtectedRoute from '../../../../components/shared/ProtectedRoute';
import DashboardLayout from '../../../../components/shared/DashboardLayout';
import OrderDetail from '../../../../components/dashboard/OrderDetail';
import AssignTeamModal from '../../../../components/dashboard/AssignTeamModal';
import StatusUpdateModal from '../../../../components/dashboard/StatusUpdateModal';
import { useToast } from '../../../../components/shared/Toast';

const statusActions = [
  { label: 'Proses', status: 'Proses', color: 'info' },
  { label: 'Selesai', status: 'Selesai', color: 'success' },
  { label: 'Batal', status: 'Batal', color: 'error' },
];

function AdminOrderDetailPage() {
  const router = useRouter();
  const toast = useToast();
  const { id } = router.query;
  const [order, setOrder] = useState(null);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [pendingStatus, setPendingStatus] = useState(null);

  const fetchOrder = useCallback(async () => {
    if (!id) return;
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch(`/api/orders/${id}`, {
        headers: headers,
      });
      if (!res.ok) {
        setError('Pesanan tidak ditemukan');
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

  const fetchTeams = useCallback(async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch('/api/users', {
        headers: headers,
      });
      if (res.ok) {
        const data = await res.json();
        setTeams(data);
      }
    } catch {
    }
  }, []);

  useEffect(() => {
    fetchOrder();
    fetchTeams();
  }, [fetchOrder, fetchTeams]);

  const handleAssignTeam = async (orderId, teamId) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ action: 'assign_team', team_id: teamId }),
      });
      if (!res.ok) {
        const data = await res.json();
        toast(data.error || 'Gagal menetapkan tim', 'error');
        return;
      }
      const updated = await res.json();
      setOrder(updated);
      setShowAssignModal(false);
    } catch {
      toast('Gagal menetapkan tim', 'error');
    }
  };

  const handleStatusClick = (newStatus) => {
    setPendingStatus(newStatus);
    setShowStatusModal(true);
  };

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
      setPendingStatus(null);
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
          <button className="inline-flex items-center justify-center px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-semibold text-sm rounded-lg shadow-sm hover:shadow transition-all duration-200" onClick={() => router.push('/dashboard/admin')}>
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
        onBack={() => router.push('/dashboard/admin')}
      />

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 mt-6">
        <div className="p-6">
          <h3 className="text-lg font-extrabold text-slate-900 mb-4">Aksi</h3>

          <div className="flex flex-wrap gap-3">
            <button
              className="inline-flex items-center justify-center px-4 py-2 bg-white hover:bg-slate-50 text-orange-600 border border-orange-300 font-bold text-xs rounded-lg shadow-sm hover:shadow transition-all duration-200"
              onClick={() => setShowAssignModal(true)}
            >
              Assign Tim
            </button>

            {statusActions.map((action) => (
              <button
                key={action.status}
                className={`inline-flex items-center justify-center px-4 py-2 font-bold text-xs rounded-lg shadow-sm hover:shadow transition-all duration-200 ${
                  action.color === 'info'
                    ? 'bg-blue-500 hover:bg-blue-600 text-white'
                    : action.color === 'success'
                    ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
                    : 'bg-red-500 hover:bg-red-600 text-white'
                }`}
                onClick={() => handleStatusClick(action.status)}
              >
                {action.label}
              </button>
            ))}
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mt-4">
            <p className="text-blue-700 text-xs font-medium">Item pesanan tidak dapat diubah setelah tersimpan.</p>
          </div>
        </div>
      </div>

      {showAssignModal && (
        <AssignTeamModal
          order={order}
          teams={teams}
          onAssign={handleAssignTeam}
          onClose={() => setShowAssignModal(false)}
        />
      )}

      {showStatusModal && (
        <StatusUpdateModal
          order={order}
          newStatus={pendingStatus}
          onConfirm={handleStatusConfirm}
          onClose={() => {
            setShowStatusModal(false);
            setPendingStatus(null);
          }}
        />
      )}
    </DashboardLayout>
  );
}

export default function AdminOrderDetailPageProtected() {
  return (
    <ProtectedRoute allowedRole="admin">
      <AdminOrderDetailPage />
    </ProtectedRoute>
  );
}
