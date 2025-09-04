import About from "../../components/about/About";
import HeroSection from "../../components/hero/HeroSection";
import HomeCTA from "../../components/homeCta/HomeCTA";

import ServicesSlider from "../../components/slider/ServicesSlider";



export default function Home() {
  return (
    <main>
      
      <HeroSection />
      <HomeCTA />
      <ServicesSlider />
      <About />
    </main>
  );
}

 
