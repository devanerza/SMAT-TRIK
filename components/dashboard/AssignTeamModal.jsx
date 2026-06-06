import { useState, useEffect } from 'react';

export default function AssignTeamModal({ order, teams = [], onAssign, onClose }) {
  const [selectedTeamId, setSelectedTeamId] = useState(order?.team_id || '');

  useEffect(() => {
    setSelectedTeamId(order?.team_id || '');
  }, [order]);

  const handleAssign = () => {
    if (!selectedTeamId) return;
    onAssign(order.id, selectedTeamId);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl border border-slate-100 p-6 w-full max-w-md mx-4">
        <h3 className="text-lg font-extrabold text-slate-900 mb-4">Assign Tim Teknisi</h3>
        <p className="mb-4 text-sm text-slate-500">
          Pesanan: <span className="font-semibold text-slate-800">{order?.cust_name}</span>
        </p>

        <div className="form-control">
          <label className="block text-sm font-semibold text-slate-600 mb-1.5">Pilih Tim Teknisi</label>
          <select
            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors"
            value={selectedTeamId}
            onChange={(e) => setSelectedTeamId(e.target.value)}
          >
            <option value="">-- Pilih Tim --</option>
            {teams.map((team) => (
              <option key={team.id} value={team.id}>
                {team.name || team.display_name || team.email}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            className="inline-flex items-center justify-center px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-semibold text-xs rounded-lg transition-colors"
            onClick={onClose}
          >
            Batal
          </button>
          <button
            className="inline-flex items-center justify-center px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-lg shadow-sm hover:shadow transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleAssign}
            disabled={!selectedTeamId}
          >
            Assign
          </button>
        </div>
      </div>
    </div>
  );
}
