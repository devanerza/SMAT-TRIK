import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';
import ProtectedRoute from '../../../../components/shared/ProtectedRoute';
import DashboardLayout from '../../../../components/shared/DashboardLayout';

function AdminServicesPage() {
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
        alert(data.error || 'Gagal menambahkan layanan');
      }
    } catch {
      alert('Gagal menambahkan layanan');
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
        alert(data.error || 'Gagal mengupdate layanan');
      }
    } catch {
      alert('Gagal mengupdate layanan');
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
          <span className="loading loading-spinner loading-lg text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Layanan</h1>
        <button
          className="btn btn-primary btn-sm"
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
        <form onSubmit={handleAdd} className="card bg-base-100 border border-base-300 p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="form-control">
              <label className="label"><span className="label-text">Nama Layanan</span></label>
              <input
                type="text"
                className="input input-bordered input-sm"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>
            <div className="form-control">
              <label className="label"><span className="label-text">Harga (Rp)</span></label>
              <input
                type="number"
                className="input input-bordered input-sm"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
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
              <th>Harga</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {services.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-8 text-base-content/50">
                  Belum ada layanan
                </td>
              </tr>
            ) : (
              services.map((service) => (
                <tr key={service.id}>
                  {editingId === service.id ? (
                    <>
                      <td>
                        <input
                          type="text"
                          className="input input-bordered input-sm w-full"
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          className="input input-bordered input-sm w-full"
                          value={form.price}
                          onChange={(e) => setForm({ ...form, price: e.target.value })}
                        />
                      </td>
                      <td className="flex gap-2">
                        <button
                          className="btn btn-primary btn-xs"
                          onClick={() => handleUpdate(service.id)}
                        >
                          Simpan
                        </button>
                        <button
                          className="btn btn-ghost btn-xs"
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
                      <td className="font-medium">{service.name}</td>
                      <td>
                        {service.price != null
                          ? `Rp ${service.price.toLocaleString('id-ID')}`
                          : '-'}
                      </td>
                      <td>
                        <button
                          className="btn btn-ghost btn-xs"
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
