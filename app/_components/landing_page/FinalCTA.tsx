import Reveal, { Tag } from "@/app/_components/landing_page/Reveal";
import Link from "next/link";

export default function CTA() {
    return (
        <section className="relative py-28 px-6 bg-[#0f0f1a] text-center overflow-hidden">
            <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 800px 500px at 50% 50%, rgba(240,38,111,0.12), transparent)" }} />
            <div className="relative z-10 max-w-xl mx-auto">
                <Reveal>
                    <Tag color="pink">Get Started Today</Tag>
                    <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white mt-6 mb-5 leading-[1.08]">
                        Start managing your<br />workforce <span className="text-[#F0266F]">smarter</span> today
                    </h2>
                    <p className="text-white/50 text-base mb-10 leading-relaxed">
                        Join 500+ outsourcing companies that have replaced their spreadsheets with WorkZen. Free to start, no credit card needed.
                    </p>
                    <div className="flex flex-wrap gap-4 justify-center">
                        <Link href="/register" className="px-8 py-4 bg-white text-[#0f0f1a] font-bold rounded-xl hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-white/20 transition-all no-underline">
                            Start Free Trial
                        </Link>
                        <Link href="/register" className="px-8 py-4 bg-transparent text-white/70 font-semibold border border-white/15 rounded-xl hover:border-white/40 hover:text-white transition-all no-underline">
                            Sign Up Now →
                        </Link>
                    </div>
                </Reveal>
            </div>
        </section>
    );
}
