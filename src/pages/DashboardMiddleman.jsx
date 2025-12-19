import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import OrdersList from '@/components/OrdersList';
import LogisticsStats from '@/components/LogisticsStats';
import { demoStore } from '@/lib/demoStore';

export default function DashboardMiddleman() {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const syncData = () => {
            setOrders(demoStore.getOrders());
        };
        syncData();
        const unsubscribe = demoStore.subscribe(syncData);
        return () => unsubscribe();
    }, []);

    const handleDispatch = (orderId) => {
        demoStore.updateOrderStatus(orderId, 'In Transit');
    };

    const readyOrders = orders.filter(o => o.status === 'Ready');

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Middleman Dashboard</h1>

            {/* Manager's Efficiency Component */}
            <LogisticsStats />

            {/* ACTION REQUIRED SECTION */}
            {readyOrders.length > 0 && (
                <Card className="border-blue-200 bg-blue-50/50">
                    <CardHeader>
                        <CardTitle className="text-blue-900">Ready for Dispatch ({readyOrders.length})</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {readyOrders.map(order => (
                            <div key={order.id} className="flex flex-col md:flex-row justify-between items-center bg-white p-4 rounded-lg border shadow-sm">
                                <div>
                                    <p className="font-bold text-lg">{order.id} <span className="text-sm font-normal text-muted-foreground"> • {order.product}</span></p>
                                    <p className="text-sm text-gray-600">{order.quantity} • From: {order.source} • To: {order.destination}</p>
                                </div>
                                <Button onClick={() => handleDispatch(order.id)} className="mt-4 md:mt-0 bg-blue-600 hover:bg-blue-700">
                                    Assign Fleet & Dispatch
                                </Button>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            )}

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader><CardTitle className="text-lg">Managed Farmers</CardTitle></CardHeader>
                    <CardContent><p className="text-sm text-muted-foreground">View and support farmers in your assigned network.</p></CardContent>
                </Card>
                <Card>
                    <CardHeader><CardTitle className="text-lg">Assigned Orders</CardTitle></CardHeader>
                    <CardContent><p className="text-sm text-muted-foreground">Coordinate logistics for currently active orders.</p></CardContent>
                </Card>
                <Card
                    className="cursor-pointer hover:border-primary/50 transition-colors"
                    onClick={() => navigate("/dashboard/payments")}
                >
                    <CardHeader><CardTitle className="text-lg">Commission Overview</CardTitle></CardHeader>
                    <CardContent><p className="text-sm text-muted-foreground">Track your earnings and payout status.</p></CardContent>
                </Card>
            </div>

            <div className="space-y-4">
                <h2 className="text-xl font-semibold tracking-tight">Active Assignments</h2>
                <OrdersList />
            </div>
        </div>
    );
}
