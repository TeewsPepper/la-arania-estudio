import About from "../../components/about/About";
import HeroSection from "../../components/hero/HeroSection";
import HomeCTA from "../../components/homeCta/HomeCTA";

import ServicesSlider from "../../components/slider/ServicesSlider";
/* import TestLoginButtons from "../../components/test/TestLoginButton"; */


export default function Home() {
  return (
    <main>
      {/* <TestLoginButtons /> */}
      <HeroSection />
      <HomeCTA />
      <ServicesSlider />
      <About />
    </main>
  );
}

 
