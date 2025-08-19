import About from "../../components/about/About";
import HeroSection from "../../components/hero/HeroSection";

import ServicesSlider from "../../components/slider/ServicesSlider";
import CTAButton from "../../components/ui/CTAButton";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <CTAButton>Hacé tu Reserva</CTAButton>
      <ServicesSlider />
      <About />
    </main>
  );
}

 
