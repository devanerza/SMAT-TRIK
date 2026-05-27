import { useState, useEffect, useCallback } from 'react';
import ProtectedRoute from '../../../../components/shared/ProtectedRoute';
import DashboardLayout from '../../../../components/shared/DashboardLayout';

function AdminTeamsPage() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ email: '', password: '', name: '', phone: '' });
  const [showAddForm, setShowAddForm] = useState(false);

  const fetchTeams = useCallback(async () => {
    try {
      const res = await fetch('/api/users');
      if (res.ok) {
        const data = await res.json();
        setTeams(data);
      }
    } catch {
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTeams();
  }, [fetchTeams]);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.email.trim() || !form.password) return;

    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: form.email.trim(),
          password: form.password,
          name: form.name.trim() || null,
          phone: form.phone.trim() || null,
        }),
      });
      if (res.ok) {
        setForm({ email: '', password: '', name: '', phone: '' });
        setShowAddForm(false);
        fetchTeams();
      } else {
        const data = await res.json();
        alert(data.error || 'Gagal menambahkan teknisi');
      }
    } catch {
      alert('Gagal menambahkan teknisi');
    }
  };

  const handleUpdate = async (id) => {
    const updates = {};
    if (form.name) updates.name = form.name.trim();
    if (form.phone) updates.phone = form.phone.trim();

    try {
      const res = await fetch(`/api/users/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (res.ok) {
        setEditingId(null);
        setForm({ email: '', password: '', name: '', phone: '' });
        fetchTeams();
      } else {
        const data = await res.json();
        alert(data.error || 'Gagal mengupdate teknisi');
      }
    } catch {
      alert('Gagal mengupdate teknisi');
    }
  };

  const startEdit = (team) => {
    setEditingId(team.id);
    setForm({
      email: team.email || '',
      password: '',
      name: team.name || '',
      phone: team.phone || '',
    });
    setShowAddForm(false);
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

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Tim Teknisi</h1>
        <button
          className="btn btn-primary btn-sm"
          onClick={() => {
            setShowAddForm(!showAddForm);
            setEditingId(null);
            setForm({ email: '', password: '', name: '', phone: '' });
          }}
        >
          {showAddForm ? 'Batal' : 'Tambah Teknisi'}
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleAdd} className="card bg-base-100 border border-base-300 p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label"><span className="label-text">Email</span></label>
              <input
                type="email"
                className="input input-bordered input-sm"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
            <div className="form-control">
              <label className="label"><span className="label-text">Password</span></label>
              <input
                type="password"
                className="input input-bordered input-sm"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
            </div>
            <div className="form-control">
              <label className="label"><span className="label-text">Nama</span></label>
              <input
                type="text"
                className="input input-bordered input-sm"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div className="form-control">
              <label className="label"><span className="label-text">No. Telepon</span></label>
              <input
                type="text"
                className="input input-bordered input-sm"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </div>
          </div>
          <div className="mt-4">
            <button type="submit" className="btn btn-primary btn-sm">
              Simpan
            </button>
          </div>
        </form>
      )}

      <div className="overflow-x-auto">
        <table className="table table-zebra">
          <thead>
            <tr>
              <th>Nama</th>
              <th>Email</th>
              <th>Telepon</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {teams.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-8 text-base-content/50">
                  Belum ada teknisi
                </td>
              </tr>
            ) : (
              teams.map((team) => (
                <tr key={team.id}>
                  {editingId === team.id ? (
                    <>
                      <td>
                        <input
                          type="text"
                          className="input input-bordered input-sm w-full"
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                        />
                      </td>
                      <td className="text-sm text-base-content/70">{team.email}</td>
                      <td>
                        <input
                          type="text"
                          className="input input-bordered input-sm w-full"
                          value={form.phone}
                          onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        />
                      </td>
                      <td className="flex gap-2">
                        <button
                          className="btn btn-primary btn-xs"
                          onClick={() => handleUpdate(team.id)}
                        >
                          Simpan
                        </button>
                        <button
                          className="btn btn-ghost btn-xs"
                          onClick={() => {
                            setEditingId(null);
                            setForm({ email: '', password: '', name: '', phone: '' });
                          }}
                        >
                          Batal
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="font-medium">{team.name || '-'}</td>
                      <td className="text-sm">{team.email}</td>
                      <td className="text-sm">{team.phone || '-'}</td>
                      <td>
                        <button
                          className="btn btn-ghost btn-xs"
                          onClick={() => startEdit(team)}
                        >
                          Ubah
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}

export default function AdminTeamsPageProtected() {
  return (
    <ProtectedRoute allowedRole="admin">
      <AdminTeamsPage />
    </ProtectedRoute>
  );
}
