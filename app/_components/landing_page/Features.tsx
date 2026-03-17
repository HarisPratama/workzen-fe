import Reveal from "@/app/_components/landing_page/Reveal";
import {Tag} from "lucide-react";

const employees = [
    { init: "AR", color: "bg-[#F0266F]", name: "Ahmad Rizki", client: "→ PT Maju Jaya · Security", status: "Active", statusCls: "bg-green-900/30 text-green-400" },
    { init: "DS", color: "bg-blue-500", name: "Dewi Sartika", client: "→ CV Sukses Mandiri · Cleaning", status: "Assigned", statusCls: "bg-pink-900/30 text-pink-400" },
    { init: "BS", color: "bg-orange-500", name: "Budi Santoso", client: "→ Available for deployment", status: "Available", statusCls: "bg-orange-900/30 text-orange-400" },
    { init: "SN", color: "bg-violet-500", name: "Siti Nurhaliza", client: "→ PT Global Tech · Admin", status: "Active", statusCls: "bg-green-900/30 text-green-400" },
    { init: "RH", color: "bg-green-600", name: "Rudi Hermawan", client: "→ PT Sejahtera Abadi · Driver", status: "Active", statusCls: "bg-green-900/30 text-green-400" },
];
const payrollRows = [
    { name: "Ahmad Rizki", days: "22 days · PT Maju Jaya", amount: "Rp 4,400,000" },
    { name: "Dewi Sartika", days: "20 days · CV Sukses Mandiri", amount: "Rp 3,800,000" },
    { name: "Siti Nurhaliza", days: "22 days + 4h OT · PT Global", amount: "Rp 5,200,000" },
    { name: "Rudi Hermawan", days: "21 days · PT Sejahtera", amount: "Rp 4,100,000" },
];

export default function Features() {
    return (
        <section id="features" className="py-24 px-6 bg-[#0f0f1a]">
            <div className="max-w-6xl mx-auto">
                <Reveal>
                    <Tag color="pink">Core Features</Tag>
                    <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mt-4 mb-0">
                        Deep dive into<br />what WorkZen does
                    </h2>
                </Reveal>

                <div className="flex flex-col gap-20 mt-18">
                    {/* Feature 1 */}
                    <Reveal>
                        <div className="grid md:grid-cols-2 gap-16 items-center mt-12">
                            <div>
                                <Tag color="pink">Employee Management</Tag>
                                <h3 className="text-3xl font-extrabold text-white mt-4 mb-3 tracking-tight leading-snug">All your outsourced employees in one place</h3>
                                <p className="text-white/50 text-sm leading-relaxed mb-6">Stop searching through folders and spreadsheets. WorkZen gives you a complete view of every employee — their assignment status, documents, performance, and history.</p>
                                <ul className="space-y-2.5">
                                    {["Complete employee profiles with documents", "Deployment history and client assignment tracking", "Contract expiry alerts and renewal management", "Employee status dashboard (active, on-leave, available)"].map(pt => (
                                        <li key={pt} className="flex gap-2.5 text-sm text-white/70">
                                            <span className="w-5 h-5 rounded-md bg-pink-900/30 text-[#F0266F] flex items-center justify-center flex-shrink-0 text-[10px] mt-0.5">✓</span>
                                            {pt}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="bg-[#1a1a2e] border border-white/8 rounded-2xl p-7 flex flex-col gap-3">
                                <div className="text-[10px] font-bold text-white/30 tracking-widest uppercase pb-3 border-b border-white/6 mb-1">👥 Employee List — 1,248 employees</div>
                                {employees.map(e => (
                                    <div key={e.name} className="flex items-center gap-3 p-2.5 pl-3.5 rounded-xl bg-white/[0.03] hover:bg-pink-900/10 transition-colors">
                                        <div className={`w-8 h-8 rounded-full ${e.color} flex items-center justify-center text-xs font-bold text-white flex-shrink-0`}>{e.init}</div>
                                        <div className="flex-1 min-w-0">
                                            <div className="text-sm font-semibold text-white">{e.name}</div>
                                            <div className="text-[11px] text-white/40">{e.client}</div>
                                        </div>
                                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide ${e.statusCls}`}>{e.status}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Reveal>

                    {/* Feature 2 */}
                    <Reveal>
                        <div className="grid md:grid-cols-2 gap-16 items-center">
                            <div className="bg-[#1a1a2e] border border-white/8 rounded-2xl p-7 order-2 md:order-1">
                                <div className="text-[10px] font-bold text-white/30 tracking-widest uppercase pb-3 border-b border-white/6 mb-2">💰 Payroll — March 2026</div>
                                {payrollRows.map(r => (
                                    <div key={r.name} className="flex justify-between items-center py-3 border-b border-white/5 last:border-0">
                                        <div>
                                            <div className="text-sm font-semibold text-white">{r.name}</div>
                                            <div className="text-[11px] text-white/35">{r.days}</div>
                                        </div>
                                        <div className="text-base font-extrabold text-green-400">{r.amount}</div>
                                    </div>
                                ))}
                                <div className="flex justify-between items-center mt-4 pt-4 border-t border-white/8">
                                    <span className="text-xs text-white/30">Total (1,248 employees)</span>
                                    <span className="text-2xl font-extrabold text-[#F0266F] tracking-tight">Rp 5.2B</span>
                                </div>
                            </div>
                            <div className="order-1 md:order-2">
                                <Tag color="green">Payroll Automation</Tag>
                                <h3 className="text-3xl font-extrabold text-white mt-4 mb-3 tracking-tight leading-snug">Process payroll in minutes, not days</h3>
                                <p className="text-white/50 text-sm leading-relaxed mb-6">WorkZen automatically calculates salary for every employee based on attendance records, client assignments, and contract terms. No more manual calculations.</p>
                                <ul className="space-y-2.5">
                                    {["Auto-calculate based on attendance & contract type", "BPJS, overtime, and deduction management", "Multi-client payroll in one run", "Export payslips as PDF or direct bank transfer"].map(pt => (
                                        <li key={pt} className="flex gap-2.5 text-sm text-white/70">
                                            <span className="w-5 h-5 rounded-md bg-green-900/30 text-green-400 flex items-center justify-center flex-shrink-0 text-[10px] mt-0.5">✓</span>
                                            {pt}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </Reveal>
                </div>
            </div>
        </section>
    );
}
