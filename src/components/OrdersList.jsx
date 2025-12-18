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

const getStatusBadgeVariant = (status) => {
    switch (status) {
        case 'Pending':
            return 'secondary';
        case 'Confirmed':
            return 'default';
        case 'Delivered':
            return 'outline';
        default:
            return 'default';
    }
};

export default function OrdersList() {
    const navigate = useNavigate();

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Product</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Farmer</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>ETA</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {dummyOrders.map((order) => (
                        <TableRow
                            key={order.id}
                            className="cursor-pointer"
                            onClick={() => navigate(`/orders/${order.id}`)}
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
                            <TableCell>{order.eta}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
