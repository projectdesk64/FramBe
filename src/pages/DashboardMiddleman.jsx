import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import OrdersList from '@/components/OrdersList';

export default function DashboardMiddleman() {
    const navigate = useNavigate();
    const cards = [
        { title: "Managed Farmers", description: "View and support farmers in your assigned network." },
        { title: "Assigned Orders", description: "Coordinate logistics for currently active orders." },
        { title: "Commission Overview", description: "Track your earnings and payout status." }
    ];

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Middleman Dashboard</h1>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {cards.map((card, index) => (
                    <Card
                        key={index}
                        className={card.title === "Commission Overview" ? "cursor-pointer hover:border-primary/50 transition-colors" : ""}
                        onClick={() => {
                            if (card.title === "Commission Overview") {
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
                <h2 className="text-xl font-semibold tracking-tight">Active Assignments</h2>
                <OrdersList />
            </div>
        </div>
    );
}
