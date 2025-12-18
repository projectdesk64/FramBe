import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Signup() {
    const navigate = useNavigate();

    // Form State
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        role: null
    });

    // Error State
    const [errors, setErrors] = useState({});

    const roles = [
        { id: 'farmer', title: 'Farmer', description: 'Sell your produce directly to businesses' },
        { id: 'pg', title: 'PG Owner / Hotel Owner', description: 'Source fresh produce for your kitchen' },
        { id: 'middleman', title: 'Middleman', description: 'Manage logistics and supply chain' },
    ];

    const validateForm = () => {
        const newErrors = {};

        // Full Name
        if (!formData.fullName.trim()) {
            newErrors.fullName = "Full name is required";
        }

        // Email
        if (!formData.email) {
            newErrors.email = "Email is required";
        } else if (!formData.email.includes('@') || !formData.email.includes('.')) {
            newErrors.email = "Please enter a valid email address";
        }

        // Password
        if (!formData.password) {
            newErrors.password = "Password is required";
        } else if (formData.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
        }

        // Role
        if (!formData.role) {
            newErrors.role = "Please select a role";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (validateForm()) {
            // Demo Logic: Store role and redirect
            localStorage.setItem('farmbe_role', formData.role);
            // Optional: Store user info for demo personalization if needed later
            localStorage.setItem('farmbe_user', JSON.stringify({
                name: formData.fullName,
                email: formData.email,
                role: formData.role
            }));

            navigate(`/dashboard/${formData.role}`);
        }
    };

    const updateField = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Clear error when user types
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: null }));
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-64px)] py-10 px-4">
            <div className="w-full max-w-2xl space-y-8">
                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight">Create your FramBe account</h1>
                    <p className="text-muted-foreground text-lg">Join our community today</p>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                    {roles.map((role) => (
                        <Card
                            key={role.id}
                            className={`cursor-pointer transition-all border-2 ${formData.role === role.id
                                ? 'border-primary ring-1 ring-primary'
                                : 'hover:border-primary/50 border-transparent'
                                }`}
                            onClick={() => updateField('role', role.id)}
                        >
                            <CardHeader className="p-4">
                                <CardTitle className="text-base">{role.title}</CardTitle>
                                <CardDescription className="text-xs">{role.description}</CardDescription>
                            </CardHeader>
                        </Card>
                    ))}
                </div>
                {errors.role && (
                    <p className="text-center text-sm text-destructive font-medium">{errors.role}</p>
                )}

                <Card className="max-w-md mx-auto">
                    <CardHeader>
                        <CardTitle className="text-xl">Account Details</CardTitle>
                        <CardDescription>Enter your information to create an account</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none" htmlFor="fullName">Full Name</label>
                                <Input
                                    id="fullName"
                                    placeholder="John Doe"
                                    value={formData.fullName}
                                    onChange={(e) => updateField('fullName', e.target.value)}
                                />
                                {errors.fullName && <p className="text-sm text-destructive">{errors.fullName}</p>}
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none" htmlFor="email">Email</label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="name@example.com"
                                    value={formData.email}
                                    onChange={(e) => updateField('email', e.target.value)}
                                />
                                {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none" htmlFor="password">Password</label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="Min. 6 characters"
                                    value={formData.password}
                                    onChange={(e) => updateField('password', e.target.value)}
                                />
                                {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
                            </div>

                            <Button className="w-full" type="submit" disabled={
                                !formData.fullName.trim() ||
                                !formData.email.includes('@') ||
                                !formData.email.includes('.') ||
                                formData.password.length < 6 ||
                                !formData.role
                            }>
                                Create Account
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <p className="text-center text-sm text-muted-foreground">
                    Already have an account? <Link to="/login" className="text-primary hover:underline">Login</Link>
                </p>
            </div>
        </div>
    );
}
