import * as fc from 'fast-check';
import { calculateDailyUsedUnits, checkQuotaAvailability } from '../../lib/quotaChecker';

describe('Daily Quota Checker and Correctness Properties Suite', () => {

  describe('calculateDailyUsedUnits', () => {
    // Feature: ac-maintenance-service, Property 7: Kalkulasi Kuota Harian Akurat
    test('Property 7: calculateDailyUsedUnits calculates total unit count of non-cancelled orders accurately', () => {
      fc.assert(
        fc.property(
          fc.array(
            fc.record({
              status: fc.constantFrom('pending', 'confirmed', 'in_progress', 'done', 'cancelled'),
              items: fc.array(
                fc.record({
                  unitCount: fc.integer({ min: 1, max: 10 })
                })
              )
            })
          ),
          (orders) => {
            let expectedTotal = 0;
            for (const order of orders) {
              if (order.status !== 'cancelled') {
                for (const item of order.items) {
                  expectedTotal += item.unitCount;
                }
              }
            }

            const actualTotal = calculateDailyUsedUnits(orders);
            return actualTotal === expectedTotal;
          }
        )
      );
    });

    // Concrete unit tests
    test('concrete examples for calculateDailyUsedUnits', () => {
      const orders = [
        {
          status: 'pending',
          items: [{ unitCount: 2 }, { unitCount: 3 }]
        },
        {
          status: 'cancelled',
          items: [{ unitCount: 5 }]
        },
        {
          status: 'confirmed',
          items: [{ unitCount: 1 }]
        }
      ];

      expect(calculateDailyUsedUnits(orders)).toBe(6); // 2 + 3 + 1
      expect(calculateDailyUsedUnits([])).toBe(0);
      expect(calculateDailyUsedUnits(null)).toBe(0);
      expect(calculateDailyUsedUnits(undefined)).toBe(0);
    });
  });

  describe('checkQuotaAvailability', () => {
    // Feature: ac-maintenance-service, Property 8: Penerimaan Order Berdasarkan Kuota
    test('Property 8: checkQuotaAvailability allows order if and only if total units <= 20', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: 50 }),
          fc.integer({ min: 0, max: 50 }),
          (usedUnits, newOrderUnits) => {
            const result = checkQuotaAvailability(usedUnits, newOrderUnits);
            const expectedAllowed = (usedUnits + newOrderUnits) <= 20;

            let expectedRemaining;
            if (expectedAllowed) {
              expectedRemaining = Math.max(0, 20 - usedUnits - newOrderUnits);
            } else {
              expectedRemaining = Math.max(0, 20 - usedUnits);
            }

            return result.allowed === expectedAllowed && result.remainingUnits === expectedRemaining;
          }
        )
      );
    });

    // Concrete boundary unit tests
    test('boundary scenarios for checkQuotaAvailability', () => {
      // Tepat 20 unit (diterima)
      expect(checkQuotaAvailability(15, 5)).toEqual({
        allowed: true,
        remainingUnits: 0
      });

      // 21 unit (ditolak)
      expect(checkQuotaAvailability(15, 6)).toEqual({
        allowed: false,
        remainingUnits: 5
      });

      // 0 unit (diterima)
      expect(checkQuotaAvailability(0, 0)).toEqual({
        allowed: true,
        remainingUnits: 20
      });

      // 21 unit total starting from 20 used (ditolak)
      expect(checkQuotaAvailability(20, 1)).toEqual({
        allowed: false,
        remainingUnits: 0
      });

      // safe fallback on non-numbers
      expect(checkQuotaAvailability('invalid', null)).toEqual({
        allowed: true,
        remainingUnits: 20
      });
    });
  });
});
