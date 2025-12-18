import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const PAYMENT_DATA = [
    { id: "ORD-7281", counterparty: "Farmer: Rajesh Kumar", amount: "₹12,400", status: "Paid", method: "UPI", date: "2023-12-15" },
    { id: "ORD-9102", counterparty: "Farmer: Sunil Singh", amount: "₹8,500", status: "Pending", method: "Bank Transfer", date: "2023-12-16" },
    { id: "ORD-8823", counterparty: "PG: Green Valley", amount: "₹15,200", status: "Paid", method: "Cash", date: "2023-12-14" },
    { id: "ORD-4456", counterparty: "Farmer: Amit Patel", amount: "₹9,800", status: "Paid", method: "UPI", date: "2023-12-12" },
    { id: "ORD-5567", counterparty: "PG: Sunrise Stay", amount: "₹21,000", status: "Pending", method: "Bank Transfer", date: "2023-12-17" },
];

export default function Payments() {
    const navigate = useNavigate();
    const [role, setRole] = useState(localStorage.getItem('farmbe_role') || 'pg');

    useEffect(() => {
        const storedRole = localStorage.getItem('farmbe_role');
        if (storedRole) {
            setRole(storedRole);
        }
    }, []);

    const getRoleTitle = () => {
        switch (role) {
            case 'pg': return "Payments you need to make";
            case 'middleman': return "Payments you manage";
            case 'farmer': return "Payments you will receive";
            default: return "Payment Visibility";
        }
    };

    const getCounterpartyLabel = () => {
        switch (role) {
            case 'pg': return "Recipient (Middleman/Farmer)";
            case 'middleman': return "Source/Recipient";
            case 'farmer': return "Sender (Middleman/PG)";
            default: return "Counterparty";
        }
    };

    return (
        <div className="space-y-8">
            <Button variant="ghost" onClick={() => navigate(-1)} className="mb-2">
                &lsaquo; Back
            </Button>
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Payments Visibility</h1>
                <p className="text-muted-foreground">{getRoleTitle()}</p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Order Value</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₹66,900</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Amount Paid</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">₹37,400</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Amount Pending</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-orange-600">₹29,500</div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Transaction Ledger</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Order ID</TableHead>
                                <TableHead>{getCounterpartyLabel()}</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Method</TableHead>
                                <TableHead>Date</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {PAYMENT_DATA.map((payment) => (
                                <TableRow key={payment.id}>
                                    <TableCell className="font-medium">{payment.id}</TableCell>
                                    <TableCell>{payment.counterparty}</TableCell>
                                    <TableCell>{payment.amount}</TableCell>
                                    <TableCell>
                                        <Badge variant={payment.status === "Paid" ? "success" : "secondary"}>
                                            {payment.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{payment.method}</TableCell>
                                    <TableCell>{payment.date}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <div className="bg-muted/50 p-6 rounded-lg border">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">Payment Flow Explanation (Demo)</h3>
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center">
                    <div className="flex-1 p-4 bg-background rounded border shadow-sm w-full">
                        <div className="font-bold text-primary">PG Owner</div>
                        <div className="text-xs text-muted-foreground mt-1">Initiates Payment</div>
                    </div>
                    <div className="hidden md:block text-2xl text-muted-foreground">→</div>
                    <div className="flex-1 p-4 bg-background rounded border shadow-sm w-full">
                        <div className="font-bold text-primary">Middleman</div>
                        <div className="text-xs text-muted-foreground mt-1">Funds Managed</div>
                    </div>
                    <div className="hidden md:block text-2xl text-muted-foreground">→</div>
                    <div className="flex-1 p-4 bg-background rounded border shadow-sm w-full">
                        <div className="font-bold text-primary">Farmer</div>
                        <div className="text-xs text-muted-foreground mt-1">Direct Settlement</div>
                    </div>
                </div>
                <p className="mt-6 text-sm text-center text-muted-foreground">
                    FramBe provides complete visibility into the payment lifecycle.
                    <br />
                    <span className="italic">Note: This screen displays ledger visibility only. Actual payment processing is handled externally.</span>
                </p>
            </div>
        </div>
    );
}
