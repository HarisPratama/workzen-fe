import Reveal from "@/app/_components/landing_page/Reveal";
import {Tag} from "lucide-react";

const steps = [
    { icon: "🏢", num: "1", title: "Create your account", desc: "Sign up and set up your outsourcing company profile in minutes" },
    { icon: "👤", num: "2", title: "Add employees", desc: "Import your employee database via CSV or add manually" },
    { icon: "🤝", num: "3", title: "Assign to clients", desc: "Link employees to client companies with contract details" },
    { icon: "📍", num: "4", title: "Track attendance", desc: "Employees check in digitally from any client location" },
    { icon: "💳", num: "5", title: "Generate payroll", desc: "One click to process salary for all employees automatically" },
];

export default function HowItWorks() {
    return (
        <section id="how-it-works" className="py-24 px-6 bg-gray-50">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                    <Reveal><Tag color="blue">How It Works</Tag></Reveal>
                    <Reveal delay={80}><h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mt-4 mb-3">Get started in 5 simple steps</h2></Reveal>
                    <Reveal delay={120}><p className="text-gray-500 text-base max-w-md mx-auto">From signup to first payroll run — onboard your entire workforce in under a day.</p></Reveal>
                </div>
                <div className="relative flex flex-col md:flex-row items-start gap-8 md:gap-0">
                    <div className="hidden md:block absolute top-7 left-[10%] right-[10%] h-px bg-gray-200 z-0" />
                    {steps.map((s, i) => (
                        <Reveal key={s.num} delay={i * 80} className="flex-1 text-center px-3 relative z-10">
                            <div className="text-2xl mb-3">{s.icon}</div>
                            <div className="w-14 h-14 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center text-xl font-extrabold mx-auto mb-5 hover:bg-[#F0266F] hover:text-white hover:border-[#F0266F] hover:scale-110 transition-all cursor-default">
                                {s.num}
                            </div>
                            <div className="font-bold text-sm mb-1.5">{s.title}</div>
                            <div className="text-xs text-gray-400 leading-relaxed">{s.desc}</div>
                        </Reveal>
                    ))}
                </div>
            </div>
        </section>
    );
}
