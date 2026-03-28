import { toast } from "sonner";

export async function apiFetch(endpoint: string, options?: RequestInit) {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/v1/${endpoint}`
    let res = await fetch(url, {
        ...options,
        credentials: "include",
    })

    if (res.status === 401) {
        // try refresh token
        const refresh = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/auth/refresh`, {
            method: "POST",
            credentials: "include"
        })

        if (refresh.ok) {
            res = await fetch(url, {
                ...options,
                credentials: "include",
            })
        } else {
            // session expired — notify and redirect
            if (typeof window !== "undefined") {
                toast.error("Session expired. Please login again.");
                setTimeout(() => {
                    window.location.href = "/login";
                }, 1500);
            }
            throw new Error("Session expired. Please login again.");
        }
    }

    return res
}
