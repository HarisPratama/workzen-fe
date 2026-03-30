"use client"
import { toast } from "sonner";
import { CheckCircle, XCircle, Send, Phone, MessageSquare } from "lucide-react";
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
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { updateOffer } from "@/services/offer.service";

interface OfferDecisionModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onDecisionMade?: () => void;
    onAccepted?: (offerId: number) => void;
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
    onAccepted,
    offer,
}: OfferDecisionModalProps) {
    const [loading, setLoading] = useState(false);
    const [feedback, setFeedback] = useState("");

    if (!offer) return null;

    const decision = offer.decision?.toLowerCase();
    const isAccepting = decision === "accepted";
    const isRejecting = decision === "rejected";
    const isSending = decision === "sent";

    const handleSubmit = async () => {
        if (!offer.id || !decision) return;
        setLoading(true);
        try {
            await updateOffer(String(offer.id), {
                status: decision as "sent" | "accepted" | "declined",
                ...(feedback ? { feedback } : {}),
            });
            toast.success(
                isSending
                    ? "Offer has been sent to candidate."
                    : isAccepting
                    ? `Offer accepted by ${offer.candidateName}.`
                    : `Offer declined by ${offer.candidateName}.`
            );
            setFeedback("");
            onOpenChange(false);
            onDecisionMade?.();
            if (isAccepting && offer.id) {
                onAccepted?.(offer.id);
            }
        } catch (err) {
            console.error(err);
            toast.error(err instanceof Error ? err.message : "Failed to update offer.");
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setFeedback("");
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        {isSending && <Send className="w-5 h-5 text-blue-600" />}
                        {isAccepting && <CheckCircle className="w-5 h-5 text-green-600" />}
                        {isRejecting && <XCircle className="w-5 h-5 text-red-600" />}
                        {isSending
                            ? "Send Offer to Candidate"
                            : isAccepting
                            ? "Record Offer Acceptance"
                            : "Record Offer Rejection"}
                    </DialogTitle>
                    <DialogDescription>
                        {isSending
                            ? "Mark this offer as sent. You will contact the candidate to present this offer."
                            : isAccepting
                            ? "Record that the candidate has accepted this offer after being contacted."
                            : "Record that the candidate has declined this offer."}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-2">
                    {/* Candidate & Offer Info */}
                    <div className={`rounded-lg p-4 border ${
                        isSending
                            ? "bg-blue-50 border-blue-200"
                            : isAccepting
                            ? "bg-green-50 border-green-200"
                            : "bg-red-50 border-red-200"
                    }`}>
                        <p className="text-sm text-gray-600 mb-1">Candidate</p>
                        <p className="font-semibold text-gray-900">{offer.candidateName}</p>
                        <p className="text-sm text-gray-600">{offer.position}</p>
                    </div>

                    {/* How to contact info - only for Send */}
                    {isSending && (
                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                            <p className="text-sm font-medium text-amber-800 mb-2">After sending, contact the candidate via:</p>
                            <div className="flex gap-4 text-sm text-amber-700">
                                <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" /> Phone Call</span>
                                <span className="flex items-center gap-1"><MessageSquare className="w-3.5 h-3.5" /> WhatsApp</span>
                            </div>
                        </div>
                    )}

                    {/* Accepted: next steps */}
                    {isAccepting && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                            <p className="text-sm font-medium text-green-800 mb-1">After confirmation:</p>
                            <p className="text-sm text-green-700">
                                You will be prompted to create an assignment and complete the hiring process.
                            </p>
                        </div>
                    )}

                    {/* Feedback / Notes */}
                    {(isAccepting || isRejecting) && (
                        <div>
                            <Label htmlFor="offer-feedback">
                                {isRejecting ? "Reason for Rejection (Optional)" : "Notes (Optional)"}
                            </Label>
                            <Textarea
                                id="offer-feedback"
                                placeholder={isRejecting
                                    ? "e.g., Candidate accepted another offer, salary too low..."
                                    : "e.g., Candidate confirmed via phone call on..."
                                }
                                value={feedback}
                                onChange={(e) => setFeedback(e.target.value)}
                                rows={3}
                                className="mt-1"
                            />
                        </div>
                    )}
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={handleClose} disabled={loading}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={loading}
                        className={
                            isSending
                                ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                                : isAccepting
                                ? "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                                : "bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700"
                        }
                    >
                        {loading
                            ? "Processing..."
                            : isSending
                            ? "Confirm & Send"
                            : isAccepting
                            ? "Record Acceptance"
                            : "Record Rejection"
                        }
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
