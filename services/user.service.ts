import { apiFetch } from "@/lib/api";

export async function getUserProfile() {
    const resp = await apiFetch(`admin/users/profile`, { method: "GET" });
    if (!resp.ok) { const err = await resp.json().catch(() => null); throw new Error(err?.meta?.message || "Failed to get user profile."); }
    return resp.json();
}

export type UpdatePasswordPayload = {
    current_password: string;
    new_password: string;
    confirm_password: string;
};

export async function updatePassword(payload: UpdatePasswordPayload) {
    const resp = await apiFetch(`admin/users/update-password`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });

    if (!resp.ok) { const err = await resp.json().catch(() => null); throw new Error(err?.meta?.message || "Failed to update password."); }
    return resp.json();
}
