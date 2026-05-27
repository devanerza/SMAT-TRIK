export default function QuotaUtilizationChart({ utilization }) {
  const pct = typeof utilization === 'number' ? Math.round(utilization) : 0;
  const color =
    pct < 50 ? 'bg-success' : pct < 80 ? 'bg-warning' : 'bg-error';

  return (
    <div className="card bg-base-100 border border-base-300">
      <div className="card-body">
        <h3 className="card-title text-lg">Utilisasi Kuota Harian</h3>
        <div className="flex flex-col items-center py-6">
          <div
            className="radial-progress text-primary"
            style={{ '--value': pct }}
            role="progressbar"
          >
            {pct}%
          </div>
          <p className="text-sm text-base-content/60 mt-3">
            Rata-rata pemakaian kuota harian
          </p>
          <div className="w-full mt-4">
            <div className="h-4 bg-base-200 rounded-full overflow-hidden">
              <div
                className={`h-full ${color} rounded-full transition-all`}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
