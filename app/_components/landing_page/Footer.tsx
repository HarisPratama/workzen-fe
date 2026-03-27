import Image from "next/image";

const footerLinks = {
    Product: ["Features", "Pricing", "Changelog", "Roadmap"],
    Resources: ["Documentation", "API Reference", "Blog", "Help Center"],
    Company: ["About", "Contact", "Privacy Policy", "Terms of Service"],
};

export default function Footer() {
    return (
        <footer className="bg-[#0f0f1a] border-t border-white/5 px-6 py-14">
            <div className="max-w-6xl mx-auto">
                <div className="grid md:grid-cols-4 gap-12 mb-12">
                    <div>
                        <div className="flex items-center gap-2.5 font-extrabold text-xl text-white mb-3">
                            <Image src="/workzen.png" alt="WorkZen" width={32} height={32} className="rounded-lg" />
                            WorkZen
                        </div>
                        <p className="text-sm text-white/35 leading-relaxed max-w-[200px]">The all-in-one workforce management platform built for outsourcing companies.</p>
                    </div>
                    {Object.entries(footerLinks).map(([heading, links]) => (
                        <div key={heading}>
                            <h4 className="text-xs font-bold text-white/50 tracking-widest uppercase mb-4">{heading}</h4>
                            <ul className="space-y-2.5">
                                {links.map(l => <li key={l}><a href="#" className="text-sm text-white/35 hover:text-white transition-colors no-underline">{l}</a></li>)}
                            </ul>
                        </div>
                    ))}
                </div>
                <div className="flex flex-col md:flex-row justify-between items-center gap-3 pt-7 border-t border-white/5 text-sm text-white/30">
                    <span>© 2026 WorkZen. All rights reserved.</span>
                    <span>🇮🇩 Made for Indonesian outsourcing companies</span>
                </div>
            </div>
        </footer>
    );
}
