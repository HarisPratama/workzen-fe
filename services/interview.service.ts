import {apiFetch} from "@/lib/api";

type GetInterviewsParams = {
    limit?: number;
    page?: number;
    search?: string;
    status?: string;
    order_by?: string;
    order_type?: string;
};

export async function getInterviews(data: GetInterviewsParams = {}) {
    const {
        limit = 10,
        page = 1,
        search = "",
        status = "",
        order_by = "",
        order_type = "",
    } = data;

    const params = new URLSearchParams();
    params.set("limit", String(limit));
    params.set("page", String(page));
    if (search) params.set("search", search);
    if (status) params.set("status", status);
    if (order_by) params.set("order_by", order_by);
    if (order_type) params.set("order_type", order_type);

    const resp = await apiFetch(`interviews?${params.toString()}`, {
        method: "GET",
    });

    if (!resp.ok) {
        const err = await resp.json().catch(() => null);
        throw new Error(err?.meta?.message || "Failed to get interviews.");
    }

    return resp.json();
}

export async function getDetailInterview(id: string) {
    const resp = await apiFetch(`interviews/${id}`, {
        method: "GET",
    });

    if (!resp.ok) {
        const err = await resp.json().catch(() => null);
        throw new Error(err?.meta?.message || "Failed to get interview detail.");
    }

    return resp.json();
}

export type CreateInterviewPayload = {
    candidate_application_id: number;
    manpower_request_id?: number;
    interviewer_id: number;
    interview_type?: string;
    scheduled_at: string;
    duration_minutes: number;
    type: "phone" | "video" | "in-person" | "technical" | "hr" | "final";
    location?: string;
    meeting_link?: string;
};

export async function createInterview(payload: CreateInterviewPayload) {
    const resp = await apiFetch(`interviews`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });

    if (!resp.ok) {
        const err = await resp.json().catch(() => null);
        throw new Error(err?.meta?.message || "Failed to create interview.");
    }

    return resp.json();
}

export type UpdateInterviewPayload = {
    scheduled_at?: string;
    duration_minutes?: number;
    type?: string;
    location?: string;
    meeting_link?: string;
};

export async function updateInterview(
    id: string,
    payload: UpdateInterviewPayload
) {
    const resp = await apiFetch(`interviews/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });

    if (!resp.ok) {
        const err = await resp.json().catch(() => null);
        throw new Error(err?.meta?.message || "Failed to update interview.");
    }

    return resp.json();
}

export async function deleteInterview(id: string) {
    const resp = await apiFetch(`interviews/${id}`, {
        method: "DELETE",
    });

    if (!resp.ok) {
        const err = await resp.json().catch(() => null);
        throw new Error(err?.meta?.message || "Failed to delete interview.");
    }

    return resp.json();
}
