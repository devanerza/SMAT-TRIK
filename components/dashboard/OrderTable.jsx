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
      <div className="flex flex-wrap gap-4 mb-4">
        <div className="form-control">
          <label className="label">
            <span className="label-text">Status</span>
          </label>
          <select
            className="select select-bordered select-sm"
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
          <label className="label">
            <span className="label-text">Tanggal Mulai</span>
          </label>
          <input
            type="date"
            className="input input-bordered input-sm"
            value={dateStart}
            onChange={(e) => onDateStartChange(e.target.value)}
          />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Tanggal Akhir</span>
          </label>
          <input
            type="date"
            className="input input-bordered input-sm"
            value={dateEnd}
            onChange={(e) => onDateEndChange(e.target.value)}
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="table table-zebra table-pin-rows">
          <thead>
            <tr>
              <th>Nama Customer</th>
              <th>WA</th>
              <th>Lokasi</th>
              <th>Status</th>
              <th>Tim</th>
              <th>Tanggal</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="text-center py-8">
                  <span className="loading loading-spinner loading-md text-primary" />
                </td>
              </tr>
            ) : orders.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-8 text-base-content/50">
                  Tidak ada pesanan
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr
                  key={order.id}
                  className="cursor-pointer hover"
                  onClick={() => onOrderClick?.(order.id)}
                >
                  <td>{order.cust_name}</td>
                  <td>
                    <a
                      href={`https://wa.me/${order.cust_phone}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link link-primary"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {order.cust_phone}
                    </a>
                  </td>
                  <td>
                    <a
                      href={order.cust_loc_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link link-primary truncate max-w-[200px] inline-block"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {order.cust_loc_url}
                    </a>
                  </td>
                  <td>
                    <StatusBadge status={order.status} />
                  </td>
                  <td>{order.team_name || '-'}</td>
                  <td className="text-sm text-base-content/60">
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
