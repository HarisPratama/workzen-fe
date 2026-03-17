"use client"
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

interface CreateOfferModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onCreate: (data: OfferData) => void;
}

export interface OfferData {
    salary: string;
    startDate: string;
    contractType: string;
    benefits: string;
    notes: string;
}

const contractTypes = [
    "Full-time Permanent",
    "Full-time Contract (6 months)",
    "Full-time Contract (1 year)",
    "Full-time Contract (2 years)",
    "Part-time",
    "Project-based",
];

export function CreateOfferModal({
                                     open,
                                     onOpenChange,
                                     onCreate,
                                 }: CreateOfferModalProps) {
    const [formData, setFormData] = useState<OfferData>({
        salary: "",
        startDate: "",
        contractType: "",
        benefits: "",
        notes: "",
    });

    const handleInputChange = (field: keyof OfferData, value: string) => {
        setFormData({ ...formData, [field]: value });
    };

    const handleSubmit = () => {
        if (formData.salary && formData.startDate && formData.contractType) {
            onCreate(formData);
            // Reset form
            setFormData({
                salary: "",
                startDate: "",
                contractType: "",
                benefits: "",
                notes: "",
            });
        }
    };

    const handleClose = () => {
        setFormData({
            salary: "",
            startDate: "",
            contractType: "",
            benefits: "",
            notes: "",
        });
        onOpenChange(false);
    };

    const isFormValid = formData.salary && formData.startDate && formData.contractType;

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
                        <p className="font-semibold text-gray-900">Candidate Name</p>
                        <p className="text-sm text-gray-600">Position</p>
                    </div>

                    {/* Salary */}
                    <div>
                        <Label htmlFor="salary" className="flex items-center gap-2 mb-2">
                            <DollarSign className="w-4 h-4 text-pink-600" />
                            Monthly Salary *
                        </Label>
                        <Input
                            id="salary"
                            type="text"
                            placeholder="e.g. Rp 15.000.000"
                            value={formData.salary}
                            onChange={(e) => handleInputChange("salary", e.target.value)}
                        />
                        <p className="text-xs text-gray-500 mt-1">Enter the gross monthly salary</p>
                    </div>

                    {/* Start Date */}
                    <div>
                        <Label htmlFor="start-date" className="flex items-center gap-2 mb-2">
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

                    {/* Contract Type */}
                    <div>
                        <Label htmlFor="contract-type" className="flex items-center gap-2 mb-2">
                            <Briefcase className="w-4 h-4 text-pink-600" />
                            Contract Type *
                        </Label>
                        <Select value={formData.contractType} onValueChange={(value) => handleInputChange("contractType", value)}>
                            <SelectTrigger id="contract-type">
                                <SelectValue placeholder="Select contract type..." />
                            </SelectTrigger>
                            <SelectContent>
                                {contractTypes.map((type) => (
                                    <SelectItem key={type} value={type}>
                                        {type}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Benefits */}
                    <div>
                        <Label htmlFor="benefits" className="mb-2 block">
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

                    {/* Notes */}
                    <div>
                        <Label htmlFor="offer-notes" className="flex items-center gap-2 mb-2">
                            <FileText className="w-4 h-4 text-pink-600" />
                            Additional Notes (Optional)
                        </Label>
                        <Textarea
                            id="offer-notes"
                            placeholder="Any additional information or conditions..."
                            value={formData.notes}
                            onChange={(e) => handleInputChange("notes", e.target.value)}
                            rows={3}
                        />
                    </div>

                    {/* Preview */}
                    {isFormValid && (
                        <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
                            <p className="font-semibold text-blue-900 mb-2">Offer Summary</p>
                            <div className="space-y-1 text-sm text-blue-800">
                                <p><span className="font-medium">Salary:</span> {formData.salary}</p>
                                <p><span className="font-medium">Start Date:</span> {new Date(formData.startDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                                <p><span className="font-medium">Contract:</span> {formData.contractType}</p>
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
                        disabled={!isFormValid}
                        className="bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700"
                    >
                        Send Offer
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
