import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import OrdersList from '@/components/OrdersList';
import { demoStore } from '@/lib/demoStore';

export default function DashboardPG() {
    const navigate = useNavigate();
    const [inventory, setInventory] = useState([]);
    const [orderSuccess, setOrderSuccess] = useState(false);

    useEffect(() => {
        const syncData = () => {
            setInventory(demoStore.getInventory());
        };
        syncData();
        const unsubscribe = demoStore.subscribe(syncData);
        return () => unsubscribe();
    }, []);

    const handlePlaceOrder = () => {
        // Hardcoded logic for demo as requested
        const product = "Hydroponic Tomatoes";
        const quantityStr = "50kg";
        const quantityNum = 50;

        // Find stock
        const item = inventory.find(i => i.item === product);
        if (item && item.stock >= quantityNum) {
            // 1. Create Order
            demoStore.createOrder({
                product: product,
                quantity: quantityStr,
                buyer: "Sai PG Stays",
                status: "Pending" // Explicitly requested status
            });

            // 2. Reduce Stock
            demoStore.updateStock(item.id, item.stock - quantityNum);

            // 3. Show Success
            setOrderSuccess(true);
            setTimeout(() => setOrderSuccess(false), 3000);
        } else {
            alert("Insufficient stock!");
        }
    };

    // Find specific item for display
    const tomatoItem = inventory.find(i => i.item === "Hydroponic Tomatoes");

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">PG Owner Dashboard</h1>

            {orderSuccess && (
                <div className="bg-green-100 border border-green-200 text-green-800 px-4 py-3 rounded relative">
                    <strong className="font-bold">Order Placed! </strong>
                    <span className="block sm:inline">Your order for {tomatoItem?.item} has been sent to the farmer.</span>
                </div>
            )}

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {/* LIVE INVENTORY CARD */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Available Stock</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex justify-between items-center mb-2">
                            <span className="font-medium text-muted-foreground">{tomatoItem?.item || "Tomatoes"}</span>
                            <Badge variant="outline" className="text-lg">{tomatoItem?.stock || 0} kg</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mb-4">
                            Fresh stock available directly from GreenEarth Estates.
                        </p>
                    </CardContent>
                    <CardFooter>
                        <Button
                            className="w-full"
                            onClick={handlePlaceOrder}
                            disabled={!tomatoItem || tomatoItem.stock < 50}
                        >
                            Place Order (50kg)
                        </Button>
                    </CardFooter>
                </Card>

                <Card
                    className="cursor-pointer hover:border-primary/50 transition-colors"
                    onClick={() => navigate("/dashboard/orders")}
                >
                    <CardHeader>
                        <CardTitle className="text-lg">My Orders</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">View and manage your recent purchase orders.</p>
                    </CardContent>
                </Card>

                <Card
                    className="cursor-pointer hover:border-primary/50 transition-colors"
                    onClick={() => navigate("/dashboard/payments")}
                >
                    <CardHeader>
                        <CardTitle className="text-lg">Payments & Invoices</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">Access billing history and pending invoices.</p>
                    </CardContent>
                </Card>
            </div>

            <div className="space-y-4">
                <h2 className="text-xl font-semibold tracking-tight">Recent Orders</h2>
                {/* Passing nothing to OrdersList for now as per minimal scope, relies on its internal dummy data + potentially reading shared state if refactored. 
                    For Phase 1 scope, we just need to place order successfully. */}
                <OrdersList />
            </div>
        </div>
    );
}
