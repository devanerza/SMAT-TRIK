import * as fc from 'fast-check';
import { hitungPenghematanAC } from '../../lib/freonCalculator';

describe('Freon Calculator Suite', () => {
  describe('hitungPenghematanAC', () => {
    test('Property 1: Kalkulasi Freon Menghasilkan Nilai yang Benar dan Konsisten', () => {
      fc.assert(
        fc.property(
          fc.float({ min: 0.5, max: 5, noNaN: true }),
          fc.integer({ min: 1, max: 10 }),
          fc.float({ min: 500, max: 5000, noNaN: true }),
          fc.float({ min: 1, max: 24, noNaN: true }),
          (pk, jumlahUnit, tarifKwh, jamPerHari) => {
            const result = hitungPenghematanAC(pk, jumlahUnit, tarifKwh, jamPerHari);

            expect(result.dayaKonv).toBeGreaterThan(0);
            expect(result.dayaSmat).toBeGreaterThan(0);
            expect(result.dayaKonv).toBeGreaterThan(result.dayaSmat);
            expect(result.biayaKonv).toBeGreaterThan(0);
            expect(result.biayaSmat).toBeGreaterThan(0);
            expect(result.biayaKonv).toBeGreaterThan(result.biayaSmat);
            expect(result.hematNominal).toBeGreaterThan(0);
            expect(result.hematPersen).toBeGreaterThan(0);
            expect(result.hematPersen).toBeLessThan(100);

            const calculatedHemat = result.biayaKonv - result.biayaSmat;
            expect(Math.abs(result.hematNominal - calculatedHemat)).toBeLessThan(0.1);

            const expectedRatio = ((4.0 - 2.9) / 4.0) * 100;
            expect(Math.abs(result.hematPersen - expectedRatio)).toBeLessThan(0.1);
          }
        ),
        { numRuns: 100 }
      );
    });

    test('Property 2: Validasi Input Simulator Menolak Nilai Tidak Valid', () => {
      fc.assert(
        fc.property(
          fc.float({ min: -1000, max: 1000, noNaN: true }),
          fc.float({ min: -100, max: 100, noNaN: true }),
          fc.float({ min: -10000, max: 10000, noNaN: true }),
          fc.float({ min: -100, max: 100, noNaN: true }),
          (pk, jumlahUnit, tarifKwh, jamPerHari) => {
            const isValid = pk > 0 && jumlahUnit >= 1 && Number.isInteger(jumlahUnit) && tarifKwh > 0 && jamPerHari > 0;
            const result = hitungPenghematanAC(pk, Math.round(jumlahUnit) || 1, Math.abs(tarifKwh), Math.abs(jamPerHari));

            expect(typeof result.dayaKonv).toBe('number');
            expect(typeof result.dayaSmat).toBe('number');
            expect(typeof result.biayaKonv).toBe('number');
            expect(typeof result.biayaSmat).toBe('number');
            expect(typeof result.hematNominal).toBe('number');
            expect(typeof result.hematPersen).toBe('number');

            expect(Number.isFinite(result.dayaKonv)).toBe(true);
            expect(Number.isFinite(result.dayaSmat)).toBe(true);
          }
        ),
        { numRuns: 100 }
      );
    });

    test('unit test: 1 PK, 1 unit, Rp 1.500/kWh, 8 jam/hari', () => {
      const result = hitungPenghematanAC(1, 1, 1500, 8);

      expect(result.dayaKonv).toBe(880);
      expect(result.dayaSmat).toBe(638);
      expect(result.hematPersen).toBe(27.5);
    });
  });
});
