"use client"
import { toast } from "sonner";
import { DollarSign, Calendar, FileText, Briefcase } from "lucide-react";
import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "./ui/select";
import { createOffer, type CreateOfferPayload } from "@/services/offer.service";

interface CreateOfferModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onCreated?: () => void;
    candidateApplicationId?: number;
    position?: string;
    candidateName?: string;
}

export interface OfferData {
    base_salary: string;
    startDate: string;
    employment_type: string;
    benefits: string;
    notes: string;
    currency: string;
    probation_period_months: string;
}

export function CreateOfferModal({
    open,
    onOpenChange,
    onCreated,
    candidateApplicationId,
    position,
    candidateName,
}: CreateOfferModalProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<OfferData>({
        base_salary: "",
        startDate: "",
        employment_type: "",
        benefits: "",
        notes: "",
        currency: "IDR",
        probation_period_months: "3",
    });

    const handleInputChange = (field: keyof OfferData, value: string) => {
        setFormData({ ...formData, [field]: value });
    };

    const resetForm = () => {
        setFormData({
            base_salary: "",
            startDate: "",
            employment_type: "",
            benefits: "",
            notes: "",
            currency: "IDR",
            probation_period_months: "3",
        });
    };

    const handleSubmit = async () => {
        if (!formData.base_salary || !formData.startDate || !formData.employment_type || !candidateApplicationId) return;

        setLoading(true);
        try {
            const payload: CreateOfferPayload = {
                candidate_application_id: candidateApplicationId,
                position: position || "",
                base_salary: Number(formData.base_salary),
                employment_type: formData.employment_type as CreateOfferPayload["employment_type"],
                currency: formData.currency,
                benefits: formData.benefits || undefined,
                probation_period_months: Number(formData.probation_period_months) || undefined,
                start_date: formData.startDate,
            };

            await createOffer(payload);
            resetForm();
            onOpenChange(false);
            onCreated?.();
        } catch (err) {
            console.error(err);
            toast.error(err instanceof Error ? err.message : "Failed to create offer. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        resetForm();
        onOpenChange(false);
    };

    const isFormValid = formData.base_salary && formData.startDate && formData.employment_type;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Create Job Offer</DialogTitle>
                    <DialogDescription>
                        Create an offer letter for this candidate
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-5 py-4">
                    {/* Candidate Info */}
                    <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-sm text-gray-600 mb-1">Candidate</p>
                        <p className="font-semibold text-gray-900">{candidateName || "Candidate"}</p>
                        <p className="text-sm text-gray-600">{position || "Position"}</p>
                    </div>

                    {/* Salary */}
                    <div>
                        <Label htmlFor="salary" className="flex items-center gap-2">
                            <DollarSign className="w-4 h-4 text-pink-600" />
                            Base Salary *
                        </Label>
                        <Input
                            id="salary"
                            type="number"
                            placeholder="e.g. 15000000"
                            value={formData.base_salary}
                            onChange={(e) => handleInputChange("base_salary", e.target.value)}
                        />
                        <p className="text-xs text-gray-500 mt-1">Enter the gross monthly salary in numbers</p>
                    </div>

                    {/* Start Date */}
                    <div>
                        <Label htmlFor="start-date" className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-pink-600" />
                            Expected Start Date *
                        </Label>
                        <Input
                            id="start-date"
                            type="date"
                            value={formData.startDate}
                            onChange={(e) => handleInputChange("startDate", e.target.value)}
                            min={new Date().toISOString().split('T')[0]}
                        />
                    </div>

                    {/* Employment Type */}
                    <div>
                        <Label htmlFor="employment-type" className="flex items-center gap-2">
                            <Briefcase className="w-4 h-4 text-pink-600" />
                            Employment Type *
                        </Label>
                        <Select value={formData.employment_type} onValueChange={(value) => handleInputChange("employment_type", value)}>
                            <SelectTrigger id="employment-type">
                                <SelectValue placeholder="Select employment type..." />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="full_time">Full Time</SelectItem>
                                <SelectItem value="part_time">Part Time</SelectItem>
                                <SelectItem value="contract">Contract</SelectItem>
                                <SelectItem value="freelance">Freelance</SelectItem>
                                <SelectItem value="internship">Internship</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Probation Period */}
                    <div>
                        <Label htmlFor="probation" className="block">
                            Probation Period (months)
                        </Label>
                        <Input
                            id="probation"
                            type="number"
                            min="0"
                            max="12"
                            value={formData.probation_period_months}
                            onChange={(e) => handleInputChange("probation_period_months", e.target.value)}
                        />
                    </div>

                    {/* Benefits */}
                    <div>
                        <Label htmlFor="benefits" className="block">
                            Benefits & Perks (Optional)
                        </Label>
                        <Textarea
                            id="benefits"
                            placeholder="e.g. Health insurance, Annual bonus, Transportation allowance..."
                            value={formData.benefits}
                            onChange={(e) => handleInputChange("benefits", e.target.value)}
                            rows={3}
                        />
                    </div>

                    {/* Preview */}
                    {isFormValid && (
                        <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
                            <p className="font-semibold text-blue-900 mb-2">Offer Summary</p>
                            <div className="space-y-1 text-sm text-blue-800">
                                <p><span className="font-medium">Salary:</span> {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(Number(formData.base_salary))}</p>
                                <p><span className="font-medium">Start Date:</span> {new Date(formData.startDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                                <p><span className="font-medium">Type:</span> {formData.employment_type.replace("_", " ")}</p>
                            </div>
                        </div>
                    )}
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={!isFormValid || loading}
                        className="bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700"
                    >
                        {loading ? "Creating..." : "Send Offer"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
