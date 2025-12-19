import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import FarmVitals from '@/components/FarmVitals';
import { demoStore } from '@/lib/demoStore';

export default function DashboardFarmer() {
    const navigate = useNavigate();
    const [inventory, setInventory] = useState([]);
    const [orders, setOrders] = useState([]);

    // Subscribe to store updates
    useEffect(() => {
        const syncData = () => {
            setInventory(demoStore.getInventory());
            // Filter orders relevant to farmer (Active/Pending usually, but showing all for demo clarity or specific status)
            // The prompt asks to "Fetch incoming orders", usually implies all or pending.
            // Let's show all for now but highlight pending.
            setOrders(demoStore.getOrders());
        };

        syncData();
        const unsubscribe = demoStore.subscribe(syncData);
        return () => unsubscribe();
    }, []);

    const handleStockUpdate = (id, newQty) => {
        demoStore.updateStock(id, parseInt(newQty));
    };

    const handleConfirmOrder = (orderId) => {
        demoStore.updateOrderStatus(orderId, 'Ready');
    };

    const activeOrders = orders.filter(o => o.status !== 'Completed');

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Farmer Dashboard</h1>

            {/* Owner's Pride Component */}
            <FarmVitals />

            <div className="grid gap-4 md:grid-cols-2">
                {/* INVENTORY MANGEMENT */}
                <Card>
                    <CardHeader>
                        <CardTitle>My Crops / Stock</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {inventory.map((item) => (
                                <div key={item.id} className="flex items-center justify-between border p-3 rounded-lg">
                                    <div>
                                        <p className="font-medium">{item.item}</p>
                                        <p className="text-sm text-muted-foreground">₹{item.price} / kg</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-muted-foreground">Qty:</span>
                                        <Input
                                            type="number"
                                            value={item.stock}
                                            onChange={(e) => handleStockUpdate(item.id, e.target.value)}
                                            className="w-20"
                                        />
                                        <span className="text-sm text-muted-foreground">kg</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* INCOMING ORDERS */}
                <Card>
                    <CardHeader>
                        <CardTitle>Incoming Orders</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {activeOrders.length === 0 ? (
                            <p className="text-sm text-muted-foreground">No active orders.</p>
                        ) : (
                            <div className="space-y-4">
                                {activeOrders.map((order) => (
                                    <div key={order.id} className="flex flex-col gap-2 border p-3 rounded-lg">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="font-semibold">{order.product}</p>
                                                <p className="text-sm text-muted-foreground">{order.quantity} • {order.buyer}</p>
                                            </div>
                                            <div className={`text-xs px-2 py-1 rounded-full ${order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                                    order.status === 'Ready' ? 'bg-green-100 text-green-800' :
                                                        'bg-blue-100 text-blue-800'
                                                }`}>
                                                {order.status}
                                            </div>
                                        </div>

                                        {order.status === 'Pending' && (
                                            <Button
                                                size="sm"
                                                className="w-full mt-2"
                                                onClick={() => handleConfirmOrder(order.id)}
                                            >
                                                Confirm & Pack
                                            </Button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
