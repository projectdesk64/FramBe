import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { demoStore } from '@/lib/demoStore';
import { Package, IndianRupee, AlertTriangle, RefreshCw, Trash2 } from "lucide-react";

export default function DashboardFarmer() {
    const [inventory, setInventory] = useState([]);
    const [orders, setOrders] = useState([]);

    const user = JSON.parse(localStorage.getItem('farmbe_user') || '{"name": "GreenEarth Estates", "role": "Farmer"}');

    // Local state for editing to avoid laggy inputs before save
    const [editValues, setEditValues] = useState({});

    // Add Product Modal State
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [newProduct, setNewProduct] = useState({
        name: "",
        category: "Vegetables",
        price: "",
        stock: "",
        image: ""
    });

    const syncData = () => {
        setInventory(demoStore.getInventory());
        setOrders(demoStore.getOrders());
    };

    useEffect(() => {
        syncData();
        const unsubscribe = demoStore.subscribe(syncData);
        return () => unsubscribe();
    }, []);

    // KPIs
    // KPIs
    const totalRevenue = orders.reduce((sum, order) =>
        order.status !== 'Cancelled' ? sum + (order.total || 0) : sum, 0
    );
    const activeOrdersCount = orders.filter(o =>
        o.status === 'Pending' || o.status === 'Shipped'
    ).length;
    const lowStockCount = inventory.filter(i => i.stock < 100).length;

    // Handlers
    const handleTempUpdate = (id, field, value) => {
        setEditValues(prev => ({
            ...prev,
            [id]: {
                ...prev[id],
                [field]: value
            }
        }));
    };

    const saveProduct = (item) => {
        const updates = editValues[item.id];
        if (updates) {
            // Convert to numbers where appropriate
            const saneUpdates = {};
            if (updates.stock !== undefined) saneUpdates.stock = parseInt(updates.stock);
            if (updates.price !== undefined) saneUpdates.price = parseInt(updates.price);

            demoStore.updateProduct(item.id, saneUpdates);

            // Clear local edit state for this item so it resyncs with store
            setEditValues(prev => {
                const newState = { ...prev };
                delete newState[item.id];
                return newState;
            });

            // Ideally use a toast here
        }
    };

    const handleDelete = (id) => {
        if (window.confirm("Delete this item permanently?")) {
            const updatedList = demoStore.deleteProduct(id);
            setInventory(updatedList);
            alert("Item Deleted");
        }
    };

    const handleAddProductSubmit = (e) => {
        e.preventDefault();
        if (!newProduct.name || !newProduct.price || !newProduct.stock) {
            alert("Please fill in all required fields");
            return;
        }

        demoStore.addProduct(newProduct);
        alert("Product Added Successfully");
        setIsAddModalOpen(false);
        setNewProduct({
            name: "",
            category: "Vegetables",
            price: "",
            stock: "",
            image: ""
        });
        syncData(); // Explicit refresh logic mostly redundant due to subscription but good callback
    };

    const handleStatusUpdate = (orderId, newStatus) => {
        // 1. Optimistic Update (UI)
        const updatedOrders = orders.map(order =>
            order.id === orderId ? { ...order, status: newStatus } : order
        );
        setOrders(updatedOrders);

        // 2. Update persistent store (uses correct key 'farmbe_orders_v2')
        demoStore.updateOrderStatus(orderId, newStatus);
    };

    return (
        <div className="min-h-screen bg-gray-50/50 relative">

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
                {/* 1. Header Section */}
                <div className="flex justify-between items-center pb-2">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900">{user.name}</h1>
                        <p className="text-sm font-medium text-gray-500 mt-1">
                            <span className="capitalize">{user.role}</span>
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <Button
                            className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full shadow-lg shadow-emerald-200 px-6 transition-transform hover:scale-105"
                            onClick={() => setIsAddModalOpen(true)}
                        >
                            + Add Product
                        </Button>
                        <Button variant="outline" size="icon" onClick={syncData} title="Refresh Data" className="rounded-full h-10 w-10 border-gray-200 hover:bg-gray-50 hover:text-emerald-600 transition-colors">
                            <RefreshCw className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                {/* 2. KPI Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Revenue Card */}
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <span className="text-sm font-medium text-gray-500 uppercase tracking-wider">Total Revenue</span>
                                <div className="p-2 bg-emerald-50 rounded-lg">
                                    <IndianRupee className="h-5 w-5 text-emerald-600" />
                                </div>
                            </div>
                            <div className="text-3xl font-bold text-gray-900 tracking-tight">₹ {totalRevenue.toLocaleString()}</div>
                        </CardContent>
                    </Card>

                    {/* Active Orders Card */}
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <span className="text-sm font-medium text-gray-500 uppercase tracking-wider">Active Orders</span>
                                <div className="p-2 bg-blue-50 rounded-lg">
                                    <Package className="h-5 w-5 text-blue-600" />
                                </div>
                            </div>
                            <div className="text-3xl font-bold text-gray-900 tracking-tight">{activeOrdersCount}</div>
                        </CardContent>
                    </Card>

                    {/* Inventory Status Card */}
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <span className="text-sm font-medium text-gray-500 uppercase tracking-wider">Inventory Status</span>
                                <div className="p-2 bg-amber-50 rounded-lg">
                                    <AlertTriangle className="h-5 w-5 text-amber-600" />
                                </div>
                            </div>
                            <div className="text-3xl font-bold text-gray-900 tracking-tight">
                                {lowStockCount > 0 ? "Action Needed" : "Healthy"}
                            </div>
                            {lowStockCount > 0 && (
                                <p className="text-sm text-gray-500 mt-1">{lowStockCount} items have low stock</p>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* 3. Main Content (The Tabs) */}
                <Tabs defaultValue="inventory" className="w-full space-y-6">
                    <TabsList className="bg-white border rounded-full p-1 h-12 inline-flex shadow-sm">
                        <TabsTrigger
                            value="inventory"
                            className="rounded-full px-6 py-2 text-sm font-medium transition-all data-[state=active]:bg-gray-900 data-[state=active]:text-white data-[state=active]:shadow-md"
                        >
                            Inventory
                        </TabsTrigger>
                        <TabsTrigger
                            value="orders"
                            className="rounded-full px-6 py-2 text-sm font-medium transition-all data-[state=active]:bg-gray-900 data-[state=active]:text-white data-[state=active]:shadow-md"
                        >
                            Orders
                        </TabsTrigger>
                    </TabsList>

                    {/* Tab 1: Inventory */}
                    <TabsContent value="inventory" className="m-0">
                        <Card className="border-none shadow-xl shadow-gray-200/50 overflow-hidden bg-white/80 backdrop-blur-sm">
                            <CardContent className="p-0">
                                <Table>
                                    <TableHeader className="bg-gray-50/50 border-b border-gray-100">
                                        <TableRow className="hover:bg-transparent">
                                            <TableHead className="w-[120px] py-5 pl-8 text-xs font-bold text-gray-400 uppercase tracking-widest">Image</TableHead>
                                            <TableHead className="py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">Product</TableHead>
                                            <TableHead className="text-right py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">Price (₹/kg)</TableHead>
                                            <TableHead className="text-right py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">Stock (kg)</TableHead>
                                            <TableHead className="py-5 text-xs font-bold text-gray-400 uppercase tracking-widest text-center">Status</TableHead>
                                            <TableHead className="text-right py-5 pr-8 text-xs font-bold text-gray-400 uppercase tracking-widest">Action</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {inventory.map((item) => {
                                            const currentPrice = editValues[item.id]?.price ?? item.price;
                                            const currentStock = editValues[item.id]?.stock ?? item.stock;
                                            const isModified = editValues[item.id] !== undefined;

                                            return (
                                                <TableRow key={item.id} className="group hover:bg-gray-50/80 transition-all duration-200 border-gray-50/50">
                                                    <TableCell className="pl-8 py-4">
                                                        <div className="h-16 w-16 rounded-2xl overflow-hidden shadow-sm border border-gray-100 group-hover:shadow-md transition-shadow bg-white">
                                                            <img
                                                                src={item.image}
                                                                alt={item.name}
                                                                className="h-full w-full object-cover"
                                                            />
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="py-4">
                                                        <div>
                                                            <div className="font-bold text-gray-900 text-base">{item.name}</div>
                                                            <div className="text-xs text-gray-500 font-medium mt-0.5">{item.category}</div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-right py-4">
                                                        <Input
                                                            type="number"
                                                            className="w-24 ml-auto text-right font-semibold text-gray-700 bg-transparent border-transparent hover:border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500/20 transition-all rounded-lg h-9"
                                                            value={currentPrice}
                                                            onChange={(e) => handleTempUpdate(item.id, 'price', e.target.value)}
                                                        />
                                                    </TableCell>
                                                    <TableCell className="text-right py-4">
                                                        <Input
                                                            type="number"
                                                            className="w-24 ml-auto text-right font-semibold text-gray-700 bg-transparent border-transparent hover:border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500/20 transition-all rounded-lg h-9"
                                                            value={currentStock}
                                                            onChange={(e) => handleTempUpdate(item.id, 'stock', e.target.value)}
                                                        />
                                                    </TableCell>
                                                    <TableCell className="py-4 text-center">
                                                        {item.stock === 0 ? (
                                                            <div className="inline-flex items-center px-3 py-1 rounded-full bg-red-50 text-red-600 text-xs font-semibold border border-red-100">
                                                                <span className="w-1.5 h-1.5 rounded-full bg-red-500 mr-2"></span>
                                                                Sold Out
                                                            </div>
                                                        ) : item.stock < 50 ? (
                                                            <div className="inline-flex items-center px-3 py-1 rounded-full bg-amber-50 text-amber-600 text-xs font-semibold border border-amber-100">
                                                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-2"></span>
                                                                Low Stock
                                                            </div>
                                                        ) : (
                                                            <div className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-xs font-semibold border border-emerald-100">
                                                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2"></span>
                                                                In Stock
                                                            </div>
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="text-right pr-8 py-4">
                                                        <div className="flex justify-end items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            {isModified && (
                                                                <Button
                                                                    size="sm"
                                                                    className="bg-gray-900 text-white hover:bg-black rounded-full h-8 px-4 text-xs font-medium animate-in fade-in zoom-in-95"
                                                                    onClick={() => saveProduct(item)}
                                                                >
                                                                    Save
                                                                </Button>
                                                            )}
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-8 w-8 hover:bg-red-50 hover:text-red-600 rounded-full transition-colors"
                                                                onClick={() => handleDelete(item.id)}
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Tab 2: Orders */}
                    <TabsContent value="orders" className="m-0">
                        <Card className="border-none shadow-xl shadow-gray-200/50 overflow-hidden bg-white/80 backdrop-blur-sm">
                            <CardContent className="p-0">
                                <Table>
                                    <TableHeader className="bg-gray-50/50 border-b border-gray-100">
                                        <TableRow className="hover:bg-transparent">
                                            <TableHead className="py-5 pl-8 text-xs font-bold text-gray-400 uppercase tracking-widest">Order ID</TableHead>
                                            <TableHead className="py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">Date</TableHead>
                                            <TableHead className="py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">Customer</TableHead>
                                            <TableHead className="py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">Items</TableHead>
                                            <TableHead className="py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">Total</TableHead>
                                            <TableHead className="py-5 pr-8 text-xs font-bold text-gray-400 uppercase tracking-widest">Status</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {orders.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={6} className="text-center py-16 text-gray-400">
                                                    <div className="flex flex-col items-center justify-center gap-2">
                                                        <Package className="h-8 w-8 text-gray-300" />
                                                        <p>No orders found.</p>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            orders.map((order) => (
                                                <TableRow key={order.id} className="hover:bg-gray-50/80 transition-colors border-gray-50/50">
                                                    <TableCell className="pl-8 py-4 font-semibold text-gray-900">{order.id}</TableCell>
                                                    <TableCell className="py-4 text-gray-500">{order.date}</TableCell>
                                                    <TableCell className="py-4 font-medium text-gray-900">{order.customer}</TableCell>
                                                    <TableCell className="max-w-[200px] py-4 truncate text-gray-500" title={order.items}>
                                                        {order.items}
                                                    </TableCell>
                                                    <TableCell className="py-4 font-bold text-gray-900">₹{order.total?.toLocaleString()}</TableCell>
                                                    <td className="pr-8 py-4 whitespace-nowrap">
                                                        <div className="relative">
                                                            <select
                                                                value={order.status}
                                                                onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                                                                className={`appearance-none pl-3 pr-8 py-1.5 rounded-full text-xs font-bold cursor-pointer outline-none transition-all
                                                                    ${order.status === 'Delivered' ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200' :
                                                                        order.status === 'Shipped' ? 'bg-blue-100 text-blue-800 hover:bg-blue-200' :
                                                                            order.status === 'Cancelled' ? 'bg-red-100 text-red-800 hover:bg-red-200' :
                                                                                'bg-amber-100 text-amber-800 hover:bg-amber-200'
                                                                    }`}
                                                            >
                                                                <option value="Pending">Pending</option>
                                                                <option value="Shipped">Shipped</option>
                                                                <option value="Delivered">Delivered</option>
                                                                <option value="Cancelled">Cancelled</option>
                                                            </select>
                                                        </div>
                                                    </td>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>

            {/* Add Product Modal Overlay */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-6 space-y-4">
                            <div className="flex justify-between items-center">
                                <h2 className="text-xl font-bold text-gray-900">Add New Inventory</h2>
                                <button
                                    onClick={() => setIsAddModalOpen(false)}
                                    className="text-gray-400 hover:text-gray-500 text-2xl leading-none"
                                >
                                    &times;
                                </button>
                            </div>

                            <form onSubmit={handleAddProductSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Name</label>
                                    <Input
                                        required
                                        placeholder="e.g. Fresh Spinach"
                                        value={newProduct.name}
                                        onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                                        className="border-stone-200 focus:ring-emerald-500"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Category</label>
                                    <select
                                        className="flex h-10 w-full rounded-md border border-stone-200 bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        value={newProduct.category}
                                        onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                                    >
                                        <option value="Vegetables">Vegetables</option>
                                        <option value="Fruits">Fruits</option>
                                        <option value="Grains">Grains</option>
                                    </select>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">Price (₹/kg)</label>
                                        <Input
                                            required
                                            type="number"
                                            placeholder="40"
                                            value={newProduct.price}
                                            onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                                            className="border-stone-200 focus:ring-emerald-500"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">Stock (kg)</label>
                                        <Input
                                            required
                                            type="number"
                                            placeholder="100"
                                            value={newProduct.stock}
                                            onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                                            className="border-stone-200 focus:ring-emerald-500"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Image URL (Optional)</label>
                                    <Input
                                        placeholder="https://..."
                                        value={newProduct.image}
                                        onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                                        className="border-stone-200 focus:ring-emerald-500"
                                    />
                                    <p className="text-xs text-gray-500">Leave empty for default vegetable image</p>
                                </div>

                                <div className="pt-4 flex gap-3">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="w-full"
                                        onClick={() => setIsAddModalOpen(false)}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                                    >
                                        Save Product
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
