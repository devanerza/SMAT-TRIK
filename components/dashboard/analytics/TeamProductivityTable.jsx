export default function TeamProductivityTable({ productivity, teamNames = {} }) {
  const entries = Object.entries(productivity || {});

  return (
    <div className="card bg-base-100 border border-base-300">
      <div className="card-body">
        <h3 className="card-title text-lg">Produktivitas Tim Teknisi</h3>
        {entries.length === 0 ? (
          <p className="text-sm text-base-content/50 py-4">Belum ada data</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="table table-zebra">
              <thead>
                <tr>
                  <th>Tim</th>
                  <th>Jumlah Order</th>
                  <th>Total Unit</th>
                </tr>
              </thead>
              <tbody>
                {entries.map(([teamId, data]) => (
                  <tr key={teamId}>
                    <td className="font-medium">
                      {teamNames[teamId] || teamId.substring(0, 8) + '...'}
                    </td>
                    <td>{data.orderCount}</td>
                    <td>{data.totalUnits}</td>
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
