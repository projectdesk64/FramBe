import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardFarmer() {
    const navigate = useNavigate();
    const cards = [
        { title: "My Crops / Stock", description: "View and manage your current crop inventory." },
        { title: "Incoming Orders", description: "Monitor and process new orders from buyers." },
        { title: "Payments Overview", description: "Track your earnings and pending payments." }
    ];

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Farmer Dashboard</h1>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {cards.map((card, index) => (
                    <Card
                        key={index}
                        className={(card.title === "Payments Overview" || card.title === "Incoming Orders") ? "cursor-pointer hover:border-primary/50 transition-colors" : ""}
                        onClick={() => {
                            if (card.title === "Payments Overview") {
                                navigate("/dashboard/payments");
                            } else if (card.title === "Incoming Orders") {
                                navigate("/dashboard/orders");
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
        </div>
    );
}
