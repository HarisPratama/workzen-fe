"use client"
import { Calendar, Clock, User, FileText, MapPin, Link } from "lucide-react";
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
import { Combobox } from "./ui/combobox";
import { createInterview, type CreateInterviewPayload } from "@/services/interview.service";
import { getEmployees } from "@/services/employee.service";
import { useFetch } from "@/hooks/use-fetch";

interface ScheduleInterviewModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onScheduled?: () => void;
    candidateApplicationId?: number;
    manpowerRequestId?: number;
}

export interface InterviewScheduleData {
    date: string;
    time: string;
    type: string;
    duration_minutes: string;
    location: string;
    meeting_link: string;
    interviewer_id: string;
    notes: string;
}

export function ScheduleInterviewModal({
    open,
    onOpenChange,
    onScheduled,
    candidateApplicationId,
    manpowerRequestId,
}: ScheduleInterviewModalProps) {
    const { data: employeeData, loading: empLoading } = useFetch(
        () => getEmployees({ limit: 100 }), []
    );

    const employeeOptions = (employeeData?.data ?? []).map((e: { id: number; name: string }) => ({
        value: String(e.id),
        label: e.name,
        sublabel: `ID: ${e.id}`,
    }));

    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<InterviewScheduleData>({
        date: "",
        time: "",
        type: "",
        duration_minutes: "60",
        location: "",
        meeting_link: "",
        interviewer_id: "",
        notes: "",
    });

    const handleInputChange = (field: keyof InterviewScheduleData, value: string) => {
        setFormData({ ...formData, [field]: value });
    };

    const resetForm = () => {
        setFormData({
            date: "",
            time: "",
            type: "",
            duration_minutes: "60",
            location: "",
            meeting_link: "",
            interviewer_id: "",
            notes: "",
        });
    };

    const handleSubmit = async () => {
        if (!formData.date || !formData.time || !formData.type || !candidateApplicationId) return;

        setLoading(true);
        try {
            const scheduled_at = `${formData.date}T${formData.time}:00Z`;

            const payload: CreateInterviewPayload = {
                candidate_application_id: candidateApplicationId,
                interviewer_id: Number(formData.interviewer_id) || 1,
                scheduled_at,
                duration_minutes: Number(formData.duration_minutes) || 60,
                type: formData.type as CreateInterviewPayload["type"],
                location: formData.location || undefined,
                meeting_link: formData.meeting_link || undefined,
            };

            if (manpowerRequestId) {
                payload.manpower_request_id = manpowerRequestId;
            }

            await createInterview(payload);
            resetForm();
            onOpenChange(false);
            onScheduled?.();
        } catch (error) {
            console.error("Failed to schedule interview:", error);
            alert("Failed to schedule interview. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const isFormValid = formData.date && formData.time && formData.type;

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
                        <Label htmlFor="interview-date" className="flex items-center gap-2">
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
                        <Label htmlFor="interview-time" className="flex items-center gap-2">
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

                    {/* Type */}
                    <div>
                        <Label htmlFor="interview-type" className="flex items-center gap-2">
                            <User className="w-4 h-4 text-pink-600" />
                            Interview Type *
                        </Label>
                        <Select
                            value={formData.type}
                            onValueChange={(value) => handleInputChange("type", value)}
                        >
                            <SelectTrigger id="interview-type">
                                <SelectValue placeholder="Select interview type..." />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="phone">Phone</SelectItem>
                                <SelectItem value="video">Video</SelectItem>
                                <SelectItem value="in-person">In Person</SelectItem>
                                <SelectItem value="technical">Technical</SelectItem>
                                <SelectItem value="hr">HR</SelectItem>
                                <SelectItem value="final">Final</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Interviewer */}
                    <div>
                        <Label className="flex items-center gap-2">
                            <User className="w-4 h-4 text-pink-600" />
                            Interviewer
                        </Label>
                        <Combobox
                            options={employeeOptions}
                            value={formData.interviewer_id}
                            onValueChange={(v) => handleInputChange("interviewer_id", v)}
                            placeholder="Select interviewer..."
                            searchPlaceholder="Search by name..."
                            emptyText="No employees found."
                            loading={empLoading}
                        />
                    </div>

                    {/* Duration */}
                    <div>
                        <Label htmlFor="duration">
                            Duration (minutes)
                        </Label>
                        <Input
                            id="duration"
                            type="number"
                            min="15"
                            max="480"
                            value={formData.duration_minutes}
                            onChange={(e) => handleInputChange("duration_minutes", e.target.value)}
                        />
                    </div>

                    {/* Location */}
                    <div>
                        <Label htmlFor="location" className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-pink-600" />
                            Location (Optional)
                        </Label>
                        <Input
                            id="location"
                            placeholder="e.g. Office Jakarta, Room 3A"
                            value={formData.location}
                            onChange={(e) => handleInputChange("location", e.target.value)}
                        />
                    </div>

                    {/* Meeting Link */}
                    <div>
                        <Label htmlFor="meeting-link" className="flex items-center gap-2">
                            <Link className="w-4 h-4 text-pink-600" />
                            Meeting Link (Optional)
                        </Label>
                        <Input
                            id="meeting-link"
                            placeholder="e.g. https://meet.google.com/..."
                            value={formData.meeting_link}
                            onChange={(e) => handleInputChange("meeting_link", e.target.value)}
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={!isFormValid || loading}
                        className="bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700"
                    >
                        {loading ? "Scheduling..." : "Schedule Interview"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
