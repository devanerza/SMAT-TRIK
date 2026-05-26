import * as fc from 'fast-check';
import {
  validateWhatsappNumber,
  validateEmail,
  validateOrderItem,
  validateCustomerInfo
} from '../../lib/validators';

describe('Validator Functions and Correctness Properties Suite', () => {
  
  describe('validateWhatsappNumber', () => {
    // Feature: ac-maintenance-service, Property 4: Validasi Format Nomor WhatsApp
    test('Property 4: validateWhatsappNumber rejects any string with incorrect format, length, or characters', () => {
      fc.assert(
        fc.property(fc.string(), (str) => {
          const isValid = validateWhatsappNumber(str);
          if (isValid) {
            const onlyDigits = /^\d+$/.test(str);
            const lengthOk = str.length >= 10 && str.length <= 15;
            const prefixOk = str.startsWith('08') || str.startsWith('628');
            return onlyDigits && lengthOk && prefixOk;
          }
          return true;
        })
      );
    });

    test('validateWhatsappNumber accepts valid WhatsApp numbers', () => {
      fc.assert(
        fc.property(
          fc.constantFrom('08', '628'),
          fc.stringOf(fc.integer({ min: 0, max: 9 }).map(String), { minLength: 8, maxLength: 12 }),
          (prefix, suffix) => {
            const number = prefix + suffix;
            return validateWhatsappNumber(number) === true;
          }
        )
      );
    });

    // Unit tests
    test('concrete examples for whatsapp validation', () => {
      // Valid cases
      expect(validateWhatsappNumber('08123456789')).toBe(true);
      expect(validateWhatsappNumber('6281234567890')).toBe(true);
      expect(validateWhatsappNumber('0811111111')).toBe(true); // 10 digits
      expect(validateWhatsappNumber('628111111111111')).toBe(true); // 15 digits

      // Invalid cases
      expect(validateWhatsappNumber('18123456789')).toBe(false); // wrong prefix
      expect(validateWhatsappNumber('0812')).toBe(false); // too short
      expect(validateWhatsappNumber('0812345678901234')).toBe(false); // too long
      expect(validateWhatsappNumber('0812-3456-789')).toBe(false); // non-digits
      expect(validateWhatsappNumber('+628123456789')).toBe(false); // non-digits
      expect(validateWhatsappNumber('081234567a9')).toBe(false); // non-digits
      expect(validateWhatsappNumber(null)).toBe(false); // not a string
    });
  });

  describe('validateEmail', () => {
    // Feature: ac-maintenance-service, Property 5: Validasi Format Email
    test('Property 5: validateEmail accepts valid emails and rejects emails missing @ or dots in domain', () => {
      fc.assert(
        fc.property(fc.string(), (str) => {
          const isValid = validateEmail(str);
          if (isValid) {
            const parts = str.split('@');
            return parts.length === 2 && parts[1].includes('.');
          }
          return true;
        })
      );
    });

    test('validateEmail accepts valid email configurations', () => {
      fc.assert(
        fc.property(
          fc.stringOf(fc.constantFrom(...'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789.+-'), { minLength: 1, maxLength: 20 }),
          fc.stringOf(fc.constantFrom(...'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-'), { minLength: 1, maxLength: 15 }),
          fc.stringOf(fc.constantFrom(...'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'), { minLength: 2, maxLength: 6 }),
          (local, domain, tld) => {
            const cleanLocal = local.replace(/^\.+|\.+$/g, '').replace(/\.{2,}/g, '.');
            const cleanDomain = domain.replace(/^-+|-+$/g, '');

            if (cleanLocal.length === 0 || cleanDomain.length === 0) return true;

            const email = `${cleanLocal}@${cleanDomain}.${tld}`;
            return validateEmail(email) === true;
          }
        )
      );
    });

    // Unit tests
    test('concrete examples for email validation', () => {
      // Valid
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('user.name+tag@domain.co.id')).toBe(true);
      expect(validateEmail('123@abc.xyz')).toBe(true);

      // Invalid
      expect(validateEmail('testexample.com')).toBe(false); // no @
      expect(validateEmail('test@')).toBe(false); // no domain
      expect(validateEmail('test@localhost')).toBe(false); // no TLD
      expect(validateEmail('@domain.com')).toBe(false); // no local part
      expect(validateEmail('test@domain.')).toBe(false); // trailing dot
      expect(validateEmail(123)).toBe(false); // not a string
    });
  });

  describe('validateOrderItem', () => {
    // Feature: ac-maintenance-service, Property 6: Validasi Unit Count Item
    test('Property 6: validateOrderItem rejects invalid unitCount values', () => {
      fc.assert(
        fc.property(
          fc.constantFrom('service-id-123'),
          fc.constantFrom('0.5_pk', '0.75_pk', '1_pk', '1.5_pk', '2_pk', '2.5_pk'),
          fc.oneof(
            fc.integer(),
            fc.float(),
            fc.string(),
            fc.boolean(),
            fc.object(),
            fc.constant(null),
            fc.constant(undefined)
          ),
          (serviceId, acCapacity, unitCount) => {
            const item = { serviceId, acCapacity, unitCount };
            const result = validateOrderItem(item);

            const isPositiveInt = typeof unitCount === 'number' && Number.isInteger(unitCount) && unitCount >= 1;
            if (!isPositiveInt) {
              return result.isValid === false && result.errors.unitCount !== undefined;
            }
            return true;
          }
        )
      );
    });

    test('validateOrderItem accepts valid items', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1 }).map(s => s.trim()).filter(s => s.length > 0),
          fc.constantFrom('0.5_pk', '0.75_pk', '1_pk', '1.5_pk', '2_pk', '2.5_pk'),
          fc.integer({ min: 1, max: 1000 }),
          (serviceId, acCapacity, unitCount) => {
            const item = { serviceId, acCapacity, unitCount };
            const result = validateOrderItem(item);
            return result.isValid === true && Object.keys(result.errors).length === 0;
          }
        )
      );
    });

    // Unit tests
    test('concrete examples for validateOrderItem', () => {
      // Valid
      expect(validateOrderItem({ serviceId: 's1', acCapacity: '1_pk', unitCount: 2 })).toEqual({
        isValid: true,
        errors: {}
      });

      // Missing serviceId
      expect(validateOrderItem({ acCapacity: '1_pk', unitCount: 2 })).toEqual({
        isValid: false,
        errors: { serviceId: 'Layanan wajib dipilih' }
      });

      // Invalid acCapacity
      expect(validateOrderItem({ serviceId: 's1', acCapacity: '3_pk', unitCount: 2 })).toEqual({
        isValid: false,
        errors: { acCapacity: 'Kapasitas AC tidak valid' }
      });

      // Invalid unitCount (decimal)
      expect(validateOrderItem({ serviceId: 's1', acCapacity: '1_pk', unitCount: 1.5 })).toEqual({
        isValid: false,
        errors: { unitCount: 'Jumlah unit harus berupa bilangan bulat minimal 1' }
      });

      // Invalid unitCount (zero)
      expect(validateOrderItem({ serviceId: 's1', acCapacity: '1_pk', unitCount: 0 })).toEqual({
        isValid: false,
        errors: { unitCount: 'Jumlah unit harus berupa bilangan bulat minimal 1' }
      });
    });
  });

  describe('validateCustomerInfo', () => {
    // Feature: ac-maintenance-service, Property 3: Validasi Form Order Menolak Field Wajib yang Kosong
    test('Property 3: validateCustomerInfo rejects when required fields or items list are empty', () => {
      fc.assert(
        fc.property(
          fc.record({
            custName: fc.string(),
            custPhone: fc.string(),
            custLocUrl: fc.string(),
            custEmail: fc.option(fc.string()),
            items: fc.option(fc.array(fc.object()))
          }),
          (info) => {
            const isNameEmpty = !info.custName || info.custName.trim() === '';
            const isPhoneEmpty = !info.custPhone || info.custPhone.trim() === '' || !validateWhatsappNumber(info.custPhone);
            const isLocEmpty = !info.custLocUrl || info.custLocUrl.trim() === '';
            const isItemsEmpty = info.items !== undefined && (!Array.isArray(info.items) || info.items.length === 0);

            const result = validateCustomerInfo(info);

            if (isNameEmpty || isPhoneEmpty || isLocEmpty || isItemsEmpty) {
              return result.isValid === false;
            }
            return true;
          }
        )
      );
    });

    test('validateCustomerInfo accepts valid customer info', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1 }).map(s => s.trim()).filter(s => s.length > 0),
          fc.constantFrom('08', '628'),
          fc.stringOf(fc.integer({ min: 0, max: 9 }).map(String), { minLength: 8, maxLength: 12 }),
          fc.string({ minLength: 1 }).map(s => s.trim()).filter(s => s.length > 0),
          fc.option(fc.constant('test@example.com')),
          (name, prefix, suffix, locUrl, email) => {
            const info = {
              custName: name,
              custPhone: prefix + suffix,
              custLocUrl: locUrl
            };
            if (email !== null) {
              info.custEmail = email;
            }
            const result = validateCustomerInfo(info);
            return result.isValid === true && Object.keys(result.errors).length === 0;
          }
        )
      );
    });

    // Unit tests
    test('concrete examples for validateCustomerInfo', () => {
      // Valid
      const validCustomer = {
        custName: 'John Doe',
        custPhone: '081234567890',
        custLocUrl: 'https://maps.google.com/?q=loc'
      };
      expect(validateCustomerInfo(validCustomer)).toEqual({
        isValid: true,
        errors: {}
      });

      // Valid with items
      expect(validateCustomerInfo({
        ...validCustomer,
        items: [{ serviceId: 's1', acCapacity: '1_pk', unitCount: 1 }]
      })).toEqual({
        isValid: true,
        errors: {}
      });

      // Invalid (missing name)
      expect(validateCustomerInfo({
        custPhone: '081234567890',
        custLocUrl: 'https://maps.google.com/?q=loc'
      })).toEqual({
        isValid: false,
        errors: { custName: 'Nama lengkap wajib diisi' }
      });

      // Invalid (invalid phone number)
      expect(validateCustomerInfo({
        custName: 'John Doe',
        custPhone: 'invalid-phone',
        custLocUrl: 'https://maps.google.com/?q=loc'
      })).toEqual({
        isValid: false,
        errors: { custPhone: 'Format nomor WhatsApp tidak valid' }
      });

      // Invalid (empty items list)
      expect(validateCustomerInfo({
        ...validCustomer,
        items: []
      })).toEqual({
        isValid: false,
        errors: { items: 'Minimal satu item harus diisi' }
      });
    });
  });
});
