const V = 220;
const ARUS_KONV = 4.0;
const ARUS_SMAT = 2.9;
const HARI_PER_BULAN = 30;

export function hitungPenghematanAC(pk, jumlahUnit, tarifKwh, jamPerHari) {
  const dayaKonv = pk * jumlahUnit * ARUS_KONV * V;
  const dayaSmat = pk * jumlahUnit * ARUS_SMAT * V;

  const kwhKonv = (dayaKonv / 1000) * jamPerHari * HARI_PER_BULAN;
  const kwhSmat = (dayaSmat / 1000) * jamPerHari * HARI_PER_BULAN;

  const biayaKonv = kwhKonv * tarifKwh;
  const biayaSmat = kwhSmat * tarifKwh;

  const hematNominal = biayaKonv - biayaSmat;
  const hematPersen = dayaKonv > 0 ? ((dayaKonv - dayaSmat) / dayaKonv) * 100 : 0;

  return {
    dayaKonv: Math.round(dayaKonv * 100) / 100,
    dayaSmat: Math.round(dayaSmat * 100) / 100,
    biayaKonv: Math.round(biayaKonv * 100) / 100,
    biayaSmat: Math.round(biayaSmat * 100) / 100,
    hematNominal: Math.round(hematNominal * 100) / 100,
    hematPersen: Math.round(hematPersen * 100) / 100,
  };
}
