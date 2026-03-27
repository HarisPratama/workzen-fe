import Image from "next/image";

type Props = {
    mode: "register" | "login";
}

export default function BrandPanel({ mode }: Props) {
    const stats = [
        { num: "500+", label: "Companies" },
        { num: "50K+", label: "Employees" },
        { num: "99.9%", label: "Uptime" },
    ];
    const features = [
        { icon: "👥", text: "Employee lifecycle management" },
        { icon: "🏢", text: "Multi-client assignment tracking" },
        { icon: "💰", text: "Automated payroll processing" },
        { icon: "📊", text: "Real-time workforce analytics" },
    ];

    return (
        <div className="hidden lg:flex flex-col justify-between h-full bg-[#0f0f1a] px-12 py-12 relative overflow-hidden">
            {/* Background glow */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-0 w-96 h-96 rounded-full opacity-20"
                     style={{ background: "radial-gradient(circle, #F0266F, transparent)", transform: "translate(-40%, -40%)" }} />
                <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full opacity-10"
                     style={{ background: "radial-gradient(circle, #3b82f6, transparent)", transform: "translate(40%, 40%)" }} />
                {/* Dot grid */}
                <div className="absolute inset-0 opacity-20"
                     style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
            </div>

            {/* Logo */}
            <div className="relative z-10">
                <div className="flex items-center gap-3 mb-14">
                    <Image src="/workzen.png" alt="WorkZen" width={36} height={36} className="rounded-xl" />
                    <span className="text-white font-extrabold text-xl tracking-tight">WorkZen</span>
                </div>

                {/* Heading */}
                <div className="mb-10">
                    <h2 className="text-white font-extrabold text-4xl leading-[1.1] tracking-tight mb-4">
                        {mode === "login"
                            ? <>Welcome<br />back to your<br /><span className="text-[#F0266F]">workforce hub</span></>
                            : <>The smartest way<br />to manage your<br /><span className="text-[#F0266F]">outsourced team</span></>
                        }
                    </h2>
                    <p className="text-white/45 text-sm leading-relaxed max-w-xs">
                        {mode === "login"
                            ? "Your team is waiting. Log in to manage attendance, payroll, and client assignments."
                            : "Join 500+ outsourcing companies who replaced spreadsheets with WorkZen."}
                    </p>
                </div>

                {/* Feature list */}
                <div className="flex flex-col gap-3.5">
                    {features.map((f) => (
                        <div key={f.text} className="flex items-center gap-3.5">
                            <div className="w-9 h-9 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-base flex-shrink-0">
                                {f.icon}
                            </div>
                            <span className="text-white/60 text-sm">{f.text}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Stats bar */}
            <div className="relative z-10 bg-white/5 border border-white/10 rounded-2xl p-6">
                <p className="text-white/30 text-xs font-bold tracking-widest uppercase mb-5">Platform Stats</p>
                <div className="grid grid-cols-3 gap-4">
                    {stats.map((s) => (
                        <div key={s.label} className="text-center">
                            <div className="text-2xl font-extrabold text-white tracking-tight">{s.num}</div>
                            <div className="text-xs text-white/35 mt-0.5">{s.label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
