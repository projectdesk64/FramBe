// Single source of truth for the demo
// Uses localStorage to sync data across pages/tabs

const INVENTORY_KEY = 'farmbe_inventory';
const ORDERS_KEY = 'farmbe_orders';
const EVENT_KEY = 'farmbe_storage_change';

// Initial Data
const INITIAL_INVENTORY = [
    { id: 1, item: "Hydroponic Tomatoes", stock: 500, price: 42 }
];

const INITIAL_ORDERS = [];

// Helper to dispatch local event for same-tab updates
const notify = () => {
    window.dispatchEvent(new Event(EVENT_KEY));
};

export const demoStore = {
    init: () => {
        if (!localStorage.getItem(INVENTORY_KEY)) {
            localStorage.setItem(INVENTORY_KEY, JSON.stringify(INITIAL_INVENTORY));
        }
        if (!localStorage.getItem(ORDERS_KEY)) {
            localStorage.setItem(ORDERS_KEY, JSON.stringify(INITIAL_ORDERS));
        }
    },

    getInventory: () => {
        try {
            return JSON.parse(localStorage.getItem(INVENTORY_KEY) || '[]');
        } catch (e) {
            return [];
        }
    },

    updateStock: (itemId, newQty) => {
        const inventory = demoStore.getInventory();
        const itemIndex = inventory.findIndex(i => i.id === itemId);

        if (itemIndex > -1) {
            inventory[itemIndex].stock = newQty;
            localStorage.setItem(INVENTORY_KEY, JSON.stringify(inventory));
            notify();
        }
    },

    getOrders: () => {
        try {
            return JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]');
        } catch (e) {
            return [];
        }
    },

    createOrder: (orderData) => {
        const orders = demoStore.getOrders();
        const newOrder = {
            id: `ORD-${Date.now()}`,
            source: "GreenEarth Estates",
            destination: "Sai PG Stays",
            status: "Pending",
            timestamp: new Date().toISOString(),
            ...orderData
        };

        orders.push(newOrder);
        localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
        notify();
        return newOrder;
    },

    updateOrderStatus: (orderId, newStatus) => {
        const orders = demoStore.getOrders();
        const orderIndex = orders.findIndex(o => o.id === orderId);

        if (orderIndex > -1) {
            orders[orderIndex].status = newStatus;

            // If dispatching, add start time for tracking visual (Phase 2 prep)
            if (newStatus === 'In Transit') {
                orders[orderIndex].startTime = Date.now();
            }

            localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
            notify();
        }
    },

    // React hook style subscription
    subscribe: (callback) => {
        window.addEventListener(EVENT_KEY, callback);
        window.addEventListener('storage', callback); // For cross-tab changes
        return () => {
            window.removeEventListener(EVENT_KEY, callback);
            window.removeEventListener('storage', callback);
        };
    }
};

// Initialize on load
demoStore.init();
