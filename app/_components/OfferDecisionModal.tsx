"use client"
import { toast } from "sonner";
import { CheckCircle, XCircle, AlertTriangle } from "lucide-react";
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
import { updateOffer } from "@/services/offer.service";

interface OfferDecisionModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onDecisionMade?: () => void;
    offer: {
        id?: number;
        decision?: string;
        candidateName?: string;
        position?: string;
    } | null;
}

export function OfferDecisionModal({
    open,
    onOpenChange,
    onDecisionMade,
    offer,
}: OfferDecisionModalProps) {
    const [loading, setLoading] = useState(false);

    if (!offer) return null;

    const isAccepting = offer.decision === "ACCEPT";

    const handleAccept = async () => {
        if (!offer.id) return;
        setLoading(true);
        try {
            await updateOffer(String(offer.id), { status: "accepted" });
            onOpenChange(false);
            onDecisionMade?.();
        } catch (err) {
            console.error(err);
            toast.error(err instanceof Error ? err.message : "Failed to update offer. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleDecline = async () => {
        if (!offer.id) return;
        setLoading(true);
        try {
            await updateOffer(String(offer.id), { status: "rejected" });
            onOpenChange(false);
            onDecisionMade?.();
        } catch (err) {
            console.error(err);
            toast.error(err instanceof Error ? err.message : "Failed to update offer. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        {isAccepting ? (
                            <CheckCircle className="w-6 h-6 text-green-600" />
                        ) : (
                            <XCircle className="w-6 h-6 text-red-600" />
                        )}
                        {isAccepting ? "Offer Accepted" : "Offer Declined"}
                    </DialogTitle>
                    <DialogDescription>
                        {isAccepting
                            ? "Candidate has accepted the offer. Would you like to proceed with hiring?"
                            : "Candidate has declined the offer."}
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4">
                    <div className={`rounded-lg p-4 border-2 ${
                        isAccepting
                            ? "bg-green-50 border-green-200"
                            : "bg-red-50 border-red-200"
                    }`}>
                        <p className="text-sm text-gray-600 mb-1">Candidate</p>
                        <p className="font-semibold text-gray-900">{offer.candidateName}</p>
                        <p className="text-sm text-gray-600 mb-3">{offer.position}</p>

                        {isAccepting && (
                            <div className="mt-3 pt-3 border-t border-green-200">
                                <div className="flex items-start gap-2">
                                    <AlertTriangle className="w-4 h-4 text-green-700 mt-0.5 flex-shrink-0" />
                                    <div className="text-sm text-green-800">
                                        <p className="font-medium mb-1">Next Steps:</p>
                                        <ul className="list-disc list-inside space-y-1 text-xs">
                                            <li>Create employee record</li>
                                            <li>Set up client assignment</li>
                                            <li>Update manpower request fulfillment</li>
                                            <li>Prepare onboarding documents</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    {isAccepting ? (
                        <Button
                            onClick={handleAccept}
                            disabled={loading}
                            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                        >
                            {loading ? "Processing..." : "Convert to Employee"}
                        </Button>
                    ) : (
                        <Button
                            onClick={handleDecline}
                            disabled={loading}
                            className="bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700"
                        >
                            {loading ? "Processing..." : "Confirm Decline"}
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
