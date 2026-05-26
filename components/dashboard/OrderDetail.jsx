import StatusBadge from './StatusBadge';

export default function OrderDetail({ order, onBack }) {
  if (!order) return null;

  const totalUnits = order.order_items?.reduce(
    (sum, item) => sum + (item.unit_count || 0),
    0
  );

  return (
    <div>
      <button className="btn btn-ghost btn-sm mb-4" onClick={onBack}>
        &larr; Kembali
      </button>

      <div className="card bg-base-100 border border-base-300 mb-6">
        <div className="card-body">
          <div className="flex items-center justify-between mb-4">
            <h2 className="card-title">Detail Pesanan</h2>
            <StatusBadge status={order.status} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-base-content/60">Nama Customer</p>
              <p className="font-medium">{order.cust_name}</p>
            </div>
            <div>
              <p className="text-sm text-base-content/60">Nomor WA</p>
              <p className="font-medium">{order.cust_phone}</p>
            </div>
            <div>
              <p className="text-sm text-base-content/60">Email</p>
              <p className="font-medium">{order.cust_email || '-'}</p>
            </div>
            <div>
              <p className="text-sm text-base-content/60">Lokasi</p>
              <a
                href={order.cust_loc_url}
                target="_blank"
                rel="noopener noreferrer"
                className="link link-primary"
              >
                Buka Lokasi
              </a>
            </div>
            <div>
              <p className="text-sm text-base-content/60">Tim Teknisi</p>
              <p className="font-medium">{order.team_name || 'Belum di-assign'}</p>
            </div>
            <div>
              <p className="text-sm text-base-content/60">Tanggal Dibuat</p>
              <p className="font-medium">
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

      <div className="card bg-base-100 border border-base-300">
        <div className="card-body">
          <h3 className="card-title text-lg mb-4">
            Item Pesanan
            <span className="badge badge-outline badge-sm ml-2">
              Total {totalUnits} unit
            </span>
          </h3>
          <div className="overflow-x-auto">
            <table className="table table-zebra">
              <thead>
                <tr>
                  <th>Layanan</th>
                  <th>Kapasitas AC</th>
                  <th>Jumlah Unit</th>
                </tr>
              </thead>
              <tbody>
                {order.order_items?.map((item, idx) => (
                  <tr key={item.id || idx}>
                    <td>{item.service_name || item.service_id}</td>
                    <td>{item.ac_capacity}</td>
                    <td>{item.unit_count}</td>
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
