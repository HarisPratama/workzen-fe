import { apiFetch } from "@/lib/api";

type GetAssignmentsParams = {
    limit?: number;
    page?: number;
    search?: string;
    status?: string;
};

export async function getAssignments(data: GetAssignmentsParams = {}) {
    const { limit = 10, page = 1, search = "", status = "" } = data;

    const params = new URLSearchParams();
    params.set("limit", String(limit));
    params.set("page", String(page));
    if (search) params.set("search", search);
    if (status) params.set("status", status);

    const resp = await apiFetch(`assignments?${params.toString()}`, { method: "GET" });
    if (!resp.ok) { const err = await resp.json().catch(() => null); throw new Error(err?.meta?.message || "Failed to get assignments."); }
    return resp.json();
}

export async function getDetailAssignment(id: string) {
    const resp = await apiFetch(`assignments/${id}`, { method: "GET" });
    if (!resp.ok) { const err = await resp.json().catch(() => null); throw new Error(err?.meta?.message || "Failed to get assignment detail."); }
    return resp.json();
}

export type CreateAssignmentPayload = {
    employee_id: number;
    assignment_type: string;
    start_date: string;
    client_id?: number;
    project_id?: number;
    department_id?: number;
    end_date?: string;
    expected_end_date?: string;
    role?: string;
    position?: string;
    location?: string;
    remote_type?: "onsite" | "remote" | "hybrid";
    billing_rate?: number;
    cost_rate?: number;
    currency?: string;
    hours_per_week?: number;
    notes?: string;
};

export async function createAssignment(payload: CreateAssignmentPayload) {
    const resp = await apiFetch(`assignments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });

    if (!resp.ok) { const err = await resp.json().catch(() => null); throw new Error(err?.meta?.message || "Failed to create assignment."); }
    return resp.json();
}

export type UpdateAssignmentPayload = {
    status?: "active" | "completed" | "cancelled";
    end_date?: string;
    notes?: string;
    termination_reason?: string;
};

export async function updateAssignment(id: string, payload: UpdateAssignmentPayload) {
    const resp = await apiFetch(`assignments/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });

    if (!resp.ok) { const err = await resp.json().catch(() => null); throw new Error(err?.meta?.message || "Failed to update assignment."); }
    return resp.json();
}

export async function deleteAssignment(id: string) {
    const resp = await apiFetch(`assignments/${id}`, { method: "DELETE" });
    if (!resp.ok) { const err = await resp.json().catch(() => null); throw new Error(err?.meta?.message || "Failed to delete assignment."); }
    return resp.json();
}
