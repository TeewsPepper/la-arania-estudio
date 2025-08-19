
import { useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import logoBg from '../../assets/images/logo-bg-transparent.png';
import styles from './Navbar.module.css';

const Navbar = () => {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const controls = useAnimation();

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  useEffect(() => {
    const animateSpider = async () => {
      while (true) {
        await controls.start({
          y: [0, 150, 300, 450, 300, 150, 0],
          x: [0, -80, 50, -30, 0],
          rotate: [0, 5, -5, 3, 0],
          transition: { 
            duration: 6,
            ease: "easeInOut"
          }
        });

        await controls.start({
          y: [0, -10, 0],
          scale: [1, 1.1, 1],
          transition: {
            duration: 0.5,
            times: [0, 0.5, 1]
          }
        });

        await new Promise(resolve => setTimeout(resolve, 5000));
      }
    };

    animateSpider();

    return () => controls.stop();
  }, [controls]);

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        <Link to="/" onClick={() => setMenuOpen(false)}>
          <motion.img
            src={logoBg}
            alt="Logo La Araña"
            animate={controls}
            initial={{ y: 0, x: 0, rotate: 0 }}
            style={{ 
              position: 'relative',
              zIndex: 20,
              transformOrigin: 'center'
            }}
          />
        </Link>
      </div>

      <button 
        className={`${styles.hamburger} ${menuOpen ? styles.open : ''}`} 
        onClick={toggleMenu} 
        aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
      >
        <span className={styles.bar}></span>
        <span className={styles.bar}></span>
        <span className={styles.bar}></span>
      </button>

      <ul className={`${styles.links} ${menuOpen ? styles.showMenu : ''}`}>
        <li>
          <Link
            to="/"
            className={`${location.pathname === '/' ? styles.active : ''}`}
            onClick={() => setMenuOpen(false)}
          >
            Inicio
          </Link>
        </li>
        <li>
          <Link
            to="/promociones"
            className={`${location.pathname === '/promociones' ? styles.active : ''}`}
            onClick={() => setMenuOpen(false)}
          >
            Promociones
          </Link>
        </li>
        <li>
          <Link
            to="/login"
            className={`${location.pathname === '/login' ? styles.active : ''}`}
            onClick={() => setMenuOpen(false)}
          >
            Login
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;