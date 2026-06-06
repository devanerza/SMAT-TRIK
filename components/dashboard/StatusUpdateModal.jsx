import StatusBadge from './StatusBadge';

export default function StatusUpdateModal({ order, newStatus, onConfirm, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl border border-slate-100 p-6 w-full max-w-md mx-4">
        <h3 className="text-lg font-extrabold text-slate-900 mb-4">Konfirmasi Perubahan Status</h3>
        <p className="mb-4 text-sm text-slate-500">
          Pesanan: <span className="font-semibold text-slate-800">{order?.cust_name}</span>
        </p>

        <div className="flex items-center gap-3 justify-center my-6">
          <StatusBadge status={order?.status} />
          <span className="text-slate-300">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </span>
          <StatusBadge status={newStatus} />
        </div>

        <p className="text-center text-sm text-slate-400">
          Apakah Anda yakin ingin mengubah status pesanan ini?
        </p>

        <div className="flex justify-end gap-3 mt-6">
          <button
            className="inline-flex items-center justify-center px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-semibold text-xs rounded-lg transition-colors"
            onClick={onClose}
          >
            Batal
          </button>
          <button
            className="inline-flex items-center justify-center px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-lg shadow-sm hover:shadow transition-all duration-200"
            onClick={() => onConfirm(order.id, newStatus)}
          >
            Konfirmasi
          </button>
        </div>
      </div>
    </div>
  );
}
