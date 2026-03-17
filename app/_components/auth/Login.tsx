"use client"
import {Input} from "@/app/_components/ui/input";
import {Label} from "@/app/_components/ui/label";
import {useState} from "react";
import {useRouter} from "next/navigation";
import {useForm} from "react-hook-form";
import {loginApi} from "@/services/auth.service";

export default function LoginComponent() {
    const router = useRouter();

    const { register, handleSubmit } = useForm();
    const [form, setForm] = useState({ email: "", password: "" });
    const [showPass, setShowPass] = useState(false);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const onSubmit = async (data:any) => {
        setLoading(true)
        console.log(data)

        try {
            await loginApi(data)
            router.push("/org/overview")
        } catch(e){
            console.error(e)
        }

        setLoading(false)
    }

    return (
        <div className="flex flex-col justify-center h-full px-8 sm:px-12 py-12 max-w-md w-full mx-auto">
            {/* Mobile logo */}
            <div className="flex items-center gap-2.5 mb-10 lg:hidden">
                <div className="w-8 h-8 bg-[#F0266F] rounded-xl flex items-center justify-center">🎯</div>
                <span className="font-extrabold text-lg text-[#1a1a2e]">TalentHR</span>
            </div>

            {success ? (
                <div className="text-center py-8">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-4xl mx-auto mb-5 animate-bounce">✅</div>
                    <h3 className="text-2xl font-extrabold text-[#1a1a2e] mb-2">Welcome back!</h3>
                    <p className="text-gray-400 text-sm">Redirecting to your dashboard...</p>
                    <div className="mt-6 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-[#F0266F] rounded-full animate-[progress_1.5s_ease_forwards]" style={{ width: "100%" }} />
                    </div>
                    <style>{`@keyframes progress { from{width:0} to{width:100%} }`}</style>
                </div>
            ) : (
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-8">
                        <h1 className="text-3xl font-extrabold text-[#1a1a2e] tracking-tight mb-2">Sign in</h1>
                        <p className="text-gray-400 text-sm">Enter your credentials to access your workforce dashboard</p>
                    </div>

                    {/* Social login */}
                    <div className="grid grid-cols-2 gap-3 mb-6">
                        {[{ icon: "G", label: "Google", bg: "hover:bg-red-50 hover:border-red-200" }, { icon: "in", label: "LinkedIn", bg: "hover:bg-blue-50 hover:border-blue-200" }].map((s) => (
                            <button key={s.label} className={`flex items-center justify-center gap-2.5 py-3 border-2 border-gray-200 rounded-xl text-sm font-semibold text-gray-600 bg-white transition-all ${s.bg}`}>
                                <span className="font-extrabold">{s.icon}</span> {s.label}
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center gap-3 mb-6">
                        <div className="flex-1 h-px bg-gray-200" />
                        <span className="text-xs text-gray-400 font-medium">or continue with email</span>
                        <div className="flex-1 h-px bg-gray-200" />
                    </div>

                    <div className="flex flex-col gap-4 mb-6">
                        <Label title="Email address" />
                        <Input {...register("email")} type="email" placeholder="you@company.com"/>
                        <Label title="Password" />
                        <Input {...register("password")} type={showPass ? "text" : "password"} placeholder="••••••••"/>
                    </div>

                    <div className="flex items-center justify-between mb-7">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" className="w-4 h-4 accent-[#F0266F] rounded" />
                            <span className="text-xs text-gray-500 font-medium">Remember me</span>
                        </label>
                        <a href="#" className="text-xs text-[#F0266F] font-semibold hover:underline">Forgot password?</a>
                    </div>

                    <button type="submit" disabled={loading}
                            className="w-full py-4 bg-[#F0266F] text-white font-bold rounded-xl text-sm tracking-wide transition-all hover:bg-[#ff4d8d] hover:-translate-y-0.5 hover:shadow-xl hover:shadow-pink-300/40 disabled:opacity-70 disabled:translate-y-0 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                        {loading ? (
                            <><svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg> Signing in...</>
                        ) : "Sign In →"}
                    </button>

                    <p className="text-center text-xs text-gray-400 mt-6">
                        Don&#39;t have an account?{" "}
                        <button onClick={() => router.push('/register')} className="text-[#F0266F] font-bold hover:underline bg-transparent border-none cursor-pointer">
                            Create one free
                        </button>
                    </p>
                </form>
            )}
        </div>
    );
}
