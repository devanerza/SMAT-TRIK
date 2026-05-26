/**
 * Calculates the total daily used units from a list of orders.
 * Only orders whose status is not 'cancelled' are included.
 *
 * @param {Array} orders - Array of order objects.
 * @returns {number} The total unit count.
 */
export function calculateDailyUsedUnits(orders) {
  if (!Array.isArray(orders)) return 0;
  let total = 0;
  for (const order of orders) {
    if (order && order.status !== 'cancelled') {
      const items = order.order_items || order.items || [];
      if (Array.isArray(items)) {
        for (const item of items) {
          if (item) {
            const count = Number(item.unit_count || item.unitCount || 0);
            if (!isNaN(count)) {
              total += count;
            }
          }
        }
      }
    }
  }
  return total;
}

/**
 * Checks if a new order's units can fit within the daily quota constraint of 20 units.
 *
 * @param {number} usedUnits - The units already used today.
 * @param {number} newOrderUnits - The units requested for the new order.
 * @returns {{ allowed: boolean, remainingUnits: number }}
 */
export function checkQuotaAvailability(usedUnits, newOrderUnits) {
  const used = typeof usedUnits === 'number' && !isNaN(usedUnits) ? usedUnits : 0;
  const newUnits = typeof newOrderUnits === 'number' && !isNaN(newOrderUnits) ? newOrderUnits : 0;

  const total = used + newUnits;
  const allowed = total <= 20;
  const remainingUnits = allowed ? 20 - total : 20 - used;

  return {
    allowed,
    remainingUnits: Math.max(0, remainingUnits)
  };
}
