"use client"
import { toast } from "sonner";
import { CheckCircle, XCircle, FileText } from "lucide-react";
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
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "./ui/select";
import { updateInterview, submitFeedback } from "@/services/interview.service";

type CandidateStatus = "APPLIED" | "SCREENING" | "INTERVIEW" | "OFFERED" | "HIRED";

interface InterviewResultModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onResultSubmitted?: () => void;
    interview: {
        id: number;
        type: string;
        scheduled_at: string;
        duration_minutes: number;
        status?: string;
        result?: string;
        location?: string;
        meeting_link?: string;
        interviewer?: { id: number; name: string };
        candidate_application?: { id: number; position: string; candidate: {
            full_name: string;
        } };
    } | null;
}

export function InterviewResultModal({
    open,
    onOpenChange,
    onResultSubmitted,
    interview,
}: InterviewResultModalProps) {
    const [result, setResult] = useState<"PASS" | "FAIL" | "">("");
    const [notes, setNotes] = useState("");
    const [rating, setRating] = useState(5);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!result || !interview?.id) return;

        setLoading(true);
        try {
            await submitFeedback(String(interview.id), {
                rating: rating,
                overall_feedback: notes,
                recommendation: result === "PASS" ? "hire" : "no_hire",
            });
            setResult("");
            setNotes("");
            onOpenChange(false);
            onResultSubmitted?.();
            toast.success("Interview result submitted successfully");
        } catch (err) {
            console.error(err);
            toast.error(err instanceof Error ? err.message : "Failed to submit result. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setResult("");
        setNotes("");
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle>Submit Interview Result</DialogTitle>
                    <DialogDescription>
                        Record the interview outcome for this candidate
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-5 py-4">
                    {/* Candidate Info */}
                    <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-sm text-gray-600 mb-1">Candidate</p>
                        <p className="font-semibold text-gray-900">{interview?.candidate_application?.candidate?.full_name}</p>
                        <p className="text-sm text-gray-600">{interview?.candidate_application?.position}</p>
                    </div>

                    {/* Result */}
                    <div>
                        <Label htmlFor="result">
                            Interview Result *
                        </Label>
                        <Select value={result} onValueChange={(value) => setResult(value as "PASS" | "FAIL")}>
                            <SelectTrigger id="result">
                                <SelectValue placeholder="Select result..." />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="PASS">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle className="w-4 h-4 text-green-600" />
                                        <span>PASS - Proceed to next stage</span>
                                    </div>
                                </SelectItem>
                                <SelectItem value="FAIL">
                                    <div className="flex items-center gap-2">
                                        <XCircle className="w-4 h-4 text-red-600" />
                                        <span>FAIL - Reject candidate</span>
                                    </div>
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Result Preview */}
                    {result && (
                        <div className={`p-4 rounded-lg border-2 ${
                            result === "PASS"
                                ? "bg-green-50 border-green-200"
                                : "bg-red-50 border-red-200"
                        }`}>
                            <div className="flex items-center gap-2">
                                {result === "PASS" ? (
                                    <>
                                        <CheckCircle className="w-5 h-5 text-green-600" />
                                        <div>
                                            <p className="font-semibold text-green-900">Recommended to Pass</p>
                                            <p className="text-sm text-green-700">Interview result will be saved as completed</p>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <XCircle className="w-5 h-5 text-red-600" />
                                        <div>
                                            <p className="font-semibold text-red-900">Recommended to Fail</p>
                                            <p className="text-sm text-red-700">Interview result will be saved as completed</p>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Notes */}
                    <div>
                        <Label htmlFor="result-notes" className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-pink-600" />
                            Interview Notes {result === "FAIL" && "*"}
                        </Label>
                        <Textarea
                            id="result-notes"
                            placeholder={result === "FAIL"
                                ? "Please provide reason for rejection..."
                                : "Add notes about the interview (strengths, areas to improve, etc.)..."}
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            rows={4}
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={!result || (result === "FAIL" && !notes) || loading}
                        className={
                            result === "PASS"
                                ? "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                                : "bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700"
                        }
                    >
                        {loading
                            ? "Submitting..."
                            : result === "PASS"
                                ? "Submit Result"
                                : "Submit Rejection Result"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
