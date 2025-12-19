import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { demoStore } from '@/lib/demoStore';
import TrackingMap from '../components/TrackingMap';
import { Printer, CheckCircle, Package, MapPin, Clock } from 'lucide-react';
import { Badge } from "@/components/ui/badge";

const OrderStatus = () => {
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);

    useEffect(() => {
        // Fetch the most recent order
        const orders = demoStore.getOrders();
        if (orders.length > 0) {
            setOrder(orders[0]); // Topmost order is the newest
        } else {
            // If no orders, redirect back to dashboard
            navigate('/dashboard/pg');
        }
    }, [navigate]);

    const handlePrint = () => {
        window.print();
    };

    if (!order) return <div className="p-10 text-center">Loading Order Details...</div>;

    // Hardcoded locations for demo
    const farmLoc = [12.9716, 77.5946];
    const pgLoc = [12.2958, 76.6394];

    return (
        <div className="min-h-screen bg-gray-50 pb-10">
            {/* Header Banner - Hidden when printing usually, but we'll keep it simple */}
            <div className="bg-emerald-600 text-white p-6 shadow-md print:hidden">
                <div className="max-w-6xl mx-auto flex items-center gap-4">
                    <div className="bg-white/20 p-3 rounded-full">
                        <CheckCircle className="w-8 h-8" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold">Order Confirmed</h1>
                        <p className="opacity-90">Your fresh produce is on its way!</p>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto mt-8 px-4 grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left Column: Tracking Map */}
                <div className="lg:col-span-2 space-y-6 print:hidden">
                    <Card className="overflow-hidden border-0 shadow-lg">
                        <div className="relative h-[400px] bg-slate-100">
                            <TrackingMap source={farmLoc} destination={pgLoc} />

                            {/* Overlay Status Card */}
                            <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-sm p-4 rounded-lg shadow-lg border border-gray-100 flex items-center justify-between z-[400] max-w-md mx-auto lg:mx-0">
                                <div className="flex items-center gap-3">
                                    <div className="bg-orange-100 p-2 rounded-full text-orange-600">
                                        <Clock className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Estimated Arrival</p>
                                        <p className="text-lg font-bold text-gray-900">Today, 4:00 PM</p>
                                    </div>
                                </div>
                                <Badge variant="secondary" className="bg-emerald-100 text-emerald-800">
                                    Out for Delivery
                                </Badge>
                            </div>
                        </div>
                    </Card>

                    {/* Delivery Steps Steps (Visual Only) */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border">
                        <h3 className="font-bold text-gray-800 mb-4">Delivery Progress</h3>
                        <div className="relative flex justify-between">
                            <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-100 -translate-y-1/2 -z-10"></div>

                            <div className="flex flex-col items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center text-sm font-bold border-4 border-white">1</div>
                                <span className="text-xs font-medium text-gray-600">Order Placed</span>
                            </div>
                            <div className="flex flex-col items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center text-sm font-bold border-4 border-white">2</div>
                                <span className="text-xs font-medium text-gray-600">Processed</span>
                            </div>
                            <div className="flex flex-col items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center text-sm font-bold border-4 border-white animate-pulse">3</div>
                                <span className="text-xs font-bold text-emerald-600">Out for Delivery</span>
                            </div>
                            <div className="flex flex-col items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-400 flex items-center justify-center text-sm font-bold border-4 border-white">4</div>
                                <span className="text-xs font-medium text-gray-400">Delivered</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Invoice / Summary */}
                <div className="lg:col-span-1">
                    <Card className="border-0 shadow-lg h-full print:shadow-none print:border">
                        <CardHeader className="bg-gray-50 border-b">
                            <div className="flex justify-between items-center">
                                <CardTitle>Order Summary</CardTitle>
                                <span className="font-mono text-sm text-gray-500">#{order.id}</span>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6">

                            {/* Invoice Header details (Visible mostly on Print) */}
                            <div className="hidden print:block mb-8">
                                <h1 className="text-3xl font-bold mb-2">INVOICE</h1>
                                <p className="text-gray-500">FarmBe Direct</p>
                                <p className="text-gray-500">123 Green Valley, Bangalore, KA</p>
                                <div className="mt-4 border-t pt-4">
                                    <p><strong>Billed To:</strong> {order.customer}</p>
                                    <p><strong>Date:</strong> {order.date}</p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <p className="text-sm text-gray-500 mb-4">Items Ordered</p>
                                    <div className="space-y-3">
                                        {/* Since items is just a string in the simple demo store, we parse roughly or display as is
                                            Real app would have array of objects. 
                                            Our current demoStore.js stores items as: "Tomatoes (50kg), Onions (100kg)" 
                                        */}
                                        {order.items.split(', ').map((item, idx) => (
                                            <div key={idx} className="flex justify-between items-center border-b border-dashed pb-2 last:border-0">
                                                <div className="flex items-center gap-3">
                                                    <div className="bg-gray-100 p-2 rounded-md text-gray-600 print:hidden">
                                                        <Package className="w-4 h-4" />
                                                    </div>
                                                    <span className="font-medium text-gray-700">{item}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="pt-4 border-t space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Subtotal</span>
                                        <span>₹{order.total?.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Delivery Fee</span>
                                        <span className="text-emerald-600 font-medium">Free</span>
                                    </div>
                                    <div className="flex justify-between items-center pt-2 border-t mt-2">
                                        <span className="font-bold text-lg">Total</span>
                                        <span className="font-bold text-xl text-emerald-700">₹{order.total?.toLocaleString()}</span>
                                    </div>
                                </div>

                                <div className="pt-6 print:hidden">
                                    <Button
                                        className="w-full h-12 text-lg gap-2 bg-gray-900 hover:bg-black"
                                        onClick={handlePrint}
                                    >
                                        <Printer className="w-5 h-5" /> Download Invoice
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="w-full mt-3 h-12"
                                        onClick={() => navigate('/dashboard/pg')}
                                    >
                                        Back to Dashboard
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

            </div>
        </div>
    );
};

export default OrderStatus;
