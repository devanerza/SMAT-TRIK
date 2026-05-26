/**
 * Validasi transisi status yang diizinkan untuk Admin
 * @param {string} currentStatus - Status saat ini
 * @param {string} newStatus - Status baru yang diinginkan
 * @returns {boolean} true jika transisi diizinkan
 */
export function validateAdminStatusTransition(currentStatus, newStatus) {
  const allowedTransitions = {
    Pending: ['Proses', 'Batal'],
    Proses: ['Batal'],
    // Batal dan Selesai tidak bisa diubah lagi
  };

  if (!allowedTransitions[currentStatus]) {
    return false;
  }

  return allowedTransitions[currentStatus].includes(newStatus);
}

/**
 * Validasi transisi status yang diizinkan untuk Teknisi
 * @param {string} currentStatus - Status saat ini
 * @param {string} newStatus - Status baru yang diinginkan
 * @returns {boolean} true jika transisi diizinkan
 */
export function validateTechnicianStatusTransition(currentStatus, newStatus) {
  const allowedTransitions = {
    Proses: ['Selesai'],
    // Pending, Batal, dan Selesai tidak bisa diubah oleh teknisi
  };

  if (!allowedTransitions[currentStatus]) {
    return false;
  }

  return allowedTransitions[currentStatus].includes(newStatus);
}

/**
 * Validasi bahwa order memiliki team_id sebelum dikonfirmasi
 * @param {Object} order - Objek order
 * @returns {boolean} true jika order memiliki team_id yang valid
 */
export function validateConfirmationRequirement(order) {
  // Asumsi: team_id ada dan tidak kosong (string non-empty atau number non-zero)
  const teamId = order.team_id || order.teamId;
  return teamId !== null && teamId !== undefined && teamId !== '';
}

/**
 * Validasi bahwa assign tim hanya diizinkan pada status pending atau confirmed
 * @param {Object} order - Objek order
 * @returns {boolean} true jika status order mengizinkan assign tim
 */
export function validateAssignTeam(order) {
  const status = order.status;
  return status === 'Pending' || status === 'Proses';
}