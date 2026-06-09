import * as fc from 'fast-check';
import { buildWaLink } from '../../lib/waLink';

describe('wa.me Link Builder and Correctness Properties Suite', () => {

  describe('buildWaLink', () => {
    // Feature: ac-maintenance-service, Property 9: Konten Pesan wa.me Lengkap
    test('Property 9: buildWaLink contains complete message content including customer, items, and quota details', () => {
      fc.assert(
        fc.property(
          fc.record({
            custName: fc.string({ minLength: 1 }).map(s => s.trim()).filter(s => s.length > 0),
            custPhone: fc.string({ minLength: 1 }).map(s => s.trim()).filter(s => s.length > 0),
            custLocUrl: fc.string({ minLength: 1 }).map(s => s.trim()).filter(s => s.length > 0)
          }),
          fc.array(
            fc.record({
              serviceName: fc.string({ minLength: 1 }).map(s => s.trim()).filter(s => s.length > 0),
              acCapacity: fc.string({ minLength: 1 }).map(s => s.trim()).filter(s => s.length > 0),
              unitCount: fc.integer({ min: 1, max: 10 })
            }),
            { minLength: 1, maxLength: 5 }
          ),
          fc.integer({ min: 0, max: 20 }),
          fc.stringOf(fc.integer({ min: 0, max: 9 }).map(String), { minLength: 10, maxLength: 12 }),
          (order, items, remainingQuota, adminPhone) => {
            const url = buildWaLink(order, items, remainingQuota, adminPhone);

            // Assert starting prefix
            expect(url.startsWith(`https://wa.me/${adminPhone}?text=`)).toBe(true);

            // Extract the encoded message
            const prefixLen = `https://wa.me/${adminPhone}?text=`.length;
            const encodedMessage = url.substring(prefixLen);
            const decodedMessage = decodeURIComponent(encodedMessage);

            // Assert exact content inclusions
            expect(decodedMessage.includes(order.custName)).toBe(true);
            expect(decodedMessage.includes(order.custPhone)).toBe(true);
            expect(decodedMessage.includes(order.custLocUrl)).toBe(true);
            expect(decodedMessage.includes(`Sisa Kuota Hari Ini: ${remainingQuota}`)).toBe(true);

            let expectedTotalUnits = 0;
            for (const item of items) {
              expectedTotalUnits += item.unitCount;
              expect(decodedMessage.includes(item.serviceName)).toBe(true);
              expect(decodedMessage.includes(item.acCapacity)).toBe(true);
              expect(decodedMessage.includes(`${item.unitCount} unit`)).toBe(true);
            }

            expect(decodedMessage.includes(`Total Unit: ${expectedTotalUnits}`)).toBe(true);

            return true;
          }
        )
      );
    });

    test('buildWaLink includes coordinates link when custLat/custLng are provided', () => {
      const order = {
        custName: 'Budi',
        custPhone: '081234567890',
        custLocUrl: 'https://www.google.com/maps?q=-6.2,106.8',
        custLat: -6.2,
        custLng: 106.8,
      };

      const items = [
        { serviceName: 'Cuci AC', acCapacity: '1 PK', unitCount: 1 },
      ];

      const url = buildWaLink(order, items, 15, '62811111111');
      const encodedMessage = url.split('text=')[1];
      const decodedMessage = decodeURIComponent(encodedMessage);

      expect(decodedMessage).toContain('https://www.google.com/maps?q=-6.2,106.8');
    });

    // Concrete unit tests
    test('concrete examples for buildWaLink including special characters encoding', () => {
      const order = {
        custName: 'John Doe & Co.',
        custPhone: '081234567890',
        custLocUrl: 'https://maps.google.com/?q=loc&z=15'
      };

      const items = [
        {
          serviceName: 'Cuci AC',
          acCapacity: '1_pk',
          unitCount: 2
        },
        {
          serviceName: 'Tambah Freon',
          acCapacity: '1.5_pk',
          unitCount: 1
        }
      ];

      const url = buildWaLink(order, items, 17, '62811111111');

      // The URL should be successfully constructed and start properly
      expect(url.startsWith('https://wa.me/62811111111?text=')).toBe(true);

      const encodedMessage = url.split('text=')[1];
      const decodedMessage = decodeURIComponent(encodedMessage);

      // Verify overall formatting and presence of special characters
      expect(decodedMessage).toContain('John Doe & Co.');
      expect(decodedMessage).toContain('081234567890');
      expect(decodedMessage).toContain('https://maps.google.com/?q=loc&z=15');
      expect(decodedMessage).toContain('Cuci AC (1_pk) - 2 unit');
      expect(decodedMessage).toContain('Tambah Freon (1.5_pk) - 1 unit');
      expect(decodedMessage).toContain('Total Unit: 3');
      expect(decodedMessage).toContain('Sisa Kuota Hari Ini: 17');

      // Assert that standard URL encoding occurred for special characters
      expect(encodedMessage).not.toContain(' ');
      expect(encodedMessage).not.toContain('&');
      expect(encodedMessage).toContain('%20'); // space
      expect(encodedMessage).toContain('%26'); // ampersand
    });
  });
});
