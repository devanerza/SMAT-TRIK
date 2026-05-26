import * as fc from 'fast-check';
import {
  validateAdminStatusTransition,
  validateTechnicianStatusTransition,
  validateConfirmationRequirement,
  validateAssignTeam
} from '../../lib/statusTransitions';

describe('Status Transitions and Validation Properties Suite', () => {
  describe('validateAdminStatusTransition', () => {
    // Property 12: Transisi Status Order Hanya pada Jalur yang Diizinkan (Admin)
    test('Property 12: Admin status transitions follow allowed paths', () => {
      fc.assert(
        fc.property(
          fc.oneof(
            fc.constant('Pending'),
            fc.constant('Proses'),
            fc.constant('Selesai'),
            fc.constant('Batal')
          ),
          fc.oneof(
            fc.constant('Pending'),
            fc.constant('Proses'),
            fc.constant('Selesai'),
            fc.constant('Batal')
          ),
          (currentStatus, newStatus) => {
            const result = validateAdminStatusTransition(currentStatus, newStatus);
            
            // Define allowed transitions based on requirements
            const allowedMap = {
              Pending: ['Proses', 'Batal'],
              Proses: ['Batal'],
              Selesai: [], // No transitions allowed from Selesai
              Batal: []    // No transitions allowed from Batal
            };
            
            const expected = allowedMap[currentStatus]?.includes(newStatus) || false;
            expect(result).toBe(expected);
            
            return true;
          }
        )
      );
    });
  });

  describe('validateTechnicianStatusTransition', () => {
    // Property 17: Transisi Status oleh Teknisi Hanya pada Jalur yang Diizinkan
    test('Property 17: Technician status transitions follow allowed paths', () => {
      fc.assert(
        fc.property(
          fc.oneof(
            fc.constant('Pending'),
            fc.constant('Proses'),
            fc.constant('Selesai'),
            fc.constant('Batal')
          ),
          fc.oneof(
            fc.constant('Pending'),
            fc.constant('Proses'),
            fc.constant('Selesai'),
            fc.constant('Batal')
          ),
          (currentStatus, newStatus) => {
            const result = validateTechnicianStatusTransition(currentStatus, newStatus);
            
            // Define allowed transitions based on requirements
            const allowedMap = {
              Pending: [],        // Technician cannot change from Pending
              Proses: ['Selesai'],
              Selesai: [],      // Technician cannot change from Selesai (already completed)
              Batal: []         // Technician cannot change from Batal
            };
            
            const expected = allowedMap[currentStatus]?.includes(newStatus) || false;
            expect(result).toBe(expected);
            
            return true;
          }
        )
      );
    });
  });

  describe('validateConfirmationRequirement', () => {
    // Property 13: Konfirmasi Order Wajib Ada Assigned Team
    test('Property 13: Order confirmation requires assigned team', () => {
      fc.assert(
        fc.property(
          fc.record({
            team_id: fc.option(fc.string({ minLength: 1 }), { nil: null, undefined: '' }),
            teamId: fc.option(fc.string({ minLength: 1 }), { nil: null, undefined: '' }),
            status: fc.oneof(fc.constant('Pending'), fc.constant('Proses'), fc.constant('Selesai'), fc.constant('Batal'))
          }),
          (order) => {
            const result = validateConfirmationRequirement(order);
            
            // Order has team_id if either team_id or teamId is present and non-empty
            const hasTeamId = !! (order.team_id || order.teamId);
            expect(result).toBe(hasTeamId);
            
            return true;
          }
        )
      );
    });
  });

  describe('validateAssignTeam', () => {
    // Property 15: Assign Tim Hanya Diizinkan pada Status Pending atau Confirmed
    test('Property 15: Team assignment only allowed for pending or confirmed orders', () => {
      fc.assert(
        fc.property(
          fc.oneof(
            fc.constant('Pending'),
            fc.constant('Proses'),
            fc.constant('Selesai'),
            fc.constant('Batal')
          ),
          (status) => {
            const order = { status };
            const result = validateAssignTeam(order);
            const expected = status === 'Pending' || status === 'Proses';
            expect(result).toBe(expected);
            
            return true;
          }
        )
      );
    });
  });
});

// Concrete unit tests for explicit validation
describe('Status Transitions Concrete Unit Tests', () => {
  describe('validateAdminStatusTransition', () => {
    test('allows Pending → Proses', () => {
      expect(validateAdminStatusTransition('Pending', 'Proses')).toBe(true);
    });

    test('allows Pending → Batal', () => {
      expect(validateAdminStatusTransition('Pending', 'Batal')).toBe(true);
    });

    test('allows Proses → Batal', () => {
      expect(validateAdminStatusTransition('Proses', 'Batal')).toBe(true);
    });

    test('rejects invalid transitions', () => {
      expect(validateAdminStatusTransition('Pending', 'Selesai')).toBe(false);
      expect(validateAdminStatusTransition('Proses', 'Pending')).toBe(false);
      expect(validateAdminStatusTransition('Batal', 'Proses')).toBe(false);
      expect(validateAdminStatusTransition('Selesai', 'Batal')).toBe(false);
    });
  });

  describe('validateTechnicianStatusTransition', () => {
    test('allows Proses → Selesai', () => {
      expect(validateTechnicianStatusTransition('Proses', 'Selesai')).toBe(true);
    });

    test('rejects invalid transitions', () => {
      expect(validateTechnicianStatusTransition('Pending', 'Proses')).toBe(false);
      expect(validateTechnicianStatusTransition('Proses', 'Batal')).toBe(false);
      expect(validateTechnicianStatusTransition('Selesai', 'Proses')).toBe(false);
      expect(validateTechnicianStatusTransition('Batal', 'Selesai')).toBe(false);
    });
  });

  describe('validateConfirmationRequirement', () => {
    test('returns false when no team_id', () => {
      expect(validateConfirmationRequirement({ status: 'Pending' })).toBe(false);
    });

    test('returns false when team_id is empty string', () => {
      expect(validateConfirmationRequirement({ status: 'Pending', team_id: '' })).toBe(false);
    });

    test('returns true when team_id is present', () => {
      expect(validateConfirmationRequirement({ status: 'Pending', team_id: 'team123' })).toBe(true);
    });

    test('returns true when teamId is present (alternative field)', () => {
      expect(validateConfirmationRequirement({ status: 'Pending', teamId: 'team123' })).toBe(true);
    });
  });

  describe('validateAssignTeam', () => {
    test('returns true for Pending status', () => {
      expect(validateAssignTeam({ status: 'Pending' })).toBe(true);
    });

    test('returns true for Proses status', () => {
      expect(validateAssignTeam({ status: 'Proses' })).toBe(true);
    });

    test('returns false for Selesai status', () => {
      expect(validateAssignTeam({ status: 'Selesai' })).toBe(false);
    });

    test('returns false for Batal status', () => {
      expect(validateAssignTeam({ status: 'Batal' })).toBe(false);
    });
  });
});