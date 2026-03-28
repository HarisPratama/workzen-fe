"use client"
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { getUserProfile } from "@/services/user.service";
import type { Role } from "@/lib/rbac";
import { hasPermission, hasAnyPermission, type Permission } from "@/lib/rbac";

interface UserProfile {
    id?: number;
    name: string;
    email: string;
    role: Role;
}

interface AuthContextValue {
    user: UserProfile | null;
    loading: boolean;
    can: (permission: Permission) => boolean;
    canAny: (permissions: Permission[]) => boolean;
    role: Role | undefined;
}

const AuthContext = createContext<AuthContextValue>({
    user: null,
    loading: true,
    can: () => false,
    canAny: () => false,
    role: undefined,
});

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getUserProfile()
            .then((res) => {
                const data = res.data ?? res;
                setUser(data);
            })
            .catch(() => {
                setUser(null);
            })
            .finally(() => setLoading(false));
    }, []);

    const role = user?.role;
    const can = (permission: Permission) => hasPermission(role, permission);
    const canAny = (permissions: Permission[]) => hasAnyPermission(role, permissions);

    return (
        <AuthContext.Provider value={{ user, loading, can, canAny, role }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
