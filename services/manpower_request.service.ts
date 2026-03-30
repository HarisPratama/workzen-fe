import {apiFetch} from "@/lib/api";
import {CreateManpowerRequest} from "@/const/type/request/manpower-request.type";

type GetManpowerRequestParams = {
    limit?: number;
    page?: number;
    search?: string;
    orderBy?: string;
    orderType?: string;
};

export async function getManpowerRequest(
    data: GetManpowerRequestParams = {}
) {

    const {
        limit = 10,
        page = 1,
        search = "",
        orderBy = "",
        orderType = "",
    } = data;

    const params = new URLSearchParams({
        limit: String(limit),
        page: String(page),
        search,
        orderBy,
        orderType,
    });

    const resp = await apiFetch(`manpower-requests?${params.toString()}`, {
        method: "GET",
        credentials: "include",
    });

    if (!resp.ok) {
        const err = await resp.json().catch(() => null);
        throw new Error(err?.meta?.message || "Failed to get manpower-requests.");
    }

    return resp.json();
}

export async function getDetailManpowerRequest(id: string) {
    const resp = await apiFetch(`manpower-requests/${id}`, {
        method: "GET",
        credentials: "include",
    })

    if (!resp.ok) {
        const err = await resp.json().catch(() => null);
        throw new Error(err?.meta?.message || "Failed to get manpower-requests.");
    }

    return resp.json();
}

export async function createManpowerRequest(
    payload: CreateManpowerRequest
) {

    const resp = await apiFetch(`manpower-requests`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify(payload),
    });

    if (!resp.ok) {
        const err = await resp.json().catch(() => null);
        throw new Error(err?.message || err?.meta?.message || "Failed to create manpower-requests.");
    }

    return resp.json();
}

export type UpdateManpowerRequestPayload = {
    client_id?: number;
    position?: string;
    required_count?: number;
    salary_min?: number;
    salary_max?: number;
    work_location?: string;
    job_description?: string;
    deadline_date?: string;
};

export async function updateManpowerRequest(id: string, payload: UpdateManpowerRequestPayload) {
    const resp = await apiFetch(`manpower-requests/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });

    if (!resp.ok) {
        const err = await resp.json().catch(() => null);
        throw new Error(err?.meta?.message || "Failed to update manpower request.");
    }

    return resp.json();
}

export async function deleteManpowerRequest(id: string) {
    const resp = await apiFetch(`manpower-requests/${id}`, {
        method: "DELETE",
    });

    if (!resp.ok) {
        const err = await resp.json().catch(() => null);
        throw new Error(err?.meta?.message || "Failed to delete manpower request.");
    }

    return resp.json();
}
