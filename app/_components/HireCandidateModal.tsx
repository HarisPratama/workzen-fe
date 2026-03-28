"use client"
import { toast } from "sonner";
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
import { Separator } from "./ui/separator";
import { CheckCircle, Briefcase, User } from "lucide-react";
import { hireCandidateApplication } from "@/services/candidate-application.service";

interface OfferData {
    id: number;
    position: string;
    base_salary: number;
    status: string;
    employment_type?: string;
    start_date?: string;
}

interface CandidateData {
    id: number;
    candidate_application_id?: number;
    name: string;
    email: string;
    phone: string;
    citizen_id?: string;
}

interface HireCandidateModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    candidate: CandidateData | null;
    acceptedOffer: OfferData | null;
    position: string;
    onHired: () => void;
}

const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(amount || 0);

export function HireCandidateModal({
    open,
    onOpenChange,
    candidate,
    acceptedOffer,
    position,
    onHired,
}: HireCandidateModalProps) {
    const [startDate, setStartDate] = useState(acceptedOffer?.start_date || "");
    const [loading, setLoading] = useState(false);

    const handleOpenChange = (isOpen: boolean) => {
        if (!isOpen) {
            setStartDate("");
        } else {
            setStartDate(acceptedOffer?.start_date || "");
        }
        onOpenChange(isOpen);
    };

    const handleHire = async () => {
        if (!candidate?.candidate_application_id || !acceptedOffer || !startDate) return;
        setLoading(true);

        try {
            await hireCandidateApplication(candidate.candidate_application_id, {
                start_date: startDate,
            });

            toast.success(`${candidate.name} has been hired successfully!`);
            handleOpenChange(false);
            onHired();
        } catch (err) {
            console.error(err);
            toast.error(err instanceof Error ? err.message : "Failed to complete hiring process.");
        } finally {
            setLoading(false);
        }
    };

    if (!candidate || !acceptedOffer) return null;

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        Hire Candidate
                    </DialogTitle>
                    <DialogDescription>
                        Complete the hiring process for this candidate
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-5 py-2">
                    {/* Candidate Info */}
                    <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                        <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-gray-500" />
                            <span className="font-semibold text-gray-900">{candidate.name}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                            <span>{candidate.email}</span>
                            <span>{candidate.phone}</span>
                        </div>
                    </div>

                    {/* Accepted Offer Summary */}
                    <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                        <p className="text-sm font-medium text-green-800 mb-2 flex items-center gap-1">
                            <CheckCircle className="w-3.5 h-3.5" />
                            Accepted Offer
                        </p>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                                <span className="text-green-700">Position:</span>
                                <p className="font-medium text-green-900">{position}</p>
                            </div>
                            <div>
                                <span className="text-green-700">Salary:</span>
                                <p className="font-medium text-green-900">{formatCurrency(acceptedOffer.base_salary)}</p>
                            </div>
                            {acceptedOffer.employment_type && (
                                <div>
                                    <span className="text-green-700">Type:</span>
                                    <p className="font-medium text-green-900 capitalize">{acceptedOffer.employment_type.replace("_", " ")}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <Separator />

                    {/* Info */}
                    <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                        <p className="text-sm text-blue-800 flex items-center gap-1.5">
                            <Briefcase className="w-3.5 h-3.5" />
                            Employee record and outsource assignment will be created automatically.
                        </p>
                    </div>

                    {/* Start Date */}
                    <div>
                        <Label htmlFor="hire-start-date">Start Date *</Label>
                        <Input
                            id="hire-start-date"
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="mt-1"
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => handleOpenChange(false)} disabled={loading}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleHire}
                        disabled={!startDate || loading}
                        className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                    >
                        {loading ? "Processing..." : "Confirm Hire"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
