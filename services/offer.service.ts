import {apiFetch} from "@/lib/api";

type GetOffersParams = {
    limit?: number;
    page?: number;
    search?: string;
    status?: string;
    order_by?: string;
    order_type?: string;
};

export async function getOffers(data: GetOffersParams = {}) {
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

    const resp = await apiFetch(`offers?${params.toString()}`, {
        method: "GET",
    });

    if (!resp.ok) {
        const err = await resp.json().catch(() => null);
        throw new Error(err?.meta?.message || "Failed to get offers.");
    }

    return resp.json();
}

export async function getDetailOffer(id: string) {
    const resp = await apiFetch(`offers/${id}`, {
        method: "GET",
    });

    if (!resp.ok) {
        const err = await resp.json().catch(() => null);
        throw new Error(err?.meta?.message || "Failed to get offer detail.");
    }

    return resp.json();
}

export type CreateOfferPayload = {
    candidate_application_id: number;
    position: string;
    base_salary: number;
    department?: string;
    employment_type?: "full_time" | "part_time" | "contract" | "freelance" | "internship";
    currency?: string;
    bonus?: number;
    benefits?: string;
    probation_period_months?: number;
    notice_period_days?: number;
    start_date?: string;
    expiry_date?: string;
};

export async function createOffer(payload: CreateOfferPayload) {
    const resp = await apiFetch(`offers`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });

    if (!resp.ok) {
        const err = await resp.json().catch(() => null);
        throw new Error(err?.meta?.message || "Failed to create offer.");
    }

    return resp.json();
}

export type UpdateOfferPayload = {
    status?: "draft" | "sent" | "accepted" | "rejected" | "withdrawn";
    feedback?: string;
    negotiated_salary?: number;
    start_date?: string;
};

export async function updateOffer(id: string, payload: UpdateOfferPayload) {
    const resp = await apiFetch(`offers/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });

    if (!resp.ok) {
        const err = await resp.json().catch(() => null);
        throw new Error(err?.meta?.message || "Failed to update offer.");
    }

    return resp.json();
}

export async function deleteOffer(id: string) {
    const resp = await apiFetch(`offers/${id}`, {
        method: "DELETE",
    });

    if (!resp.ok) {
        const err = await resp.json().catch(() => null);
        throw new Error(err?.meta?.message || "Failed to delete offer.");
    }

    return resp.json();
}
