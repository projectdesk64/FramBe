import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Truck, Package, MapPin, ArrowLeft, Clock } from 'lucide-react';
import Navbar from '../components/ui/Navbar';

export default function OrderStatus() {
    const [order, setOrder] = useState(null);
    const [userRole, setUserRole] = useState('pg'); // Default to PG view

    useEffect(() => {
        // 1. Get User Role (to know where the "Back" button goes)
        const user = JSON.parse(localStorage.getItem('farmbe_user') || '{}');
        if (user.role) setUserRole(user.role.toLowerCase());

        // 2. Get Orders safely
        const allOrders = JSON.parse(localStorage.getItem('farmbe_orders') || '[]');

        // For demo: Just grab the first order found. 
        // In real app, we'd grab by ID from URL params.
        if (allOrders.length > 0) {
            setOrder(allOrders[0]);
        }
    }, []);

    // Define where the "Back" button leads
    const backLink = userRole.includes('farm') ? '/dashboard-farmer' : '/dashboard-pg';

    // --- EMPTY STATE (The Fix) ---
    if (!order) {
        return (
            <div className="min-h-screen bg-stone-50">
                <Navbar />
                <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-stone-100 text-center max-w-md w-full">
                        <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4 text-stone-400">
                            <Package size={32} />
                        </div>
                        <h2 className="text-xl font-bold text-stone-900 mb-2 font-serif">No Active Orders</h2>
                        <p className="text-stone-500 mb-8">You haven't placed or received any orders yet.</p>
                        <Link
                            to={backLink}
                            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 transition-colors w-full"
                        >
                            Return to Dashboard
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    // --- ACTIVE ORDER VIEW (Existing Logic) ---
    // Helper to determine step status
    const getStepStatus = (step) => {
        const statusMap = { 'Pending': 0, 'Shipped': 1, 'Delivered': 2 };
        const currentStep = statusMap[order.status] || 0;
        if (currentStep > step) return 'completed';
        if (currentStep === step) return 'current';
        return 'upcoming';
    };

    return (
        <div className="min-h-screen bg-stone-50 pb-12">
            <Navbar />

            {/* Header */}
            <div className="bg-white border-b border-stone-200 pt-24 pb-8 px-4">
                <div className="max-w-3xl mx-auto">
                    <Link to={backLink} className="inline-flex items-center text-stone-500 hover:text-emerald-700 mb-6 transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Dashboard
                    </Link>
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-stone-900 font-serif mb-2">
                                Order #{order.id}
                            </h1>
                            <p className="text-stone-500">Placed on {new Date(order.date).toLocaleDateString()}</p>
                        </div>
                        <div className={`px-4 py-1.5 rounded-full text-sm font-bold border ${order.status === 'Delivered' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                                order.status === 'Shipped' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                    'bg-yellow-50 text-yellow-700 border-yellow-200'
                            }`}>
                            {order.status}
                        </div>
                    </div>
                </div>
            </div>

            {/* Tracking Content */}
            <div className="max-w-3xl mx-auto px-4 mt-8">
                <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden">
                    <div className="p-6 md:p-8">
                        <h2 className="text-lg font-semibold text-stone-900 mb-8">Tracking Status</h2>

                        {/* Timeline */}
                        <div className="relative">
                            {/* Vertical Line */}
                            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-stone-100"></div>

                            {/* Step 1: Confirmed */}
                            <TimelineItem
                                status="completed"
                                icon={<CheckCircle />}
                                title="Order Confirmed"
                                desc="Your order has been verified by the system."
                                time={new Date(order.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            />

                            {/* Step 2: Shipped */}
                            <TimelineItem
                                status={getStepStatus(1) === 'upcoming' ? 'upcoming' : 'completed'}
                                icon={<Truck />}
                                title="Shipped from Farm"
                                desc="Farmer has dispatched your goods."
                            />

                            {/* Step 3: Delivered */}
                            <TimelineItem
                                status={getStepStatus(2) === 'upcoming' ? 'upcoming' : 'completed'}
                                icon={<MapPin />}
                                title="Delivered"
                                desc="Package arrived at your location."
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function TimelineItem({ status, icon, title, desc, time }) {
    const isCompleted = status === 'completed';
    const isCurrent = status === 'current';

    return (
        <div className={`relative flex items-start mb-8 last:mb-0 ${status === 'upcoming' ? 'opacity-50' : 'opacity-100'}`}>
            <div className={`relative z-10 w-16 h-16 rounded-full flex items-center justify-center border-4 border-white shadow-sm shrink-0 mr-4 ${isCompleted ? 'bg-emerald-600 text-white' :
                    isCurrent ? 'bg-emerald-100 text-emerald-700 ring-4 ring-emerald-50' : 'bg-stone-100 text-stone-400'
                }`}>
                {React.cloneElement(icon, { size: 24 })}
            </div>
            <div className="pt-2">
                <h3 className={`font-bold text-lg ${isCompleted || isCurrent ? 'text-stone-900' : 'text-stone-400'}`}>{title}</h3>
                <p className="text-stone-500 text-sm mt-1">{desc}</p>
                {time && <p className="text-xs text-stone-400 mt-2 flex items-center"><Clock size={12} className="mr-1" /> {time}</p>}
            </div>
        </div>
    );
}
