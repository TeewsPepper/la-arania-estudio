import { useState, useEffect } from "react";
import styles from './Layout.module.css';
import logoBg from '../../assets/images/logo-bg-transparent.png';
import { Outlet } from "react-router-dom";
import Footer from '../footer/Footer';
import Navbar from '../navbar/Navbar';
import SocialNavbar from '../social/SocialNavbar';
import MapSection from './mapSection/MapSection';

const Layout: React.FC = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300); // Ajusta la altura donde aparece
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className={styles.container}>
      <img 
        src={logoBg} 
        alt="Fondo La Araña" 
        className={styles.backgroundLogo} 
      />
      <Navbar />
      
      <main><Outlet/></main>
      <SocialNavbar />
      <MapSection/>
      <Footer />

      {showScrollTop && (
        <button
          className={styles.scrollTopButton}
          onClick={scrollToTop}
          aria-label="Volver arriba"
        >
          ↑
        </button>
      )}
    </div>
  );
};

export default Layout;
