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
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg mb-4">Assign Tim Teknisi</h3>
        <p className="mb-4 text-sm text-base-content/70">
          Pesanan: <span className="font-medium">{order?.cust_name}</span>
        </p>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Pilih Tim Teknisi</span>
          </label>
          <select
            className="select select-bordered w-full"
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

        <div className="modal-action">
          <button className="btn btn-ghost" onClick={onClose}>
            Batal
          </button>
          <button
            className="btn btn-primary"
            onClick={handleAssign}
            disabled={!selectedTeamId}
          >
            Assign
          </button>
        </div>
      </div>
      <div className="modal-backdrop" onClick={onClose} />
    </div>
  );
}
