"use client"
import { ArrowLeft, User, Mail, Phone, MapPin, Briefcase, Calendar } from "lucide-react";
import { useState } from "react";
import { Button } from "@/app/_components/ui/button";
import { Input } from "@/app/_components/ui/input";
import { Textarea } from "@/app/_components/ui/textarea";
import { Label } from "@/app/_components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/app/_components/ui/select";
import { useRouter } from "next/navigation";
import { createCandidate } from "@/services/candidate.service";

export default function CandidateAdd() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        full_name: "",
        email: "",
        phone: "",
        address: "",
        birth_date: "",
        source: "",
        citizen_id: "",
    });

    const handleInputChange = (field: string, value: string) => {
        setFormData({ ...formData, [field]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await createCandidate({
                full_name: formData.full_name,
                email: formData.email,
                phone: formData.phone,
                address: formData.address,
                birth_date: formData.birth_date ? `${formData.birth_date}T00:00:00Z` : "",
                source: formData.source,
                citizen_id: formData.citizen_id || undefined,
            });
            router.push("/org/candidates");
        } catch (error) {
            console.error("Failed to create candidate:", error);
            alert("Failed to create candidate. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const isFormValid = () => {
        return (
            formData.full_name &&
            formData.email &&
            formData.phone &&
            formData.address &&
            formData.birth_date &&
            formData.source
        );
    };

    const onBack = () => {
        router.back();
    }

    return (
        <div className="px-8 py-8 space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <button
                    onClick={onBack}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    <ArrowLeft className="w-5 h-5 text-gray-600" />
                </button>
                <div>
                    <h2 className="text-3xl font-bold text-gray-900">Add New Candidate</h2>
                    <p className="text-sm text-gray-600 mt-1">
                        Add a new candidate to your talent pool
                    </p>
                </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information */}
                <div className="bg-white rounded-xl border border-gray-200 p-8">
                    <div className="flex items-center gap-2 mb-6">
                        <User className="w-5 h-5 text-pink-600" />
                        <h3 className="font-semibold text-gray-900">Personal Information</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <Label htmlFor="full_name">Full Name *</Label>
                            <Input
                                id="full_name"
                                placeholder="e.g. Ahmad Rizki"
                                value={formData.full_name}
                                onChange={(e) => handleInputChange("full_name", e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <Label htmlFor="email">Email Address *</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="email@example.com"
                                value={formData.email}
                                onChange={(e) => handleInputChange("email", e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <Label htmlFor="phone">Phone Number *</Label>
                            <Input
                                id="phone"
                                type="tel"
                                placeholder="+62 812-3456-7890"
                                value={formData.phone}
                                onChange={(e) => handleInputChange("phone", e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <Label htmlFor="birth_date" className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-pink-600" />
                                Birth Date *
                            </Label>
                            <Input
                                id="birth_date"
                                type="date"
                                value={formData.birth_date}
                                onChange={(e) => handleInputChange("birth_date", e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <Label htmlFor="citizen_id">Citizen ID (KTP)</Label>
                            <Input
                                id="citizen_id"
                                placeholder="e.g. 3201234567890001"
                                value={formData.citizen_id}
                                onChange={(e) => handleInputChange("citizen_id", e.target.value)}
                            />
                        </div>

                        <div className="md:col-span-2">
                            <Label htmlFor="address" className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-pink-600" />
                                Address *
                            </Label>
                            <Textarea
                                id="address"
                                placeholder="e.g. Jl. Sudirman No. 1, Jakarta Selatan"
                                value={formData.address}
                                onChange={(e) => handleInputChange("address", e.target.value)}
                                rows={3}
                                required
                            />
                        </div>

                        <div>
                            <Label htmlFor="source" className="flex items-center gap-2">
                                <Briefcase className="w-4 h-4 text-pink-600" />
                                Source *
                            </Label>
                            <Select value={formData.source} onValueChange={(value) => handleInputChange("source", value)}>
                                <SelectTrigger id="source">
                                    <SelectValue placeholder="Select source..." />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                                    <SelectItem value="Job Portal">Job Portal</SelectItem>
                                    <SelectItem value="Referral">Referral</SelectItem>
                                    <SelectItem value="Direct Application">Direct Application</SelectItem>
                                    <SelectItem value="Recruitment Event">Recruitment Event</SelectItem>
                                    <SelectItem value="Other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-3">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onBack}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        disabled={!isFormValid() || loading}
                        className="bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700"
                    >
                        {loading ? "Saving..." : "Add Candidate"}
                    </Button>
                </div>
            </form>
        </div>
    );
}
