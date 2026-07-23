import { AboutSection } from "@/components/sections/about-section";
import { CompaniesSection } from "@/components/sections/companies-section";
import { CoursesSection } from "@/components/sections/courses-section";
import { FinalCta } from "@/components/sections/final-cta";
import { Footer } from "@/components/sections/footer";
import { HeroIntro } from "@/components/sections/hero-intro";
import { IntroOverlay } from "@/components/animations/intro-overlay";
import { MentorsSection } from "@/components/sections/mentors-section";
import { Navbar } from "@/components/sections/navbar";
import { ResultsSection } from "@/components/sections/results-section";
import { TestimonialsSection } from "@/components/sections/testimonials-section";

export default function Home() {
  return (
    <>
      <IntroOverlay />
      <Navbar />
      <main id="main-content">
        <HeroIntro />
        <AboutSection />
        <CoursesSection />
        <CompaniesSection />
        <ResultsSection />
        <TestimonialsSection />
        <MentorsSection />
        <FinalCta />
        <Footer />
      </main>
    </>
  );
}
