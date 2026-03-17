import Reveal from "@/app/_components/landing_page/Reveal";
import {Tag} from "lucide-react";

const solutions = [
    { icon: "👥", bg: "bg-pink-50", title: "Employee Management", desc: "Centralize all employee data, documents, and contracts. Know the status of every outsourced employee at a glance." },
    { icon: "🏢", bg: "bg-green-50", title: "Client Assignment", desc: "Assign and reassign employees to client companies with ease. Track deployments, contract durations, and SLAs." },
    { icon: "🕐", bg: "bg-blue-50", title: "Attendance Tracking", desc: "Real-time attendance across all client locations. GPS check-in, leave management, and automated reports." },
    { icon: "💰", bg: "bg-orange-50", title: "Payroll Automation", desc: "Auto-calculate salaries based on attendance, assignments, and contract terms. Process payroll in minutes." },
    { icon: "🎯", bg: "bg-purple-50", title: "Recruitment Pipeline", desc: "Manage candidates from application to placement. Build your outsourcing talent pool and fill positions faster." },
    { icon: "📈", bg: "bg-yellow-50", title: "Analytics & Reports", desc: "Headcount growth, turnover rates, talent distribution — insights that help you grow your outsourcing business." },
];

export default function Solution() {
    return (
        <section id="solution" className="py-24 px-6">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-14">
                    <Reveal><Tag color="green">The Solution</Tag></Reveal>
                    <Reveal delay={80}>
                        <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mt-4 mb-4">
                            Everything you need to manage<br />outsourced employees —{" "}
                            <em className="not-italic text-[#F0266F]">in one place</em>
                        </h2>
                    </Reveal>
                    <Reveal delay={120}>
                        <p className="text-gray-500 text-base leading-relaxed max-w-lg mx-auto">
                            WorkZen is the only HR platform built specifically for outsourcing companies. Manage your entire workforce lifecycle from a single dashboard.
                        </p>
                    </Reveal>
                </div>
                <div className="grid md:grid-cols-3 gap-6">
                    {solutions.map((s, i) => (
                        <Reveal key={s.title} delay={i * 70}>
                            <div className="bg-white border border-gray-200 rounded-2xl p-8 hover:border-[#F0266F] hover:-translate-y-1 hover:shadow-xl hover:shadow-pink-100/60 transition-all group">
                                <div className={`w-12 h-12 ${s.bg} rounded-2xl flex items-center justify-center text-2xl mb-5`}>{s.icon}</div>
                                <h3 className="font-bold text-lg mb-2">{s.title}</h3>
                                <p className="text-sm text-gray-400 leading-relaxed">{s.desc}</p>
                            </div>
                        </Reveal>
                    ))}
                </div>
            </div>
        </section>
    );
}