export default function OrderTrendChart({ daily, weekly }) {
  const dailyEntries = Object.entries(daily || {});
  const weeklyEntries = Object.entries(weekly || {});

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100">
      <div className="p-6">
        <h3 className="text-lg font-extrabold text-slate-900 mb-4">Tren Order Harian</h3>
        {dailyEntries.length === 0 ? (
          <p className="text-sm text-slate-400 py-4">Belum ada data</p>
        ) : (
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {dailyEntries.map(([date, data]) => {
              const maxCount = Math.max(...dailyEntries.map(([, d]) => d.count), 1);
              const width = (data.count / maxCount) * 100;
              return (
                <div key={date} className="flex items-center gap-3">
                  <span className="text-xs w-24 shrink-0 text-slate-400">
                    {new Date(date + 'T00:00:00').toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'short',
                    })}
                  </span>
                  <div className="flex-1 h-5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-orange-500 rounded-full transition-all"
                      style={{ width: `${width}%` }}
                    />
                  </div>
                  <span className="text-xs font-semibold w-12 text-right text-slate-600">
                    {data.count}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        <div className="border-t border-slate-100 my-6" />

        <h3 className="text-lg font-extrabold text-slate-900 mb-4">Tren Order Mingguan</h3>
        {weeklyEntries.length === 0 ? (
          <p className="text-sm text-slate-400 py-4">Belum ada data</p>
        ) : (
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {weeklyEntries.map(([week, data]) => {
              const maxCount = Math.max(...weeklyEntries.map(([, d]) => d.count), 1);
              const width = (data.count / maxCount) * 100;
              return (
                <div key={week} className="flex items-center gap-3">
                  <span className="text-xs w-24 shrink-0 text-slate-400">{week}</span>
                  <div className="flex-1 h-5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-orange-400 rounded-full transition-all"
                      style={{ width: `${width}%` }}
                    />
                  </div>
                  <span className="text-xs font-semibold w-12 text-right text-slate-600">
                    {data.count}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
