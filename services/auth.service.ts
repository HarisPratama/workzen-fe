import {apiFetch} from "@/lib/api";

export async function loginApi(data: {
    email: string;
    password: string;
}) {
    const res = await apiFetch(`auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    if (!res.ok) {
        throw new Error("Login failed");
    }

    return res.json();
}

export async function logout() {
    const res = await apiFetch("auth/logout", {
        method: "POST",
    });

    if (!res.ok) {
        throw new Error("Logout failed");
    }

    return res.json();
}