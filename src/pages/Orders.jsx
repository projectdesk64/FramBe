import React from 'react';
import OrdersList from '@/components/OrdersList';

export default function Orders() {
    return (
        <div className="container py-10 pl-4 pr-4">
            <h1 className="text-3xl font-bold mb-6 tracking-tight">Orders</h1>
            <OrdersList />
        </div>
    );
}
