import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import ProtectedRoute from '../../../../components/shared/ProtectedRoute';
import DashboardLayout from '../../../../components/shared/DashboardLayout';
import OrderDetail from '../../../../components/dashboard/OrderDetail';
import AssignTeamModal from '../../../../components/dashboard/AssignTeamModal';
import StatusUpdateModal from '../../../../components/dashboard/StatusUpdateModal';

const statusActions = [
  { label: 'Proses', status: 'Proses', color: 'btn-info' },
  { label: 'Selesai', status: 'Selesai', color: 'btn-success' },
  { label: 'Batal', status: 'Batal', color: 'btn-error' },
];

function AdminOrderDetailPage() {
  const router = useRouter();
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
      const res = await fetch(`/api/orders/${id}`);
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
      const res = await fetch('/api/users');
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
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'assign_team', team_id: teamId }),
      });
      if (!res.ok) {
        const data = await res.json();
        alert(data.error || 'Gagal menetapkan tim');
        return;
      }
      const updated = await res.json();
      setOrder(updated);
      setShowAssignModal(false);
    } catch {
      alert('Gagal menetapkan tim');
    }
  };

  const handleStatusClick = (newStatus) => {
    setPendingStatus(newStatus);
    setShowStatusModal(true);
  };

  const handleStatusConfirm = async (orderId, newStatus) => {
    try {
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
      setPendingStatus(null);
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
          <button className="btn btn-ghost" onClick={() => router.push('/dashboard/admin')}>
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

      <div className="divider" />

      <div className="card bg-base-100 border border-base-300">
        <div className="card-body">
          <h3 className="card-title text-lg mb-4">Aksi</h3>

          <div className="flex flex-wrap gap-3">
            <button
              className="btn btn-outline btn-primary btn-sm"
              onClick={() => setShowAssignModal(true)}
            >
              Assign Tim
            </button>

            {statusActions.map((action) => (
              <button
                key={action.status}
                className={`btn ${action.color} btn-sm`}
                onClick={() => handleStatusClick(action.status)}
              >
                {action.label}
              </button>
            ))}
          </div>

          <div className="alert alert-info mt-4 text-sm">
            <span>Item pesanan tidak dapat diubah setelah tersimpan.</span>
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
