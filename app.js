/**
 * FreezeFlow - Application Logic
 * Handles pricing, local storage, and UI updates
 */

document.addEventListener('DOMContentLoaded', () => {
    // --- State & Constants ---
    const PRICING = {
        wash: 75000,
        deep: 150000,
        freon: 200000
    };

    // PK Multipliers (Optional complexity for realism)
    const PK_MULTIPLIERS = {
        '0.5': 1.0,
        '1': 1.2,
        '1.5': 1.3,
        '2': 1.5
    };

    let orders = JSON.parse(localStorage.getItem('freezeFlow_orders')) || [];

    // --- DOM Elements ---
    const orderForm = document.getElementById('orderForm');
    const acCountInput = document.getElementById('acCount');
    const pkTypeSelect = document.getElementById('pkType');
    const serviceTypeSelect = document.getElementById('serviceType');
    const totalPriceDisplay = document.getElementById('totalPrice');
    const historyList = document.getElementById('historyList');
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');

    // --- Core Functions ---

    /**
     * Formats number to Indonesian Rupiah currency string
     * @param {number} amount 
     */
    const formatIDR = (amount) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount);
    };

    /**
     * Calculates the total price based on form inputs
     */
    const calculateTotal = () => {
        const count = parseInt(acCountInput.value) || 0;
        const pk = pkTypeSelect.value;
        const type = serviceTypeSelect.value;

        const basePrice = PRICING[type] || 0;
        const multiplier = PK_MULTIPLIERS[pk] || 1;

        const total = (basePrice * multiplier) * count;

        totalPriceDisplay.textContent = formatIDR(total);
        return total;
    };

    /**
     * Displays a temporary toast notification
     * @param {string} message 
     */
    const showToast = (message) => {
        toastMessage.textContent = message;
        toast.classList.add('show');

        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    };

    /**
     * Renders the order history from localStorage
     */
    const renderHistory = () => {
        if (orders.length === 0) {
            historyList.innerHTML = `
                <div class="empty-state">
                    <i data-lucide="package-open"></i>
                    <p>No bookings yet.</p>
                </div>
            `;
            lucide.createIcons();
            return;
        }

        // Sort orders by date (newest first)
        const sortedOrders = [...orders].sort((a, b) => new Date(b.date) - new Date(a.date));

        historyList.innerHTML = sortedOrders.map(order => `
            <div class="service-item">
                <div class="item-info">
                    <h4>${order.serviceName} (${order.pk} PK)</h4>
                    <p>${order.count} Unit • ${new Date(order.date).toLocaleDateString('en-GB')}</p>
                </div>
                <div style="text-align: right">
                    <div style="font-weight: 700; color: var(--primary);">${formatIDR(order.total)}</div>
                    <span class="badge badge-upcoming">Upcoming</span>
                </div>
            </div>
        `).join('');

        // Re-initialize icons for newly added elements
        lucide.createIcons();
    };

    /**
     * Saves a new order and redirects to WhatsApp
     */
    const handleOrderSubmit = (e) => {
        e.preventDefault();

        const count = parseInt(acCountInput.value);
        const pkValue = pkTypeSelect.options[pkTypeSelect.selectedIndex].text.split(' ')[0];
        const serviceName = serviceTypeSelect.options[serviceTypeSelect.selectedIndex].text.split('(')[0].trim();
        const total = calculateTotal();

        const newOrder = {
            id: Date.now(),
            count: count,
            pk: pkValue,
            serviceName: serviceName,
            serviceType: serviceTypeSelect.value,
            total: total,
            date: new Date().toISOString()
        };

        // Save to state and storage
        orders.push(newOrder);
        localStorage.setItem('freezeFlow_orders', JSON.stringify(orders));

        // Construct WhatsApp Message
        const waNumber = "6281944104536"; // Replace with actual admin number
        const waMessage = `Halo FreezeFlow! 👋
Saya ingin memesan layanan cuci AC.

*Detail Pesanan:*
❄️ *Layanan:* ${serviceName}
🌬️ *Kapasitas:* ${pkValue} PK
🔢 *Jumlah:* ${count} Unit
💰 *Total Biaya:* ${formatIDR(total)}

Mohon segera dikonfirmasi. Terima kasih!`;

        const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(waMessage)}`;

        // UI Feedback
        showToast('Redirecting to WhatsApp...');

        // Delay slightly for toast visibility
        setTimeout(() => {
            window.open(waUrl, '_blank');
            orderForm.reset();
            calculateTotal();
            renderHistory();
        }, 1500);
    };

    // --- Event Listeners ---

    // Real-time calculation on any input change
    [acCountInput, pkTypeSelect, serviceTypeSelect].forEach(el => {
        el.addEventListener('input', calculateTotal);
    });

    orderForm.addEventListener('submit', handleOrderSubmit);

    // --- Initialization ---
    calculateTotal();
    renderHistory();
});
