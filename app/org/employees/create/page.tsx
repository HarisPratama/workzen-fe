"use client"
import { ArrowLeft, User, CreditCard, Phone } from "lucide-react";
import { useState } from "react";
import { Button } from "@/app/_components/ui/button";
import { Input } from "@/app/_components/ui/input";
import { Label } from "@/app/_components/ui/label";
import { useRouter } from "next/navigation";
import { createEmployee } from "@/services/employee.service";

export default function CreateEmployeePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        citizen_id: "",
        phone_number: "",
    });

    const handleInputChange = (field: string, value: string) => {
        setFormData({ ...formData, [field]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await createEmployee(formData);
            router.push("/org/employees");
        } catch (error) {
            console.error("Failed to create employee:", error);
            alert("Failed to create employee. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const isFormValid = formData.name && formData.citizen_id && formData.phone_number;

    return (
        <div className="px-8 py-8 space-y-6">
            <div className="flex items-center gap-4">
                <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <ArrowLeft className="w-5 h-5 text-gray-600" />
                </button>
                <div>
                    <h2 className="text-3xl font-bold text-gray-900">Add New Employee</h2>
                    <p className="text-sm text-gray-600 mt-1">Register a new employee to your organization</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-white rounded-xl border border-gray-200 p-8">
                    <div className="flex items-center gap-2 mb-6">
                        <User className="w-5 h-5 text-pink-600" />
                        <h3 className="font-semibold text-gray-900">Employee Information</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <Label htmlFor="name">Full Name *</Label>
                            <Input
                                id="name"
                                placeholder="e.g. Ahmad Rizki"
                                value={formData.name}
                                onChange={(e) => handleInputChange("name", e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <Label htmlFor="citizen_id" className="flex items-center gap-2">
                                <CreditCard className="w-4 h-4 text-pink-600" />
                                Citizen ID (KTP) *
                            </Label>
                            <Input
                                id="citizen_id"
                                placeholder="e.g. 3201234567890001"
                                value={formData.citizen_id}
                                onChange={(e) => handleInputChange("citizen_id", e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <Label htmlFor="phone_number" className="flex items-center gap-2">
                                <Phone className="w-4 h-4 text-pink-600" />
                                Phone Number *
                            </Label>
                            <Input
                                id="phone_number"
                                type="tel"
                                placeholder="+62 812-3456-7890"
                                value={formData.phone_number}
                                onChange={(e) => handleInputChange("phone_number", e.target.value)}
                                required
                            />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-3">
                    <Button type="button" variant="outline" onClick={() => router.back()}>
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        disabled={!isFormValid || loading}
                        className="bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700"
                    >
                        {loading ? "Saving..." : "Add Employee"}
                    </Button>
                </div>
            </form>
        </div>
    );
}
