import React, { useState, useEffect } from "react";
import { demoStore } from "@/lib/demoStore";
import { ShoppingCart, Minus, Plus, X, Search, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const DashboardPG = () => {
    const [inventory, setInventory] = useState([]);
    const [cart, setCart] = useState([]);
    const user = JSON.parse(localStorage.getItem('farmbe_user') || '{"name": "Sai PG Stays", "role": "Buyer"}');
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [orderPlaced, setOrderPlaced] = useState(null);

    // Sync with store
    useEffect(() => {
        // Initial fetch
        setInventory(demoStore.getInventory());

        // Subscribe to updates (e.g., if Farmer changes stock)
        const unsubscribe = demoStore.subscribe(() => {
            setInventory(demoStore.getInventory());
        });

        return () => unsubscribe();
    }, []);

    const addToCart = (product) => {
        setCart((prev) => {
            const existing = prev.find((item) => item.id === product.id);
            if (existing) {
                if (existing.quantity < product.stock) {
                    return prev.map((item) =>
                        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                    );
                }
                return prev;
            }
            return [...prev, { ...product, quantity: 1 }];
        });
    };

    const removeFromCart = (productId) => {
        setCart((prev) => prev.filter((item) => item.id !== productId));
    };

    const adjustQuantity = (productId, delta) => {
        setCart((prev) => {
            return prev.map((item) => {
                if (item.id === productId) {
                    const newQty = item.quantity + delta;
                    if (newQty < 1) return item; // Don't remove here, use remove button

                    // Check stock limit
                    const product = inventory.find(p => p.id === productId);
                    if (product && newQty > product.stock) return item;

                    return { ...item, quantity: newQty };
                }
                return item;
            });
        });
    };

    const checkout = () => {
        const order = demoStore.placeOrder(cart);
        if (order) {
            setOrderPlaced(order);
            setCart([]);
            setTimeout(() => {
                setIsCartOpen(false);
                setOrderPlaced(null);
                // Redirect to Live Tracking Page with Order ID
                window.location.href = `/eta?orderId=${order.id}`;
            }, 1000);
        } else {
            alert("Order failed! Some items may be out of stock.");
        }
    };

    const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            {/* Main Content */}
            <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">

                {/* Page Header & Actions */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">{user.name}</h1>
                        <p className="text-sm font-medium text-gray-500 mt-1">
                            <span className="capitalize">{user.role}</span>
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="relative w-full md:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input placeholder="Search vegetables..." className="pl-9 bg-white border-gray-200 focus:bg-white transition-all" />
                        </div>

                        <Button
                            variant="outline"
                            className="bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-gray-900 shadow-sm transition-all relative"
                            onClick={() => setIsCartOpen(true)}
                        >
                            <ShoppingCart className="w-5 h-5 mr-2" />
                            <span className="font-medium">Cart</span>
                            {cartItemCount > 0 && (
                                <span className="absolute -top-2 -right-2 bg-emerald-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-sm min-w-[20px] text-center">
                                    {cartItemCount}
                                </span>
                            )}
                        </Button>
                    </div>
                </div>
                <div className="mb-6 flex items-center justify-between">
                    <h3 className="text-xl font-bold text-gray-800">Available Produce</h3>
                </div>

                {/* Product Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {inventory.map((product) => {
                        const inCart = cart.find(c => c.id === product.id);
                        const isOutOfStock = product.stock <= 0;

                        return (
                            <div
                                key={product.id}
                                className="group bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-300 flex flex-col"
                            >
                                <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${isOutOfStock ? 'grayscale opacity-80' : ''}`}
                                    />
                                    {isOutOfStock && (
                                        <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center">
                                            <span className="bg-white/90 text-gray-900 px-4 py-1.5 rounded-full text-sm font-bold shadow-lg transform -rotate-2 border border-gray-100">
                                                Sold Out
                                            </span>
                                        </div>
                                    )}
                                </div>

                                <CardContent className="p-5 flex-1 flex flex-col">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h3 className="font-bold text-lg text-gray-900 leading-tight">{product.name}</h3>
                                            <p className="text-xs font-medium text-gray-500 mt-1 uppercase tracking-wider">{product.category}</p>
                                        </div>
                                        <div className="flex items-baseline">
                                            <span className="text-xl font-bold text-gray-900">₹{product.price}</span>
                                            <span className="text-sm text-gray-500 font-medium ml-1">/{product.unit}</span>
                                        </div>
                                    </div>

                                    <div className="mt-auto pt-4">
                                        <div className="flex justify-between items-center mb-4">
                                            <span className={`text-sm font-medium flex items-center gap-1.5 ${isOutOfStock ? 'text-red-500' :
                                                product.stock < 50 ? 'text-amber-600' : 'text-emerald-600'
                                                }`}>
                                                <span className={`w-2 h-2 rounded-full ${isOutOfStock ? 'bg-red-500' :
                                                    product.stock < 50 ? 'bg-amber-500' : 'bg-emerald-500'
                                                    }`}></span>
                                                {product.stock} {product.unit} left
                                            </span>
                                        </div>

                                        {inCart ? (
                                            <div className="flex items-center justify-between bg-gray-50 rounded-lg p-1 border border-gray-100">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-9 w-9 rounded-md hover:bg-white hover:text-red-600 hover:shadow-sm"
                                                    onClick={() => adjustQuantity(product.id, -1)}
                                                >
                                                    <Minus className="h-4 w-4" />
                                                </Button>
                                                <span className="text-sm font-bold w-6 text-center text-gray-900">{inCart.quantity}</span>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-9 w-9 rounded-md hover:bg-white hover:text-emerald-600 hover:shadow-sm"
                                                    onClick={() => adjustQuantity(product.id, 1)}
                                                    disabled={inCart.quantity >= product.stock}
                                                >
                                                    <Plus className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        ) : (
                                            <Button
                                                className="w-full bg-emerald-50 text-emerald-700 hover:bg-emerald-100 hover:text-emerald-800 font-semibold border border-emerald-100 shadow-sm transition-colors"
                                                onClick={() => addToCart(product)}
                                                disabled={isOutOfStock}
                                            >
                                                Add to Cart
                                            </Button>
                                        )}
                                    </div>
                                </CardContent>
                            </div>
                        );
                    })}
                </div>
            </main>

            {/* Cart Drawer / Modal Overlay */}
            {isCartOpen && (
                <div className="fixed inset-0 z-50 flex justify-end isolate">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity animate-in fade-in duration-300"
                        onClick={() => setIsCartOpen(false)}
                    />

                    {/* Drawer Panel */}
                    <div className="relative w-full max-w-md bg-white shadow-2xl h-full flex flex-col animate-in slide-in-from-right duration-300 sm:border-l sm:border-gray-200">
                        <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-white">
                            <h2 className="text-xl font-bold flex items-center gap-2 text-gray-900">
                                <ShoppingCart className="w-5 h-5 text-emerald-600" /> Your Cart
                            </h2>
                            <Button variant="ghost" size="icon" onClick={() => setIsCartOpen(false)} className="hover:bg-gray-100 rounded-full">
                                <X className="w-5 h-5 text-gray-500" />
                            </Button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-5 bg-gray-50/50">
                            {orderPlaced ? (
                                <div className="h-full flex flex-col items-center justify-center text-center p-6 animate-in zoom-in duration-300">
                                    <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4 text-emerald-600 shadow-sm">
                                        <CheckCircle className="w-10 h-10" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Order Placed!</h3>
                                    <p className="text-gray-500 mb-6 max-w-[200px]">You have successfully purchased fresh produce.</p>
                                    <div className="bg-white p-4 rounded-xl border border-gray-200 w-full text-sm">
                                        <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Order ID</p>
                                        <p className="font-mono font-medium text-gray-900">{orderPlaced.id}</p>
                                    </div>
                                </div>
                            ) : cart.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-gray-400">
                                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                        <ShoppingCart className="w-10 h-10 opacity-20 text-gray-500" />
                                    </div>
                                    <p className="text-lg font-medium text-gray-600">Your cart is empty</p>
                                    <p className="text-sm text-gray-400 mb-6">Add some fresh produce to get started</p>
                                    <Button variant="outline" onClick={() => setIsCartOpen(false)}>Start Shopping</Button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {cart.map((item) => (
                                        <div key={item.id} className="flex gap-4 p-4 border border-gray-100 rounded-xl bg-white shadow-sm">
                                            <img src={item.image} alt={item.name} className="w-20 h-20 rounded-lg object-cover bg-gray-100" />
                                            <div className="flex-1 flex flex-col justify-between">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <h4 className="font-bold text-gray-900 text-sm">{item.name}</h4>
                                                        <p className="text-xs text-gray-500 mt-0.5">₹{item.price} / {item.unit}</p>
                                                    </div>
                                                    <p className="font-bold text-gray-900">₹{item.price * item.quantity}</p>
                                                </div>

                                                <div className="flex items-center justify-between mt-2">
                                                    <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-1 border border-gray-100">
                                                        <button
                                                            className="w-6 h-6 flex items-center justify-center hover:bg-white rounded hover:shadow-sm text-gray-600 transition-all"
                                                            onClick={() => item.quantity > 1 ? adjustQuantity(item.id, -1) : removeFromCart(item.id)}
                                                        >
                                                            <Minus className="w-3 h-3" />
                                                        </button>
                                                        <span className="text-sm font-bold w-4 text-center text-gray-900">{item.quantity}</span>
                                                        <button
                                                            className="w-6 h-6 flex items-center justify-center hover:bg-white rounded hover:shadow-sm text-emerald-600 transition-all"
                                                            onClick={() => adjustQuantity(item.id, 1)}
                                                        >
                                                            <Plus className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                    <button
                                                        onClick={() => removeFromCart(item.id)}
                                                        className="text-xs text-red-500 hover:text-red-700 font-medium"
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {!orderPlaced && cart.length > 0 && (
                            <div className="p-6 border-t border-gray-100 bg-white">
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-gray-500 font-medium">Subtotal</span>
                                    <span className="text-2xl font-bold text-gray-900">₹{cartTotal}</span>
                                </div>
                                <Button
                                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white h-12 text-lg font-semibold shadow-lg shadow-emerald-200 transition-all active:scale-[0.98]"
                                    onClick={checkout}
                                >
                                    Pay & Place Order
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default DashboardPG;
