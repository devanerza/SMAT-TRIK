import * as fc from 'fast-check';
import { filterOrders } from '../../lib/orderFilters';

describe('Order Filters Properties Suite', () => {
  describe('filterOrders', () => {
    // Property 11: Filter Order Mengembalikan Hasil yang Sesuai Kriteria
    test('Property 11: filterOrders returns results matching criteria', () => {
      fc.assert(
        fc.property(
          fc.array(
            fc.record({
              id: fc.integer(),
              custName: fc.string(),
              status: fc.oneof(fc.constant('Pending'), fc.constant('Proses'), fc.constant('Selesai'), fc.constant('Batal')),
              created_at: fc.date().map(d => d.toISOString())
            })
          ),
          fc.record({
            status: fc.option(fc.oneof(
              fc.constant('Pending'),
              fc.constant('Proses'),
              fc.constant('Selesai'),
              fc.constant('Batal'),
              fc.array(fc.oneof(
                fc.constant('Pending'),
                fc.constant('Proses'),
                fc.constant('Selesai'),
                fc.constant('Batal')
              ))
            )),
            startDate: fc.option(fc.date().map(d => d.toISOString().split('T')[0])),
            endDate: fc.option(fc.date().map(d => d.toISOString().split('T')[0]))
          }),
          (orders, criteria) => {
            // Ensure startDate <= endDate if both are provided
            if (criteria.startDate && criteria.endDate && criteria.startDate > criteria.endDate) {
              return true; // Skip invalid date ranges
            }

            const filtered = filterOrders(orders, criteria);

            // Check that all filtered orders meet criteria
            for (const order of filtered) {
              // Status check
              if (criteria.status) {
                const statusList = Array.isArray(criteria.status) ? criteria.status : [criteria.status];
                if (!statusList.includes(order.status)) {
                  throw new Error(`Order status ${order.status} not in allowed statuses ${JSON.stringify(criteria.status)}`);
                }
              }

              // Start date check
              if (criteria.startDate) {
                const orderDate = order.created_at.split('T')[0];
                if (orderDate < criteria.startDate) {
                  throw new Error(`Order date ${orderDate} is before start date ${criteria.startDate}`);
                }
              }

              // End date check
              if (criteria.endDate) {
                const orderDate = order.created_at.split('T')[0];
                if (orderDate > criteria.endDate) {
                  throw new Error(`Order date ${orderDate} is after end date ${criteria.endDate}`);
                }
              }
            }

            // Check that we didn't incorrectly exclude any orders
            for (const order of orders) {
              const matchesCriteria = 
                (!criteria.status || 
                  (Array.isArray(criteria.status) ? criteria.status : [criteria.status]).includes(order.status)) &&
                (!criteria.startDate || order.created_at.split('T')[0] >= criteria.startDate) &&
                (!criteria.endDate || order.created_at.split('T')[0] <= criteria.endDate);

              if (matchesCriteria) {
                const found = filtered.find(o => o.id === order.id);
                if (!found) {
                  throw new Error(`Order with id ${order.id} should have been included but was filtered out`);
                }
              }
            }

            return true;
          }
        )
      );
    });
  });
});

// Concrete unit tests
describe('Order Filters Concrete Unit Tests', () => {
  const testOrders = [
    { id: 1, custName: 'John Doe', status: 'Pending', created_at: '2026-05-20T10:00:00Z' },
    { id: 2, custName: 'Jane Smith', status: 'Proses', created_at: '2026-05-21T14:30:00Z' },
    { id: 3, custName: 'Bob Wilson', status: 'Selesai', created_at: '2026-05-22T09:15:00Z' },
    { id: 4, custName: 'Alice Brown', status: 'Batal', created_at: '2026-05-23T16:45:00Z' }
  ];

  describe('filterOrders with status criteria', () => {
    test('filters by single status', () => {
      const result = filterOrders(testOrders, { status: 'Proses' });
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(2);
    });

    test('filters by multiple statuses', () => {
      const result = filterOrders(testOrders, { status: ['Pending', 'Selesai'] });
      expect(result).toHaveLength(2);
      expect(result.map(o => o.id).sort()).toEqual([1, 3]);
    });

    test('returns empty array when no matches', () => {
      const result = filterOrders(testOrders, { status: 'Completed' });
      expect(result).toHaveLength(0);
    });
  });

  describe('filterOrders with date criteria', () => {
    test('filters by start date', () => {
      const result = filterOrders(testOrders, { startDate: '2026-05-22' });
      expect(result).toHaveLength(2);
      expect(result.map(o => o.id)).toEqual([3, 4]);
    });

    test('filters by end date', () => {
      const result = filterOrders(testOrders, { endDate: '2026-05-21' });
      expect(result).toHaveLength(2);
      expect(result.map(o => o.id)).toEqual([1, 2]);
    });

    test('filters by date range', () => {
      const result = filterOrders(testOrders, { startDate: '2026-05-21', endDate: '2026-05-22' });
      expect(result).toHaveLength(2);
      expect(result.map(o => o.id)).toEqual([2, 3]);
    });
  });

  describe('filterOrders with combined criteria', () => {
    test('filters by status and date range', () => {
      const result = filterOrders(testOrders, { 
        status: ['Proses', 'Selesai'], 
        startDate: '2026-05-21',
        endDate: '2026-05-22'
      });
      expect(result).toHaveLength(2);
      expect(result.map(o => o.id)).toEqual([2, 3]);
    });

    test('returns empty when no combined matches', () => {
      const result = filterOrders(testOrders, { 
        status: ['Pending'], 
        startDate: '2026-05-22'
      });
      expect(result).toHaveLength(0);
    });
  });

  describe('edge cases', () => {
    test('handles empty orders array', () => {
      const result = filterOrders([], { status: 'Pending' });
      expect(result).toHaveLength(0);
    });

    test('handles undefined criteria', () => {
      const result = filterOrders(testOrders, undefined);
      expect(result).toEqual(testOrders);
    });

    test('handles empty criteria object', () => {
      const result = filterOrders(testOrders, {});
      expect(result).toEqual(testOrders);
    });
  });
});