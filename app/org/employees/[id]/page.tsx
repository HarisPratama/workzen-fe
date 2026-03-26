"use client"
import { ArrowLeft, Phone, CreditCard, Calendar, User, Edit, Trash2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/app/_components/ui/button";
import { Skeleton } from "@/app/_components/ui/skeleton";
import { Input } from "@/app/_components/ui/input";
import { Label } from "@/app/_components/ui/label";
import {
    Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/app/_components/ui/dialog";
import { useRouter, useParams } from "next/navigation";
import { useFetch } from "@/hooks/use-fetch";
import { getDetailEmployee, updateEmployee, deleteEmployee } from "@/services/employee.service";

interface Employee {
    id: number;
    name: string;
    citizen_id: string;
    phone_number: string;
    status?: string;
    created_at: string;
    updated_at: string;
}

export default function EmployeeDetailPage() {
    const router = useRouter();
    const params = useParams();
    const employeeId = params.id as string;

    const { data, loading, refetch } = useFetch(
        () => getDetailEmployee(employeeId),
        [employeeId]
    );

    const employee: Employee | undefined = data?.data;

    const [editOpen, setEditOpen] = useState(false);
    const [editLoading, setEditLoading] = useState(false);
    const [editForm, setEditForm] = useState({ name: "", citizen_id: "", phone_number: "" });

    const [deleteOpen, setDeleteOpen] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const openEdit = () => {
        if (!employee) return;
        setEditForm({ name: employee.name, citizen_id: employee.citizen_id, phone_number: employee.phone_number });
        setEditOpen(true);
    };

    const handleEdit = async () => {
        setEditLoading(true);
        try {
            await updateEmployee(employeeId, editForm);
            setEditOpen(false);
            refetch();
        } catch (error) {
            console.error("Failed to update employee:", error);
            alert("Failed to update employee.");
        } finally {
            setEditLoading(false);
        }
    };

    const handleDelete = async () => {
        setDeleteLoading(true);
        try {
            await deleteEmployee(employeeId);
            router.push("/org/employees");
        } catch (error) {
            console.error("Failed to delete employee:", error);
            alert("Failed to delete employee.");
        } finally {
            setDeleteLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="px-8 py-8 space-y-6">
                <div className="flex items-center gap-4">
                    <Skeleton className="w-10 h-10 rounded-lg" />
                    <div>
                        <Skeleton className="w-64 h-8 mb-2" />
                        <Skeleton className="w-96 h-5" />
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <Skeleton key={i} className="h-24 rounded-xl" />
                    ))}
                </div>
                <Skeleton className="h-64 rounded-xl" />
            </div>
        );
    }

    if (!employee) {
        return (
            <div className="px-8 py-8 text-center">
                <p className="text-gray-500">Employee not found.</p>
                <Button variant="outline" onClick={() => router.back()} className="mt-4">Go Back</Button>
            </div>
        );
    }

    return (
        <div className="px-8 py-8 space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                    <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <ArrowLeft className="w-5 h-5 text-gray-600" />
                    </button>
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900">{employee.name}</h2>
                        <p className="text-sm text-gray-600 mt-1">Employee ID: {employee.id}</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={openEdit}>
                        <Edit className="w-4 h-4 mr-2" />Edit
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700" onClick={() => setDeleteOpen(true)}>
                        <Trash2 className="w-4 h-4 mr-2" />Delete
                    </Button>
                </div>
            </div>

            {/* Quick Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-pink-50 rounded-lg">
                            <CreditCard className="w-5 h-5 text-pink-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Citizen ID</p>
                            <p className="font-semibold text-gray-900 font-mono text-sm">{employee.citizen_id || "-"}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-5">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-blue-50 rounded-lg">
                            <Phone className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Phone</p>
                            <p className="font-semibold text-gray-900">{employee.phone_number || "-"}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-5">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-green-50 rounded-lg">
                            <Calendar className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Joined</p>
                            <p className="font-semibold text-gray-900 text-sm">
                                {employee.created_at
                                    ? new Date(employee.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })
                                    : "-"}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Details */}
            <div className="bg-white rounded-xl border border-gray-200 p-8">
                <div className="space-y-8">
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <User className="w-5 h-5 text-pink-600" />
                            Employee Information
                        </h3>
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Full Name</p>
                                <p className="font-medium text-gray-900">{employee.name}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Citizen ID (KTP)</p>
                                <p className="font-medium text-gray-900 font-mono">{employee.citizen_id || "-"}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Phone Number</p>
                                <p className="font-medium text-gray-900">{employee.phone_number || "-"}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Registered At</p>
                                <p className="font-medium text-gray-900">
                                    {employee.created_at
                                        ? new Date(employee.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })
                                        : "-"}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Edit Dialog */}
            <Dialog open={editOpen} onOpenChange={setEditOpen}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Edit Employee</DialogTitle>
                        <DialogDescription>Update employee information</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div>
                            <Label htmlFor="edit-name">Full Name *</Label>
                            <Input id="edit-name" value={editForm.name}
                                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} />
                        </div>
                        <div>
                            <Label htmlFor="edit-ktp">Citizen ID (KTP) *</Label>
                            <Input id="edit-ktp" value={editForm.citizen_id}
                                onChange={(e) => setEditForm({ ...editForm, citizen_id: e.target.value })} />
                        </div>
                        <div>
                            <Label htmlFor="edit-phone">Phone Number *</Label>
                            <Input id="edit-phone" value={editForm.phone_number}
                                onChange={(e) => setEditForm({ ...editForm, phone_number: e.target.value })} />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setEditOpen(false)}>Cancel</Button>
                        <Button onClick={handleEdit} disabled={!editForm.name || !editForm.citizen_id || editLoading}
                            className="bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700">
                            {editLoading ? "Saving..." : "Save Changes"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation */}
            <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Delete Employee</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete <strong>{employee.name}</strong>? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteOpen(false)}>Cancel</Button>
                        <Button variant="destructive" onClick={handleDelete} disabled={deleteLoading}>
                            {deleteLoading ? "Deleting..." : "Delete"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
