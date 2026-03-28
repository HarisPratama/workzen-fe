"use client"
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import { ArrowLeft, User, Briefcase, MapPin, Calendar, DollarSign } from "lucide-react";
import { useState } from "react";
import { Button } from "@/app/_components/ui/button";
import { Input } from "@/app/_components/ui/input";
import { Label } from "@/app/_components/ui/label";
import { Textarea } from "@/app/_components/ui/textarea";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/app/_components/ui/select";
import { Combobox } from "@/app/_components/ui/combobox";
import { useRouter } from "next/navigation";
import { createAssignment } from "@/services/assignment.service";
import { getEmployees } from "@/services/employee.service";
import { getListClient } from "@/services/client.service";
import { useFetch } from "@/hooks/use-fetch";

export default function CreateAssignmentPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        employee_id: "",
        client_id: "",
        assignment_type: "",
        start_date: "",
        expected_end_date: "",
        position: "",
        role: "",
        location: "",
        remote_type: "",
        billing_rate: "",
        cost_rate: "",
        hours_per_week: "",
        notes: "",
    });

    const { data: employeeData, loading: empLoading } = useFetch(
        () => getEmployees({ limit: 100 }), []
    );
    const { data: clientData, loading: clientLoading } = useFetch(
        () => getListClient(), []
    );

    const employeeOptions = (employeeData?.data ?? []).map((e: { id: number; name: string }) => ({
        value: String(e.id),
        label: e.name,
        sublabel: `ID: ${e.id}`,
    }));

    const clientOptions = (clientData?.data ?? []).map((c: { id: number; company_name: string }) => ({
        value: String(c.id),
        label: c.company_name,
        sublabel: `ID: ${c.id}`,
    }));

    const handleChange = (field: string, value: string) => {
        setFormData({ ...formData, [field]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await createAssignment({
                employee_id: Number(formData.employee_id),
                assignment_type: formData.assignment_type,
                start_date: formData.start_date,
                client_id: formData.client_id ? Number(formData.client_id) : undefined,
                expected_end_date: formData.expected_end_date || undefined,
                position: formData.position || undefined,
                role: formData.role || undefined,
                location: formData.location || undefined,
                remote_type: (formData.remote_type as "onsite" | "remote" | "hybrid") || undefined,
                billing_rate: formData.billing_rate ? Number(formData.billing_rate) : undefined,
                cost_rate: formData.cost_rate ? Number(formData.cost_rate) : undefined,
                hours_per_week: formData.hours_per_week ? Number(formData.hours_per_week) : undefined,
                notes: formData.notes || undefined,
            });
            router.push("/org/assignments");
        } catch (err) {
            console.error(err);
            toast.error(err instanceof Error ? err.message : "Failed to create assignment.");
        } finally {
            setLoading(false);
        }
    };

    const isFormValid = formData.employee_id && formData.assignment_type && formData.start_date;

    return (
        <div className="px-8 py-8 space-y-6">
            <div className="flex items-center gap-4">
                <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <ArrowLeft className="w-5 h-5 text-gray-600" />
                </button>
                <div>
                    <h2 className="text-3xl font-bold text-gray-900">New Assignment</h2>
                    <p className="text-sm text-gray-600 mt-1">Assign an employee to a client or project</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Assignment Info */}
                <div className="bg-white rounded-xl border border-gray-200 p-8">
                    <div className="flex items-center gap-2 mb-6">
                        <User className="w-5 h-5 text-pink-600" />
                        <h3 className="font-semibold text-gray-900">Assignment Details</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <Label>Employee *</Label>
                            <Combobox
                                options={employeeOptions}
                                value={formData.employee_id}
                                onValueChange={(v) => handleChange("employee_id", v)}
                                placeholder="Select employee..."
                                searchPlaceholder="Search employee name..."
                                emptyText="No employees found."
                                loading={empLoading}
                            />
                        </div>
                        <div>
                            <Label>Client</Label>
                            <Combobox
                                options={clientOptions}
                                value={formData.client_id}
                                onValueChange={(v) => handleChange("client_id", v)}
                                placeholder="Select client..."
                                searchPlaceholder="Search client name..."
                                emptyText="No clients found."
                                loading={clientLoading}
                            />
                        </div>
                        <div>
                            <Label>Assignment Type *</Label>
                            <Select value={formData.assignment_type} onValueChange={(v) => handleChange("assignment_type", v)}>
                                <SelectTrigger><SelectValue placeholder="Select type..." /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="client">Client Assignment</SelectItem>
                                    <SelectItem value="project">Project Assignment</SelectItem>
                                    <SelectItem value="internal">Internal</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label>Work Model</Label>
                            <Select value={formData.remote_type} onValueChange={(v) => handleChange("remote_type", v)}>
                                <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="onsite">Onsite</SelectItem>
                                    <SelectItem value="remote">Remote</SelectItem>
                                    <SelectItem value="hybrid">Hybrid</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                {/* Position & Location */}
                <div className="bg-white rounded-xl border border-gray-200 p-8">
                    <div className="flex items-center gap-2 mb-6">
                        <Briefcase className="w-5 h-5 text-pink-600" />
                        <h3 className="font-semibold text-gray-900">Position & Schedule</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <Label htmlFor="position">Position</Label>
                            <Input id="position" placeholder="e.g. Software Engineer" value={formData.position}
                                onChange={(e) => handleChange("position", e.target.value)} />
                        </div>
                        <div>
                            <Label htmlFor="role">Role</Label>
                            <Input id="role" placeholder="e.g. Tech Lead" value={formData.role}
                                onChange={(e) => handleChange("role", e.target.value)} />
                        </div>
                        <div>
                            <Label htmlFor="location" className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-pink-600" />Location
                            </Label>
                            <Input id="location" placeholder="e.g. Jakarta" value={formData.location}
                                onChange={(e) => handleChange("location", e.target.value)} />
                        </div>
                        <div>
                            <Label htmlFor="hours">Hours per Week</Label>
                            <Input id="hours" type="number" placeholder="40" value={formData.hours_per_week}
                                onChange={(e) => handleChange("hours_per_week", e.target.value)} />
                        </div>
                        <div>
                            <Label htmlFor="start" className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-pink-600" />Start Date *
                            </Label>
                            <Input id="start" type="date" value={formData.start_date}
                                onChange={(e) => handleChange("start_date", e.target.value)} required />
                        </div>
                        <div>
                            <Label htmlFor="end">Expected End Date</Label>
                            <Input id="end" type="date" value={formData.expected_end_date}
                                onChange={(e) => handleChange("expected_end_date", e.target.value)} />
                        </div>
                    </div>
                </div>

                {/* Billing */}
                <div className="bg-white rounded-xl border border-gray-200 p-8">
                    <div className="flex items-center gap-2 mb-6">
                        <DollarSign className="w-5 h-5 text-pink-600" />
                        <h3 className="font-semibold text-gray-900">Billing</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <Label htmlFor="billing">Billing Rate</Label>
                            <Input id="billing" type="number" placeholder="0" value={formData.billing_rate}
                                onChange={(e) => handleChange("billing_rate", e.target.value)} />
                        </div>
                        <div>
                            <Label htmlFor="cost">Cost Rate</Label>
                            <Input id="cost" type="number" placeholder="0" value={formData.cost_rate}
                                onChange={(e) => handleChange("cost_rate", e.target.value)} />
                        </div>
                        <div className="md:col-span-2">
                            <Label htmlFor="notes">Notes</Label>
                            <Textarea id="notes" placeholder="Optional notes..." value={formData.notes}
                                onChange={(e) => handleChange("notes", e.target.value)} rows={3} />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-3">
                    <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
                    <Button type="submit" disabled={!isFormValid || loading}
                        className="bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700">
                        {loading ? "Creating..." : "Create Assignment"}
                    </Button>
                </div>
            </form>
        </div>
    );
}
