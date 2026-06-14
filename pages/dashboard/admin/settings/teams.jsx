import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';
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
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      const headers = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch('/api/users', { headers });
      if (res.ok) {
        const data = await res.json();
        setTeams(data);
      }
    } catch (error) {
      console.error('Error fetching data: ' + error)
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
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch('/api/users', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          email: form.email.trim(),
          password: form.password,
          name: form.name.trim() || '',
          phone: form.phone.trim() || '',
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
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch(`/api/users/${id}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify(updates),
      });
      console.log(res)
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
          <span className="loading loading-spinner loading-lg text-orange-500" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Tim Teknisi</h1>
        <button
          className="inline-flex items-center justify-center px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-lg shadow-sm hover:shadow transition-all duration-200"
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
        <form onSubmit={handleAdd} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-control">
              <label className="block text-sm font-semibold text-slate-600 mb-1.5">Email</label>
              <input
                type="email"
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
            <div className="form-control">
              <label className="block text-sm font-semibold text-slate-600 mb-1.5">Password</label>
              <input
                type="password"
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
            </div>
            <div className="form-control">
              <label className="block text-sm font-semibold text-slate-600 mb-1.5">Nama</label>
              <input
                type="text"
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div className="form-control">
              <label className="block text-sm font-semibold text-slate-600 mb-1.5">No. Telepon</label>
              <input
                type="text"
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </div>
          </div>
          <div className="mt-4">
            <button type="submit" className="inline-flex items-center justify-center px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-lg shadow-sm hover:shadow transition-all duration-200">
              Simpan
            </button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="text-left font-semibold text-slate-500 px-6 py-3.5">Nama</th>
                <th className="text-left font-semibold text-slate-500 px-6 py-3.5">Email</th>
                <th className="text-left font-semibold text-slate-500 px-6 py-3.5">Telepon</th>
                <th className="text-left font-semibold text-slate-500 px-6 py-3.5">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {teams.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-8 text-slate-400">
                    Belum ada teknisi
                  </td>
                </tr>
              ) : (
                teams.map((team) => (
                  <tr key={team.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                    {editingId === team.id ? (
                      <>
                        <td className="px-6 py-3">
                          <input
                            type="text"
                            className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                          />
                        </td>
                        <td className="text-slate-500 px-6 py-3">{team.email}</td>
                        <td className="px-6 py-3">
                          <input
                            type="text"
                            className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors"
                            value={form.phone}
                            onChange={(e) => setForm({ ...form, phone: e.target.value })}
                          />
                        </td>
                        <td className="px-6 py-3 flex gap-2">
                          <button
                            className="inline-flex items-center justify-center px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white font-semibold text-xs rounded-lg transition-colors"
                            onClick={() => handleUpdate(team.id)}
                          >
                            Simpan
                          </button>
                          <button
                            className="inline-flex items-center justify-center px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-600 border border-slate-300 font-semibold text-xs rounded-lg transition-colors"
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
                        <td className="font-medium text-slate-800 px-6 py-3.5">{team.name || '-'}</td>
                        <td className="text-slate-600 px-6 py-3.5">{team.email}</td>
                        <td className="text-slate-600 px-6 py-3.5">{team.phone || '-'}</td>
                        <td className="px-6 py-3.5">
                          <button
                            className="text-orange-600 hover:text-orange-700 font-semibold text-xs transition-colors"
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
