export const INITIAL_INVENTORY = [
    {
        id: 1,
        name: "Tomatoes",
        price: 45,
        stock: 500,
        unit: "kg",
        category: "Vegetables",
        image: "https://images.unsplash.com/photo-1582284540020-8acbe03f4924?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    {
        id: 2,
        name: "Onions",
        price: 28,
        stock: 1200,
        unit: "kg",
        category: "Vegetables",
        image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 3,
        name: "Potatoes",
        price: 35,
        stock: 800,
        unit: "kg",
        category: "Vegetables",
        image: "https://images.unsplash.com/photo-1518977676641-8f26969e3c6c?auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 4,
        name: "Green Chillies",
        price: 80,
        stock: 150,
        unit: "kg",
        category: "Vegetables",
        image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=800&q=80"
    }
];

export const INITIAL_ORDERS = [
    {
        id: "ORD-001",
        customer: "Fresh Mart",
        items: "Tomatoes (50kg), Onions (100kg)",
        total: 2400,
        status: "Pending",
        date: "2025-10-20"
    },
    {
        id: "ORD-002",
        customer: "Green Grocers",
        items: "Potatoes (200kg)",
        total: 1100,
        status: "Shipped",
        date: "2025-10-19"
    }
];

export const FALLBACK_IMAGES = [
    "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80", // Vegetable Basket
    "https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&q=80", // Fresh Greens
    "https://images.unsplash.com/photo-1518843875459-f738682238a6?auto=format&fit=crop&q=80"  // Mixed Roots
];

const INVENTORY_KEY = "farmbe_inventory_v2";
const ORDERS_KEY = "farmbe_orders_v2";

class DemoStore {
    constructor() {
        this.subscribers = [];
        this.init();

        // Listen for changes from other windows
        window.addEventListener("storage", (event) => {
            if (event.key === INVENTORY_KEY || event.key === ORDERS_KEY) {
                // Determine what changed and maybe only reload that part,
                // but for simplicity and consistency with notify(), we trigger a general update.
                this.notify();
            }
        });
    }

    init() {
        if (!localStorage.getItem(INVENTORY_KEY)) {
            this.resetInventory();
        }
        if (!localStorage.getItem(ORDERS_KEY)) {
            this.resetOrders();
        }
    }

    resetInventory() {
        localStorage.setItem(INVENTORY_KEY, JSON.stringify(INITIAL_INVENTORY));
        this.notify();
    }

    resetOrders() {
        localStorage.setItem(ORDERS_KEY, JSON.stringify(INITIAL_ORDERS));
        this.notify();
    }

    getInventory() {
        try {
            const data = localStorage.getItem(INVENTORY_KEY);
            return data ? JSON.parse(data) : [];
        } catch (e) {
            console.error("Failed to parse inventory from localStorage", e);
            return [];
        }
    }

    getOrders() {
        try {
            const data = localStorage.getItem(ORDERS_KEY);
            return data ? JSON.parse(data) : [];
        } catch (e) {
            console.error("Failed to parse orders from localStorage", e);
            return [];
        }
    }

    updateInventory(newInventory) {
        localStorage.setItem(INVENTORY_KEY, JSON.stringify(newInventory));
        this.notify();
    }

    updateOrders(newOrders) {
        localStorage.setItem(ORDERS_KEY, JSON.stringify(newOrders));
        this.notify();
    }

    updateStock(id, newStock) {
        const inventory = this.getInventory();
        const itemIndex = inventory.findIndex(item => item.id === id);
        if (itemIndex > -1) {
            inventory[itemIndex].stock = newStock;
            this.updateInventory(inventory);
        }
    }

    updateProduct(id, updates) {
        const inventory = this.getInventory();
        const itemIndex = inventory.findIndex(item => item.id === id);
        if (itemIndex > -1) {
            inventory[itemIndex] = { ...inventory[itemIndex], ...updates };
            this.updateInventory(inventory);
        }
    }

    updateOrderStatus(id, status) {
        const orders = this.getOrders();
        const orderIndex = orders.findIndex(o => o.id === id);
        if (orderIndex > -1) {
            orders[orderIndex].status = status;
            this.updateOrders(orders);
        }
    }

    placeOrder(cartItems) {
        const inventory = this.getInventory();
        const orders = this.getOrders();

        // 1. Validate Stock
        for (const item of cartItems) {
            const product = inventory.find(p => p.id === item.id);
            if (!product || product.stock < item.quantity) {
                console.error(`Insufficient stock for ${item.name}`);
                return false;
            }
        }

        // 2. Reduce Stock
        cartItems.forEach(item => {
            const productIndex = inventory.findIndex(p => p.id === item.id);
            if (productIndex > -1) {
                inventory[productIndex].stock -= item.quantity;
            }
        });

        // 3. Create Order
        const newOrder = {
            id: `ORD-${Math.floor(Math.random() * 10000)}`,
            customer: "Sai PG Stays", // Hardcoded for this view
            items: cartItems.map(i => `${i.name} (${i.quantity}kg)`).join(", "),
            total: cartItems.reduce((sum, i) => sum + (i.price * i.quantity), 0),
            status: "Pending",
            date: new Date().toISOString().split('T')[0]
        };

        orders.unshift(newOrder); // Add to top

        // 4. Commit Changes
        this.updateInventory(inventory);
        this.updateOrders(orders);

        return newOrder;
    }

    addProduct(product) {
        const inventory = this.getInventory();
        const newId = Date.now();

        let imageUrl = product.image;
        if (!imageUrl) {
            const randomIndex = Math.floor(Math.random() * FALLBACK_IMAGES.length);
            imageUrl = FALLBACK_IMAGES[randomIndex];
        }

        const newProduct = {
            id: newId,
            name: product.name,
            category: product.category || "Vegetables",
            price: Number(product.price),
            stock: Number(product.stock),
            unit: product.unit || "kg",
            image: imageUrl
        };

        inventory.push(newProduct);
        localStorage.setItem(INVENTORY_KEY, JSON.stringify(inventory));

        // Dispatch events as requested for sync and immediate update
        window.dispatchEvent(new Event("storage"));
        this.notify();

        return inventory;
    }

    deleteProduct(id) {
        let inventory = this.getInventory();
        inventory = inventory.filter(p => p.id !== id);
        localStorage.setItem(INVENTORY_KEY, JSON.stringify(inventory));

        window.dispatchEvent(new Event("storage"));
        this.notify();
        return inventory;
    }

    subscribe(callback) {
        this.subscribers.push(callback);
        return () => {
            this.subscribers = this.subscribers.filter(cb => cb !== callback);
        };
    }

    notify() {
        this.subscribers.forEach(cb => cb());
        window.dispatchEvent(new Event("farmbe-store-updated"));
    }
}

export const demoStore = new DemoStore();

export const initStore = () => demoStore.init();
