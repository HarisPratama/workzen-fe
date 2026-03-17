import {apiFetch} from "@/lib/api";

export async function getListClient() {

    const resp = await apiFetch(`clients`, {
        method: "GET",
        credentials: "include",
    });

    if (!resp.ok) {
        throw new Error("Failed to get list of clients.");
    }

    return resp.json();
}