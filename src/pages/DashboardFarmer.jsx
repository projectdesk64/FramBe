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
    const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);
    const activeOrdersCount = orders.length;
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
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900">{user.name}</h1>
                        <p className="text-sm font-medium text-gray-500 mt-1">
                            <span className="capitalize">{user.role}</span>
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <Button
                            className="bg-emerald-600 hover:bg-emerald-700 text-white"
                            onClick={() => setIsAddModalOpen(true)}
                        >
                            + Add Product
                        </Button>
                        <Button variant="outline" size="icon" onClick={syncData} title="Refresh Data">
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
                <Tabs defaultValue="inventory" className="w-full">
                    <TabsList className="bg-white border rounded-lg p-1 mb-6">
                        <TabsTrigger value="inventory" className="data-[state=active]:bg-gray-100">Inventory</TabsTrigger>
                        <TabsTrigger value="orders" className="data-[state=active]:bg-gray-100">Orders</TabsTrigger>
                    </TabsList>

                    {/* Tab 1: Inventory */}
                    <TabsContent value="inventory">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            <Table>
                                <TableHeader className="bg-gray-50/50">
                                    <TableRow>
                                        <TableHead className="w-[100px] text-xs font-semibold text-gray-500 uppercase tracking-wider">Image</TableHead>
                                        <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Product</TableHead>
                                        <TableHead className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Price (₹/kg)</TableHead>
                                        <TableHead className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Stock (kg)</TableHead>
                                        <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</TableHead>
                                        <TableHead className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {inventory.map((item) => {
                                        // Use local edit value or store value
                                        const currentPrice = editValues[item.id]?.price ?? item.price;
                                        const currentStock = editValues[item.id]?.stock ?? item.stock;
                                        const isModified = editValues[item.id] !== undefined;

                                        return (
                                            <TableRow key={item.id} className="hover:bg-gray-50/50 transition-colors">
                                                <TableCell>
                                                    <img
                                                        src={item.image}
                                                        alt={item.name}
                                                        className="h-10 w-10 object-cover rounded-lg bg-gray-100"
                                                    />
                                                </TableCell>
                                                <TableCell className="font-medium text-gray-900">{item.name}</TableCell>
                                                <TableCell className="text-right">
                                                    <Input
                                                        type="number"
                                                        className="w-24 ml-auto text-right"
                                                        value={currentPrice}
                                                        onChange={(e) => handleTempUpdate(item.id, 'price', e.target.value)}
                                                    />
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Input
                                                        type="number"
                                                        className="w-24 ml-auto text-right"
                                                        value={currentStock}
                                                        onChange={(e) => handleTempUpdate(item.id, 'stock', e.target.value)}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    {item.stock === 0 ? (
                                                        <Badge variant="destructive" className="bg-red-50 text-red-700 hover:bg-red-100 border-red-100">Sold Out</Badge>
                                                    ) : item.stock < 50 ? (
                                                        <Badge variant="secondary" className="bg-amber-50 text-amber-700 hover:bg-amber-100 border-amber-100">Low Stock</Badge>
                                                    ) : (
                                                        <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-100">In Stock</Badge>
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end items-center gap-2">
                                                        {isModified && (
                                                            <Button
                                                                size="sm"
                                                                className="bg-gray-900 text-white hover:bg-black"
                                                                onClick={() => saveProduct(item)}
                                                            >
                                                                Save
                                                            </Button>
                                                        )}
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => handleDelete(item.id)}
                                                        >
                                                            <Trash2 className="h-4 w-4 text-red-500" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </div>
                    </TabsContent>

                    {/* Tab 2: Orders */}
                    <TabsContent value="orders">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            <Table>
                                <TableHeader className="bg-gray-50/50">
                                    <TableRow>
                                        <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Order ID</TableHead>
                                        <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</TableHead>
                                        <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</TableHead>
                                        <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Items</TableHead>
                                        <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total</TableHead>
                                        <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {orders.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={6} className="text-center py-12 text-gray-400">
                                                No orders found.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        orders.map((order) => (
                                            <TableRow key={order.id} className="hover:bg-gray-50/50 transition-colors">
                                                <TableCell className="font-medium text-gray-900">{order.id}</TableCell>
                                                <TableCell className="text-gray-500">{order.date}</TableCell>
                                                <TableCell className="text-gray-900">{order.customer}</TableCell>
                                                <TableCell className="max-w-[200px] truncate text-gray-500" title={order.items}>
                                                    {order.items}
                                                </TableCell>
                                                <TableCell className="font-medium text-gray-900">₹{order.total?.toLocaleString()}</TableCell>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <select
                                                        value={order.status}
                                                        onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                                                        className={`text-xs font-semibold px-2 py-1 rounded-full border-none cursor-pointer outline-none focus:ring-2 focus:ring-emerald-500/20 ${order.status === 'Delivered' ? 'bg-emerald-100 text-emerald-800' :
                                                            order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                                                                'bg-yellow-100 text-yellow-800'
                                                            }`}
                                                    >
                                                        <option value="Pending">Pending</option>
                                                        <option value="Shipped">Shipped</option>
                                                        <option value="Delivered">Delivered</option>
                                                        <option value="Cancelled">Cancelled</option>
                                                    </select>
                                                </td>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
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
