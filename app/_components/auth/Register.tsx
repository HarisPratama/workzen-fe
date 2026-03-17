"use client"

import { useState } from "react";
import {Input} from "@/app/_components/ui/input";
import {Label} from "@/app/_components/ui/label";
import {useRouter} from "next/navigation";

const steps = ["Account", "Company", "Done"];

export function EyeIcon({ open }: {open: boolean}) {
    return open ? (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
        </svg>
    ) : (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
            <line x1="1" y1="1" x2="23" y2="23" />
        </svg>
    );
}


export default function RegisterComponent() {
    const router = useRouter();

    const [step, setStep] = useState(0);
    const [showPass, setShowPass] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [done, setDone] = useState(false);
    const [form, setForm] = useState({
        fullName: "", email: "", password: "", confirmPassword: "",
        company: "", role: "", employees: "", agree: false,
    });
    const [errors, setErrors] = useState({});

    const set = (k: string) => (e: { target: { type: string; checked: never; value: never; }; }) =>
        setForm((f) => ({ ...f, [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value }));

    const nextStep = () => {
        setErrors({});
        setStep(step + 1);
    };

    const submit = () => {
        setLoading(true);
        setTimeout(() => { setLoading(false); setDone(true); setStep(2); }, 1800);
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

    return (
        <div className="flex flex-col justify-center h-full px-8 sm:px-12 py-12 max-w-md w-full mx-auto">
            {/* Mobile logo */}
            <div className="flex items-center gap-2.5 mb-8 lg:hidden">
                <div className="w-8 h-8 bg-[#F0266F] rounded-xl flex items-center justify-center">🎯</div>
                <span className="font-extrabold text-lg text-[#1a1a2e]">TalentHR</span>
            </div>

            {/* Step indicator */}
            <div className="flex items-center gap-2 mb-8">
                {steps.map((s, i) => (
                    <div key={s} className="flex items-center gap-2">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${i < step || done ? "bg-[#F0266F] text-white" : i === step ? "bg-[#F0266F] text-white ring-4 ring-pink-100" : "bg-gray-100 text-gray-400"}`}>
                            {i < step || done ? "✓" : i + 1}
                        </div>
                        <span className={`text-xs font-semibold ${i === step && !done ? "text-[#1a1a2e]" : "text-gray-400"}`}>{s}</span>
                        {i < steps.length - 1 && <div className={`h-px w-6 mx-1 ${i < step ? "bg-[#F0266F]" : "bg-gray-200"}`} />}
                    </div>
                ))}
            </div>

            {/* Step 0: Account */}
            {step === 0 && (
                <>
                    <div className="mb-7">
                        <h1 className="text-3xl font-extrabold text-[#1a1a2e] tracking-tight mb-1.5">Create your account</h1>
                        <p className="text-gray-400 text-sm">Start managing your workforce for free. No credit card needed.</p>
                    </div>

                    {/* Social */}
                    <div className="grid grid-cols-2 gap-3 mb-5">
                        {[{ icon: "G", label: "Google" }, { icon: "in", label: "LinkedIn" }].map((s) => (
                            <button key={s.label} className="flex items-center justify-center gap-2 py-3 border-2 border-gray-200 rounded-xl text-sm font-semibold text-gray-600 bg-white hover:bg-gray-50 transition-all">
                                <span className="font-extrabold">{s.icon}</span> {s.label}
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center gap-3 mb-5">
                        <div className="flex-1 h-px bg-gray-200" />
                        <span className="text-xs text-gray-400 font-medium">or with email</span>
                        <div className="flex-1 h-px bg-gray-200" />
                    </div>

                    <div className="flex flex-col gap-3.5">
                        <Label title="Full Sname"/>
                        <Input placeholder="Ahmad Rizki" value={form.fullName}/>

                        <Label title="Work Email"/>
                        <Input type="email" placeholder="you@company.com" value={form.email}/>
                        <div>
                            <Input type={showPass ? "text" : "password"} placeholder="Min. 8 characters" value={form.password}/>
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
                        </div>
                        <Label title="Confirm Password"/>
                        <Input type={showConfirm ? "text" : "password"} placeholder="Re-enter password" value={form.confirmPassword}/>
                    </div>

                    <button onClick={nextStep} className="w-full mt-6 py-4 bg-[#F0266F] text-white font-bold rounded-xl text-sm tracking-wide hover:bg-[#ff4d8d] hover:-translate-y-0.5 hover:shadow-xl hover:shadow-pink-300/40 transition-all">
                        Continue →
                    </button>

                    <p className="text-center text-xs text-gray-400 mt-5">
                        Already have an account?{" "}
                        <button onClick={() => router.push('/login')} className="text-[#F0266F] font-bold hover:underline bg-transparent border-none cursor-pointer">Sign in</button>
                    </p>
                </>
            )}

            {/* Step 1: Company */}
            {step === 1 && (
                <>
                    <div className="mb-7">
                        <h1 className="text-3xl font-extrabold text-[#1a1a2e] tracking-tight mb-1.5">Tell us about your company</h1>
                        <p className="text-gray-400 text-sm">Help us personalize your workforce management experience.</p>
                    </div>

                    <div className="flex flex-col gap-4">
                        <Label title="Confirm Password"/>
                        <Input placeholder="PT Maju Jaya Outsourcing" value={form.company}/>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-bold text-gray-500 tracking-wider uppercase">Your Role</label>
                            <select value={form.role}
                                    className={`px-4 py-3.5 bg-gray-50 border-2 rounded-xl text-sm text-gray-800 outline-none transition-all focus:bg-white focus:border-[#F0266F] focus:shadow-lg focus:shadow-pink-100 appearance-none cursor-pointer ${errors ? "border-red-400 bg-red-50" : "border-gray-200"}`}>
                                <option value="">Select your role...</option>
                                {["HR Director", "HR Manager", "Operations Manager", "CEO / Owner", "Finance Manager", "Recruitment Manager", "Other"].map(r => <option key={r} value={r}>{r}</option>)}
                            </select>
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-bold text-gray-500 tracking-wider uppercase">Number of Outsourced Employees</label>
                            <div className="grid grid-cols-3 gap-2">
                                {["1–20", "21–100", "101–500", "501–1K", "1K–5K", "5K+"].map((opt) => (
                                    <button key={opt} onClick={() => setForm(f => ({ ...f, employees: opt }))}
                                            className={`py-3 rounded-xl text-xs font-bold border-2 transition-all ${form.employees === opt ? "bg-[#F0266F] text-white border-[#F0266F] shadow-lg shadow-pink-200" : "bg-gray-50 text-gray-500 border-gray-200 hover:border-pink-200 hover:text-[#F0266F]"}`}>
                                        {opt}
                                    </button>
                                ))}
                            </div>
                            {/*{errors.employees && <p className="text-xs text-red-500 font-medium">{errors.employees}</p>}*/}
                        </div>

                        <label className="flex items-start gap-3 cursor-pointer mt-1">
                            <input type="checkbox" checked={form.agree} className="w-4 h-4 accent-[#F0266F] rounded mt-0.5 flex-shrink-0" />
                            <span className="text-xs text-gray-500 leading-relaxed">
                I agree to WorkZen&#39;s{" "}
                                <a href="#" className="text-[#F0266F] font-semibold hover:underline">Terms of Service</a>
                                {" "}and{" "}
                                <a href="#" className="text-[#F0266F] font-semibold hover:underline">Privacy Policy</a>
              </span>
                        </label>
                        {/*{errors.agree && <p className="text-xs text-red-500 font-medium -mt-2">{errors.agree}</p>}*/}
                    </div>

                    <div className="flex gap-3 mt-6">
                        <button onClick={() => { setStep(0); setErrors({}); }}
                                className="flex-1 py-4 border-2 border-gray-200 text-gray-600 font-bold rounded-xl text-sm hover:border-gray-300 transition-all">
                            ← Back
                        </button>
                        <button onClick={submit} disabled={loading}
                                className="flex-1 py-4 bg-[#F0266F] text-white font-bold rounded-xl text-sm hover:bg-[#ff4d8d] hover:-translate-y-0.5 hover:shadow-xl hover:shadow-pink-300/40 disabled:opacity-70 disabled:translate-y-0 transition-all flex items-center justify-center gap-2">
                            {loading ? (
                                <><svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg> Creating...</>
                            ) : "Create Account →"}
                        </button>
                    </div>
                </>
            )}

            {/* Step 2: Done */}
            {step === 2 && (
                <div className="text-center py-6">
                    <div className="relative w-24 h-24 mx-auto mb-6">
                        <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-30" />
                        <div className="relative w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-4xl shadow-xl shadow-green-200">
                            🎉
                        </div>
                    </div>
                    <h2 className="text-2xl font-extrabold text-[#1a1a2e] tracking-tight mb-2">You&#39;re all set!</h2>
                    <p className="text-gray-400 text-sm mb-2">Account created for</p>
                    <p className="text-[#F0266F] font-bold text-sm mb-8">{form.email}</p>

                    <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 text-left mb-8">
                        <p className="text-xs font-bold text-gray-400 tracking-widest uppercase mb-4">What&#39;s next</p>
                        {[
                            { icon: "📧", text: "Check your email for verification link" },
                            { icon: "👥", text: "Import your employee database" },
                            { icon: "🏢", text: "Add your first client company" },
                            { icon: "🚀", text: "Run your first payroll" },
                        ].map((item) => (
                            <div key={item.text} className="flex items-center gap-3 py-2">
                                <span className="text-base">{item.icon}</span>
                                <span className="text-sm text-gray-600">{item.text}</span>
                            </div>
                        ))}
                    </div>

                    <button onClick={() => router.push('/org/overview')}
                            className="w-full py-4 bg-[#F0266F] text-white font-bold rounded-xl text-sm hover:bg-[#ff4d8d] hover:-translate-y-0.5 hover:shadow-xl hover:shadow-pink-300/40 transition-all">
                        Go to Dashboard →
                    </button>
                </div>
            )}
        </div>
    );
}
