import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';
import ProtectedRoute from '../../../../components/shared/ProtectedRoute';
import DashboardLayout from '../../../../components/shared/DashboardLayout';
import { useToast } from '../../../../components/shared/Toast';

function AdminServicesPage() {
  const toast = useToast();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ name: '', price: '' });
  const [showAddForm, setShowAddForm] = useState(false);

  const fetchServices = useCallback(async () => {
    try {
      const res = await fetch('/api/services');
      if (res.ok) {
        const data = await res.json();
        setServices(data);
      }
    } catch {
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch('/api/services', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          name: form.name.trim(),
          price: form.price ? parseInt(form.price) : 0,
        }),
      });
      if (res.ok) {
        setForm({ name: '', price: '' });
        setShowAddForm(false);
        fetchServices();
      } else {
        const data = await res.json();
        toast(data.error || 'Gagal menambahkan layanan', 'error');
      }
    } catch {
      toast('Gagal menambahkan layanan', 'error');
    }
  };

  const handleUpdate = async (id) => {
    const updates = {};
    if (form.name) updates.name = form.name.trim();
    if (form.price !== undefined) updates.price = form.price ? parseFloat(form.price) : null;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch(`/api/services/${id}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify(updates),
      });
      if (res.ok) {
        setEditingId(null);
        setForm({ name: '', price: '' });
        fetchServices();
      } else {
        const data = await res.json();
        toast(data.error || 'Gagal mengupdate layanan', 'error');
      }
    } catch {
      toast('Gagal mengupdate layanan', 'error');
    }
  };

  const startEdit = (service) => {
    setEditingId(service.id);
    setForm({
      name: service.name || '',
      price: service.price != null ? parseInt(service.price) : 0,
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
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Layanan</h1>
        <button
          className="inline-flex items-center justify-center px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-lg shadow-sm hover:shadow transition-all duration-200"
          onClick={() => {
            setShowAddForm(!showAddForm);
            setEditingId(null);
            setForm({ name: '', price: '' });
          }}
        >
          {showAddForm ? 'Batal' : 'Tambah Layanan'}
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleAdd} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="form-control">
              <label className="block text-sm font-semibold text-slate-600 mb-1.5">Nama Layanan</label>
              <input
                type="text"
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>
            <div className="form-control">
              <label className="block text-sm font-semibold text-slate-600 mb-1.5">Harga (Rp)</label>
              <input
                type="number"
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
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
                <th className="text-left font-semibold text-slate-500 px-6 py-3.5">Harga</th>
                <th className="text-left font-semibold text-slate-500 px-6 py-3.5">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {services.length === 0 ? (
                <tr>
                  <td colSpan="3" className="text-center py-8 text-slate-400">
                    Belum ada layanan
                  </td>
                </tr>
              ) : (
                services.map((service) => (
                  <tr key={service.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                    {editingId === service.id ? (
                      <>
                        <td className="px-6 py-3">
                          <input
                            type="text"
                            className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                          />
                        </td>
                        <td className="px-6 py-3">
                          <input
                            type="number"
                            className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors"
                            value={form.price}
                            onChange={(e) => setForm({ ...form, price: e.target.value })}
                          />
                        </td>
                        <td className="px-6 py-3 flex gap-2">
                          <button
                            className="inline-flex items-center justify-center px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white font-semibold text-xs rounded-lg transition-colors"
                            onClick={() => handleUpdate(service.id)}
                          >
                            Simpan
                          </button>
                          <button
                            className="inline-flex items-center justify-center px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-600 border border-slate-300 font-semibold text-xs rounded-lg transition-colors"
                            onClick={() => {
                              setEditingId(null);
                              setForm({ name: '', price: '' });
                            }}
                          >
                            Batal
                          </button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="font-medium text-slate-800 px-6 py-3.5">{service.name}</td>
                        <td className="text-slate-600 px-6 py-3.5">
                          {service.price != null
                            ? `Rp ${service.price.toLocaleString('id-ID')}`
                            : '-'}
                        </td>
                        <td className="px-6 py-3.5">
                          <button
                            className="text-orange-600 hover:text-orange-700 font-semibold text-xs transition-colors"
                            onClick={() => startEdit(service)}
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

export default function AdminServicesPageProtected() {
  return (
    <ProtectedRoute allowedRole="admin">
      <AdminServicesPage />
    </ProtectedRoute>
  );
}
