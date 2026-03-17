const Hero = ()=> {
    return (
        <section className="relative min-h-screen flex flex-col items-center text-center pt-32 pb-20 px-6 overflow-hidden">
            {/* Backgrounds */}
            <div className="absolute inset-0 z-0"
                 style={{ background: "radial-gradient(ellipse 900px 600px at 50% -100px, rgba(240,38,111,0.09), transparent), radial-gradient(ellipse 400px 400px at 10% 80%, rgba(240,38,111,0.05), transparent), radial-gradient(ellipse 300px 300px at 90% 60%, rgba(59,130,246,0.05), transparent)" }} />
            <div className="absolute inset-0 z-0"
                 style={{ backgroundImage: "radial-gradient(circle, rgba(240,38,111,0.12) 1px, transparent 1px)", backgroundSize: "40px 40px", maskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black, transparent)" }} />

            <div className="relative z-10 max-w-3xl mx-auto">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 bg-pink-50 border border-pink-200 rounded-full pl-2 pr-4 py-1.5 mb-8 animate-[fadeDown_0.6s_ease_forwards]">
                    <div className="w-[22px] h-[22px] bg-[#F0266F] rounded-full flex items-center justify-center text-xs text-white">✦</div>
                    <span className="text-xs font-semibold text-[#F0266F]"># HR Platform for Outsourcing Companies</span>
                </div>

                {/* Title */}
                <h1 className="text-5xl md:text-7xl font-extrabold leading-[1.07] tracking-[-0.03em] text-[#1a1a2e] mb-6 opacity-0 animate-[fadeUp_0.7s_0.2s_forwards]">
                    Workforce Management<br />
                    for{" "}
                    <span className="text-[#F0266F] relative inline-block">
            Outsourcing
            <span className="absolute bottom-0.5 left-0 right-0 h-1 bg-pink-200 rounded-sm -z-10" />
          </span>{" "}
                    Companies
                </h1>

                {/* Sub */}
                <p className="text-lg md:text-xl text-gray-500 max-w-xl mx-auto mb-10 leading-relaxed font-light opacity-0 animate-[fadeUp_0.7s_0.4s_forwards]">
                    Manage your outsourced employees, client assignments, attendance, and payroll — all in one intelligent platform. Stop wrestling with spreadsheets.
                </p>

                {/* CTAs */}
                <div className="flex flex-wrap gap-3.5 justify-center mb-14 opacity-0 animate-[fadeUp_0.7s_0.6s_forwards]">
                    <a href="#" className="inline-flex items-center gap-2 px-8 py-4 bg-[#F0266F] text-white font-bold rounded-xl shadow-[0_4px_24px_rgba(240,38,111,0.3)] hover:bg-[#ff4d8d] hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(240,38,111,0.4)] transition-all no-underline text-base">
                        🚀 Start Free Trial
                    </a>
                    <a href="#" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#1a1a2e] font-semibold rounded-xl border border-gray-200 hover:border-[#F0266F] hover:text-[#F0266F] hover:-translate-y-0.5 transition-all no-underline text-base">
                        ▶ Request Demo
                    </a>
                </div>

                {/* Trust */}
                <div className="flex items-center justify-center gap-3 text-sm text-gray-400 opacity-0 animate-[fadeUp_0.7s_0.8s_forwards]">
                    <div className="flex">
                        {["AR", "DK", "SW", "MR", "BT"].map((i, idx) => (
                            <div key={i} className={`w-7 h-7 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-500 ${idx > 0 ? "-ml-2" : ""}`}>{i}</div>
                        ))}
                    </div>
                    <span>Trusted by <strong className="text-[#1a1a2e]">500+</strong> outsourcing companies across Indonesia</span>
                </div>
            </div>

            {/* Dashboard Preview */}
            <div className="relative z-10 mt-16 w-full max-w-4xl mx-auto opacity-0 animate-[fadeUp_0.8s_0.9s_forwards]">
                <div className="bg-white border border-gray-200 rounded-2xl shadow-[0_32px_80px_rgba(0,0,0,0.1)] overflow-hidden">
                    <div className="flex items-center gap-2 px-5 py-3.5 bg-gray-50 border-b border-gray-200">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
                        <div className="w-2.5 h-2.5 rounded-full bg-[#ffc12d]" />
                        <div className="w-2.5 h-2.5 rounded-full bg-[#29cc41]" />
                        <span className="ml-3 text-xs text-gray-400">WorkZen — Talent Overview</span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-7">
                        {[
                            { icon: "👥", bg: "bg-pink-50", num: "1,248", badge: "+4.2%", badgeColor: "text-green-500", label: "Total Headcount" },
                            { icon: "🆕", bg: "bg-green-50", num: "34", badge: "+12%", badgeColor: "text-green-500", label: "New Hires (Mo)" },
                            { icon: "📋", bg: "bg-orange-50", num: "18", badge: "4 depts", badgeColor: "text-[#F0266F]", label: "We're Hiring" },
                            { icon: "📉", bg: "bg-purple-50", num: "2.4%", badge: "+0.5%", badgeColor: "text-orange-500", label: "Turnover Rate" },
                        ].map((c) => (
                            <div key={c.label} className="bg-white border border-gray-100 rounded-2xl p-4">
                                <div className={`w-9 h-9 ${c.bg} rounded-xl flex items-center justify-center text-lg mb-3`}>{c.icon}</div>
                                <div className="text-2xl font-extrabold tracking-tight">
                                    {c.num} <span className={`text-xs font-semibold ${c.badgeColor}`}>{c.badge}</span>
                                </div>
                                <div className="text-xs text-gray-400 mt-0.5">{c.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <style>{`
        @keyframes fadeDown { from{opacity:0;transform:translateY(-16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
      `}</style>
        </section>
    );
}

export default Hero;
