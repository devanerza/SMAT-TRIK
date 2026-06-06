import StatusBadge from './StatusBadge';

const statusOptions = ['', 'Pending', 'Proses', 'Selesai', 'Batal'];

export default function OrderTable({
  orders,
  statusFilter,
  dateStart,
  dateEnd,
  onStatusFilter,
  onDateStartChange,
  onDateEndChange,
  onOrderClick,
  loading,
}) {
  return (
    <div>
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="form-control">
          <label className="block text-sm font-semibold text-slate-600 mb-1.5">Status</label>
          <select
            className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors min-w-[150px]"
            value={statusFilter}
            onChange={(e) => onStatusFilter(e.target.value)}
          >
            {statusOptions.map((s) => (
              <option key={s} value={s}>
                {s || 'Semua Status'}
              </option>
            ))}
          </select>
        </div>
        <div className="form-control">
          <label className="block text-sm font-semibold text-slate-600 mb-1.5">Tanggal Mulai</label>
          <input
            type="date"
            className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors"
            value={dateStart}
            onChange={(e) => onDateStartChange(e.target.value)}
          />
        </div>
        <div className="form-control">
          <label className="block text-sm font-semibold text-slate-600 mb-1.5">Tanggal Akhir</label>
          <input
            type="date"
            className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors"
            value={dateEnd}
            onChange={(e) => onDateEndChange(e.target.value)}
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/50">
              <th className="text-left font-semibold text-slate-500 px-4 py-3.5">Nama Customer</th>
              <th className="text-left font-semibold text-slate-500 px-4 py-3.5">WA</th>
              <th className="text-left font-semibold text-slate-500 px-4 py-3.5">Lokasi</th>
              <th className="text-left font-semibold text-slate-500 px-4 py-3.5">Status</th>
              <th className="text-left font-semibold text-slate-500 px-4 py-3.5">Tim</th>
              <th className="text-left font-semibold text-slate-500 px-4 py-3.5">Tanggal</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="text-center py-8">
                  <span className="loading loading-spinner loading-md text-orange-500" />
                </td>
              </tr>
            ) : orders.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-8 text-slate-400">
                  Tidak ada pesanan
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr
                  key={order.id}
                  className="border-b border-slate-50 cursor-pointer hover:bg-slate-50/70 transition-colors"
                  onClick={() => onOrderClick?.(order.id)}
                >
                  <td className="font-medium text-slate-800 px-4 py-3.5">{order.cust_name}</td>
                  <td className="px-4 py-3.5">
                    <a
                      href={`https://wa.me/${order.cust_phone}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-orange-600 hover:text-orange-700 font-medium"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {order.cust_phone}
                    </a>
                  </td>
                  <td className="px-4 py-3.5">
                    <a
                      href={order.cust_loc_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-orange-600 hover:text-orange-700 truncate max-w-[200px] inline-block"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {order.cust_loc_url}
                    </a>
                  </td>
                  <td className="px-4 py-3.5">
                    <StatusBadge status={order.status} />
                  </td>
                  <td className="text-slate-600 px-4 py-3.5">{order.team_name || '-'}</td>
                  <td className="text-slate-400 text-xs px-4 py-3.5">
                    {new Date(order.created_at).toLocaleDateString('id-ID', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
