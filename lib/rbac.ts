export type Role = "SUPER_ADMIN" | "TENANT_ADMIN" | "SUPERVISOR" | "EMPLOYEE";

export type Permission =
    | "overview:view"
    | "employees:view" | "employees:create" | "employees:edit" | "employees:delete"
    | "clients:view" | "clients:create" | "clients:edit" | "clients:delete"
    | "assignments:view" | "assignments:create" | "assignments:edit" | "assignments:delete"
    | "attendance:view" | "attendance:create" | "attendance:edit" | "attendance:delete"
    | "manpower-request:view" | "manpower-request:create" | "manpower-request:edit" | "manpower-request:delete"
    | "candidates:view" | "candidates:create" | "candidates:edit" | "candidates:delete"
    | "payroll:view" | "payroll:create" | "payroll:edit" | "payroll:delete"
    | "settings:view";

const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
    SUPER_ADMIN: [
        "overview:view",
        "employees:view", "employees:create", "employees:edit", "employees:delete",
        "clients:view", "clients:create", "clients:edit", "clients:delete",
        "assignments:view", "assignments:create", "assignments:edit", "assignments:delete",
        "attendance:view", "attendance:create", "attendance:edit", "attendance:delete",
        "manpower-request:view", "manpower-request:create", "manpower-request:edit", "manpower-request:delete",
        "candidates:view", "candidates:create", "candidates:edit", "candidates:delete",
        "payroll:view", "payroll:create", "payroll:edit", "payroll:delete",
        "settings:view",
    ],
    TENANT_ADMIN: [
        "overview:view",
        "employees:view", "employees:create", "employees:edit", "employees:delete",
        "clients:view", "clients:create", "clients:edit", "clients:delete",
        "assignments:view", "assignments:create", "assignments:edit", "assignments:delete",
        "attendance:view", "attendance:create", "attendance:edit", "attendance:delete",
        "manpower-request:view", "manpower-request:create", "manpower-request:edit", "manpower-request:delete",
        "candidates:view", "candidates:create", "candidates:edit", "candidates:delete",
        "payroll:view", "payroll:create", "payroll:edit", "payroll:delete",
        "settings:view",
    ],
    SUPERVISOR: [
        "overview:view",
        "employees:view",
        "clients:view",
        "assignments:view",
        "attendance:view",
        "manpower-request:view", "manpower-request:create", "manpower-request:edit", "manpower-request:delete",
        "candidates:view", "candidates:create", "candidates:edit", "candidates:delete",
        "payroll:view",
    ],
    EMPLOYEE: [
        "overview:view",
        "attendance:view",
    ],
};

export function hasPermission(role: Role | string | undefined, permission: Permission): boolean {
    if (!role) return false;
    const perms = ROLE_PERMISSIONS[role as Role];
    if (!perms) return false;
    return perms.includes(permission);
}

export function hasAnyPermission(role: Role | string | undefined, permissions: Permission[]): boolean {
    return permissions.some((p) => hasPermission(role, p));
}

// Menu items each role can see (by page route key)
export type MenuPage = "overview" | "employees" | "clients" | "assignments" | "attendance" | "manpower-request" | "candidates" | "payroll" | "settings";

const MENU_ACCESS: Record<Role, MenuPage[]> = {
    SUPER_ADMIN: ["overview", "employees", "clients", "assignments", "attendance", "manpower-request", "candidates", "payroll", "settings"],
    TENANT_ADMIN: ["overview", "employees", "clients", "assignments", "attendance", "manpower-request", "candidates", "payroll", "settings"],
    SUPERVISOR: ["overview", "employees", "clients", "assignments", "attendance", "manpower-request", "candidates", "payroll"],
    EMPLOYEE: ["overview", "attendance"],
};

export function getAccessibleMenus(role: Role | string | undefined): MenuPage[] {
    if (!role) return ["overview"];
    return MENU_ACCESS[role as Role] ?? ["overview"];
}
