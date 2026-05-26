import StatusBadge from './StatusBadge';

export default function StatusUpdateModal({ order, newStatus, onConfirm, onClose }) {
  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg mb-4">Konfirmasi Perubahan Status</h3>
        <p className="mb-4 text-sm text-base-content/70">
          Pesanan: <span className="font-medium">{order?.cust_name}</span>
        </p>

        <div className="flex items-center gap-3 justify-center my-6">
          <StatusBadge status={order?.status} />
          <span className="text-xl">&rarr;</span>
          <StatusBadge status={newStatus} />
        </div>

        <p className="text-center text-sm text-base-content/60">
          Apakah Anda yakin ingin mengubah status pesanan ini?
        </p>

        <div className="modal-action">
          <button className="btn btn-ghost" onClick={onClose}>
            Batal
          </button>
          <button
            className="btn btn-primary"
            onClick={() => onConfirm(order.id, newStatus)}
          >
            Konfirmasi
          </button>
        </div>
      </div>
      <div className="modal-backdrop" onClick={onClose} />
    </div>
  );
}
