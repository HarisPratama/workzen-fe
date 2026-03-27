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
        throw new Error(error?.meta?.message || "Failed to register tenant.");
    }

    return resp.json();
}
