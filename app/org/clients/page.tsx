"use client"
import { toast } from "sonner";
import { Plus, Search, Building2, Edit, Trash2, Eye, MapPin } from "lucide-react";
import { useState } from "react";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/app/_components/ui/table";
import { Button } from "@/app/_components/ui/button";
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/app/_components/ui/dropdown-menu";
import { Input } from "@/app/_components/ui/input";
import { Label } from "@/app/_components/ui/label";
import { Skeleton } from "@/app/_components/ui/skeleton";
import {
    Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/app/_components/ui/dialog";
import { getListClient, createClient, updateClient, deleteClient } from "@/services/client.service";
import { useFetch } from "@/hooks/use-fetch";

interface Client {
    id: number;
    company_name: string;
    address: string;
    status: string;
    created_at: string;
}

export default function ClientsPage() {
    const [page, setPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const [createOpen, setCreateOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [createLoading, setCreateLoading] = useState(false);
    const [editLoading, setEditLoading] = useState(false);
    const [editingClient, setEditingClient] = useState<Client | null>(null);
    const [createForm, setCreateForm] = useState({ company_name: "", address: "" });
    const [editForm, setEditForm] = useState({ company_name: "", address: "" });

    const { data, loading, refetch } = useFetch(
        () => getListClient({ page, limit: 10, search: searchQuery }),
        [page, searchQuery],
        { debounceMs: searchQuery ? 400 : 0 }
    );

    const clients: Client[] = data?.data ?? [];
    const totalPages = data?.pagination?.total_pages ?? 1;
    const total = data?.pagination?.total ?? 0;

    const handleCreate = async () => {
        setCreateLoading(true);
        try {
            await createClient(createForm);
            setCreateOpen(false);
            setCreateForm({ company_name: "", address: "" });
            refetch();
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Failed to create client.");
        } finally {
            setCreateLoading(false);
        }
    };

    const openEdit = (client: Client) => {
        setEditingClient(client);
        setEditForm({ company_name: client.company_name, address: client.address });
        setEditOpen(true);
    };

    const handleEdit = async () => {
        if (!editingClient) return;
        setEditLoading(true);
        try {
            await updateClient(String(editingClient.id), editForm);
            setEditOpen(false);
            setEditingClient(null);
            refetch();
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Failed to update client.");
        } finally {
            setEditLoading(false);
        }
    };

    const handleDelete = async (client: Client) => {
        if (!confirm(`Delete client "${client.company_name}"?`)) return;
        try {
            await deleteClient(String(client.id));
            refetch();
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Failed to delete client.");
        }
    };

    return (
        <div className="px-8 py-8 space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900">Clients</h2>
                    <p className="text-sm text-gray-600 mt-1">Manage your client companies</p>
                </div>
                <button
                    onClick={() => setCreateOpen(true)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-pink-600 to-rose-600 text-white rounded-lg hover:from-pink-700 hover:to-rose-700 transition-all font-medium shadow-sm"
                >
                    <Plus className="w-4 h-4" />
                    Add Client
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-pink-50 rounded-lg">
                            <Building2 className="w-5 h-5 text-pink-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Total Clients</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {loading ? <Skeleton className="w-8 h-7" /> : total}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-green-50 rounded-lg">
                            <Building2 className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Active</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {loading ? <Skeleton className="w-8 h-7" /> : clients.filter(c => c.status === "active").length}
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
                        placeholder="Search clients..."
                        value={searchQuery}
                        onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
                        className="pl-10"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-gray-50">
                            <TableHead className="font-semibold">Company Name</TableHead>
                            <TableHead className="font-semibold">Address</TableHead>
                            <TableHead className="font-semibold">Status</TableHead>
                            <TableHead className="font-semibold">Created</TableHead>
                            <TableHead className="font-semibold text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <TableRow key={i}>
                                    {Array.from({ length: 5 }).map((_, j) => (
                                        <TableCell key={j}><Skeleton className="w-24 h-5" /></TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : clients.length > 0 ? (
                            clients.map((client) => (
                                <TableRow key={client.id} className="hover:bg-gray-50">
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Building2 className="w-4 h-4 text-gray-400" />
                                            <p className="font-medium text-gray-900">{client.company_name}</p>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <p className="text-sm text-gray-900 flex items-center gap-1">
                                            <MapPin className="w-3 h-3 text-gray-400" />
                                            {client.address || "-"}
                                        </p>
                                    </TableCell>
                                    <TableCell>
                                        <div className={`inline-flex items-center px-3 py-1 rounded-full border text-xs font-medium capitalize ${
                                            client.status === "active" ? "bg-green-50 text-green-700 border-green-200" : "bg-gray-50 text-gray-700 border-gray-200"
                                        }`}>
                                            {client.status || "active"}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <p className="text-sm text-gray-900">
                                            {client.created_at
                                                ? new Date(client.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })
                                                : "-"}
                                        </p>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="sm"><span className="text-gray-600">&#8942;</span></Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => openEdit(client)}>
                                                    <Edit className="w-4 h-4 mr-2" />Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(client)}>
                                                    <Trash2 className="w-4 h-4 mr-2" />Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-12 text-gray-500">No clients found</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">Showing {clients.length} of {total} clients</p>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</Button>
                    <span className="flex items-center px-3 text-sm text-gray-600">Page {page} of {totalPages}</span>
                    <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>Next</Button>
                </div>
            </div>

            {/* Create Modal */}
            <Dialog open={createOpen} onOpenChange={setCreateOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Add Client</DialogTitle>
                        <DialogDescription>Add a new client company</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div>
                            <Label htmlFor="create-name">Company Name *</Label>
                            <Input id="create-name" placeholder="e.g. PT Maju Jaya" value={createForm.company_name}
                                onChange={(e) => setCreateForm({ ...createForm, company_name: e.target.value })} />
                        </div>
                        <div>
                            <Label htmlFor="create-address">Address *</Label>
                            <Input id="create-address" placeholder="e.g. Jakarta, Indonesia" value={createForm.address}
                                onChange={(e) => setCreateForm({ ...createForm, address: e.target.value })} />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
                        <Button onClick={handleCreate}
                            disabled={!createForm.company_name || !createForm.address || createLoading}
                            className="bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700">
                            {createLoading ? "Creating..." : "Add Client"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Modal */}
            <Dialog open={editOpen} onOpenChange={setEditOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Edit Client</DialogTitle>
                        <DialogDescription>Update client information</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div>
                            <Label htmlFor="edit-name">Company Name *</Label>
                            <Input id="edit-name" value={editForm.company_name}
                                onChange={(e) => setEditForm({ ...editForm, company_name: e.target.value })} />
                        </div>
                        <div>
                            <Label htmlFor="edit-address">Address *</Label>
                            <Input id="edit-address" value={editForm.address}
                                onChange={(e) => setEditForm({ ...editForm, address: e.target.value })} />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setEditOpen(false)}>Cancel</Button>
                        <Button onClick={handleEdit}
                            disabled={!editForm.company_name || !editForm.address || editLoading}
                            className="bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700">
                            {editLoading ? "Saving..." : "Save Changes"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
