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
          Bandingkan biaya listrik AC konvensional vs AC dengan teknologi Smat-Trik.
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

          <button type="submit" className="btn btn-primary w-full">
            Hitung Penghematan
          </button>
        </form>

        {result && (
          <div className="mt-6 space-y-4">
            <div className="divider">Hasil Perbandingan</div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="card bg-base-200 p-4">
                <h4 className="font-bold text-sm mb-2">AC Konvensional</h4>
                <p className="text-lg font-bold text-base-content">
                  {formatRupiah(result.biayaKonv)}
                </p>
                <p className="text-xs text-base-content/60">
                  / bulan ({result.dayaKonv} W)
                </p>
              </div>
              <div className="card bg-success/10 p-4 border border-success/30">
                <h4 className="font-bold text-sm mb-2">AC dengan Smat-Trik</h4>
                <p className="text-lg font-bold text-success">
                  {formatRupiah(result.biayaSmat)}
                </p>
                <p className="text-xs text-base-content/60">
                  / bulan ({result.dayaSmat} W)
                </p>
              </div>
            </div>

            <div className="card bg-primary/10 p-4 border border-primary/30 text-center">
              <p className="text-sm text-base-content/60">Penghematan per Bulan</p>
              <p className="text-2xl font-bold text-primary">
                {formatRupiah(result.hematNominal)}
              </p>
              <p className="text-sm text-primary font-medium">
                Hemat {result.hematPersen.toFixed(1)}%
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
