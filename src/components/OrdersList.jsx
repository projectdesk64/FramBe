import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SHARED_ORDER } from '@/lib/demoState';

const dummyOrders = [
    {
        id: "ORD001",
        product: "Tomatoes",
        quantity: "25 kg",
        farmer: "Rajesh Kumar",
        status: "Pending",
        eta: "Today"
    },
    {
        id: "ORD002",
        product: "Onions",
        quantity: "50 kg",
        farmer: "Suresh Singh",
        status: "Confirmed",
        eta: "Tomorrow"
    },
    {
        id: "ORD003",
        product: "Potatoes",
        quantity: "100 kg",
        farmer: "Amit Patel",
        status: "Delivered",
        eta: "2 days ago"
    },
    {
        id: "ORD004",
        product: "Green Chilies",
        quantity: "10 kg",
        farmer: "Vikram Mahto",
        status: "Pending",
        eta: "Today"
    },
    {
        id: "ORD005",
        product: "Carrots",
        quantity: "30 kg",
        farmer: "Sunil Verma",
        status: "Confirmed",
        eta: "Tomorrow"
    }
];

const getStatusStyles = (status) => {
    switch (status) {
        case 'Pending Dispatch':
            return { variant: 'secondary', className: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100 border-yellow-200' };
        case 'Action Required':
            return { variant: 'destructive', className: 'bg-red-100 text-red-800 hover:bg-red-100 border-red-200 animate-pulse' };
        case 'Processing':
        case 'In Transit':
            return { variant: 'default', className: 'bg-blue-100 text-blue-800 hover:bg-blue-100 border-blue-200' };
        case 'Confirmed':
            return { variant: 'default', className: 'bg-emerald-100 text-emerald-800 hover:bg-emerald-100 border-emerald-200' };
        case 'Delivered':
            return { variant: 'outline', className: 'text-slate-600' };
        default:
            return { variant: 'secondary', className: '' };
    }
};

export default function OrdersList() {
    const navigate = useNavigate();
    const userRole = localStorage.getItem('farmbe_role') || 'pg';

    // Role-specific display logic for the shared order
    const sharedOrderDisplay = {
        ...SHARED_ORDER,
        status: SHARED_ORDER.status[userRole] || 'Pending',
        action: SHARED_ORDER.action[userRole] || 'View Details',
        farmer: userRole === 'farmer' ? 'Self (Farm Stock)' : 'GreenEarth Farm' // "Farmer" column content
    };

    const sharedStatusStyle = getStatusStyles(sharedOrderDisplay.status);

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Product</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Source/Farmer</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {/* Golden Thread Shared Order */}
                    <TableRow
                        key={sharedOrderDisplay.id}
                        className="cursor-pointer bg-muted/30 hover:bg-muted/50 border-l-4 border-l-primary"
                        onClick={() => navigate(`/dashboard/orders/${sharedOrderDisplay.id}`)}
                    >
                        <TableCell className="font-medium">{sharedOrderDisplay.id}</TableCell>
                        <TableCell>{sharedOrderDisplay.product}</TableCell>
                        <TableCell>{sharedOrderDisplay.quantity}</TableCell>
                        <TableCell>{sharedOrderDisplay.farmer}</TableCell>
                        <TableCell>
                            <Badge variant={sharedStatusStyle.variant} className={sharedStatusStyle.className}>
                                {sharedOrderDisplay.status}
                            </Badge>
                        </TableCell>
                        <TableCell>
                            <Button variant="link" className="p-0 h-auto font-semibold text-primary">
                                {sharedOrderDisplay.action} &rarr;
                            </Button>
                        </TableCell>
                    </TableRow>

                    {/* Dummy Orders */}
                    {dummyOrders.map((order) => (
                        <TableRow
                            key={order.id}
                            className="cursor-pointer"
                            onClick={() => navigate(`/dashboard/orders/${order.id}`)}
                        >
                            <TableCell className="font-medium">{order.id}</TableCell>
                            <TableCell>{order.product}</TableCell>
                            <TableCell>{order.quantity}</TableCell>
                            <TableCell>{order.farmer}</TableCell>
                            <TableCell>
                                <Badge variant={getStatusBadgeVariant(order.status)}>
                                    {order.status}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                <span className="text-muted-foreground text-sm">View</span>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
