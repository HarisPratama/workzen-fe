import Reveal from "@/app/_components/landing_page/Reveal";
import {Tag} from "lucide-react";

const problems = [
    { icon: "📊", title: "Attendance tracked manually", desc: "Collecting daily attendance from multiple client sites via WhatsApp is error-prone and time-consuming." },
    { icon: "💸", title: "Payroll calculations are messy", desc: "Calculating salary for hundreds of employees across different clients takes days every month." },
    { icon: "🗂️", title: "Client assignments hard to track", desc: "Who is deployed where? Which contract expires this month? No one knows until it's too late." },
    { icon: "⚠️", title: "Employee data scattered everywhere", desc: "Documents, contracts, and personal data spread across folders, emails, and Excel files." },
];
const sheetRows = [
    { name: "Ahmad Rizki", client: "PT Maju Jaya", att: "22/26 days", status: "OK", cls: "" },
    { name: "Dewi Sari", client: "???", att: "BELUM", status: "⚠", cls: "bg-yellow-50" },
    { name: "Budi S.", client: "PT Global", att: "ERROR", status: "❌", cls: "bg-red-50" },
    { name: "Siti N.", client: "-", att: "Manual", status: "?", cls: "bg-yellow-50" },
    { name: "Rudi H.", client: "CV Karya", att: "-", status: "❌", cls: "bg-red-50" },
];

const Problem = () => {
    return (
        <section id="problem" className="py-24 px-6 bg-gray-50">
            <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
                <div>
                    <Reveal>
                        <Tag color="pink">The Problem</Tag>
                    </Reveal>
                    <Reveal delay={80}>
                        <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mt-4 mb-4 leading-[1.12]">
                            Managing outsourced<br />employees is <em className="not-italic text-[#F0266F]">chaos</em>
                        </h2>
                    </Reveal>
                    <Reveal delay={120}>
                        <p className="text-gray-500 text-base leading-relaxed mb-8">
                            Sound familiar? Most outsourcing companies still rely on spreadsheets, WhatsApp groups, and manual processes to manage hundreds of employees.
                        </p>
                    </Reveal>
                    <div className="flex flex-col gap-3.5">
                        {problems.map((p, i) => (
                            <Reveal key={p.title} delay={160 + i * 60}>
                                <div className="flex gap-4 items-start bg-white border border-gray-200 rounded-2xl p-5 hover:border-[#F0266F] hover:translate-x-1.5 hover:shadow-lg hover:shadow-pink-100 transition-all group">
                                    <div className="w-11 h-11 bg-pink-50 rounded-xl flex items-center justify-center text-xl flex-shrink-0">{p.icon}</div>
                                    <div>
                                        <div className="font-bold text-sm text-[#1a1a2e] mb-1">{p.title}</div>
                                        <div className="text-xs text-gray-400 leading-relaxed">{p.desc}</div>
                                    </div>
                                </div>
                            </Reveal>
                        ))}
                    </div>
                </div>

                <Reveal delay={100}>
                    <div className="bg-gradient-to-br from-pink-50 to-pink-100 border border-pink-200 rounded-3xl p-8 relative overflow-hidden">
                        <span className="absolute right-5 top-5 text-4xl opacity-20">😫</span>
                        <p className="text-xs font-bold text-red-500 text-center mb-4">⚠️ Your current system</p>
                        <div className="bg-white rounded-xl overflow-hidden shadow-md">
                            <div className="grid grid-cols-4 gap-2 px-4 py-2.5 bg-gray-100 border-b border-gray-200 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                                <span>Employee</span><span>Assigned To</span><span>Attendance</span><span>Status</span>
                            </div>
                            {sheetRows.map((r) => (
                                <div key={r.name} className={`grid grid-cols-4 gap-2 px-4 py-2.5 border-b border-gray-50 text-xs text-gray-500 last:border-0 ${r.cls}`}>
                                    <span>{r.name}</span><span>{r.client}</span><span>{r.att}</span><span>{r.status}</span>
                                </div>
                            ))}
                        </div>
                        <p className="text-center text-[#F0266F] text-xs font-bold mt-4 tracking-wide">🔥 DATA_FINAL_v3_REVISED_FINAL2.xlsx</p>
                    </div>
                </Reveal>
            </div>
        </section>
    );
}

export default Problem;
