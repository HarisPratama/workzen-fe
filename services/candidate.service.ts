import {apiFetch} from "@/lib/api";

type GetCandidatesParams = {
    limit?: number;
    page?: number;
    search?: string;
};

export async function getCandidates(data: GetCandidatesParams = {}) {
    const {limit = 10, page = 1, search = ""} = data;

    const params = new URLSearchParams({
        limit: String(limit),
        page: String(page),
        search,
    });

    const resp = await apiFetch(`candidates?${params.toString()}`, {
        method: "GET",
    });

    if (!resp.ok) {
        throw new Error("Failed to get candidates.");
    }

    return resp.json();
}

export async function getDetailCandidate(id: string) {
    const resp = await apiFetch(`candidates/${id}`, {
        method: "GET",
    });

    if (!resp.ok) {
        throw new Error("Failed to get candidate detail.");
    }

    return resp.json();
}

export type CreateCandidatePayload = {
    full_name: string;
    email: string;
    phone: string;
    birth_date: string;
    address: string;
    source: string;
    citizen_id?: string;
    status?: string;
};

export async function createCandidate(payload: CreateCandidatePayload) {
    const resp = await apiFetch(`candidates`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });

    if (!resp.ok) {
        throw new Error("Failed to create candidate.");
    }

    return resp.json();
}

export type UpdateCandidatePayload = {
    full_name?: string;
    email?: string;
    phone?: string;
    birth_date?: string;
    address?: string;
    source?: string;
    citizen_id?: string;
    status?: string;
};

export async function updateCandidate(id: string, payload: UpdateCandidatePayload) {
    const resp = await apiFetch(`candidates/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });

    if (!resp.ok) {
        throw new Error("Failed to update candidate.");
    }

    return resp.json();
}

export async function deleteCandidate(id: string) {
    const resp = await apiFetch(`candidates/${id}`, {
        method: "DELETE",
    });

    if (!resp.ok) {
        throw new Error("Failed to delete candidate.");
    }

    return resp.json();
}
