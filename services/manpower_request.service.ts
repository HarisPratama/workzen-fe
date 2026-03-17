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
        throw new Error("Failed to get manpower-requests.");
    }

    return resp.json();
}

export async function getDetailManpowerRequest(id: string) {
    const resp = await apiFetch(`manpower-requests/${id}`, {
        method: "GET",
        credentials: "include",
    })

    if (!resp.ok) {
        throw new Error("Failed to get manpower-requests.");
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
        throw new Error("Failed to create manpower-requests.");
    }

    return resp.json();
}
