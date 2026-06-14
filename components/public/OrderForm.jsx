import { useState } from 'react';
import { validateCustomerInfo, validateOrderItem } from '../../lib/validators';
import { useQuota } from '../../hooks/useQuota';
import LocationSearch from './LocationSearch';

const capacityOptions = [
  { value: '', label: 'Pilih Kapasitas' },
  { value: '0.5 PK', label: '0.5 PK' },
  { value: '0.75 PK', label: '0.75 PK' },
  { value: '1 PK', label: '1 PK' },
  { value: '1.5 PK', label: '1.5 PK' },
  { value: '2 PK', label: '2 PK' },
  { value: '2.5 PK', label: '2.5 PK' },
];

const REGION_CONFIG = {
  Surabaya: { serviceCode: 'SUB/YK', adminPhone: '6281944104536' },
  Yogyakarta: { serviceCode: 'SUB/YK', adminPhone: '6281944104536' },
  Jakarta: { serviceCode: 'JAK', adminPhone: '6281944104536' },
}

const emptyItem = { serviceId: '', acCapacity: '', unitCount: 1 };

export default function OrderForm({ services }) {
  const { remainingUnits, maxUnits, loading: quotaLoading, error: quotaError } = useQuota();

  const [customer, setCustomer] = useState({
    custName: '',
    custPhone: '',
    custEmail: '',
    location: null
  });
  const [items, setItems] = useState([{ ...emptyItem }]);
  const [region, setRegion] = useState('');
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(null);

  // Filter service list by region
  const filteredServices = region
    ? services.filter((s) => s.region === REGION_CONFIG[region].serviceCode)
    : [];

  const allItemsFilled = items.every(
    (item) => item.serviceId && item.acCapacity && item.unitCount >= 1
  );

  const canSubmit =
    region &&
    customer.custName.trim() &&
    customer.custPhone.trim() &&
    customer.location?.maps_link &&
    allItemsFilled;

  // Cust info
  const updateCustomer = (field, value) => {
    setCustomer({ ...customer, [field]: value });
  };

  // Order item
  const updateItem = (index, field, value) => {
    const updated = items.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    );
    setItems(updated);
  };


  const addItem = () => {
    setItems([...items, { ...emptyItem }]);
  };

  const removeItem = (index) => {
    if (items.length <= 1) return;
    setItems(items.filter((_, i) => i !== index));
  };

  // Submit order
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setSuccess(null);

    const payloadCustomer = {
      custName: customer.custName,
      custPhone: customer.custPhone,
      custEmail: customer.custEmail,
      custLocUrl: customer.location?.maps_link || '',
      custLat: customer.location?.lat || null,
      custLng: customer.location?.lng || null,
    };

    const newErrors = {};

    const customerResult = validateCustomerInfo(payloadCustomer);
    if (!customerResult.isValid) {
      Object.assign(newErrors, customerResult.errors);
    }

    const itemErrors = [];
    items.forEach((item, idx) => {
      const result = validateOrderItem(item);
      if (!result.isValid) {
        itemErrors.push({ index: idx, errors: result.errors });
      }
    });
    if (itemErrors.length > 0) {
      newErrors.items = itemErrors;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerInfo: payloadCustomer, items, region }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.details && Array.isArray(data.details)) {
          setErrors({ server: data.details.map((d) => d.errors).join(', ') });
        } else if (data.error === 'Kuota harian penuh') {
          setErrors({ quota: 'Maaf, kuota harian sudah penuh. Silakan coba lagi besok.' });
        } else {
          setErrors({ server: data.error || 'Terjadi kesalahan, silakan coba lagi' });
        }
        return;
      }

      if (data.waLink) {
        window.open(data.waLink, '_blank');
      }

      setCustomer({ custName: '', custPhone: '', custEmail: '', location: null });
      setItems([{ ...emptyItem }]);
    } catch {
      setErrors({ server: 'Gagal terhubung ke server' });
    } finally {
      setSubmitting(false);
    }
  };

  if (quotaLoading) {
    return (
      <div className="flex justify-center py-12">
        <span className="loading loading-spinner loading-lg text-orange-500" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {quotaError && (
        <div className="alert alert-warning text-sm">
          <span>{quotaError}</span>
        </div>
      )}

      <div className="card bg-base-100 border border-base-300 p-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-base-content/60">Sisa Kuota Hari Ini</span>
          <span className="text-lg font-bold">
            {remainingUnits}/{maxUnits}
          </span>
        </div>
        <div className="mt-2 h-3 bg-base-200 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${remainingUnits > 5 ? 'bg-success' : remainingUnits > 0 ? 'bg-warning' : 'bg-error'}`}
            style={{ width: `${((maxUnits - remainingUnits) / maxUnits) * 100}%` }}
          />
        </div>
      </div>

      {errors.quota && (
        <div className="alert alert-error text-sm">
          <span>{errors.quota}</span>
        </div>
      )}

      {errors.server && (
        <div className="alert alert-error text-sm">
          <span>{errors.server}</span>
        </div>
      )}

      <div className="card bg-base-100 border border-base-300">
        <div className="card-body">
          <h2 className="card-title text-lg">Pilih Region</h2>
          <div className="flex gap-2 flex-wrap">
            {['Surabaya', 'Yogyakarta', 'Jakarta'].map((r) => (
              <button
                key={r}
                type="button"
                className={`btn btn-sm ${
                  region === r
                    ? 'bg-orange-500 text-white hover:bg-orange-600 border-none'
                    : 'btn-outline text-orange-500 hover:bg-orange-600 hover:text-white hover:border-none'
                }`}
                onClick={() => setRegion(r)}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="card bg-base-100 border border-base-300">
        <div className="card-body">
          <h2 className="card-title text-lg">Data Customer</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Nama Lengkap</span>
              </label>
              <input
                type="text"
                className={`input input-bordered ${errors.custName ? 'input-error' : ''}`}
                value={customer.custName}
                onChange={(e) => updateCustomer('custName', e.target.value)}
                required
              />
              {errors.custName && (
                <label className="label"><span className="label-text-alt text-error">{errors.custName}</span></label>
              )}
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Nomor WhatsApp</span>
              </label>
              <input
                type="text"
                className={`input input-bordered ${errors.custPhone ? 'input-error' : ''}`}
                value={customer.custPhone}
                onChange={(e) => updateCustomer('custPhone', e.target.value)}
                placeholder="08xx atau 628xx"
                required
              />
              {errors.custPhone && (
                <label className="label"><span className="label-text-alt text-error">{errors.custPhone}</span></label>
              )}
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email (opsional)</span>
              </label>
              <input
                type="email"
                className={`input input-bordered ${errors.custEmail ? 'input-error' : ''}`}
                value={customer.custEmail}
                onChange={(e) => updateCustomer('custEmail', e.target.value)}
              />
              {errors.custEmail && (
                <label className="label"><span className="label-text-alt text-error">{errors.custEmail}</span></label>
              )}
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Ketik untuk mencari</span>
              </label>
              <LocationSearch
                value={customer.location}
                onChange={(loc) => updateCustomer("location", loc)}
                error={errors.custLocation}
              />
              {errors.custLocUrl && (
                <label className="label"><span className="label-text-alt text-error">{errors.custLocUrl}</span></label>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="card bg-base-100 border border-base-300">
        <div className="card-body">
          <div className="flex items-center justify-between mb-4">
            <h2 className="card-title text-lg">Item Pesanan</h2>
            <button type="button" className="btn btn-outline text-orange-500 btn-sm hover:bg-orange-600 hover:text-white hover:border-none" onClick={addItem}>
              + Tambah Item
            </button>
          </div>

          {errors.items && errors.items.length > 0 && (
            <div className="alert alert-error text-sm mb-4">
              <span>Ada item yang belum lengkap</span>
            </div>
          )}

          {items.map((item, index) => {
            const itemErr = errors.items?.find((e) => e.index === index);
            return (
              <div
                key={index}
                className="grid grid-cols-1 md:grid-cols-4 gap-3 p-4 bg-base-200 rounded-box mb-3"
              >
                <div className="form-control">
                  <label className="label"><span className="label-text">Layanan</span></label>
                  <select
                    className={`select select-bordered select-sm ${itemErr?.errors?.serviceId ? 'select-error' : ''}`}
                    value={item.serviceId}
                    onChange={(e) => updateItem(index, 'serviceId', e.target.value)}
                  >
                    <option value="">Pilih Layanan</option>
                    {filteredServices.map((svc) => (
                      <option key={svc.id} value={svc.id}>
                        {svc.name}
                      </option>
                    ))}
                  </select>
                  {itemErr?.errors?.serviceId && (
                    <label className="label"><span className="label-text-alt text-error">{itemErr.errors.serviceId}</span></label>
                  )}
                </div>
                <div className="form-control">
                  <label className="label"><span className="label-text">Kapasitas AC</span></label>
                  <select
                    className={`select select-bordered select-sm ${itemErr?.errors?.acCapacity ? 'select-error' : ''}`}
                    value={item.acCapacity}
                    onChange={(e) => updateItem(index, 'acCapacity', e.target.value)}
                  >
                    {capacityOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  {itemErr?.errors?.acCapacity && (
                    <label className="label"><span className="label-text-alt text-error">{itemErr.errors.acCapacity}</span></label>
                  )}
                </div>
                <div className="form-control">
                  <label className="label"><span className="label-text">Jumlah Unit</span></label>
                  <input
                    type="number"
                    className={`input input-bordered input-sm ${itemErr?.errors?.unitCount ? 'input-error' : ''}`}
                    value={item.unitCount}
                    onChange={(e) => updateItem(index, 'unitCount', parseInt(e.target.value) || '')}
                    min="1"
                  />
                  {itemErr?.errors?.unitCount && (
                    <label className="label"><span className="label-text-alt text-error">{itemErr.errors.unitCount}</span></label>
                  )}
                </div>
                <div className="flex items-end pb-2">
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm text-error"
                    onClick={() => removeItem(index)}
                    disabled={items.length <= 1}
                  >
                    Hapus
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <button
        type="submit"
        className="btn bg-orange-500 hover:bg-orange-600 text-white w-full"
        disabled={submitting || remainingUnits <= 0 || !canSubmit}
      >
        {submitting ? (
          <span className="loading loading-spinner loading-sm" />
        ) : remainingUnits <= 0 ? (
          'Kuota Penuh'
        ) : (
          'Kirim Pesanan'
        )}
      </button>
    </form>
  );
}
