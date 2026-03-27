import { apiFetch } from "@/lib/api";

type GetEmployeesParams = {
    limit?: number;
    page?: number;
    search?: string;
};

export async function getEmployees(data: GetEmployeesParams = {}) {
    const { limit = 10, page = 1, search = "" } = data;

    const params = new URLSearchParams({
        limit: String(limit),
        page: String(page),
        search,
    });

    const resp = await apiFetch(`employees?${params.toString()}`, {
        method: "GET",
    });

    if (!resp.ok) {
        const err = await resp.json().catch(() => null);
        throw new Error(err?.meta?.message || "Failed to get employees.");
    }

    return resp.json();
}

export type CreateEmployeePayload = {
    name: string;
    citizen_id: string;
    phone_number: string;
};

export async function getDetailEmployee(id: string) {
    const resp = await apiFetch(`employees/${id}`, { method: "GET" });
    if (!resp.ok) { const err = await resp.json().catch(() => null); throw new Error(err?.meta?.message || "Failed to get employee detail."); }
    return resp.json();
}

export type UpdateEmployeePayload = {
    name?: string;
    citizen_id?: string;
    phone_number?: string;
};

export async function updateEmployee(id: string, payload: UpdateEmployeePayload) {
    const resp = await apiFetch(`employees/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    if (!resp.ok) { const err = await resp.json().catch(() => null); throw new Error(err?.meta?.message || "Failed to update employee."); }
    return resp.json();
}

export async function deleteEmployee(id: string) {
    const resp = await apiFetch(`employees/${id}`, { method: "DELETE" });
    if (!resp.ok) { const err = await resp.json().catch(() => null); throw new Error(err?.meta?.message || "Failed to delete employee."); }
    return resp.json();
}

export async function createEmployee(payload: CreateEmployeePayload) {
    const resp = await apiFetch(`employees`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });

    if (!resp.ok) {
        const err = await resp.json().catch(() => null);
        throw new Error(err?.meta?.message || "Failed to create employee.");
    }

    return resp.json();
}
