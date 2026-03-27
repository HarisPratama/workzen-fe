import {apiFetch} from "@/lib/api";

type GetClientsParams = {
    limit?: number;
    page?: number;
    search?: string;
};

export async function getListClient(data: GetClientsParams = {}) {
    const { limit = 10, page = 1, search = "" } = data;

    const params = new URLSearchParams();
    params.set("limit", String(limit));
    params.set("page", String(page));
    if (search) params.set("search", search);

    const resp = await apiFetch(`clients?${params.toString()}`, {
        method: "GET",
    });

    if (!resp.ok) {
        throw new Error("Failed to get list of clients.");
    }

    return resp.json();
}

export async function getDetailClient(id: string) {
    const resp = await apiFetch(`clients/${id}`, {
        method: "GET",
    });

    if (!resp.ok) {
        throw new Error("Failed to get client detail.");
    }

    return resp.json();
}

export type CreateClientPayload = {
    company_name: string;
    address: string;
};

export async function createClient(payload: CreateClientPayload) {
    const resp = await apiFetch(`clients`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });

    if (!resp.ok) {
        throw new Error("Failed to create client.");
    }

    return resp.json();
}

export type UpdateClientPayload = {
    company_name?: string;
    address?: string;
};

export async function updateClient(id: string, payload: UpdateClientPayload) {
    const resp = await apiFetch(`clients/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });

    if (!resp.ok) {
        throw new Error("Failed to update client.");
    }

    return resp.json();
}

export async function deleteClient(id: string) {
    const resp = await apiFetch(`clients/${id}`, {
        method: "DELETE",
    });

    if (!resp.ok) {
        throw new Error("Failed to delete client.");
    }

    return resp.json();
}