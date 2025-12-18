import React from 'react';
import { useNavigate } from 'react-router-dom';
import OrdersList from '@/components/OrdersList';
import { Button } from '@/components/ui/button';

export default function Orders() {
    const navigate = useNavigate();

    return (
        <div className="space-y-6">
            <Button variant="ghost" onClick={() => navigate(-1)} className="mb-2">
                &lsaquo; Back
            </Button>
            <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
            <OrdersList />
        </div>
    );
}
