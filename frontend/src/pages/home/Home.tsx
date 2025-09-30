import About from "../../components/about/About";
import HeroSection from "../../components/hero/HeroSection";
import HomeCTA from "../../components/homeCta/HomeCTA";

import ServicesSlider from "../../components/slider/ServicesSlider";
import styles from "./Home.module.css";



export default function Home() {
  return (
    <main>
      
      <HeroSection />
      <HomeCTA />
      <ServicesSlider />
      <About />

      {/* === SEO oculto para buscadores === */}
      <section className={styles.visuallyHiddenSEO}>
        <h2>Sala de ensayo en Montevideo</h2>
        <p>
          La Araña Estudio es una <strong>sala de ensayo en Montevideo</strong> con más de 30 años de experiencia en la música. 
          Ofrecemos un espacio totalmente equipado para bandas, solistas y proyectos musicales que buscan calidad y comodidad.
        </p>

        <h2>Estudio de grabación profesional</h2>
        <p>
          Contamos con un <strong>estudio de grabación en Montevideo</strong> diseñado para grabar, mezclar y producir con estándares profesionales. 
          Trabajamos con músicos locales e internacionales en un ambiente creativo e inspirador.
        </p>

        <h2>Ensayos y producción musical</h2>
        <p>
          En La Araña Estudio podés reservar tu sala de ensayo, grabar tu música y acceder a servicios de 
          <em>producción musical</em>. Estamos ubicados en Montevideo, con fácil acceso desde distintos barrios de la ciudad.
        </p>
      </section>
    </main>
  );
}

 
