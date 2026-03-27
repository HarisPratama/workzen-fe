"use client"

import { useState, useEffect } from "react";
import { Input } from "@/app/_components/ui/input";
import { Label } from "@/app/_components/ui/label";
import { useRouter } from "next/navigation";
import { registerTenant } from "@/services/tenant.service";
import { getSubscriptionPlans, type SubscriptionPlan } from "@/services/subscription.service";

const steps = ["Account", "Company", "Plan", "Done"];

const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(amount);

export default function RegisterComponent() {
    const router = useRouter();

    const [step, setStep] = useState(0);
    const [showPass, setShowPass] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [done, setDone] = useState(false);
    const [error, setError] = useState("");
    const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
    const [plansLoading, setPlansLoading] = useState(false);
    const [form, setForm] = useState({
        admin_name: "",
        admin_email: "",
        password: "",
        confirmPassword: "",
        company_name: "",
        company_address: "",
        plan: "" as "" | "BASIC" | "PRO" | "ENTERPRISE",
    });
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        fetchPlans();
    }, []);

    const fetchPlans = async () => {
        setPlansLoading(true);
        try {
            const res = await getSubscriptionPlans();
            setPlans(res.data ?? []);
        } catch {
            console.error("Failed to fetch plans");
        } finally {
            setPlansLoading(false);
        }
    };

    const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm((f) => ({ ...f, [k]: e.target.value }));
        setFieldErrors((fe) => ({ ...fe, [k]: "" }));
        setError("");
    };

    const validateStep0 = () => {
        const errs: Record<string, string> = {};
        if (!form.admin_name.trim()) errs.admin_name = "Name is required";
        if (!form.admin_email.trim()) errs.admin_email = "Email is required";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.admin_email)) errs.admin_email = "Invalid email";
        if (!form.password) errs.password = "Password is required";
        else if (form.password.length < 8) errs.password = "Min. 8 characters";
        if (form.password !== form.confirmPassword) errs.confirmPassword = "Passwords don't match";
        setFieldErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const validateStep1 = () => {
        const errs: Record<string, string> = {};
        if (!form.company_name.trim()) errs.company_name = "Company name is required";
        if (!form.company_address.trim()) errs.company_address = "Company address is required";
        setFieldErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const nextStep = () => {
        setError("");
        if (step === 0 && !validateStep0()) return;
        if (step === 1 && !validateStep1()) return;
        setStep(step + 1);
    };

    const prevStep = () => {
        setError("");
        setFieldErrors({});
        setStep(step - 1);
    };

    const submit = async () => {
        if (!form.plan) {
            setError("Please select a plan");
            return;
        }

        setLoading(true);
        setError("");
        try {
            await registerTenant({
                admin_name: form.admin_name,
                admin_email: form.admin_email,
                password: form.password,
                company_name: form.company_name,
                company_address: form.company_address,
                plan: form.plan,
            });
            setDone(true);
            setStep(3);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "Registration failed. Please try again.";
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    const strength = (() => {
        const p = form.password;
        if (!p) return 0;
        let s = 0;
        if (p.length >= 8) s++;
        if (/[A-Z]/.test(p)) s++;
        if (/[0-9]/.test(p)) s++;
        if (/[^A-Za-z0-9]/.test(p)) s++;
        return s;
    })();

    const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"];
    const strengthColor = ["", "bg-red-400", "bg-orange-400", "bg-yellow-400", "bg-green-500"];

    const getPlanColor = (name: string) => {
        switch (name.toUpperCase()) {
            case "BASIC": return { border: "border-blue-300", bg: "bg-blue-50", text: "text-blue-700", badge: "bg-blue-100 text-blue-700" };
            case "PRO": return { border: "border-pink-400", bg: "bg-pink-50", text: "text-pink-700", badge: "bg-pink-100 text-pink-700" };
            case "ENTERPRISE": return { border: "border-purple-400", bg: "bg-purple-50", text: "text-purple-700", badge: "bg-purple-100 text-purple-700" };
            default: return { border: "border-gray-300", bg: "bg-gray-50", text: "text-gray-700", badge: "bg-gray-100 text-gray-700" };
        }
    };

    return (
        <div className="flex flex-col justify-center h-full px-8 sm:px-12 py-12 max-w-md w-full mx-auto">
            {/* Mobile logo */}
            <div className="flex items-center gap-2.5 mb-8 lg:hidden">
                <div className="w-8 h-8 bg-[#F0266F] rounded-xl flex items-center justify-center text-sm font-bold text-white">W</div>
                <span className="font-extrabold text-lg text-[#1a1a2e]">WorkZen</span>
            </div>

            {/* Step indicator */}
            <div className="flex items-center gap-1.5 mb-8">
                {steps.map((s, i) => (
                    <div key={s} className="flex items-center gap-1.5">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                            i < step || done
                                ? "bg-[#F0266F] text-white"
                                : i === step
                                    ? "bg-[#F0266F] text-white ring-4 ring-pink-100"
                                    : "bg-gray-100 text-gray-400"
                        }`}>
                            {i < step || done ? "\u2713" : i + 1}
                        </div>
                        <span className={`text-xs font-semibold hidden sm:inline ${i === step && !done ? "text-[#1a1a2e]" : "text-gray-400"}`}>{s}</span>
                        {i < steps.length - 1 && <div className={`h-px w-4 mx-0.5 ${i < step ? "bg-[#F0266F]" : "bg-gray-200"}`} />}
                    </div>
                ))}
            </div>

            {/* Global error */}
            {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
                    {error}
                </div>
            )}

            {/* Step 0: Account */}
            {step === 0 && (
                <>
                    <div className="mb-7">
                        <h1 className="text-3xl font-extrabold text-[#1a1a2e] tracking-tight mb-1.5">Create your account</h1>
                        <p className="text-gray-400 text-sm">Start managing your workforce. No credit card needed.</p>
                    </div>

                    <div className="flex flex-col gap-3.5">
                        <div>
                            <Label htmlFor="reg-name">Full Name</Label>
                            <Input id="reg-name" placeholder="Ahmad Rizki" value={form.admin_name} onChange={set("admin_name")} />
                            {fieldErrors.admin_name && <p className="text-xs text-red-500 mt-1">{fieldErrors.admin_name}</p>}
                        </div>
                        <div>
                            <Label htmlFor="reg-email">Work Email</Label>
                            <Input id="reg-email" type="email" placeholder="you@company.com" value={form.admin_email} onChange={set("admin_email")} />
                            {fieldErrors.admin_email && <p className="text-xs text-red-500 mt-1">{fieldErrors.admin_email}</p>}
                        </div>
                        <div>
                            <Label htmlFor="reg-pass">Password</Label>
                            <Input id="reg-pass" type={showPass ? "text" : "password"} placeholder="Min. 8 characters" value={form.password} onChange={set("password")} />
                            {form.password && (
                                <div className="mt-2">
                                    <div className="flex gap-1 mb-1">
                                        {[1, 2, 3, 4].map((i) => (
                                            <div key={i} className={`flex-1 h-1 rounded-full transition-all ${i <= strength ? strengthColor[strength] : "bg-gray-200"}`} />
                                        ))}
                                    </div>
                                    <span className={`text-[10px] font-bold ${strength <= 1 ? "text-red-400" : strength === 2 ? "text-orange-400" : strength === 3 ? "text-yellow-500" : "text-green-500"}`}>
                                        {strengthLabel[strength]}
                                    </span>
                                </div>
                            )}
                            {fieldErrors.password && <p className="text-xs text-red-500 mt-1">{fieldErrors.password}</p>}
                        </div>
                        <div>
                            <Label htmlFor="reg-confirm">Confirm Password</Label>
                            <Input id="reg-confirm" type={showConfirm ? "text" : "password"} placeholder="Re-enter password" value={form.confirmPassword} onChange={set("confirmPassword")} />
                            {fieldErrors.confirmPassword && <p className="text-xs text-red-500 mt-1">{fieldErrors.confirmPassword}</p>}
                        </div>
                    </div>

                    <button onClick={nextStep} className="w-full mt-6 py-4 bg-[#F0266F] text-white font-bold rounded-xl text-sm tracking-wide hover:bg-[#ff4d8d] hover:-translate-y-0.5 hover:shadow-xl hover:shadow-pink-300/40 transition-all">
                        Continue
                    </button>

                    <p className="text-center text-xs text-gray-400 mt-5">
                        Already have an account?{" "}
                        <button onClick={() => router.push("/login")} className="text-[#F0266F] font-bold hover:underline bg-transparent border-none cursor-pointer">Sign in</button>
                    </p>
                </>
            )}

            {/* Step 1: Company */}
            {step === 1 && (
                <>
                    <div className="mb-7">
                        <h1 className="text-3xl font-extrabold text-[#1a1a2e] tracking-tight mb-1.5">Company information</h1>
                        <p className="text-gray-400 text-sm">Tell us about your company to set up your workspace.</p>
                    </div>

                    <div className="flex flex-col gap-4">
                        <div>
                            <Label htmlFor="reg-company">Company Name</Label>
                            <Input id="reg-company" placeholder="PT Maju Jaya Outsourcing" value={form.company_name} onChange={set("company_name")} />
                            {fieldErrors.company_name && <p className="text-xs text-red-500 mt-1">{fieldErrors.company_name}</p>}
                        </div>
                        <div>
                            <Label htmlFor="reg-address">Company Address</Label>
                            <Input id="reg-address" placeholder="Jl. Sudirman No. 123, Jakarta" value={form.company_address} onChange={set("company_address")} />
                            {fieldErrors.company_address && <p className="text-xs text-red-500 mt-1">{fieldErrors.company_address}</p>}
                        </div>
                    </div>

                    <div className="flex gap-3 mt-6">
                        <button onClick={prevStep}
                            className="flex-1 py-4 border-2 border-gray-200 text-gray-600 font-bold rounded-xl text-sm hover:border-gray-300 transition-all">
                            Back
                        </button>
                        <button onClick={nextStep}
                            className="flex-1 py-4 bg-[#F0266F] text-white font-bold rounded-xl text-sm hover:bg-[#ff4d8d] hover:-translate-y-0.5 hover:shadow-xl hover:shadow-pink-300/40 transition-all">
                            Continue
                        </button>
                    </div>
                </>
            )}

            {/* Step 2: Choose Plan */}
            {step === 2 && (
                <>
                    <div className="mb-7">
                        <h1 className="text-3xl font-extrabold text-[#1a1a2e] tracking-tight mb-1.5">Choose your plan</h1>
                        <p className="text-gray-400 text-sm">Select the plan that fits your business needs.</p>
                    </div>

                    {plansLoading ? (
                        <div className="space-y-3">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="h-28 bg-gray-100 rounded-xl animate-pulse" />
                            ))}
                        </div>
                    ) : plans.length > 0 ? (
                        <div className="space-y-3">
                            {plans.map((plan) => {
                                const colors = getPlanColor(plan.name);
                                const isSelected = form.plan === plan.name.toUpperCase();
                                return (
                                    <button
                                        key={plan.id}
                                        onClick={() => { setForm(f => ({ ...f, plan: plan.name.toUpperCase() as typeof f.plan })); setError(""); }}
                                        className={`w-full text-left p-5 rounded-xl border-2 transition-all ${
                                            isSelected
                                                ? `${colors.border} ${colors.bg} ring-2 ring-offset-1 ring-pink-300`
                                                : "border-gray-200 bg-white hover:border-gray-300"
                                        }`}
                                    >
                                        <div className="flex items-start justify-between mb-2">
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-bold text-[#1a1a2e] text-lg">{plan.name}</span>
                                                    {plan.name.toUpperCase() === "PRO" && (
                                                        <span className="px-2 py-0.5 text-[10px] font-bold bg-pink-100 text-pink-700 rounded-full">POPULAR</span>
                                                    )}
                                                </div>
                                                <p className="text-sm text-gray-500 mt-0.5">{plan.description || `Up to ${plan.max_employees} employees`}</p>
                                            </div>
                                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-1 ${
                                                isSelected ? "border-[#F0266F] bg-[#F0266F]" : "border-gray-300"
                                            }`}>
                                                {isSelected && (
                                                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                    </svg>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex items-baseline gap-1">
                                            <span className={`text-2xl font-extrabold ${isSelected ? colors.text : "text-[#1a1a2e]"}`}>
                                                {plan.price === 0 ? "Free" : formatCurrency(plan.price)}
                                            </span>
                                            {plan.price > 0 && (
                                                <span className="text-xs text-gray-400">/ {plan.duration_days} days</span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                                            <span>Max {plan.max_employees} employees</span>
                                            <span>{plan.duration_days} days</span>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    ) : (
                        /* Fallback if no plans from API */
                        <div className="space-y-3">
                            {(["BASIC", "PRO", "ENTERPRISE"] as const).map((tier) => {
                                const isSelected = form.plan === tier;
                                const info = {
                                    BASIC: { label: "Basic", desc: "For small teams", price: "Free" },
                                    PRO: { label: "Pro", desc: "For growing businesses", price: "Most Popular" },
                                    ENTERPRISE: { label: "Enterprise", desc: "For large organizations", price: "Custom" },
                                };
                                const t = info[tier];
                                return (
                                    <button
                                        key={tier}
                                        onClick={() => { setForm(f => ({ ...f, plan: tier })); setError(""); }}
                                        className={`w-full text-left p-5 rounded-xl border-2 transition-all ${
                                            isSelected
                                                ? "border-[#F0266F] bg-pink-50 ring-2 ring-offset-1 ring-pink-300"
                                                : "border-gray-200 bg-white hover:border-gray-300"
                                        }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <span className="font-bold text-[#1a1a2e] text-lg">{t.label}</span>
                                                <p className="text-sm text-gray-500">{t.desc}</p>
                                            </div>
                                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                                isSelected ? "border-[#F0266F] bg-[#F0266F]" : "border-gray-300"
                                            }`}>
                                                {isSelected && (
                                                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                    </svg>
                                                )}
                                            </div>
                                        </div>
                                        <p className="text-sm font-semibold text-gray-600 mt-1">{t.price}</p>
                                    </button>
                                );
                            })}
                        </div>
                    )}

                    <div className="flex gap-3 mt-6">
                        <button onClick={prevStep}
                            className="flex-1 py-4 border-2 border-gray-200 text-gray-600 font-bold rounded-xl text-sm hover:border-gray-300 transition-all">
                            Back
                        </button>
                        <button onClick={submit} disabled={loading || !form.plan}
                            className="flex-1 py-4 bg-[#F0266F] text-white font-bold rounded-xl text-sm hover:bg-[#ff4d8d] hover:-translate-y-0.5 hover:shadow-xl hover:shadow-pink-300/40 disabled:opacity-70 disabled:translate-y-0 transition-all flex items-center justify-center gap-2">
                            {loading ? (
                                <><svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg> Creating...</>
                            ) : "Create Account"}
                        </button>
                    </div>
                </>
            )}

            {/* Step 3: Done */}
            {step === 3 && (
                <div className="text-center py-6">
                    <div className="relative w-24 h-24 mx-auto mb-6">
                        <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-30" />
                        <div className="relative w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-xl shadow-green-200">
                            <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                    </div>
                    <h2 className="text-2xl font-extrabold text-[#1a1a2e] tracking-tight mb-2">You&#39;re all set!</h2>
                    <p className="text-gray-400 text-sm mb-2">Account created for</p>
                    <p className="text-[#F0266F] font-bold text-sm mb-2">{form.admin_email}</p>
                    <p className="text-gray-400 text-xs mb-8">
                        {form.company_name} &mdash; {form.plan} Plan
                    </p>

                    <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 text-left mb-8">
                        <p className="text-xs font-bold text-gray-400 tracking-widest uppercase mb-4">What&#39;s next</p>
                        {[
                            { icon: "1", text: "Sign in with your credentials" },
                            { icon: "2", text: "Add your employees" },
                            { icon: "3", text: "Set up your first client" },
                            { icon: "4", text: "Create manpower requests" },
                        ].map((item) => (
                            <div key={item.text} className="flex items-center gap-3 py-2">
                                <div className="w-6 h-6 bg-pink-100 text-pink-700 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                                    {item.icon}
                                </div>
                                <span className="text-sm text-gray-600">{item.text}</span>
                            </div>
                        ))}
                    </div>

                    <button onClick={() => router.push("/login")}
                        className="w-full py-4 bg-[#F0266F] text-white font-bold rounded-xl text-sm hover:bg-[#ff4d8d] hover:-translate-y-0.5 hover:shadow-xl hover:shadow-pink-300/40 transition-all">
                        Go to Login
                    </button>
                </div>
            )}
        </div>
    );
}
