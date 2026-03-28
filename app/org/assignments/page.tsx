"use client"
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import { Plus, Search, Trash2, Briefcase, MapPin, Clock, CheckCircle, XCircle } from "lucide-react";
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
import { useRouter } from "next/navigation";
import { getAssignments, deleteAssignment, updateAssignment } from "@/services/assignment.service";
import { ConfirmDialog } from "@/app/_components/ConfirmDialog";
import { useFetch } from "@/hooks/use-fetch";

interface Assignment {
    id: number;
    employee_id: number;
    employee?: { id: number; name: string };
    client?: { id: number; company_name: string };
    assignment_type: string;
    start_date: string;
    end_date: string | null;
    expected_end_date: string | null;
    role: string | null;
    position: string | null;
    location: string | null;
    remote_type: string | null;
    status: string;
    created_at: string;
}

export default function AssignmentsPage() {
    const router = useRouter();
    const { can } = useAuth();
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [page, setPage] = useState(1);
    const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

    const { data, loading, refetch } = useFetch(
        () => getAssignments({ page, limit: 10, search: searchQuery, status: statusFilter }),
        [page, searchQuery, statusFilter],
        { debounceMs: searchQuery ? 400 : 0 }
    );

    const handleDelete = async (id: number) => {
        try {
            await deleteAssignment(String(id));
            refetch();
        } catch (err) {
            console.error(err);
            toast.error(err instanceof Error ? err.message : "Failed to delete assignment.");
        } finally {
            setDeleteConfirmId(null);
        }
    };

    const handleComplete = async (id: number) => {
        try {
            await updateAssignment(String(id), { status: "completed", end_date: new Date().toISOString().split("T")[0] });
            refetch();
        } catch (err) {
            console.error(err);
            toast.error(err instanceof Error ? err.message : "Failed to complete assignment.");
        }
    };

    const assignments: Assignment[] = data?.data ?? [];
    const totalPages = data?.pagination?.total_pages ?? 1;
    const total = data?.pagination?.total ?? 0;

    const getStatusColor = (status: string) => {
        switch (status) {
            case "active": return "bg-green-50 text-green-700 border-green-200";
            case "completed": return "bg-blue-50 text-blue-700 border-blue-200";
            case "cancelled": return "bg-red-50 text-red-700 border-red-200";
            default: return "bg-gray-50 text-gray-700 border-gray-200";
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "active": return <CheckCircle className="w-3 h-3" />;
            case "completed": return <Clock className="w-3 h-3" />;
            case "cancelled": return <XCircle className="w-3 h-3" />;
            default: return null;
        }
    };

    return (
        <div className="px-8 py-8 space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900">Assignments</h2>
                    <p className="text-sm text-gray-600 mt-1">Manage employee client assignments and projects</p>
                </div>
                {can("assignments:create") && (
                    <button
                        onClick={() => router.push("/org/assignments/create")}
                        className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-pink-600 to-rose-600 text-white rounded-lg hover:from-pink-700 hover:to-rose-700 transition-all font-medium shadow-sm"
                    >
                        <Plus className="w-4 h-4" />
                        New Assignment
                    </button>
                )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                    { label: "Total", value: total, icon: Briefcase, color: "bg-pink-50", iconColor: "text-pink-600" },
                    { label: "Active", value: assignments.filter(a => a.status === "active").length, icon: CheckCircle, color: "bg-green-50", iconColor: "text-green-600" },
                    { label: "Completed", value: assignments.filter(a => a.status === "completed").length, icon: Clock, color: "bg-blue-50", iconColor: "text-blue-600" },
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
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input
                            placeholder="Search assignments..."
                            value={searchQuery}
                            onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
                            className="pl-10"
                        />
                    </div>
                    <Select value={statusFilter || "ALL"} onValueChange={(v) => { setStatusFilter(v === "ALL" ? "" : v); setPage(1); }}>
                        <SelectTrigger className="w-full md:w-[200px]">
                            <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ALL">All Status</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-gray-50">
                            <TableHead className="font-semibold">Employee</TableHead>
                            <TableHead className="font-semibold">Client</TableHead>
                            <TableHead className="font-semibold">Position / Role</TableHead>
                            <TableHead className="font-semibold">Location</TableHead>
                            <TableHead className="font-semibold">Period</TableHead>
                            <TableHead className="font-semibold">Status</TableHead>
                            <TableHead className="font-semibold text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <TableRow key={i}>
                                    {Array.from({ length: 7 }).map((_, j) => (
                                        <TableCell key={j}><Skeleton className="w-24 h-5" /></TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : assignments.length > 0 ? (
                            assignments.map((asg) => (
                                <TableRow key={asg.id} className="hover:bg-gray-50">
                                    <TableCell>
                                        <p className="font-medium text-gray-900">{asg.employee?.name ?? `ID: ${asg.employee_id}`}</p>
                                    </TableCell>
                                    <TableCell>
                                        <p className="text-sm text-gray-900">{asg.client?.company_name ?? "-"}</p>
                                    </TableCell>
                                    <TableCell>
                                        <div>
                                            <p className="text-sm text-gray-900">{asg.position || asg.role || "-"}</p>
                                            <p className="text-xs text-gray-500 capitalize">{asg.assignment_type}</p>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <p className="text-sm text-gray-900 flex items-center gap-1">
                                            <MapPin className="w-3 h-3 text-gray-400" />
                                            {asg.location || "-"}
                                        </p>
                                        {asg.remote_type && (
                                            <Badge variant="outline" className="text-xs mt-1 capitalize">{asg.remote_type}</Badge>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <p className="text-sm text-gray-900">
                                            {new Date(asg.start_date).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                                        </p>
                                        {asg.end_date && (
                                            <p className="text-xs text-gray-500">
                                                to {new Date(asg.end_date).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                                            </p>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-medium capitalize ${getStatusColor(asg.status)}`}>
                                            {getStatusIcon(asg.status)}
                                            {asg.status}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="sm"><span className="text-gray-600">&#8942;</span></Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                {can("assignments:edit") && asg.status === "active" && (
                                                    <DropdownMenuItem onClick={() => handleComplete(asg.id)}>
                                                        <CheckCircle className="w-4 h-4 mr-2" />Mark Completed
                                                    </DropdownMenuItem>
                                                )}
                                                {can("assignments:delete") && (
                                                    <DropdownMenuItem className="text-red-600" onClick={() => setDeleteConfirmId(asg.id)}>
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
                                <TableCell colSpan={7} className="text-center py-12 text-gray-500">No assignments found</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">Showing {assignments.length} of {total} assignments</p>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</Button>
                    <span className="flex items-center px-3 text-sm text-gray-600">Page {page} of {totalPages}</span>
                    <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>Next</Button>
                </div>
            </div>

            <ConfirmDialog
                open={!!deleteConfirmId}
                onOpenChange={(open) => !open && setDeleteConfirmId(null)}
                title="Delete Assignment"
                description="Are you sure you want to delete this assignment? This action cannot be undone."
                confirmLabel="Delete"
                variant="danger"
                onConfirm={() => deleteConfirmId && handleDelete(deleteConfirmId)}
            />
        </div>
    );
}
