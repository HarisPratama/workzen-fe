const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export type RegisterTenantPayload = {
    company_name: string;
    company_address: string;
    plan: "BASIC" | "PRO" | "ENTERPRISE";
    admin_name: string;
    admin_email: string;
    password: string;
};

export async function registerTenant(payload: RegisterTenantPayload) {
    const resp = await fetch(`${BASE_URL}/fe/tenants/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });

    if (!resp.ok) {
        const error = await resp.json().catch(() => null);
        const message = error?.meta?.message || error?.message;

        if (resp.status === 400) {
            throw new Error(message || "Please fill in all required fields.");
        }
        if (resp.status === 409) {
            throw new Error(message || "An account with this email already exists.");
        }
        if (resp.status === 422) {
            throw new Error(message || "Invalid data. Please check your input.");
        }
        if (resp.status === 429) {
            throw new Error("Too many requests. Please try again later.");
        }
        if (resp.status >= 500) {
            throw new Error("Server is currently unavailable. Please try again later.");
        }

        throw new Error(message || "Registration failed. Please try again.");
    }

    return resp.json();
}
