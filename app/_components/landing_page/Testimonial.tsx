import Reveal from "@/app/_components/landing_page/Reveal";
import {Tag} from "lucide-react";

const testimonials = [
    { init: "BW", color: "bg-[#F0266F]", quote: "WorkZen completely transformed how we manage our 300+ outsourced employees. What used to take our HR team a week now takes less than an hour.", name: "Bapak Wahyu", role: "HR Director · PT Maju Jaya Outsourcing" },
    { init: "SR", color: "bg-blue-500", quote: "The payroll automation alone saved us 3 days every month. We used to have 2 people dedicated just to calculating salaries. Now it's fully automated.", name: "Sari Ramadhani", role: "Operations Manager · CV Sukses Mandiri" },
    { init: "DK", color: "bg-orange-500", quote: "Client assignment tracking is a game-changer. We can now see exactly who is deployed where, and get alerts before contracts expire. No more surprises.", name: "Dhika Kurniawan", role: "CEO · PT Global Workforce Indonesia" },
];

export default function Testimonials() {
    return (
        <section className="py-24 px-6 bg-gray-50">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-14">
                    <Reveal><Tag color="pink">Testimonials</Tag></Reveal>
                    <Reveal delay={80}><h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mt-4">Trusted by outsourcing leaders</h2></Reveal>
                </div>
                <div className="grid md:grid-cols-3 gap-6">
                    {testimonials.map((t, i) => (
                        <Reveal key={t.name} delay={i * 80}>
                            <div className="bg-white border border-gray-200 rounded-2xl p-8 hover:border-[#F0266F] hover:shadow-xl hover:shadow-pink-100/60 transition-all h-full flex flex-col">
                                <div className="text-yellow-400 tracking-widest mb-4">★★★★★</div>
                                <p className="text-sm text-[#1a1a2e] leading-relaxed italic flex-1 mb-6">"{t.quote}"</p>
                                <div className="flex items-center gap-3">
                                    <div className={`w-11 h-11 rounded-full ${t.color} flex items-center justify-center text-sm font-extrabold text-white flex-shrink-0`}>{t.init}</div>
                                    <div>
                                        <div className="font-bold text-sm">{t.name}</div>
                                        <div className="text-xs text-gray-400">{t.role}</div>
                                    </div>
                                </div>
                            </div>
                        </Reveal>
                    ))}
                </div>
            </div>
        </section>
    );
}
