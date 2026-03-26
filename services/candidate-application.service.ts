import {apiFetch} from "@/lib/api";

export type CreateCandidateApplicationPayload = {
    candidate_id: number;
    manpower_request_id: number;
};

export async function createCandidateApplication(
    payload: CreateCandidateApplicationPayload
) {
    const resp = await apiFetch(`candidate-application`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });

    if (!resp.ok) {
        throw new Error("Failed to create candidate application.");
    }

    return resp.json();
}

export async function getCandidatesForManpowerRequest(manpowerRequestId: string) {
    const resp = await apiFetch(
        `manpower_requests/${manpowerRequestId}/candidates`,
        {
            method: "GET",
        }
    );

    if (!resp.ok) {
        throw new Error("Failed to get candidates for manpower request.");
    }

    return resp.json();
}
