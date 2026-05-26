/**
 * Group orders by day and week.
 * @param {Array} orders - Array of order objects.
 * @returns {Object} Object with daily and weekly aggregates.
 */
export function aggregateDailyOrderTrend(orders) {
  if (!Array.isArray(orders)) {
    return { daily: {}, weekly: {} };
  }

  const daily = {};
  const weekly = {};

  orders.forEach(order => {
    // Assuming order has created_at in ISO format
    const dateStr = order.created_at?.split('T')[0] || order.created_at;
    // Validate date string format (YYYY-MM-DD) and range
    if (!dateStr || !/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return;
    
    // Additional validation: year should be reasonable (e.g., 1900-2100)
    const year = parseInt(dateStr.substring(0, 4));
    if (year < 1900 || year > 2100) return;

    // Parse date
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return;

    // Daily aggregation
    const dayKey = dateStr; // YYYY-MM-DD
    if (!daily[dayKey]) {
      daily[dayKey] = { count: 0, totalUnits: 0 };
    }
    daily[dayKey].count += 1;
    
    // Calculate total units for this order
    let orderUnits = 0;
    if (order.order_items && Array.isArray(order.order_items)) {
      order.order_items.forEach(item => {
        orderUnits += item.unit_count || 0;
      });
    }
    daily[dayKey].totalUnits += orderUnits;

    // Weekly aggregation (ISO week) - only for valid dates
    try {
      const year = date.getFullYear();
      const weekNumber = getWeekNumber(date);
      const weekKey = `${year}-W${weekNumber.toString().padStart(2, '0')}`;
      
      if (!weekly[weekKey]) {
        weekly[weekKey] = { count: 0, totalUnits: 0 };
      }
      weekly[weekKey].count += 1;
      weekly[weekKey].totalUnits += orderUnits;
    } catch (e) {
      // Skip week aggregation if there's an error
    }
  });

  return { daily, weekly };
}

/**
 * Get ISO week number for a date.
 * @param {Date} date - Date object.
 * @returns {number} Week number (1-53).
 */
export function getWeekNumber(date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7; // Sunday is 0, we want 7
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
}

/**
 * Sort services by frequency descending.
 * @param {Array} orderItems - Array of order item objects.
 * @returns {Array} Sorted array of service objects with frequency.
 */
export function aggregatePopularServices(orderItems) {
  if (!Array.isArray(orderItems)) {
    return [];
  }

  const serviceCounts = Object.create(null);

  orderItems.forEach(item => {
    const serviceId = item.service_id || item.serviceId || 'unknown';
    if (serviceId !== null && serviceId !== undefined) {
      const serviceIdStr = String(serviceId);
      if (!serviceCounts[serviceIdStr]) {
        serviceCounts[serviceIdStr] = { serviceId: serviceIdStr, count: 0 };
      }
      serviceCounts[serviceIdStr].count += 1;
    }
  });

  // Convert to array and sort by count descending
  const servicesArray = Object.values(serviceCounts);
  return servicesArray.sort((a, b) => b.count - a.count);
}

/**
 * Calculate team productivity (orders done and total units) per team in a period.
 * @param {Array} orders - Array of order objects.
 * @param {Array} orderItems - Array of order item objects.
 * @param {Object} period - Period object with startDate and endDate (YYYY-MM-DD).
 * @returns {Object} Mapping of teamId to productivity metrics.
 */
export function aggregateTeamProductivity(orders, orderItems, period) {
  if (!Array.isArray(orders) || !Array.isArray(orderItems)) {
    return {};
  }

  // Create orderId -> orderItems mapping
  const orderItemsMap = {};
  orderItems.forEach(item => {
    const orderId = item.order_id || item.orderId;
    if (orderId) {
      if (!orderItemsMap[orderId]) {
        orderItemsMap[orderId] = [];
      }
      orderItemsMap[orderId].push(item);
    }
  });

  const teamProductivity = {};

  orders.forEach(order => {
    // Filter by period if provided
    if (period && (period.startDate || period.endDate)) {
      const orderDate = order.created_at?.split('T')[0] || order.created_at;
      if (!orderDate || !/^\d{4}-\d{2}-\d{2}$/.test(orderDate)) return;
      
      if (period.startDate && orderDate < period.startDate) return;
      if (period.endDate && orderDate > period.endDate) return;
    }

    // Only count completed orders
    if (order.status !== 'Selesai') return;

    const teamId = order.team_id || order.teamId;
    // Validate teamId is a valid string (not a prototype property)
    if (!teamId || typeof teamId !== 'string' || 
        teamId === 'constructor' || 
        teamId === '__proto__' || 
        teamId === 'valueOf' ||
        teamId === 'toString') {
      return;
    }

    if (!teamProductivity[teamId]) {
      teamProductivity[teamId] = { orderCount: 0, totalUnits: 0 };
    }

    teamProductivity[teamId].orderCount += 1;

    // Calculate units for this order
    const items = orderItemsMap[order.id] || [];
    let orderUnits = 0;
    items.forEach(item => {
      orderUnits += item.unit_count || 0;
    });
    teamProductivity[teamId].totalUnits += orderUnits;
  });

  return teamProductivity;
}

/**
 * Group repeat customers by email (fallback to phone).
 * @param {Array} orders - Array of order objects.
 * @returns {Object} Mapping of customer identifier to their orders.
 */
export function groupRepeatCustomers(orders) {
  if (!Array.isArray(orders)) {
    return {};
  }

  const customerGroups = Object.create(null);

  orders.forEach(order => {
    let identifier = 'unknown';
    
    const email = order.cust_email || order.custEmail;
    if (email !== null && email !== undefined && email !== '' && typeof email === 'string') {
      identifier = email;
    } else {
      const phone = order.cust_phone || order.custPhone;
      if (phone !== null && phone !== undefined && phone !== '' && typeof phone === 'string') {
        identifier = phone;
      }
    }

    if (!customerGroups[identifier]) {
      customerGroups[identifier] = [];
    }
    customerGroups[identifier].push(order);
  });

  const repeatCustomers = Object.create(null);
  Object.keys(customerGroups).forEach(key => {
    if (customerGroups[key].length > 1) {
      repeatCustomers[key] = customerGroups[key];
    }
  });

  return repeatCustomers;
}

/**
 * Calculate average daily quota utilization percentage for a period.
 * @param {Array} orders - Array of order objects.
 * @param {Object} period - Period object with startDate and endDate (YYYY-MM-DD).
 * @returns {number} Average utilization percentage (0-100).
 */
export function calculateQuotaUtilization(orders, period) {
  if (!Array.isArray(orders)) {
    return 0;
  }

  // Group orders by date
  const dailyUnits = {};

  orders.forEach(order => {
    // Skip cancelled orders
    if (order.status === 'Batal') return;

    const orderDate = order.created_at?.split('T')[0] || order.created_at;
    if (!orderDate) return;

    // Filter by period if provided
    if (period && (period.startDate || period.endDate)) {
      if (period.startDate && orderDate < period.startDate) return;
      if (period.endDate && orderDate > period.endDate) return;
    }

    // Calculate units for this order
    let orderUnits = 0;
    if (order.order_items && Array.isArray(order.order_items)) {
      order.order_items.forEach(item => {
        orderUnits += item.unit_count || 0;
      });
    }

    if (!dailyUnits[orderDate]) {
      dailyUnits[orderDate] = 0;
    }
    dailyUnits[orderDate] += orderUnits;
  });

  // Calculate utilization for each day (max 20 units per day)
  const utilizationValues = [];
  Object.values(dailyUnits).forEach(units => {
    const utilization = Math.min((units / 20) * 100, 100); // Cap at 100%
    utilizationValues.push(utilization);
  });

  // Return average utilization
  if (utilizationValues.length === 0) return 0;
  
  const sum = utilizationValues.reduce((acc, val) => acc + val, 0);
  return sum / utilizationValues.length;
}

/**
 * Filter analytic data by date range.
 * @param {Array} data - Array of data objects with date property.
 * @param {string} startDate - Start date in YYYY-MM-DD format (inclusive).
 * @param {string} endDate - End date in YYYY-MM-DD format (inclusive).
 * @returns {Array} Filtered data.
 */
export function filterByDateRange(data, startDate, endDate) {
  if (!Array.isArray(data)) {
    return [];
  }

  if (!startDate && !endDate) {
    return data;
  }

  return data.filter(item => {
    // Assuming item has a date property in YYYY-MM-DD format
    const itemDate = item.date || item.tanggal || item.created_at?.split('T')[0];
    if (!itemDate || !/^\d{4}-\d{2}-\d{2}$/.test(itemDate)) return false;

    if (startDate && itemDate < startDate) return false;
    if (endDate && itemDate > endDate) return false;
    
    return true;
  });
}