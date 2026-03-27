import { apiFetch } from "@/lib/api";

export interface OverviewData {
    total_employees: number;
    total_clients: number;
    total_candidates: number;
    total_manpower_requests: number;
    total_candidate_applications: number;
    total_interviews: number;
    total_offers: number;
    total_assignments: number;
}

export async function getOverview(): Promise<{ data: OverviewData }> {
    const resp = await apiFetch("overview", {
        method: "GET",
    });

    if (!resp.ok) {
        const err = await resp.json().catch(() => null);
        throw new Error(err?.meta?.message || "Failed to get overview data.");
    }

    return resp.json();
}
