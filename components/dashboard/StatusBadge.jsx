const statusConfig = {
  Pending: { class: 'bg-yellow-50 text-yellow-700 border-yellow-200', label: 'Pending' },
  Proses: { class: 'bg-blue-50 text-blue-700 border-blue-200', label: 'Proses' },
  Selesai: { class: 'bg-emerald-50 text-emerald-700 border-emerald-200', label: 'Selesai' },
  Batal: { class: 'bg-red-50 text-red-700 border-red-200', label: 'Batal' },
};

export default function StatusBadge({ status }) {
  const config = statusConfig[status] || { class: 'bg-slate-50 text-slate-600 border-slate-200', label: status };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${config.class}`}>
      {config.label}
    </span>
  );
}
