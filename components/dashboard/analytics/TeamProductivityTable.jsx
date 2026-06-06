export default function TeamProductivityTable({ productivity, teamNames = {} }) {
  const entries = Object.entries(productivity || {});

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100">
      <div className="p-6">
        <h3 className="text-lg font-extrabold text-slate-900 mb-4">Produktivitas Tim Teknisi</h3>
        {entries.length === 0 ? (
          <p className="text-sm text-slate-400 py-4">Belum ada data</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  <th className="text-left font-semibold text-slate-500 px-4 py-3">Tim</th>
                  <th className="text-left font-semibold text-slate-500 px-4 py-3">Jumlah Order</th>
                  <th className="text-left font-semibold text-slate-500 px-4 py-3">Total Unit</th>
                </tr>
              </thead>
              <tbody>
                {entries.map(([teamId, data]) => (
                  <tr key={teamId} className="border-b border-slate-50 last:border-0">
                    <td className="font-medium text-slate-800 px-4 py-3">
                      {teamNames[teamId] || teamId.substring(0, 8) + '...'}
                    </td>
                    <td className="text-slate-600 px-4 py-3">{data.orderCount}</td>
                    <td className="text-slate-600 px-4 py-3">{data.totalUnits}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
