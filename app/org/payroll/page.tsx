"use client"
import { toast } from "sonner";
import { Plus, DollarSign, Eye, Trash2, Clock, CheckCircle, FileText, CreditCard, Edit } from "lucide-react";
import { useState } from "react";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/app/_components/ui/table";
import { Badge } from "@/app/_components/ui/badge";
import { Button } from "@/app/_components/ui/button";
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/app/_components/ui/dropdown-menu";
import { Skeleton } from "@/app/_components/ui/skeleton";
import {
    Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/app/_components/ui/dialog";
import { Input } from "@/app/_components/ui/input";
import { Label } from "@/app/_components/ui/label";
import { Textarea } from "@/app/_components/ui/textarea";
import { Combobox } from "@/app/_components/ui/combobox";
import { getPayrolls, createPayroll, updatePayroll, processPayroll, markPayrollAsPaid, deletePayroll } from "@/services/payroll.service";
import { getEmployees } from "@/services/employee.service";
import { useFetch } from "@/hooks/use-fetch";

interface Payroll {
    id: string;
    employee_id: string;
    employee?: { id: string; name: string };
    period_start: string;
    period_end: string;
    basic_salary: number;
    allowances: number;
    deductions: number;
    tax: number;
    net_salary: number;
    status?: string;
    notes: string | null;
    created_at: string;
}

const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(amount || 0);

export default function PayrollPage() {
    const [page, setPage] = useState(1);
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [createLoading, setCreateLoading] = useState(false);
    const [createForm, setCreateForm] = useState({
        employee_id: "",
        period_start: "",
        period_end: "",
        basic_salary: "",
        allowances: "",
        deductions: "",
        tax: "",
        notes: "",
    });

    const { data, loading, refetch } = useFetch(
        () => getPayrolls({ page, limit: 10 }),
        [page]
    );

    const { data: employeeData, loading: empLoading } = useFetch(
        () => getEmployees({ limit: 100 }), []
    );

    const employeeOptions = (employeeData?.data ?? []).map((e: { id: number; name: string }) => ({
        value: String(e.id),
        label: e.name,
        sublabel: `ID: ${e.id}`,
    }));

    const payrolls: Payroll[] = data?.data ?? [];
    const totalPages = data?.pagination?.total_pages ?? 1;
    const total = data?.pagination?.total ?? 0;

    const getStatusColor = (status: string | undefined) => {
        switch (status) {
            case "paid": return "bg-green-50 text-green-700 border-green-200";
            case "processed": return "bg-blue-50 text-blue-700 border-blue-200";
            case "draft": return "bg-gray-50 text-gray-700 border-gray-200";
            case "pending": return "bg-amber-50 text-amber-700 border-amber-200";
            default: return "bg-gray-50 text-gray-700 border-gray-200";
        }
    };

    const handleCreate = async () => {
        setCreateLoading(true);
        try {
            const basicSalary = Number(createForm.basic_salary);
            const allowances = Number(createForm.allowances) || 0;
            const deductions = Number(createForm.deductions) || 0;
            const tax = Number(createForm.tax) || 0;

            await createPayroll({
                employee_id: createForm.employee_id,
                period_start: createForm.period_start,
                period_end: createForm.period_end,
                basic_salary: basicSalary,
                allowances,
                deductions,
                tax,
                net_salary: basicSalary + allowances - deductions - tax,
                notes: createForm.notes || undefined,
            });
            setCreateModalOpen(false);
            setCreateForm({ employee_id: "", period_start: "", period_end: "", basic_salary: "", allowances: "", deductions: "", tax: "", notes: "" });
            refetch();
        } catch (err) {
            console.error(err);
            toast.error(err instanceof Error ? err.message : "Failed to create payroll.");
        } finally {
            setCreateLoading(false);
        }
    };

    const handleProcess = async (id: string) => {
        try {
            await processPayroll(id);
            refetch();
        } catch (err) {
            console.error(err);
            toast.error(err instanceof Error ? err.message : "Failed to process payroll.");
        }
    };

    const handleMarkPaid = async (id: string) => {
        try {
            await markPayrollAsPaid(id, {
                payment_date: new Date().toISOString().split("T")[0],
                payment_method: "bank_transfer",
            });
            refetch();
        } catch (err) {
            console.error(err);
            toast.error(err instanceof Error ? err.message : "Failed to mark as paid.");
        }
    };

    // Edit state
    const [editOpen, setEditOpen] = useState(false);
    const [editLoading, setEditLoading] = useState(false);
    const [editingId, setEditingId] = useState("");
    const [editForm, setEditForm] = useState({
        basic_salary: "", allowances: "", deductions: "", tax: "", notes: "",
    });

    const openEdit = (payroll: Payroll) => {
        setEditingId(payroll.id);
        setEditForm({
            basic_salary: String(payroll.basic_salary),
            allowances: String(payroll.allowances),
            deductions: String(payroll.deductions),
            tax: String(payroll.tax),
            notes: payroll.notes || "",
        });
        setEditOpen(true);
    };

    const handleEdit = async () => {
        setEditLoading(true);
        try {
            const basicSalary = Number(editForm.basic_salary);
            const allowances = Number(editForm.allowances) || 0;
            const deductions = Number(editForm.deductions) || 0;
            const tax = Number(editForm.tax) || 0;
            await updatePayroll(editingId, {
                basic_salary: basicSalary,
                allowances,
                deductions,
                tax,
                net_salary: basicSalary + allowances - deductions - tax,
                notes: editForm.notes || undefined,
            });
            setEditOpen(false);
            refetch();
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Failed to update payroll.");
        } finally {
            setEditLoading(false);
        }
    };

    const totalNetSalary = payrolls.reduce((sum, p) => sum + (p.net_salary || 0), 0);

    return (
        <div className="px-8 py-8 space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900">Payroll</h2>
                    <p className="text-sm text-gray-600 mt-1">Manage employee payroll and compensation</p>
                </div>
                <button
                    onClick={() => setCreateModalOpen(true)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-pink-600 to-rose-600 text-white rounded-lg hover:from-pink-700 hover:to-rose-700 transition-all font-medium shadow-sm"
                >
                    <Plus className="w-4 h-4" />
                    Create Payroll
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                    { label: "Total Records", value: total, icon: FileText, color: "bg-pink-50", iconColor: "text-pink-600", isNumber: true },
                    { label: "Total Net Salary", value: formatCurrency(totalNetSalary), icon: DollarSign, color: "bg-green-50", iconColor: "text-green-600", isNumber: false },
                    { label: "Paid", value: payrolls.filter(p => p.status === "paid").length, icon: CheckCircle, color: "bg-blue-50", iconColor: "text-blue-600", isNumber: true },
                    { label: "Pending", value: payrolls.filter(p => p.status !== "paid").length, icon: Clock, color: "bg-amber-50", iconColor: "text-amber-600", isNumber: true },
                ].map((stat) => (
                    <div key={stat.label} className="bg-white rounded-xl border border-gray-200 p-5">
                        <div className="flex items-center gap-3">
                            <div className={`p-2.5 ${stat.color} rounded-lg`}>
                                <stat.icon className={`w-5 h-5 ${stat.iconColor}`} />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">{stat.label}</p>
                                <p className={`font-bold text-gray-900 ${stat.isNumber ? "text-2xl" : "text-lg"}`}>
                                    {loading ? <Skeleton className="w-16 h-7" /> : stat.value}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-gray-50">
                            <TableHead className="font-semibold">Employee</TableHead>
                            <TableHead className="font-semibold">Period</TableHead>
                            <TableHead className="font-semibold">Basic Salary</TableHead>
                            <TableHead className="font-semibold">Allowances</TableHead>
                            <TableHead className="font-semibold">Deductions</TableHead>
                            <TableHead className="font-semibold">Net Salary</TableHead>
                            <TableHead className="font-semibold">Status</TableHead>
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
                        ) : payrolls.length > 0 ? (
                            payrolls.map((payroll) => (
                                <TableRow key={payroll.id} className="hover:bg-gray-50">
                                    <TableCell>
                                        <p className="font-medium text-gray-900">{payroll.employee?.name ?? payroll.employee_id}</p>
                                    </TableCell>
                                    <TableCell>
                                        <p className="text-sm text-gray-900">
                                            {new Date(payroll.period_start).toLocaleDateString("id-ID", { day: "numeric", month: "short" })}
                                            {" - "}
                                            {new Date(payroll.period_end).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                                        </p>
                                    </TableCell>
                                    <TableCell><p className="text-sm text-gray-900">{formatCurrency(payroll.basic_salary)}</p></TableCell>
                                    <TableCell><p className="text-sm text-green-700">+{formatCurrency(payroll.allowances)}</p></TableCell>
                                    <TableCell><p className="text-sm text-red-700">-{formatCurrency(payroll.deductions + payroll.tax)}</p></TableCell>
                                    <TableCell><p className="text-sm font-semibold text-gray-900">{formatCurrency(payroll.net_salary)}</p></TableCell>
                                    <TableCell>
                                        <div className={`inline-flex items-center px-3 py-1 rounded-full border text-xs font-medium capitalize ${getStatusColor(payroll.status)}`}>
                                            {payroll.status || "draft"}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="sm"><span className="text-gray-600">&#8942;</span></Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => openEdit(payroll)}>
                                                    <Edit className="w-4 h-4 mr-2" />Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleProcess(payroll.id)}>
                                                    <CreditCard className="w-4 h-4 mr-2" />Process
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleMarkPaid(payroll.id)}>
                                                    <CheckCircle className="w-4 h-4 mr-2" />Mark as Paid
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="text-red-600" onClick={async () => {
                                                    if (!confirm("Delete this payroll record?")) return;
                                                    try { await deletePayroll(payroll.id); refetch(); }
                                                    catch (err) { toast.error(err instanceof Error ? err.message : "Failed to delete payroll."); }
                                                }}>
                                                    <Trash2 className="w-4 h-4 mr-2" />Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={8} className="text-center py-12 text-gray-500">No payroll records found</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">Showing {payrolls.length} of {total} records</p>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</Button>
                    <span className="flex items-center px-3 text-sm text-gray-600">Page {page} of {totalPages}</span>
                    <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>Next</Button>
                </div>
            </div>

            {/* Create Modal */}
            <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
                <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Create Payroll</DialogTitle>
                        <DialogDescription>Generate a new payroll record</DialogDescription>
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
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="pr-start">Period Start *</Label>
                                <Input id="pr-start" type="date" value={createForm.period_start}
                                    onChange={(e) => setCreateForm({ ...createForm, period_start: e.target.value })} />
                            </div>
                            <div>
                                <Label htmlFor="pr-end">Period End *</Label>
                                <Input id="pr-end" type="date" value={createForm.period_end}
                                    onChange={(e) => setCreateForm({ ...createForm, period_end: e.target.value })} />
                            </div>
                        </div>
                        <div>
                            <Label htmlFor="pr-salary">Basic Salary *</Label>
                            <Input id="pr-salary" type="number" placeholder="e.g. 10000000" value={createForm.basic_salary}
                                onChange={(e) => setCreateForm({ ...createForm, basic_salary: e.target.value })} />
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <Label htmlFor="pr-allow">Allowances</Label>
                                <Input id="pr-allow" type="number" placeholder="0" value={createForm.allowances}
                                    onChange={(e) => setCreateForm({ ...createForm, allowances: e.target.value })} />
                            </div>
                            <div>
                                <Label htmlFor="pr-deduct">Deductions</Label>
                                <Input id="pr-deduct" type="number" placeholder="0" value={createForm.deductions}
                                    onChange={(e) => setCreateForm({ ...createForm, deductions: e.target.value })} />
                            </div>
                            <div>
                                <Label htmlFor="pr-tax">Tax</Label>
                                <Input id="pr-tax" type="number" placeholder="0" value={createForm.tax}
                                    onChange={(e) => setCreateForm({ ...createForm, tax: e.target.value })} />
                            </div>
                        </div>
                        {createForm.basic_salary && (
                            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
                                <p className="font-semibold text-blue-900 mb-1">Net Salary Preview</p>
                                <p className="text-lg font-bold text-blue-800">
                                    {formatCurrency(
                                        Number(createForm.basic_salary) + Number(createForm.allowances || 0)
                                        - Number(createForm.deductions || 0) - Number(createForm.tax || 0)
                                    )}
                                </p>
                            </div>
                        )}
                        <div>
                            <Label htmlFor="pr-notes">Notes</Label>
                            <Textarea id="pr-notes" placeholder="Optional notes..." value={createForm.notes}
                                onChange={(e) => setCreateForm({ ...createForm, notes: e.target.value })} rows={2} />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setCreateModalOpen(false)}>Cancel</Button>
                        <Button onClick={handleCreate}
                            disabled={!createForm.employee_id || !createForm.period_start || !createForm.period_end || !createForm.basic_salary || createLoading}
                            className="bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700">
                            {createLoading ? "Creating..." : "Create Payroll"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Modal */}
            <Dialog open={editOpen} onOpenChange={setEditOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Edit Payroll</DialogTitle>
                        <DialogDescription>Update payroll record</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div>
                            <Label htmlFor="edit-salary">Basic Salary</Label>
                            <Input id="edit-salary" type="number" value={editForm.basic_salary}
                                onChange={(e) => setEditForm({ ...editForm, basic_salary: e.target.value })} />
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <Label htmlFor="edit-allow">Allowances</Label>
                                <Input id="edit-allow" type="number" value={editForm.allowances}
                                    onChange={(e) => setEditForm({ ...editForm, allowances: e.target.value })} />
                            </div>
                            <div>
                                <Label htmlFor="edit-deduct">Deductions</Label>
                                <Input id="edit-deduct" type="number" value={editForm.deductions}
                                    onChange={(e) => setEditForm({ ...editForm, deductions: e.target.value })} />
                            </div>
                            <div>
                                <Label htmlFor="edit-tax">Tax</Label>
                                <Input id="edit-tax" type="number" value={editForm.tax}
                                    onChange={(e) => setEditForm({ ...editForm, tax: e.target.value })} />
                            </div>
                        </div>
                        {editForm.basic_salary && (
                            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
                                <p className="font-semibold text-blue-900 mb-1">Net Salary Preview</p>
                                <p className="text-lg font-bold text-blue-800">
                                    {formatCurrency(
                                        Number(editForm.basic_salary) + Number(editForm.allowances || 0)
                                        - Number(editForm.deductions || 0) - Number(editForm.tax || 0)
                                    )}
                                </p>
                            </div>
                        )}
                        <div>
                            <Label htmlFor="edit-notes">Notes</Label>
                            <Textarea id="edit-notes" value={editForm.notes} rows={2}
                                onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })} />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setEditOpen(false)}>Cancel</Button>
                        <Button onClick={handleEdit} disabled={!editForm.basic_salary || editLoading}
                            className="bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700">
                            {editLoading ? "Saving..." : "Save Changes"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
