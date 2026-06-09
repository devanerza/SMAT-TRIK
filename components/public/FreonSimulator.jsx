import { useState } from 'react';
import { hitungPenghematanAC } from '../../lib/freonCalculator';

export default function FreonSimulator() {
  const [pk, setPk] = useState('');
  const [jumlahUnit, setJumlahUnit] = useState('1');
  const [tarifKwh, setTarifKwh] = useState('');
  const [jamPerHari, setJamPerHari] = useState('');
  const [result, setResult] = useState(null);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    const pkNum = parseFloat(pk);
    const unitNum = parseInt(jumlahUnit, 10);
    const tarifNum = parseFloat(tarifKwh);
    const jamNum = parseFloat(jamPerHari);

    if (!pk || isNaN(pkNum) || pkNum <= 0) {
      newErrors.pk = 'Kapasitas AC harus lebih dari 0 PK';
    }
    if (!jumlahUnit || isNaN(unitNum) || unitNum < 1) {
      newErrors.jumlahUnit = 'Jumlah unit minimal 1';
    }
    if (!tarifKwh || isNaN(tarifNum) || tarifNum <= 0) {
      newErrors.tarifKwh = 'Tarif listrik harus lebih dari 0';
    }
    if (!jamPerHari || isNaN(jamNum) || jamNum <= 0 || jamNum > 24) {
      newErrors.jamPerHari = 'Jam pemakaian harus antara 1-24';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleHitung = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const pkNum = parseFloat(pk);
    const unitNum = parseInt(jumlahUnit, 10);
    const tarifNum = parseFloat(tarifKwh);
    const jamNum = parseFloat(jamPerHari);

    const calcResult = hitungPenghematanAC(pkNum, unitNum, tarifNum, jamNum);
    setResult(calcResult);
  };

  const formatRupiah = (num) => {
    return `Rp ${Math.round(num).toLocaleString('id-ID')}`;
  };

  return (
    <div className="card bg-base-100 border border-base-300">
      <div className="card-body">
        <h3 className="card-title text-lg">Simulator Penghematan Freon AC</h3>
        <p className="text-sm text-base-content/60 mb-4">
          Bandingkan biaya listrik AC konvensional vs AC dengan teknologi SMAT-TRIK.
        </p>

        <form onSubmit={handleHitung} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Kapasitas AC (PK)</span>
              </label>
              <input
                type="number"
                step="0.1"
                min="0.5"
                max="5"
                className={`input input-bordered input-sm ${errors.pk ? 'input-error' : ''}`}
                value={pk}
                onChange={(e) => setPk(e.target.value)}
                placeholder="Contoh: 1"
              />
              {errors.pk && (
                <label className="label"><span className="label-text-alt text-error">{errors.pk}</span></label>
              )}
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Jumlah Unit AC</span>
              </label>
              <input
                type="number"
                min="1"
                className={`input input-bordered input-sm ${errors.jumlahUnit ? 'input-error' : ''}`}
                value={jumlahUnit}
                onChange={(e) => setJumlahUnit(e.target.value)}
              />
              {errors.jumlahUnit && (
                <label className="label"><span className="label-text-alt text-error">{errors.jumlahUnit}</span></label>
              )}
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Tarif Listrik (Rp/kWh)</span>
              </label>
              <input
                type="number"
                min="1"
                className={`input input-bordered input-sm ${errors.tarifKwh ? 'input-error' : ''}`}
                value={tarifKwh}
                onChange={(e) => setTarifKwh(e.target.value)}
                placeholder="Contoh: 1500"
              />
              {errors.tarifKwh && (
                <label className="label"><span className="label-text-alt text-error">{errors.tarifKwh}</span></label>
              )}
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Jam Pemakaian per Hari</span>
              </label>
              <input
                type="number"
                min="1"
                max="24"
                className={`input input-bordered input-sm ${errors.jamPerHari ? 'input-error' : ''}`}
                value={jamPerHari}
                onChange={(e) => setJamPerHari(e.target.value)}
                placeholder="Contoh: 8"
              />
              {errors.jamPerHari && (
                <label className="label"><span className="label-text-alt text-error">{errors.jamPerHari}</span></label>
              )}
            </div>
          </div>

          <button type="submit" className="btn text-white bg-orange-500 w-full hover:bg-orange-600">
            Hitung Penghematan
          </button>
        </form>

        {result && (
          <div className="mt-6 space-y-5">
            <div className="divider">Hasil Perbandingan</div>

            {/* Cost Comparison Bar Chart */}
            <div className="space-y-3">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-semibold text-slate-600">AC Konvensional</span>
                  <span className="text-sm font-bold text-slate-800">{formatRupiah(result.biayaKonv)}</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-slate-500 h-full rounded-full transition-all duration-700"
                    style={{ width: '100%' }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-semibold text-orange-600">AC dengan Smat-Trik</span>
                  <span className="text-sm font-bold text-emerald-600">{formatRupiah(result.biayaSmat)}</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-orange-500 h-full rounded-full transition-all duration-700"
                    style={{ width: `${((result.biayaSmat / result.biayaKonv) * 100).toFixed(1)}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Savings Gauge / Ring */}
            <div className="flex items-center gap-6 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-5 border border-emerald-100">
              {/* Circular gauge */}
              <div className="relative w-20 h-20 shrink-0">
                <svg className="w-20 h-20 -rotate-90" viewBox="0 0 72 72">
                  <circle cx="36" cy="36" r="30" fill="none" stroke="#e2e8f0" strokeWidth="6" />
                  <circle
                    cx="36" cy="36" r="30"
                    fill="none" stroke="#10b981"
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeDasharray={`${(result.hematPersen / 100) * 188.5} 188.5`}
                    className="transition-all duration-1000"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-lg font-extrabold text-emerald-600">
                    {result.hematPersen.toFixed(0)}%
                  </span>
                </div>
              </div>

              {/* Savings details */}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600 mb-0.5">
                  Penghematan per Bulan
                </p>
                <p className="text-2xl font-extrabold text-emerald-700">
                  {formatRupiah(result.hematNominal)}
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  Daya: {result.dayaKonv} W → {result.dayaSmat} W
                </p>
              </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-100 rounded-xl p-3 text-center">
                <p className="text-xs text-slate-500 font-medium">Konvensional</p>
                <p className="text-base font-bold text-slate-700">{result.dayaKonv} W</p>
              </div>
              <div className="bg-orange-50 rounded-xl p-3 text-center border border-orange-100">
                <p className="text-xs text-orange-600 font-medium">Smat-Trik</p>
                <p className="text-base font-bold text-orange-600">{result.dayaSmat} W</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
