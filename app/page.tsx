import Navbar from "@/app/_components/landing_page/Navbar";
import Hero from "@/app/_components/landing_page/Hero";
import Solution from "@/app/_components/landing_page/Solution";
import Features from "@/app/_components/landing_page/Features";
import Problem from "@/app/_components/landing_page/Problem";
import HowItWorks from "@/app/_components/landing_page/HowItWorks";
import Pricing from "@/app/_components/landing_page/Pricing";
import Testimonials from "@/app/_components/landing_page/Testimonial";
import FAQ from "@/app/_components/landing_page/Faq";
import CTA from "@/app/_components/landing_page/FinalCTA";
import Footer from "@/app/_components/landing_page/Footer";

export default function Home() {
  return (
    <div className="font-sans text-[#1a1a2e] bg-white overflow-x-hidden">
          <Navbar />
          <Hero />
          <Problem />
          <Solution />
          <Features />
          <HowItWorks />
          <Pricing />
          <Testimonials />
          <FAQ />
          <CTA />
          <Footer />
    </div>
  );
}
