/**
 * Filter orders based on status and/or date range.
 * @param {Array} orders - Array of order objects.
 * @param {Object} criteria - Filter criteria.
 * @param {string|Array} criteria.status - Status or list of statuses to include.
 * @param {string} criteria.startDate - Start date in YYYY-MM-DD format (inclusive).
 * @param {string} criteria.endDate - End date in YYYY-MM-DD format (inclusive).
 * @returns {Array} Filtered orders.
 */
export function filterOrders(orders, criteria) {
  if (!Array.isArray(orders)) {
    return [];
  }

  const { status, startDate, endDate } = criteria || {};

  return orders.filter(order => {
    // Filter by status
    if (status) {
      const statusList = Array.isArray(status) ? status : [status];
      if (!statusList.includes(order.status)) {
        return false;
      }
    }

    // Filter by startDate
    if (startDate) {
      const orderDate = order.created_at?.split('T')[0] || order.created_at; // Extract date part if ISO string
      if (orderDate < startDate) {
        return false;
      }
    }

    // Filter by endDate
    if (endDate) {
      const orderDate = order.created_at?.split('T')[0] || order.created_at; // Extract date part if ISO string
      if (orderDate > endDate) {
        return false;
      }
    }

    return true;
  });
}