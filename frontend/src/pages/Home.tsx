import Footer from "../components/Footer";
import HeroSection from "../components/HeroSection";
import Navbar from "../components/Navbar";
import ServicesSlider from "../components/ServicesSlider";
import logoBg from '../assets/images/logo-bg-transparent.png'
import styles from '../styles/Home.module.css'

function Home() {
  return (
    <div className={styles.container}>
      <img src={logoBg} alt="La Araña Logo" className={styles.backgroundLogo} />
      <Navbar />
      <main>
        <HeroSection />
        <ServicesSlider />
      </main>
      <Footer />
    </div>
  );
}

export default Home;
