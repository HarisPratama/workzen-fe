const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function loginApi(data: {
    email: string;
    password: string;
}) {
    const res = await fetch(`${BASE_URL}/v1/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
    });

    if (!res.ok) {
        const err = await res.json().catch(() => null);
        const message = err?.meta?.message || err?.message;

        if (res.status === 400) {
            throw new Error(message || "Email and password are required.");
        }
        if (res.status === 401) {
            throw new Error(message || "Invalid email or password.");
        }
        if (res.status === 404) {
            throw new Error(message || "Account not found. Please check your email.");
        }
        if (res.status === 403) {
            throw new Error(message || "Your account has been suspended. Please contact support.");
        }
        if (res.status === 429) {
            throw new Error("Too many login attempts. Please try again later.");
        }
        if (res.status >= 500) {
            throw new Error("Server is currently unavailable. Please try again later.");
        }

        throw new Error(message || "Login failed. Please try again.");
    }

    return res.json();
}

export async function logout() {
    const res = await fetch(`${BASE_URL}/v1/auth/logout`, {
        method: "POST",
        credentials: "include",
    });

    if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(err?.meta?.message || "Logout failed.");
    }

    return res.json();
}
