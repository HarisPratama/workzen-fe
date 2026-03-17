
export async function apiFetch(endpoint: string, options?: RequestInit) {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/v1/${endpoint}`
    let res = await fetch(url, {
        ...options,
        credentials: "include",
    })

    if (res.status === 401) {

        // coba refresh token
        const refresh = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/auth/refresh`, {
            method: "POST",
            headers: {
                ...options?.headers
            },
            credentials: "include"
        })

        console.log(options, "=====", refresh)
        const data = await refresh.json()
        console.log(data, '<<< data')

        if (refresh.ok) {
            res = await fetch(url, {
                ...options,
                credentials: "include",
            })
        } else {
            throw new Error("UNAUTHORIZED");
        }
    }

    return res
}
