import { apiFetch } from "@/lib/api";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// Public endpoints (no auth)

export interface SubscriptionPlan {
    id: number;
    name: string;
    price: number;
    duration_days: number;
    max_employees: number;
    description: string;
}

export async function getSubscriptionPlans(): Promise<{ data: SubscriptionPlan[] }> {
    const resp = await fetch(`${BASE_URL}/fe/subscription-plans`, {
        method: "GET",
    });

    if (!resp.ok) {
        throw new Error("Failed to get subscription plans.");
    }

    return resp.json();
}

export async function getSubscriptionPlanDetail(id: string): Promise<{ data: SubscriptionPlan }> {
    const resp = await fetch(`${BASE_URL}/fe/subscription-plans/${id}`, {
        method: "GET",
    });

    if (!resp.ok) {
        throw new Error("Failed to get subscription plan detail.");
    }

    return resp.json();
}

// Authenticated endpoints

export interface Subscription {
    id: number;
    tenant_id: number;
    plan_id: number;
    status: string;
    start_date: string;
    end_date: string;
    plan?: SubscriptionPlan;
}

export async function getActiveSubscription(): Promise<{ data: Subscription }> {
    const resp = await apiFetch("subscriptions/active", {
        method: "GET",
    });

    if (!resp.ok) {
        throw new Error("Failed to get active subscription.");
    }

    return resp.json();
}

export async function getSubscriptionHistory(): Promise<{ data: Subscription[] }> {
    const resp = await apiFetch("subscriptions/history", {
        method: "GET",
    });

    if (!resp.ok) {
        throw new Error("Failed to get subscription history.");
    }

    return resp.json();
}

export async function subscribe(planId: number) {
    const resp = await apiFetch("subscriptions/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan_id: planId }),
    });

    if (!resp.ok) {
        throw new Error("Failed to subscribe.");
    }

    return resp.json();
}

export async function cancelSubscription(subscriptionId: number) {
    const resp = await apiFetch(`subscriptions/${subscriptionId}/cancel`, {
        method: "POST",
    });

    if (!resp.ok) {
        throw new Error("Failed to cancel subscription.");
    }

    return resp.json();
}

export async function changePlan(planId: number) {
    const resp = await apiFetch("subscriptions/change-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan_id: planId }),
    });

    if (!resp.ok) {
        throw new Error("Failed to change plan.");
    }

    return resp.json();
}
