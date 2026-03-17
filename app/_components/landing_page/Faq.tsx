"use client"
import {useState} from "react";
import Reveal from "@/app/_components/landing_page/Reveal";
import {Tag} from "lucide-react";

const faqs = [
    { q: "Is there a free trial for the Pro plan?", a: "Yes! You get a full 14-day free trial of the Pro plan — no credit card required. You'll have access to all Pro features including payroll automation and recruitment module." },
    { q: "Can I manage employees across multiple client companies?", a: "Absolutely. WorkZen is built specifically for outsourcing companies. You can manage unlimited client companies and assign employees to different clients simultaneously, track contract terms, and generate client-specific reports." },
    { q: "How does payroll automation work for outsourced employees?", a: "Payroll is automatically calculated based on each employee's attendance records, contract type, assignment, and any overtime or deductions. You can set different salary structures per client or contract, and run payroll for all employees in one click." },
    { q: "Can I export reports for my clients?", a: "Yes. You can export headcount reports, attendance summaries, payroll data, and performance reports in PDF or Excel format. These can be customized per client and scheduled for automatic delivery." },
    { q: "Do you support multi-branch outsourcing operations?", a: "Multi-branch support is available on the Enterprise plan. You can manage employees, attendance, and payroll across multiple cities or regional offices from a single account with role-based access control." },
    { q: "How does attendance tracking work at client locations?", a: "Employees can check in via mobile app with GPS verification, ensuring they're physically present at the client's location. You can also set up QR code check-in points at client sites for added convenience." },
];

export default function FAQ() {
    const [open, setOpen] = useState<number | null>(null);
    return (
        <section id="faq" className="py-24 px-6">
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-14">
                    <Reveal><Tag color="blue">FAQ</Tag></Reveal>
                    <Reveal delay={80}><h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mt-4">Frequently asked questions</h2></Reveal>
                </div>
                <div className="flex flex-col gap-3">
                    {faqs.map((f, i) => (
                        <Reveal key={i} delay={i * 50}>
                            <div className={`bg-white border rounded-2xl overflow-hidden transition-colors ${open === i ? "border-[#F0266F]" : "border-gray-200 hover:border-pink-200"}`}>
                                <button onClick={() => setOpen(open === i ? null : i)}
                                        className="w-full flex justify-between items-center px-6 py-5 text-left font-semibold text-sm bg-transparent cursor-pointer">
                                    <span>{f.q}</span>
                                    <span className={`w-6 h-6 rounded-full bg-pink-50 text-[#F0266F] flex items-center justify-center font-bold text-base flex-shrink-0 transition-transform duration-200 ${open === i ? "rotate-45" : ""}`}>+</span>
                                </button>
                                <div className={`overflow-hidden transition-all duration-300 ${open === i ? "max-h-48 pb-5 px-6" : "max-h-0"}`}>
                                    <p className="text-sm text-gray-500 leading-relaxed">{f.a}</p>
                                </div>
                            </div>
                        </Reveal>
                    ))}
                </div>
            </div>
        </section>
    );
}
