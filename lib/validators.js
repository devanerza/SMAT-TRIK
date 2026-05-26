/**
 * Validates Indonesian WhatsApp number.
 * Must start with '08' or '628', contain only digits, and have a length of 10 to 15 digits.
 *
 * @param {any} number
 * @returns {boolean}
 */
export function validateWhatsappNumber(number) {
  if (typeof number !== 'string') return false;
  if (!/^\d+$/.test(number)) return false;
  if (number.length < 10 || number.length > 15) return false;
  return number.startsWith('08') || number.startsWith('628');
}

/**
 * Validates email according to RFC 5321.
 * Requires an @ symbol, a local part, a domain part, and at least one dot in the domain part.
 *
 * @param {any} email
 * @returns {boolean}
 */
export function validateEmail(email) {
  if (typeof email !== 'string') return false;
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  return emailRegex.test(email);
}

/**
 * Validates a single order item.
 * Requires:
 * - serviceId: non-empty string.
 * - acCapacity: one of '0.5_pk', '0.75_pk', '1_pk', '1.5_pk', '2_pk', '2.5_pk'.
 * - unitCount: integer >= 1.
 *
 * @param {any} item
 * @returns {{ isValid: boolean, errors: Object }}
 */
export function validateOrderItem(item) {
  const errors = {};
  if (!item || typeof item !== 'object') {
    return { isValid: false, errors: { _general: 'Item is required' } };
  }

  const { serviceId, acCapacity, unitCount } = item;

  if (!serviceId || typeof serviceId !== 'string' || serviceId.trim() === '') {
    errors.serviceId = 'Layanan wajib dipilih';
  }

  const validCapacities = ['0.5_pk', '0.75_pk', '1_pk', '1.5_pk', '2_pk', '2.5_pk'];
  if (!acCapacity || typeof acCapacity !== 'string' || !validCapacities.includes(acCapacity)) {
    errors.acCapacity = 'Kapasitas AC tidak valid';
  }

  if (
    unitCount === undefined ||
    unitCount === null ||
    typeof unitCount !== 'number' ||
    !Number.isInteger(unitCount) ||
    unitCount < 1
  ) {
    errors.unitCount = 'Jumlah unit harus berupa bilangan bulat minimal 1';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

/**
 * Validates customer information.
 * Requires:
 * - custName: non-empty string.
 * - custPhone: valid WhatsApp number.
 * - custLocUrl: non-empty string.
 * - custEmail: optional, but if provided, must be valid.
 * - items: optional, but if present, must be an array of length >= 1.
 *
 * @param {any} customerInfo
 * @returns {{ isValid: boolean, errors: Object }}
 */
export function validateCustomerInfo(customerInfo) {
  const errors = {};
  if (!customerInfo || typeof customerInfo !== 'object') {
    return { isValid: false, errors: { _general: 'Informasi customer wajib diisi' } };
  }

  // Support both nested structure { customerInfo, items } and flat structure { custName, custPhone, custLocUrl, custEmail, items }
  let info = customerInfo;
  let items = customerInfo.items;

  if (customerInfo.customerInfo && typeof customerInfo.customerInfo === 'object') {
    info = customerInfo.customerInfo;
    if (items === undefined) {
      items = customerInfo.items;
    }
  }

  const { custName, custPhone, custLocUrl, custEmail } = info;

  if (!custName || typeof custName !== 'string' || custName.trim() === '') {
    errors.custName = 'Nama lengkap wajib diisi';
  }

  if (!custPhone || typeof custPhone !== 'string' || custPhone.trim() === '') {
    errors.custPhone = 'Nomor WhatsApp wajib diisi';
  } else if (!validateWhatsappNumber(custPhone)) {
    errors.custPhone = 'Format nomor WhatsApp tidak valid';
  }

  if (!custLocUrl || typeof custLocUrl !== 'string' || custLocUrl.trim() === '') {
    errors.custLocUrl = 'URL lokasi wajib diisi';
  }

  if (custEmail !== undefined && custEmail !== null && custEmail !== '') {
    if (typeof custEmail !== 'string') {
      errors.custEmail = 'Format email tidak valid';
    } else if (custEmail.trim() !== '') {
      if (!validateEmail(custEmail)) {
        errors.custEmail = 'Format email tidak valid';
      }
    }
  }

  if (items !== undefined) {
    if (!Array.isArray(items) || items.length === 0) {
      errors.items = 'Minimal satu item harus diisi';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}
