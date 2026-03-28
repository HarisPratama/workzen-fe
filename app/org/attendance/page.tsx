"use client"
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import { Search, Clock, CheckCircle, XCircle, CalendarDays, Plus, Trash2, Edit } from "lucide-react";
import { useState } from "react";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/app/_components/ui/table";
import { Badge } from "@/app/_components/ui/badge";
import { Button } from "@/app/_components/ui/button";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/app/_components/ui/select";
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/app/_components/ui/dropdown-menu";
import { Input } from "@/app/_components/ui/input";
import { Skeleton } from "@/app/_components/ui/skeleton";
import {
    Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/app/_components/ui/dialog";
import { Label } from "@/app/_components/ui/label";
import { Textarea } from "@/app/_components/ui/textarea";
import { Combobox } from "@/app/_components/ui/combobox";
import { getAttendances, createAttendance, deleteAttendance, updateAttendance } from "@/services/attendance.service";
import { ConfirmDialog } from "@/app/_components/ConfirmDialog";
import { getEmployees } from "@/services/employee.service";
import { useFetch } from "@/hooks/use-fetch";

interface Attendance {
    id: string;
    employee_id: string;
    employee?: { id: string; name: string };
    date: string;
    type: string;
    status: string;
    check_in: string | null;
    check_out: string | null;
    notes: string | null;
    created_at: string;
}

export default function AttendancePage() {
    const { can } = useAuth();
    const [page, setPage] = useState(1);
    const [statusFilter, setStatusFilter] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [createLoading, setCreateLoading] = useState(false);
    const [createForm, setCreateForm] = useState({
        employee_id: "",
        date: new Date().toISOString().split("T")[0],
        type: "regular" as const,
        status: "present" as const,
        check_in: "",
        check_out: "",
        notes: "",
    });
    const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

    const { data, loading, refetch } = useFetch(
        () => getAttendances({ page, limit: 10, status: statusFilter, start_date: startDate, end_date: endDate }),
        [page, statusFilter, startDate, endDate]
    );

    const { data: employeeData, loading: empLoading } = useFetch(
        () => getEmployees({ limit: 100 }), []
    );

    const employeeOptions = (employeeData?.data ?? []).map((e: { id: number; name: string }) => ({
        value: String(e.id),
        label: e.name,
        sublabel: `ID: ${e.id}`,
    }));

    const attendances: Attendance[] = data?.data ?? [];
    const totalPages = data?.pagination?.total_pages ?? 1;
    const total = data?.pagination?.total ?? 0;

    const getStatusColor = (status: string) => {
        switch (status) {
            case "present": return "bg-green-50 text-green-700 border-green-200";
            case "absent": return "bg-red-50 text-red-700 border-red-200";
            case "leave": return "bg-amber-50 text-amber-700 border-amber-200";
            case "holiday": return "bg-blue-50 text-blue-700 border-blue-200";
            default: return "bg-gray-50 text-gray-700 border-gray-200";
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "present": return <CheckCircle className="w-3 h-3" />;
            case "absent": return <XCircle className="w-3 h-3" />;
            default: return <Clock className="w-3 h-3" />;
        }
    };

    const handleCreate = async () => {
        setCreateLoading(true);
        try {
            await createAttendance({
                employee_id: createForm.employee_id,
                date: createForm.date,
                type: createForm.type,
                status: createForm.status,
                check_in: createForm.check_in ? `${createForm.check_in}:00` : undefined,
                check_out: createForm.check_out ? `${createForm.check_out}:00` : undefined,
                notes: createForm.notes || undefined,
            });
            setCreateModalOpen(false);
            setCreateForm({
                employee_id: "", date: new Date().toISOString().split("T")[0],
                type: "regular", status: "present", check_in: "", check_out: "", notes: "",
            });
            refetch();
        } catch (err) {
            console.error(err);
            toast.error(err instanceof Error ? err.message : "Failed to create attendance.");
        } finally {
            setCreateLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteAttendance(id);
            refetch();
        } catch (err) {
            console.error(err);
            toast.error(err instanceof Error ? err.message : "Failed to delete attendance.");
        } finally {
            setDeleteConfirmId(null);
        }
    };

    // Edit state
    const [editOpen, setEditOpen] = useState(false);
    const [editLoading, setEditLoading] = useState(false);
    const [editingId, setEditingId] = useState("");
    const [editForm, setEditForm] = useState({
        status: "present" as string,
        check_in: "",
        check_out: "",
        notes: "",
    });

    const openEdit = (att: Attendance) => {
        setEditingId(att.id);
        setEditForm({
            status: att.status,
            check_in: att.check_in?.slice(0, 5) || "",
            check_out: att.check_out?.slice(0, 5) || "",
            notes: att.notes || "",
        });
        setEditOpen(true);
    };

    const handleEdit = async () => {
        setEditLoading(true);
        try {
            await updateAttendance(editingId, {
                status: editForm.status,
                check_in: editForm.check_in ? `${editForm.check_in}:00` : undefined,
                check_out: editForm.check_out ? `${editForm.check_out}:00` : undefined,
                notes: editForm.notes || undefined,
            });
            setEditOpen(false);
            refetch();
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Failed to update attendance.");
        } finally {
            setEditLoading(false);
        }
    };

    return (
        <div className="px-8 py-8 space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900">Attendance</h2>
                    <p className="text-sm text-gray-600 mt-1">Track and manage employee attendance records</p>
                </div>
                {can("attendance:create") && (
                    <button
                        onClick={() => setCreateModalOpen(true)}
                        className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-pink-600 to-rose-600 text-white rounded-lg hover:from-pink-700 hover:to-rose-700 transition-all font-medium shadow-sm"
                    >
                        <Plus className="w-4 h-4" />
                        Add Record
                    </button>
                )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                    { label: "Total Records", value: total, icon: CalendarDays, color: "bg-pink-50", iconColor: "text-pink-600" },
                    { label: "Present", value: attendances.filter(a => a.status === "present").length, icon: CheckCircle, color: "bg-green-50", iconColor: "text-green-600" },
                    { label: "Absent", value: attendances.filter(a => a.status === "absent").length, icon: XCircle, color: "bg-red-50", iconColor: "text-red-600" },
                    { label: "On Leave", value: attendances.filter(a => a.status === "leave").length, icon: Clock, color: "bg-amber-50", iconColor: "text-amber-600" },
                ].map((stat) => (
                    <div key={stat.label} className="bg-white rounded-xl border border-gray-200 p-5">
                        <div className="flex items-center gap-3">
                            <div className={`p-2.5 ${stat.color} rounded-lg`}>
                                <stat.icon className={`w-5 h-5 ${stat.iconColor}`} />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">{stat.label}</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {loading ? <Skeleton className="w-8 h-7" /> : stat.value}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex flex-col md:flex-row gap-4">
                    <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v === "ALL" ? "" : v); setPage(1); }}>
                        <SelectTrigger className="w-full md:w-[200px]">
                            <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ALL">All Status</SelectItem>
                            <SelectItem value="present">Present</SelectItem>
                            <SelectItem value="absent">Absent</SelectItem>
                            <SelectItem value="leave">Leave</SelectItem>
                            <SelectItem value="holiday">Holiday</SelectItem>
                        </SelectContent>
                    </Select>
                    <Input
                        type="date"
                        value={startDate}
                        onChange={(e) => { setStartDate(e.target.value); setPage(1); }}
                        className="w-full md:w-[200px]"
                        placeholder="Start date"
                    />
                    <Input
                        type="date"
                        value={endDate}
                        onChange={(e) => { setEndDate(e.target.value); setPage(1); }}
                        className="w-full md:w-[200px]"
                        placeholder="End date"
                    />
                    {(statusFilter || startDate || endDate) && (
                        <Button variant="outline" onClick={() => { setStatusFilter(""); setStartDate(""); setEndDate(""); setPage(1); }}>
                            Clear
                        </Button>
                    )}
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-gray-50">
                            <TableHead className="font-semibold">Employee</TableHead>
                            <TableHead className="font-semibold">Date</TableHead>
                            <TableHead className="font-semibold">Type</TableHead>
                            <TableHead className="font-semibold">Status</TableHead>
                            <TableHead className="font-semibold">Check In</TableHead>
                            <TableHead className="font-semibold">Check Out</TableHead>
                            <TableHead className="font-semibold">Notes</TableHead>
                            <TableHead className="font-semibold text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <TableRow key={i}>
                                    {Array.from({ length: 8 }).map((_, j) => (
                                        <TableCell key={j}><Skeleton className="w-20 h-5" /></TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : attendances.length > 0 ? (
                            attendances.map((att) => (
                                <TableRow key={att.id} className="hover:bg-gray-50">
                                    <TableCell>
                                        <p className="font-medium text-gray-900">{att.employee?.name ?? att.employee_id}</p>
                                    </TableCell>
                                    <TableCell>
                                        <p className="text-sm text-gray-900">
                                            {new Date(att.date).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                                        </p>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className="bg-gray-50 text-gray-700 capitalize">{att.type}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-medium capitalize ${getStatusColor(att.status)}`}>
                                            {getStatusIcon(att.status)}
                                            {att.status}
                                        </div>
                                    </TableCell>
                                    <TableCell><p className="text-sm text-gray-900">{att.check_in || "-"}</p></TableCell>
                                    <TableCell><p className="text-sm text-gray-900">{att.check_out || "-"}</p></TableCell>
                                    <TableCell>
                                        <p className="text-sm text-gray-600 max-w-[150px] truncate">{att.notes || "-"}</p>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="sm"><span className="text-gray-600">&#8942;</span></Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                {can("attendance:edit") && (
                                                    <DropdownMenuItem onClick={() => openEdit(att)}>
                                                        <Edit className="w-4 h-4 mr-2" />Edit
                                                    </DropdownMenuItem>
                                                )}
                                                {can("attendance:delete") && (
                                                    <DropdownMenuItem className="text-red-600" onClick={() => setDeleteConfirmId(att.id)}>
                                                        <Trash2 className="w-4 h-4 mr-2" />Delete
                                                    </DropdownMenuItem>
                                                )}
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={8} className="text-center py-12 text-gray-500">No attendance records found</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">Showing {attendances.length} of {total} records</p>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</Button>
                    <span className="flex items-center px-3 text-sm text-gray-600">Page {page} of {totalPages}</span>
                    <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>Next</Button>
                </div>
            </div>

            {/* Create Modal */}
            <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Add Attendance Record</DialogTitle>
                        <DialogDescription>Create a new attendance entry</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div>
                            <Label>Employee *</Label>
                            <Combobox
                                options={employeeOptions}
                                value={createForm.employee_id}
                                onValueChange={(v) => setCreateForm({ ...createForm, employee_id: v })}
                                placeholder="Select employee..."
                                searchPlaceholder="Search employee name..."
                                emptyText="No employees found."
                                loading={empLoading}
                            />
                        </div>
                        <div>
                            <Label htmlFor="att-date">Date *</Label>
                            <Input id="att-date" type="date" value={createForm.date}
                                onChange={(e) => setCreateForm({ ...createForm, date: e.target.value })} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label>Type *</Label>
                                <Select value={createForm.type} onValueChange={(v) => setCreateForm({ ...createForm, type: v as typeof createForm.type })}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="regular">Regular</SelectItem>
                                        <SelectItem value="overtime">Overtime</SelectItem>
                                        <SelectItem value="weekend">Weekend</SelectItem>
                                        <SelectItem value="holiday">Holiday</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label>Status *</Label>
                                <Select value={createForm.status} onValueChange={(v) => setCreateForm({ ...createForm, status: v as typeof createForm.status })}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="present">Present</SelectItem>
                                        <SelectItem value="absent">Absent</SelectItem>
                                        <SelectItem value="leave">Leave</SelectItem>
                                        <SelectItem value="holiday">Holiday</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="check-in">Check In</Label>
                                <Input id="check-in" type="time" value={createForm.check_in}
                                    onChange={(e) => setCreateForm({ ...createForm, check_in: e.target.value })} />
                            </div>
                            <div>
                                <Label htmlFor="check-out">Check Out</Label>
                                <Input id="check-out" type="time" value={createForm.check_out}
                                    onChange={(e) => setCreateForm({ ...createForm, check_out: e.target.value })} />
                            </div>
                        </div>
                        <div>
                            <Label htmlFor="att-notes">Notes</Label>
                            <Textarea id="att-notes" placeholder="Optional notes..." value={createForm.notes}
                                onChange={(e) => setCreateForm({ ...createForm, notes: e.target.value })} rows={2} />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setCreateModalOpen(false)}>Cancel</Button>
                        <Button onClick={handleCreate} disabled={!createForm.employee_id || !createForm.date || createLoading}
                            className="bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700">
                            {createLoading ? "Saving..." : "Add Record"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Modal */}
            <Dialog open={editOpen} onOpenChange={setEditOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Edit Attendance</DialogTitle>
                        <DialogDescription>Update attendance record</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div>
                            <Label>Status</Label>
                            <Select value={editForm.status} onValueChange={(v) => setEditForm({ ...editForm, status: v })}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="present">Present</SelectItem>
                                    <SelectItem value="absent">Absent</SelectItem>
                                    <SelectItem value="leave">Leave</SelectItem>
                                    <SelectItem value="holiday">Holiday</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="edit-checkin">Check In</Label>
                                <Input id="edit-checkin" type="time" value={editForm.check_in}
                                    onChange={(e) => setEditForm({ ...editForm, check_in: e.target.value })} />
                            </div>
                            <div>
                                <Label htmlFor="edit-checkout">Check Out</Label>
                                <Input id="edit-checkout" type="time" value={editForm.check_out}
                                    onChange={(e) => setEditForm({ ...editForm, check_out: e.target.value })} />
                            </div>
                        </div>
                        <div>
                            <Label htmlFor="edit-notes">Notes</Label>
                            <Textarea id="edit-notes" value={editForm.notes} rows={2}
                                onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })} />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setEditOpen(false)}>Cancel</Button>
                        <Button onClick={handleEdit} disabled={editLoading}
                            className="bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700">
                            {editLoading ? "Saving..." : "Save Changes"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <ConfirmDialog
                open={!!deleteConfirmId}
                onOpenChange={(open) => !open && setDeleteConfirmId(null)}
                title="Delete Attendance Record"
                description="Are you sure you want to delete this attendance record? This action cannot be undone."
                confirmLabel="Delete"
                variant="danger"
                onConfirm={() => deleteConfirmId && handleDelete(deleteConfirmId)}
            />
        </div>
    );
}
