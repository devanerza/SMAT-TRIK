export default function QuotaUtilizationChart({ utilization }) {
  const pct = typeof utilization === 'number' ? Math.round(utilization) : 0;
  const barColor =
    pct < 50 ? 'bg-emerald-500' : pct < 80 ? 'bg-yellow-500' : 'bg-red-500';
  const textColor =
    pct < 50 ? 'text-emerald-600' : pct < 80 ? 'text-yellow-600' : 'text-red-600';

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100">
      <div className="p-6">
        <h3 className="text-lg font-extrabold text-slate-900 mb-4">Utilisasi Kuota Harian</h3>
        <div className="flex flex-col items-center py-6">
          <div className={`text-5xl font-extrabold ${textColor}`}>
            {pct}%
          </div>
          <p className="text-sm text-slate-400 mt-3">
            Rata-rata pemakaian kuota harian
          </p>
          <div className="w-full mt-4">
            <div className="h-4 bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full ${barColor} rounded-full transition-all`}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
