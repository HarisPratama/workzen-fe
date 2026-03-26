"use client"
import { Plus, Search, Eye, Edit, Trash2, Users, UserCheck, Phone } from "lucide-react";
import { useState } from "react";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/app/_components/ui/table";
import { Button } from "@/app/_components/ui/button";
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/app/_components/ui/dropdown-menu";
import { Input } from "@/app/_components/ui/input";
import { Skeleton } from "@/app/_components/ui/skeleton";
import { useRouter } from "next/navigation";
import { getEmployees, deleteEmployee } from "@/services/employee.service";
import { useFetch } from "@/hooks/use-fetch";

interface Employee {
    id: number;
    name: string;
    citizen_id: string;
    phone_number: string;
    status?: string;
    created_at: string;
    updated_at: string;
}

export default function EmployeesPage() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");
    const [page, setPage] = useState(1);

    const { data, loading, refetch } = useFetch(
        () => getEmployees({ page, limit: 10, search: searchQuery }),
        [page, searchQuery],
        { debounceMs: searchQuery ? 400 : 0 }
    );

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this employee?")) return;
        try {
            await deleteEmployee(String(id));
            refetch();
        } catch (error) {
            console.error("Failed to delete employee:", error);
            alert("Failed to delete employee.");
        }
    };

    const employees: Employee[] = data?.data ?? [];
    const totalPages = data?.pagination?.total_pages ?? 1;
    const total = data?.pagination?.total ?? 0;

    return (
        <div className="px-8 py-8 space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900">Employees</h2>
                    <p className="text-sm text-gray-600 mt-1">
                        Manage all employees in your organization
                    </p>
                </div>
                <button
                    onClick={() => router.push("/org/employees/create")}
                    className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-pink-600 to-rose-600 text-white rounded-lg hover:from-pink-700 hover:to-rose-700 transition-all font-medium shadow-sm"
                >
                    <Plus className="w-4 h-4" />
                    Add Employee
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-pink-50 rounded-lg">
                            <Users className="w-5 h-5 text-pink-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Total Employees</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {loading ? <Skeleton className="w-8 h-7" /> : total}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-green-50 rounded-lg">
                            <UserCheck className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Active</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {loading ? <Skeleton className="w-8 h-7" /> : employees.length}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-blue-50 rounded-lg">
                            <Users className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">This Page</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {loading ? <Skeleton className="w-8 h-7" /> : employees.length}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Search */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                        placeholder="Search by name or citizen ID..."
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setPage(1);
                        }}
                        className="pl-10"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-gray-50">
                            <TableHead className="font-semibold">Employee</TableHead>
                            <TableHead className="font-semibold">Citizen ID</TableHead>
                            <TableHead className="font-semibold">Phone</TableHead>
                            <TableHead className="font-semibold">Joined</TableHead>
                            <TableHead className="font-semibold text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <TableRow key={i}>
                                    <TableCell><Skeleton className="w-32 h-5" /></TableCell>
                                    <TableCell><Skeleton className="w-40 h-5" /></TableCell>
                                    <TableCell><Skeleton className="w-32 h-5" /></TableCell>
                                    <TableCell><Skeleton className="w-24 h-5" /></TableCell>
                                    <TableCell><Skeleton className="w-8 h-5 ml-auto" /></TableCell>
                                </TableRow>
                            ))
                        ) : employees.length > 0 ? (
                            employees.map((emp) => (
                                <TableRow key={emp.id} className="hover:bg-gray-50">
                                    <TableCell>
                                        <div>
                                            <p className="font-medium text-gray-900">{emp.name}</p>
                                            <p className="text-sm text-gray-600">ID: {emp.id}</p>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <p className="text-sm text-gray-900 font-mono">{emp.citizen_id || "-"}</p>
                                    </TableCell>
                                    <TableCell>
                                        <p className="text-sm text-gray-900 flex items-center gap-1">
                                            <Phone className="w-3 h-3 text-gray-400" />
                                            {emp.phone_number || "-"}
                                        </p>
                                    </TableCell>
                                    <TableCell>
                                        <p className="text-sm text-gray-900">
                                            {emp.created_at
                                                ? new Date(emp.created_at).toLocaleDateString("id-ID", {
                                                    day: "numeric", month: "short", year: "numeric",
                                                })
                                                : "-"}
                                        </p>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="sm">
                                                    <span className="text-gray-600">&#8942;</span>
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => router.push(`/org/employees/${emp.id}`)}>
                                                    <Eye className="w-4 h-4 mr-2" />
                                                    View Details
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => router.push(`/org/employees/${emp.id}`)}>
                                                    <Edit className="w-4 h-4 mr-2" />
                                                    Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(emp.id)}>
                                                    <Trash2 className="w-4 h-4 mr-2" />
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-12 text-gray-500">
                                    No employees found
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">
                    Showing {employees.length} of {total} employees
                </p>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>
                        Previous
                    </Button>
                    <span className="flex items-center px-3 text-sm text-gray-600">
                        Page {page} of {totalPages}
                    </span>
                    <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>
                        Next
                    </Button>
                </div>
            </div>
        </div>
    );
}
