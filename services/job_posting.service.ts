const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getJobPosting(token: string) {
    const resp = await fetch(`${API_URL}/fe/job-postings/${token}`, {
        method: "GET",
    });

    if (!resp.ok) {
        const err = await resp.json().catch(() => null);
        throw new Error(err?.meta?.message || "Failed to load job posting.");
    }

    return resp.json();
}

export async function applyToJob(token: string, formData: FormData) {
    const resp = await fetch(`${API_URL}/fe/job-postings/${token}/apply`, {
        method: "POST",
        body: formData,
    });

    const data = await resp.json();
    return data;
}
