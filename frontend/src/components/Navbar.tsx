// src/components/Navbar/Navbar.tsx
import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import Logo from '../assets/images/logo.png'
import styles from '../styles/Navbar.module.css'

const Navbar = () => {
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  const toggleMenu = () => setMenuOpen(!menuOpen)

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        <Link to="/" onClick={() => setMenuOpen(false)}>
          <img src={Logo} alt="Logo La Araña" />
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
            to="/promo"
            className={`${location.pathname === '/promo' ? styles.active : ''}`}
            onClick={() => setMenuOpen(false)}
          >
            Promo
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
  )
}

export default Navbar
