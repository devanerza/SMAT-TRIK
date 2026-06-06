import StatusBadge from './StatusBadge';

export default function OrderDetail({ order, onBack }) {
  if (!order) return null;

  const totalUnits = order.order_items?.reduce(
    (sum, item) => sum + (item.unit_count || 0),
    0
  );

  return (
    <div>
      <button
        className="inline-flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-semibold text-xs rounded-lg shadow-sm hover:shadow transition-all duration-200 mb-6"
        onClick={onBack}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Kembali
      </button>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 mb-6">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-extrabold text-slate-900">Detail Pesanan</h2>
            <StatusBadge status={order.status} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Nama Customer</p>
              <p className="font-semibold text-slate-800">{order.cust_name}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Nomor WA</p>
              <p className="font-semibold text-slate-800">{order.cust_phone}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Email</p>
              <p className="font-semibold text-slate-800">{order.cust_email || '-'}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Lokasi</p>
              <a
                href={order.cust_loc_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange-600 hover:text-orange-700 font-semibold text-sm"
              >
                Buka Lokasi
              </a>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Tim Teknisi</p>
              <p className="font-semibold text-slate-800">{order.team_name || 'Belum di-assign'}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Tanggal Dibuat</p>
              <p className="font-semibold text-slate-800">
                {new Date(order.created_at).toLocaleDateString('id-ID', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <h3 className="text-lg font-extrabold text-slate-900">Item Pesanan</h3>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600">
              Total {totalUnits} unit
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  <th className="text-left font-semibold text-slate-500 px-4 py-3">Layanan</th>
                  <th className="text-left font-semibold text-slate-500 px-4 py-3">Kapasitas AC</th>
                  <th className="text-left font-semibold text-slate-500 px-4 py-3">Jumlah Unit</th>
                </tr>
              </thead>
              <tbody>
                {order.order_items?.map((item, idx) => (
                  <tr key={item.id || idx} className="border-b border-slate-50 last:border-0">
                    <td className="font-medium text-slate-800 px-4 py-3">{item.service_name || item.service_id}</td>
                    <td className="text-slate-600 px-4 py-3">{item.ac_capacity}</td>
                    <td className="text-slate-600 px-4 py-3">{item.unit_count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
