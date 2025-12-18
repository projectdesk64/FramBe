import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import OrdersList from '@/components/OrdersList';

export default function DashboardPG() {
    const navigate = useNavigate();
    const cards = [
        { title: "Available Stock", description: "Monitor current inventory levels across categories." },
        { title: "My Orders", description: "View and manage your recent purchase orders." },
        { title: "Payments & Invoices", description: "Access billing history and pending invoices." }
    ];

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">PG Owner Dashboard</h1>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {cards.map((card, index) => (
                    <Card
                        key={index}
                        className={card.title === "Payments & Invoices" ? "cursor-pointer hover:border-primary/50 transition-colors" : ""}
                        onClick={() => {
                            if (card.title === "Payments & Invoices") {
                                navigate("/payments");
                            }
                        }}
                    >
                        <CardHeader>
                            <CardTitle className="text-lg">{card.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">{card.description}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="space-y-4">
                <h2 className="text-xl font-semibold tracking-tight">Recent Orders</h2>
                <OrdersList />
            </div>
        </div>
    );
}
