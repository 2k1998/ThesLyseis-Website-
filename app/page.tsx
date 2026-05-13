import Hero from "@/components/Hero";
import TrustStrip from "@/components/TrustStrip";
import PromiseSection from "@/components/PromiseSection";
import HowItWorks from "@/components/HowItWorks";
import ServicesGrid from "@/components/ServicesGrid";
import FAQAccordion from "@/components/FAQAccordion";
import CTASection from "@/components/CTASection";

export default function Home() {
  return (
    <main className="w-full">
      <Hero />
      <TrustStrip />
      <PromiseSection />
      <HowItWorks />
      <ServicesGrid />
      <FAQAccordion />
      <CTASection />
    </main>
  );
}
