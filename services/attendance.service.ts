import { apiFetch } from "@/lib/api";

type GetAttendancesParams = {
    limit?: number;
    page?: number;
    status?: string;
    start_date?: string;
    end_date?: string;
};

export async function getAttendances(data: GetAttendancesParams = {}) {
    const { limit = 10, page = 1, status = "", start_date = "", end_date = "" } = data;

    const params = new URLSearchParams();
    params.set("limit", String(limit));
    params.set("page", String(page));
    if (status) params.set("status", status);
    if (start_date) params.set("start_date", start_date);
    if (end_date) params.set("end_date", end_date);

    const resp = await apiFetch(`attendances?${params.toString()}`, {
        method: "GET",
    });

    if (!resp.ok) {
        const err = await resp.json().catch(() => null);
        throw new Error(err?.meta?.message || "Failed to get attendances.");
    }

    return resp.json();
}

export async function getDetailAttendance(id: string) {
    const resp = await apiFetch(`attendances/${id}`, { method: "GET" });
    if (!resp.ok) { const err = await resp.json().catch(() => null); throw new Error(err?.meta?.message || "Failed to get attendance detail."); }
    return resp.json();
}

export async function getAttendancesByEmployee(employeeId: string, params?: { page?: number; limit?: number }) {
    const query = new URLSearchParams();
    if (params?.page) query.set("page", String(params.page));
    if (params?.limit) query.set("limit", String(params.limit));

    const resp = await apiFetch(`attendances/employee/${employeeId}?${query.toString()}`, { method: "GET" });
    if (!resp.ok) { const err = await resp.json().catch(() => null); throw new Error(err?.meta?.message || "Failed to get employee attendances."); }
    return resp.json();
}

export async function getTodayAttendance(employeeId: string) {
    const resp = await apiFetch(`attendances/today/${employeeId}`, { method: "GET" });
    if (!resp.ok) { const err = await resp.json().catch(() => null); throw new Error(err?.meta?.message || "Failed to get today's attendance."); }
    return resp.json();
}

export type CreateAttendancePayload = {
    employee_id: string;
    date: string;
    type: "regular" | "overtime" | "weekend" | "holiday";
    status: "present" | "absent" | "leave" | "holiday";
    check_in?: string;
    check_out?: string;
    notes?: string;
};

export async function createAttendance(payload: CreateAttendancePayload) {
    const resp = await apiFetch(`attendances`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });

    if (!resp.ok) { const err = await resp.json().catch(() => null); throw new Error(err?.meta?.message || "Failed to create attendance."); }
    return resp.json();
}

export type UpdateAttendancePayload = {
    status?: string;
    check_in?: string;
    check_out?: string;
    notes?: string;
};

export async function updateAttendance(id: string, payload: UpdateAttendancePayload) {
    const resp = await apiFetch(`attendances/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });

    if (!resp.ok) { const err = await resp.json().catch(() => null); throw new Error(err?.meta?.message || "Failed to update attendance."); }
    return resp.json();
}

export async function deleteAttendance(id: string) {
    const resp = await apiFetch(`attendances/${id}`, { method: "DELETE" });
    if (!resp.ok) { const err = await resp.json().catch(() => null); throw new Error(err?.meta?.message || "Failed to delete attendance."); }
    return resp.json();
}

export async function checkIn(attendanceId: string, payload?: { check_in_time?: string; location?: string }) {
    const resp = await apiFetch(`attendances/${attendanceId}/check-in`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload ?? {}),
    });

    if (!resp.ok) { const err = await resp.json().catch(() => null); throw new Error(err?.meta?.message || "Failed to check in."); }
    return resp.json();
}

export async function checkOut(attendanceId: string, payload?: { check_out_time?: string }) {
    const resp = await apiFetch(`attendances/${attendanceId}/check-out`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload ?? {}),
    });

    if (!resp.ok) { const err = await resp.json().catch(() => null); throw new Error(err?.meta?.message || "Failed to check out."); }
    return resp.json();
}
