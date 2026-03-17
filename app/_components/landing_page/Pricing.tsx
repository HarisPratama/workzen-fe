import Reveal, { Tag } from "@/app/_components/landing_page/Reveal";

const plans = [
    {
        tier: "Starter", name: "Free", price: "$0", period: "/month", popular: false,
        desc: "Perfect for small outsourcing businesses just getting started",
        features: [
            { ok: true, text: "Up to 20 employees" }, { ok: true, text: "Employee management" },
            { ok: true, text: "Client assignment" }, { ok: true, text: "Attendance tracking" },
            { ok: true, text: "Basic reports" }, { ok: false, text: "Payroll automation" },
            { ok: false, text: "Recruitment module" }, { ok: false, text: "API access" },
        ],
        btnText: "Start Free →", btnStyle: "outline",
    },
    {
        tier: "Pro", name: "$49", price: "$49", period: "/month", popular: true,
        desc: "For growing outsourcing businesses managing hundreds of employees",
        features: [
            { ok: true, text: "Up to 200 employees" }, { ok: true, text: "Everything in Free" },
            { ok: true, text: "Payroll automation" }, { ok: true, text: "Recruitment module" },
            { ok: true, text: "Advanced reports & analytics" }, { ok: true, text: "API access" },
            { ok: true, text: "Email support" }, { ok: false, text: "Custom workflow" },
        ],
        btnText: "Start 14-Day Trial →", btnStyle: "pink",
    },
    {
        tier: "Enterprise", name: "Custom", price: "Talk to us", period: "", popular: false,
        desc: "For large outsourcing companies with complex multi-branch operations",
        features: [
            { ok: true, text: "Unlimited employees" }, { ok: true, text: "Everything in Pro" },
            { ok: true, text: "Custom workflow builder" }, { ok: true, text: "Multi-branch management" },
            { ok: true, text: "Dedicated account manager" }, { ok: true, text: "Custom integrations" },
            { ok: true, text: "SLA & priority support" }, { ok: true, text: "On-premise option" },
        ],
        btnText: "Contact Sales →", btnStyle: "outline",
    },
];

export default function Pricing() {
    return (
        <section id="pricing" className="py-24 px-6">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-14">
                    <Reveal><Tag color="orange">Pricing</Tag></Reveal>
                    <Reveal delay={80}><h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mt-4 mb-3">Simple, transparent pricing</h2></Reveal>
                    <Reveal delay={120}><p className="text-gray-500 text-base">Start free. Upgrade as you grow. No hidden fees.</p></Reveal>
                </div>
                <div className="grid md:grid-cols-3 gap-6">
                    {plans.map((p, i) => (
                        <Reveal key={p.tier} delay={i * 80}>
                            <div className={`relative bg-white border-2 rounded-2xl p-9 flex flex-col h-full transition-all hover:-translate-y-1 ${p.popular ? "border-[#F0266F] shadow-2xl shadow-pink-200/50" : "border-gray-200 hover:shadow-xl"}`}>
                                {p.popular && (
                                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#F0266F] text-white text-[10px] font-bold tracking-widest px-5 py-1.5 rounded-full whitespace-nowrap">⭐ Most Popular</div>
                                )}
                                <div className={`text-xs font-bold tracking-widest uppercase mb-2 ${p.popular ? "text-[#F0266F]" : "text-gray-400"}`}>{p.tier}</div>
                                <div className="text-2xl font-extrabold mb-1.5">{p.name}</div>
                                <div className="text-sm text-gray-400 mb-7 leading-relaxed">{p.desc}</div>
                                <div className={`flex items-end gap-1 pb-7 border-b border-gray-200 mb-7 ${p.popular ? "text-[#F0266F]" : ""}`}>
                                    <span className={`font-extrabold tracking-tight ${p.price === "Talk to us" ? "text-2xl" : "text-5xl"}`}>{p.price}</span>
                                    {p.period && <span className="text-sm text-gray-400 mb-2">{p.period}</span>}
                                </div>
                                <ul className="space-y-3 mb-8 flex-1">
                                    {p.features.map(f => (
                                        <li key={f.text} className={`flex gap-2.5 text-sm ${f.ok ? "text-[#1a1a2e]" : "text-gray-300"}`}>
                                            <span className={`flex-shrink-0 mt-0.5 text-xs ${f.ok ? "text-green-500" : "text-gray-300"}`}>{f.ok ? "✓" : "✗"}</span>
                                            {f.text}
                                        </li>
                                    ))}
                                </ul>
                                <a href="#" className={`block text-center py-3.5 rounded-xl font-bold text-sm transition-all no-underline ${p.btnStyle === "pink" ? "bg-[#F0266F] text-white hover:bg-[#ff4d8d] shadow-lg shadow-pink-300/40 hover:shadow-pink-300/60" : "border-2 border-gray-200 text-[#1a1a2e] hover:border-[#F0266F] hover:text-[#F0266F]"}`}>
                                    {p.btnText}
                                </a>
                            </div>
                        </Reveal>
                    ))}
                </div>
            </div>
        </section>
    );
}
