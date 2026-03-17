"use client"
import {Ref, useEffect, useRef, useState} from "react";

function useReveal() {
    const ref = useRef(null);
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const obs = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
            { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
        );
        obs.observe(el);
        return () => obs.disconnect();
    }, []);
    return [ref, visible];
}

type RevealProps = {
    children: React.ReactNode;
    delay?: number;
    className?: string;
}

const Reveal = ({ children, delay = 0, className = "" }: RevealProps) => {
    const [ref, visible] = useReveal();
    return (
        <div
            ref={ref as Ref<HTMLDivElement>}
            style={{ transitionDelay: `${delay}ms` }}
            className={`transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"} ${className}`}
        >
            {children}
        </div>
    );
}

const tagColors: { [key: string]: string } = {
    pink: "bg-pink-50 text-[#F0266F] border border-pink-200",
    green: "bg-green-50 text-green-700 border border-green-200",
    blue: "bg-blue-50 text-blue-700 border border-blue-200",
    orange: "bg-orange-50 text-orange-700 border border-orange-200",
};

type TagProps = {
    children: React.ReactNode;
    color: string;
}

export function Tag({ color = "pink", children }: TagProps) {
    return (
        <span className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold tracking-widest uppercase ${ tagColors[color] }`}>
      {children}
    </span>
    );
}

export default Reveal;
