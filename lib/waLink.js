/**
 * Generates a wa.me deep link with a pre-filled, URL-encoded message.
 *
 * @param {Object} order - The order header object.
 * @param {Array} items - The list of items in the order.
 * @param {number} remainingQuota - The sisa kuota harian after this order is accepted.
 * @param {string} adminPhone - The admin phone number to send the message to.
 * @returns {string} The formatted wa.me URL.
 */
export function buildWaLink(order, items, remainingQuota, adminPhone) {
  if (!order) return '';
  const cleanAdminPhone = typeof adminPhone === 'string' ? adminPhone.replace(/\D/g, '') : '';

  const name = order.custName || order.cust_name || '';
  const phone = order.custPhone || order.cust_phone || '';
  const locUrl = order.custLocUrl || order.cust_loc_url || '';

  const itemList = Array.isArray(items) ? items : [];
  let totalUnits = 0;
  const itemDetailsText = itemList.map((item, idx) => {
    const service = item.serviceName || item.service_name || item.serviceId || 'Service AC';
    const capacity = item.acCapacity || item.ac_capacity || '';
    const unitCount = Number(item.unitCount || item.unit_count || 0);
    totalUnits += unitCount;
    return `${idx + 1}. ${service} (${capacity}) - ${unitCount} unit`;
  }).join('\n');

  const message = `Halo Admin, ada booking service AC baru!

Detail Customer:
- Nama: ${name}
- WhatsApp: ${phone}
- Lokasi: ${locUrl}

Detail Layanan:
${itemDetailsText || 'Tidak ada item'}

Total Unit: ${totalUnits}
Sisa Kuota Hari Ini: ${remainingQuota !== undefined && remainingQuota !== null ? remainingQuota : 0}`;

  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${cleanAdminPhone}?text=${encodedMessage}`;
}
