import { apiFetch } from "@/lib/api";

type GetPayrollsParams = {
    limit?: number;
    page?: number;
};

export async function getPayrolls(data: GetPayrollsParams = {}) {
    const { limit = 10, page = 1 } = data;

    const params = new URLSearchParams({
        limit: String(limit),
        page: String(page),
    });

    const resp = await apiFetch(`payrolls?${params.toString()}`, { method: "GET" });
    if (!resp.ok) { const err = await resp.json().catch(() => null); throw new Error(err?.meta?.message || "Failed to get payrolls."); }
    return resp.json();
}

export async function getDetailPayroll(id: string) {
    const resp = await apiFetch(`payrolls/${id}`, { method: "GET" });
    if (!resp.ok) { const err = await resp.json().catch(() => null); throw new Error(err?.meta?.message || "Failed to get payroll detail."); }
    return resp.json();
}

export async function getPayrollsByEmployee(employeeId: string, params?: { page?: number; limit?: number }) {
    const query = new URLSearchParams();
    if (params?.page) query.set("page", String(params.page));
    if (params?.limit) query.set("limit", String(params.limit));

    const resp = await apiFetch(`payrolls/employee/${employeeId}?${query.toString()}`, { method: "GET" });
    if (!resp.ok) { const err = await resp.json().catch(() => null); throw new Error(err?.meta?.message || "Failed to get employee payrolls."); }
    return resp.json();
}

export type CreatePayrollPayload = {
    employee_id: string;
    period_start: string;
    period_end: string;
    basic_salary: number;
    allowances?: number;
    deductions?: number;
    tax?: number;
    net_salary?: number;
    notes?: string;
};

export async function createPayroll(payload: CreatePayrollPayload) {
    const resp = await apiFetch(`payrolls`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });

    if (!resp.ok) { const err = await resp.json().catch(() => null); throw new Error(err?.meta?.message || "Failed to create payroll."); }
    return resp.json();
}

export type UpdatePayrollPayload = {
    basic_salary?: number;
    allowances?: number;
    deductions?: number;
    tax?: number;
    net_salary?: number;
    notes?: string;
};

export async function updatePayroll(id: string, payload: UpdatePayrollPayload) {
    const resp = await apiFetch(`payrolls/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });

    if (!resp.ok) { const err = await resp.json().catch(() => null); throw new Error(err?.meta?.message || "Failed to update payroll."); }
    return resp.json();
}

export async function deletePayroll(id: string) {
    const resp = await apiFetch(`payrolls/${id}`, { method: "DELETE" });
    if (!resp.ok) { const err = await resp.json().catch(() => null); throw new Error(err?.meta?.message || "Failed to delete payroll."); }
    return resp.json();
}

export async function processPayroll(id: string) {
    const resp = await apiFetch(`payrolls/${id}/process`, { method: "POST" });
    if (!resp.ok) { const err = await resp.json().catch(() => null); throw new Error(err?.meta?.message || "Failed to process payroll."); }
    return resp.json();
}

export async function markPayrollAsPaid(id: string, payload: { payment_date: string; payment_method: string; transaction_id?: string }) {
    const resp = await apiFetch(`payrolls/${id}/mark-as-paid`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });

    if (!resp.ok) { const err = await resp.json().catch(() => null); throw new Error(err?.meta?.message || "Failed to mark payroll as paid."); }
    return resp.json();
}
