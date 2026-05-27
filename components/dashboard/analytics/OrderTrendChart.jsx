export default function OrderTrendChart({ daily, weekly }) {
  const dailyEntries = Object.entries(daily || {});
  const weeklyEntries = Object.entries(weekly || {});

  return (
    <div className="card bg-base-100 border border-base-300">
      <div className="card-body">
        <h3 className="card-title text-lg">Tren Order Harian</h3>
        {dailyEntries.length === 0 ? (
          <p className="text-sm text-base-content/50 py-4">Belum ada data</p>
        ) : (
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {dailyEntries.map(([date, data]) => {
              const maxCount = Math.max(...dailyEntries.map(([, d]) => d.count), 1);
              const width = (data.count / maxCount) * 100;
              return (
                <div key={date} className="flex items-center gap-3">
                  <span className="text-xs w-24 shrink-0 text-base-content/60">
                    {new Date(date + 'T00:00:00').toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'short',
                    })}
                  </span>
                  <div className="flex-1 h-5 bg-base-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all"
                      style={{ width: `${width}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium w-12 text-right">
                    {data.count}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        <div className="divider" />

        <h3 className="card-title text-lg">Tren Order Mingguan</h3>
        {weeklyEntries.length === 0 ? (
          <p className="text-sm text-base-content/50 py-4">Belum ada data</p>
        ) : (
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {weeklyEntries.map(([week, data]) => {
              const maxCount = Math.max(...weeklyEntries.map(([, d]) => d.count), 1);
              const width = (data.count / maxCount) * 100;
              return (
                <div key={week} className="flex items-center gap-3">
                  <span className="text-xs w-24 shrink-0 text-base-content/60">{week}</span>
                  <div className="flex-1 h-5 bg-base-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-secondary rounded-full transition-all"
                      style={{ width: `${width}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium w-12 text-right">
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
