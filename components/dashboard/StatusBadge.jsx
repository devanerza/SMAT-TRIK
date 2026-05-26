const statusConfig = {
  Pending: { class: 'badge-warning', label: 'Pending' },
  Proses: { class: 'badge-info', label: 'Proses' },
  Selesai: { class: 'badge-success', label: 'Selesai' },
  Batal: { class: 'badge-error', label: 'Batal' },
};

export default function StatusBadge({ status }) {
  const config = statusConfig[status] || { class: 'badge-ghost', label: status };
  return (
    <span className={`badge ${config.class} badge-sm`}>
      {config.label}
    </span>
  );
}
