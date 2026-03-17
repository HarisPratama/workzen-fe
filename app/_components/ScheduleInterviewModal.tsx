"use client"
import { Calendar, Clock, User, FileText } from "lucide-react";
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

interface ScheduleInterviewModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSchedule: (data: InterviewScheduleData) => void;
}

export interface InterviewScheduleData {
    date: string;
    time: string;
    interviewer: string;
    notes: string;
}

const mockInterviewers = [
    "John Tech Lead",
    "Sarah Manager",
    "David Senior Engineer",
    "Lisa HR Director",
    "Michael Product Manager",
];

export function ScheduleInterviewModal({
                                           open,
                                           onOpenChange,
                                           onSchedule,
                                       }: ScheduleInterviewModalProps) {
    const [formData, setFormData] = useState<InterviewScheduleData>({
        date: "",
        time: "",
        interviewer: "",
        notes: "",
    });

    const handleInputChange = (field: keyof InterviewScheduleData, value: string) => {
        setFormData({ ...formData, [field]: value });
    };

    const handleSubmit = () => {
        if (formData.date && formData.time && formData.interviewer) {
            onSchedule(formData);
            // Reset form
            setFormData({
                date: "",
                time: "",
                interviewer: "",
                notes: "",
            });
        }
    };

    const isFormValid = formData.date && formData.time && formData.interviewer;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle>Schedule Interview</DialogTitle>
                    <DialogDescription>
                        Schedule an interview for this candidate
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-5 py-4">
                    {/* Date */}
                    <div>
                        <Label htmlFor="interview-date" className="flex items-center gap-2 mb-2">
                            <Calendar className="w-4 h-4 text-pink-600" />
                            Interview Date *
                        </Label>
                        <Input
                            id="interview-date"
                            type="date"
                            value={formData.date}
                            onChange={(e) => handleInputChange("date", e.target.value)}
                            min={new Date().toISOString().split("T")[0]}
                        />
                    </div>

                    {/* Time */}
                    <div>
                        <Label htmlFor="interview-time" className="flex items-center gap-2 mb-2">
                            <Clock className="w-4 h-4 text-pink-600" />
                            Interview Time *
                        </Label>
                        <Input
                            id="interview-time"
                            type="time"
                            value={formData.time}
                            onChange={(e) => handleInputChange("time", e.target.value)}
                        />
                    </div>

                    {/* Interviewer */}
                    <div>
                        <Label htmlFor="interviewer" className="flex items-center gap-2 mb-2">
                            <User className="w-4 h-4 text-pink-600" />
                            Interviewer *
                        </Label>
                        <Select
                            value={formData.interviewer}
                            onValueChange={(value) => handleInputChange("interviewer", value)}
                        >
                            <SelectTrigger id="interviewer">
                                <SelectValue placeholder="Select interviewer..." />
                            </SelectTrigger>
                            <SelectContent>
                                {mockInterviewers.map((interviewer) => (
                                    <SelectItem key={interviewer} value={interviewer}>
                                        {interviewer}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Notes */}
                    <div>
                        <Label htmlFor="interview-notes" className="flex items-center gap-2 mb-2">
                            <FileText className="w-4 h-4 text-pink-600" />
                            Notes (Optional)
                        </Label>
                        <Textarea
                            id="interview-notes"
                            placeholder="Add any special instructions or topics to cover..."
                            value={formData.notes}
                            onChange={(e) => handleInputChange("notes", e.target.value)}
                            rows={3}
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={!isFormValid}
                        className="bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700"
                    >
                        Schedule Interview
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
