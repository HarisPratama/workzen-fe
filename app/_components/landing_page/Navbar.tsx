"use client"
import {useEffect, useState} from "react";
import Link from "next/link";

const Navbar = ()=> {
    const [scrolled, setScrolled] = useState(false);
    useEffect(() => {
        const fn = () => setScrolled(window.scrollY > 40);
        window.addEventListener("scroll", fn);
        return () => window.removeEventListener("scroll", fn);
    }, []);
    const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 h-[68px] flex items-center justify-between px-6 md:px-12 bg-white/90 backdrop-blur-xl border-b border-gray-200 transition-shadow duration-300 ${scrolled ? "shadow-lg shadow-black/5" : ""}`}>
            <a href="#" className="flex items-center gap-2.5 font-extrabold text-xl text-[#1a1a2e] no-underline">
                <div className="w-8 h-8 bg-[#F0266F] rounded-[9px] flex items-center justify-center text-base">🎯</div>
                WorkZen
            </a>
            <ul className="hidden md:flex gap-8 list-none">
                {["Features", "How It Works", "Pricing", "FAQ"].map((item) => (
                    <li key={item}>
                        <button onClick={() => scrollTo(item.toLowerCase().replace(/ /g, "-"))}
                                className="text-gray-500 text-sm font-medium hover:text-[#1a1a2e] transition-colors bg-transparent border-none cursor-pointer">
                            {item}
                        </button>
                    </li>
                ))}
            </ul>
            <div className="flex items-center gap-3">
                <Link href='/login'>
                    <span className="hidden md:inline-block px-5 py-2 text-sm font-semibold text-[#1a1a2e] border border-gray-200 rounded-xl hover:border-[#F0266F] hover:text-[#F0266F] transition-all no-underline">
                        Sign In
                    </span>
                </Link>
                <Link href="/register" className="px-5 py-2 text-sm font-semibold text-white bg-[#F0266F] rounded-xl hover:bg-[#ff4d8d] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-pink-400/30 transition-all no-underline">
                    Start Free Trial
                </Link>
            </div>
        </nav>
    );
}

export default Navbar;
