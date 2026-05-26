import * as fc from 'fast-check';
import {
  aggregateDailyOrderTrend,
  aggregatePopularServices,
  aggregateTeamProductivity,
  groupRepeatCustomers,
  calculateQuotaUtilization,
  filterByDateRange
} from '../../lib/analytics';

describe('Analytics Properties Suite', () => {
  describe('aggregateDailyOrderTrend', () => {
    // Property 19: Agregasi Analitik Per Hari Akurat
    test('Property 19: aggregateDailyOrderTrend accurately groups orders by day and week', () => {
      fc.assert(
        fc.property(
          fc.array(
            fc.record({
              id: fc.integer(),
              custName: fc.string(),
              status: fc.oneof(fc.constant('Pending'), fc.constant('Proses'), fc.constant('Selesai'), fc.constant('Batal')),
              created_at: fc.date().map(d => d.toISOString()),
              order_items: fc.array(
                fc.record({
                  unit_count: fc.integer({ min: 0, max: 10 })
                })
              )
            })
          ),
          (orders) => {
            const result = aggregateDailyOrderTrend(orders);
            
            // Verify daily aggregation
            orders.forEach(order => {
              const dateStr = order.created_at.split('T')[0];
              if (!dateStr || !/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return;
              const year = parseInt(dateStr.substring(0, 4));
              if (year < 1900 || year > 2100) return;
              
              const expectedCount = orders.filter(o => {
                const ds = o.created_at.split('T')[0];
                return ds === dateStr && /^\d{4}-\d{2}-\d{2}$/.test(ds);
              }).length;
              const expectedUnits = orders
                .filter(o => {
                  const ds = o.created_at.split('T')[0];
                  return ds === dateStr && /^\d{4}-\d{2}-\d{2}$/.test(ds);
                })
                .reduce((sum, o) => sum + (o.order_items?.reduce((iSum, item) => iSum + (item.unit_count || 0), 0) || 0), 0);
                
              expect(result.daily[dateStr]).toBeDefined();
              expect(result.daily[dateStr].count).toBe(expectedCount);
              expect(result.daily[dateStr].totalUnits).toBe(expectedUnits);
            });
            
            // Verify weekly aggregation exists (structure only, exact counts verified in concrete tests)
            expect(result.weekly).toBeDefined();
            expect(typeof result.weekly).toBe('object');
            Object.values(result.weekly).forEach(week => {
              expect(week).toHaveProperty('count');
              expect(week).toHaveProperty('totalUnits');
              expect(Number.isInteger(week.count)).toBe(true);
              expect(Number.isInteger(week.totalUnits)).toBe(true);
            });
            
            return true;
          }
        )
      );
    });
  });

  describe('aggregatePopularServices', () => {
    // Property 20: Layanan Terpopuler Diurutkan Berdasarkan Frekuensi
    test('Property 20: aggregatePopularServices sorts services by frequency descending', () => {
      fc.assert(
        fc.property(
          fc.array(
            fc.record({
              service_id: fc.string({ minLength: 1 }),
              unit_count: fc.integer({ min: 1, max: 10 })
            })
          ),
          (orderItems) => {
            const result = aggregatePopularServices(orderItems);
            
            // Count frequencies manually
            const expectedCounts = Object.create(null);
            orderItems.forEach(item => {
              const serviceId = item.service_id;
              expectedCounts[serviceId] = (expectedCounts[serviceId] || 0) + 1;
            });
            
            // Expected result sorted by count descending
            const expected = Object.keys(expectedCounts)
              .map(serviceId => ({ serviceId, count: expectedCounts[serviceId] }))
              .sort((a, b) => b.count - a.count);
              
            // Verify result matches expected
            expect(result.length).toBe(expected.length);
            result.forEach((service, index) => {
              expect(service.serviceId).toBe(expected[index].serviceId);
              expect(service.count).toBe(expected[index].count);
            });
            
            return true;
          }
        )
      );
    });
  });

  describe('aggregateTeamProductivity', () => {
    // Property 21: Produktivitas Tim Dihitung dengan Benar
    test('Property 21: aggregateTeamProductivity calculates team productivity correctly', () => {
      fc.assert(
        fc.property(
          fc.array(
            fc.record({
              id: fc.integer(),
              team_id: fc.string({ minLength: 1 }),
              status: fc.oneof(fc.constant('Pending'), fc.constant('Proses'), fc.constant('Selesai'), fc.constant('Batal')),
              created_at: fc.date().map(d => d.toISOString())
            })
          ),
          fc.array(
            fc.record({
              order_id: fc.integer(),
              unit_count: fc.integer({ min: 0, max: 10 })
            })
          ),
          fc.record({
            startDate: fc.option(fc.date().map(d => d.toISOString().split('T')[0])),
            endDate: fc.option(fc.date().map(d => d.toISOString().split('T')[0]))
          }),
          (orders, orderItems, period) => {
            // Skip invalid date ranges
            if (period.startDate && period.endDate && period.startDate > period.endDate) {
              return true;
            }
            
            const result = aggregateTeamProductivity(orders, orderItems, period);
            
            // Create orderId -> items mapping
            const orderItemsMap = {};
            orderItems.forEach(item => {
              const orderId = item.order_id;
              if (!orderItemsMap[orderId]) {
                orderItemsMap[orderId] = [];
              }
              orderItemsMap[orderId].push(item);
            });
            
            // Verify each team's productivity
            orders.forEach(order => {
              const orderDate = order.created_at.split('T')[0];
              if (!orderDate || !/^\d{4}-\d{2}-\d{2}$/.test(orderDate)) return;
              const year = parseInt(orderDate.substring(0, 4));
              if (year < 1900 || year > 2100) return;
              
              // Apply period filter
              if (period && (period.startDate || period.endDate)) {
                if (period.startDate && orderDate < period.startDate) return;
                if (period.endDate && orderDate > period.endDate) return;
              }
              
              // Only count completed orders
              if (order.status !== 'Selesai') return;
              
              const teamId = order.team_id;
              
              // Calculate expected units for this order
              const items = orderItemsMap[order.id] || [];
              const orderUnits = items.reduce((sum, item) => sum + (item.unit_count || 0), 0);
              
              // Verify in result
              expect(result[teamId]).toBeDefined();
              expect(result[teamId].orderCount).toBeGreaterThanOrEqual(1);
              expect(result[teamId].totalUnits).toBeGreaterThanOrEqual(orderUnits);
            });
            
            return true;
          }
        )
      );
    });
  });

  describe('groupRepeatCustomers', () => {
    // Property 22: Pengelompokan Customer Berulang
    test('Property 22: groupRepeatCustomers correctly groups repeat customers', () => {
      fc.assert(
        fc.property(
          fc.array(
            fc.record({
              cust_email: fc.option(fc.string({ minLength: 1 }), { null: '' }),
              cust_phone: fc.option(fc.string({ minLength: 1 }), { null: '' }),
              id: fc.integer()
            })
          ),
          (orders) => {
            const result = groupRepeatCustomers(orders);
            
            // Group manually by email (preferred) or phone
            const manualGroups = Object.create(null);
            orders.forEach(order => {
              const identifier = order.cust_email || order.cust_phone || 'unknown';
              if (!manualGroups[identifier]) {
                manualGroups[identifier] = [];
              }
              manualGroups[identifier].push(order);
            });
            
            // Expected result: only groups with more than one order
            const expected = {};
            Object.keys(manualGroups).forEach(key => {
              if (manualGroups[key].length > 1) {
                expected[key] = manualGroups[key];
              }
            });
            
            // Verify result matches expected
            expect(Object.keys(result)).toHaveLength(Object.keys(expected).length);
            Object.keys(expected).forEach(key => {
              expect(result[key]).toBeDefined();
              expect(result[key]).toHaveLength(expected[key].length);
              // Check that all orders are present
              expected[key].forEach(order => {
                const found = result[key].find(o => o.id === order.id);
                expect(found).toBeDefined();
              });
            });
            
            return true;
          }
        )
      );
    });
  });

  describe('calculateQuotaUtilization', () => {
    // Property 23: Utilisasi Kuota Harian Dihitung dengan Benar
    test('Property 23: calculateQuotaUtilization calculates quota utilization correctly', () => {
      fc.assert(
        fc.property(
          fc.array(
            fc.record({
              id: fc.integer(),
              status: fc.oneof(fc.constant('Pending'), fc.constant('Proses'), fc.constant('Selesai'), fc.constant('Batal')),
              created_at: fc.date().map(d => d.toISOString().split('T')[0]), // Just date string
              order_items: fc.array(
                fc.record({
                  unit_count: fc.integer({ min: 0, max: 10 })
                })
              )
            })
          ),
          fc.record({
            startDate: fc.option(fc.date().map(d => d.toISOString().split('T')[0])),
            endDate: fc.option(fc.date().map(d => d.toISOString().split('T')[0]))
          }),
          (orders, period) => {
            // Skip invalid date ranges
            if (period.startDate && period.endDate && period.startDate > period.endDate) {
              return true;
            }
            
            const result = calculateQuotaUtilization(orders, period);
            
            // Group orders by date (excluding cancelled)
            const dailyUnits = {};
            orders.forEach(order => {
              // Skip cancelled orders
              if (order.status === 'Batal') return;
              
              const orderDate = order.created_at;
              
              // Apply period filter
              if (period && (period.startDate || period.endDate)) {
                if (period.startDate && orderDate < period.startDate) return;
                if (period.endDate && orderDate > period.endDate) return;
              }
              
              // Calculate units
              const orderUnits = order.order_items?.reduce((sum, item) => sum + (item.unit_count || 0), 0) || 0;
              
              if (!dailyUnits[orderDate]) {
                dailyUnits[orderDate] = 0;
              }
              dailyUnits[orderDate] += orderUnits;
            });
            
            // Calculate expected utilization
            const utilizations = [];
            Object.values(dailyUnits).forEach(units => {
              const utilization = Math.min((units / 20) * 100, 100); // Max 20 units per day
              utilizations.push(utilization);
            });
            
            const expected = utilizations.length > 0 
              ? utilizations.reduce((sum, val) => sum + val, 0) / utilizations.length 
              : 0;
              
            // Allow small floating point differences
            expect(Math.abs(result - expected)).toBeLessThan(0.01);
            
            return true;
          }
        )
      );
    });
  });

  describe('filterByDateRange', () => {
    // Property 24: Filter Tanggal Analitik Mengembalikan Data dalam Rentang yang Benar
    test('Property 24: filterByDateRange returns data within correct date range', () => {
      fc.assert(
        fc.property(
          fc.array(
            fc.record({
              date: fc.date().map(d => d.toISOString().split('T')[0]),
              value: fc.integer()
            })
          ),
          fc.record({
            startDate: fc.option(fc.date().map(d => d.toISOString().split('T')[0])),
            endDate: fc.option(fc.date().map(d => d.toISOString().split('T')[0]))
          }),
          (data, criteria) => {
            // Skip invalid date ranges
            if (criteria.startDate && criteria.endDate && criteria.startDate > criteria.endDate) {
              return true;
            }
            
            const result = filterByDateRange(data, criteria.startDate, criteria.endDate);
            
            // Verify all items in result are within date range
            result.forEach(item => {
              if (criteria.startDate) {
                expect(item.date >= criteria.startDate).toBe(true);
              }
              if (criteria.endDate) {
                expect(item.date <= criteria.endDate).toBe(true);
              }
            });
            
            // Verify we didn't incorrectly exclude any items
            data.forEach(item => {
              if (!item.date || !/^\d{4}-\d{2}-\d{2}$/.test(item.date)) return;
              const inRange = 
                (!criteria.startDate || item.date >= criteria.startDate) &&
                (!criteria.endDate || item.date <= criteria.endDate);
                
              if (inRange) {
                const found = result.find(rItem => rItem.date === item.date && rItem.value === item.value);
                expect(found).toBeDefined();
              }
            });
            
            return true;
          }
        )
      );
    });
  });
});

// Concrete unit tests
describe('Analytics Concrete Unit Tests', () => {
  describe('aggregateDailyOrderTrend', () => {
    test('groups orders correctly by day and week', () => {
      const orders = [
        { 
          id: 1, 
          custName: 'John', 
          status: 'Selesai', 
          created_at: '2026-05-20T10:00:00Z',
          order_items: [{ unit_count: 2 }]
        },
        { 
          id: 2, 
          custName: 'Jane', 
          status: 'Selesai', 
          created_at: '2026-05-20T14:00:00Z',
          order_items: [{ unit_count: 1 }]
        },
        { 
          id: 3, 
          custName: 'Bob', 
          status: 'Selesai', 
          created_at: '2026-05-21T09:00:00Z',
          order_items: [{ unit_count: 3 }]
        }
      ];
      
      const result = aggregateDailyOrderTrend(orders);
      
      // Daily checks
      expect(result.daily['2026-05-20']).toEqual({ count: 2, totalUnits: 3 });
      expect(result.daily['2026-05-21']).toEqual({ count: 1, totalUnits: 3 });
      
      // Weekly checks (both dates in week 21 of 2026)
      expect(result.weekly['2026-W21']).toEqual({ count: 3, totalUnits: 6 });
    });
  });

  describe('aggregatePopularServices', () => {
    test('sorts services by frequency descending', () => {
      const orderItems = [
        { service_id: 'ac_cleaning', unit_count: 1 },
        { service_id: 'freon_refill', unit_count: 2 },
        { service_id: 'ac_cleaning', unit_count: 1 },
        { service_id: 'ac_cleaning', unit_count: 1 },
        { service_id: 'electrical_repair', unit_count: 1 }
      ];
      
      const result = aggregatePopularServices(orderItems);
      
      expect(result).toHaveLength(3);
      expect(result[0]).toEqual({ serviceId: 'ac_cleaning', count: 3 });
      expect(result[1]).toEqual({ serviceId: 'freon_refill', count: 1 });
      expect(result[2]).toEqual({ serviceId: 'electrical_repair', count: 1 });
    });
  });

  describe('aggregateTeamProductivity', () => {
    test('calculates team productivity correctly', () => {
      const orders = [
        { 
          id: 1, 
          team_id: 'teamA', 
          status: 'Selesai', 
          created_at: '2026-05-20T10:00:00Z'
        },
        { 
          id: 2, 
          team_id: 'teamA', 
          status: 'Selesai', 
          created_at: '2026-05-20T14:00:00Z'
        },
        { 
          id: 3, 
          team_id: 'teamB', 
          status: 'Selesai', 
          created_at: '2026-05-21T09:00:00Z'
        },
        { 
          id: 4, 
          team_id: 'teamA', 
          status: 'Proses', 
          created_at: '2026-05-21T10:00:00Z' // Not completed, shouldn't count
        }
      ];
      
      const orderItems = [
        { order_id: 1, unit_count: 2 },
        { order_id: 2, unit_count: 1 },
        { order_id: 3, unit_count: 3 }
      ];
      
      const result = aggregateTeamProductivity(orders, orderItems, {});
      
      expect(result.teamA).toEqual({ orderCount: 2, totalUnits: 3 });
      expect(result.teamB).toEqual({ orderCount: 1, totalUnits: 3 });
    });
    
    test('respects date period', () => {
      const orders = [
        { 
          id: 1, 
          team_id: 'teamA', 
          status: 'Selesai', 
          created_at: '2026-05-20T10:00:00Z'
        },
        { 
          id: 2, 
          team_id: 'teamA', 
          status: 'Selesai', 
          created_at: '2026-05-22T10:00:00Z'
        }
      ];
      
      const orderItems = [
        { order_id: 1, unit_count: 2 },
        { order_id: 2, unit_count: 2 }
      ];
      
      const result = aggregateTeamProductivity(orders, orderItems, { 
        startDate: '2026-05-21',
        endDate: '2026-05-23'
      });
      
      // Only order from 2026-05-22 should count
      expect(result.teamA).toEqual({ orderCount: 1, totalUnits: 2 });
    });
  });

  describe('groupRepeatCustomers', () => {
    test('groups repeat customers correctly', () => {
      const orders = [
        { cust_email: 'john@example.com', cust_phone: '08123', id: 1 },
        { cust_email: 'john@example.com', cust_phone: '08123', id: 2 }, // Same email
        { cust_email: 'jane@example.com', cust_phone: '08124', id: 3 },
        { cust_email: '', cust_phone: '08125', id: 4 }, // Only phone
        { cust_email: '', cust_phone: '08125', id: 5 }  // Same phone
      ];
      
      const result = groupRepeatCustomers(orders);
      
      expect(Object.keys(result)).toHaveLength(2);
      expect(result['john@example.com']).toHaveLength(2);
      expect(result['08125']).toHaveLength(2);
    });
    
    test('returns empty object when no repeat customers', () => {
      const orders = [
        { cust_email: 'john@example.com', id: 1 },
        { cust_email: 'jane@example.com', id: 2 }
      ];
      
      const result = groupRepeatCustomers(orders);
      expect(result).toEqual({});
    });
  });

  describe('calculateQuotaUtilization', () => {
    test('calculates quota utilization correctly', () => {
      const orders = [
        { 
          id: 1, 
          status: 'Selesai', 
          created_at: '2026-05-20',
          order_items: [{ unit_count: 5 }] // 5 units = 25%
        },
        { 
          id: 2, 
          status: 'Selesai', 
          created_at: '2026-05-20',
          order_items: [{ unit_count: 10 }] // 10 units = 50%
        },
        { 
          id: 3, 
          status: 'Batal', 
          created_at: '2026-05-20',
          order_items: [{ unit_count: 10 }] // Cancelled, shouldn't count
        },
        { 
          id: 4, 
          status: 'Selesai', 
          created_at: '2026-05-21',
          order_items: [{ unit_count: 20 }] // 20 units = 100%
        },
        { 
          id: 5, 
          status: 'Selesai', 
          created_at: '2026-05-21',
          order_items: [{ unit_count: 10 }] // 10 units, total 30 units = 150% -> capped at 100%
        }
      ];
      
      // Test without period filter
      let result = calculateQuotaUtilization(orders, {});
      // Day 2026-05-20: 15 units = 75%
      // Day 2026-05-21: 30 units = 100% (capped)
      // Average: (75 + 100) / 2 = 87.5%
      expect(result).toBeCloseTo(87.5);
      
      // Test with period filter (only 2026-05-20)
      result = calculateQuotaUtilization(orders, { 
        startDate: '2026-05-20',
        endDate: '2026-05-20'
      });
      // Only 2026-05-20: 15 units = 75%
      expect(result).toBeCloseTo(75);
    });
  });

  describe('filterByDateRange', () => {
    test('filters data by date range correctly', () => {
      const data = [
        { date: '2026-05-19', value: 1 },
        { date: '2026-05-20', value: 2 },
        { date: '2026-05-21', value: 3 },
        { date: '2026-05-22', value: 4 }
      ];
      
      // Test start date only
      let result = filterByDateRange(data, '2026-05-20', undefined);
      expect(result).toHaveLength(3);
      expect(result.map(item => item.date)).toEqual(['2026-05-20', '2026-05-21', '2026-05-22']);
      
      // Test end date only
      result = filterByDateRange(data, undefined, '2026-05-21');
      expect(result).toHaveLength(3);
      expect(result.map(item => item.date)).toEqual(['2026-05-19', '2026-05-20', '2026-05-21']);
      
      // Test both dates
      result = filterByDateRange(data, '2026-05-20', '2026-05-21');
      expect(result).toHaveLength(2);
      expect(result.map(item => item.date)).toEqual(['2026-05-20', '2026-05-21']);
      
      // Test no filters
      result = filterByDateRange(data, undefined, undefined);
      expect(result).toEqual(data);
      
      // Test empty result
      result = filterByDateRange(data, '2026-05-23', '2026-05-24');
      expect(result).toHaveLength(0);
    });
  });
});