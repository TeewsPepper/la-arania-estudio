import { useState, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth"; // 👈 usamos el hook
import logoBg from "../../assets/images/logo-bg-transparent.png";
import styles from "./Navbar.module.css";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, logout, user } = useAuth(); // 👈 más limpio
  const [menuOpen, setMenuOpen] = useState(false);
  const controls = useAnimation();

  const toggleMenu = () => setMenuOpen((v) => !v);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate("/");
  };

  // Animación del logo
  useEffect(() => {
    let isMounted = true;

    const animateSpider = async () => {
      while (isMounted) {
        await controls.start({
          y: [0, 150, 300, 450, 300, 150, 0],
          x: [0, -80, 50, -30, 0],
          rotate: [0, 5, -5, 3, 0],
          transition: { duration: 6, ease: "easeInOut" },
        });

        await controls.start({
          y: [0, -10, 0],
          scale: [1, 1.1, 1],
          transition: { duration: 0.5, times: [0, 0.5, 1] },
        });

        await new Promise((resolve) => setTimeout(resolve, 5000));
      }
    };

    animateSpider();

    return () => {
      isMounted = false; // corta el bucle cuando el componente se desmonta
      controls.stop();
    };
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
              position: "relative",
              zIndex: 20,
              transformOrigin: "center",
            }}
          />
        </Link>
      </div>

      <button
        className={`${styles.hamburger} ${menuOpen ? styles.open : ""}`}
        onClick={toggleMenu}
        aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
      >
        <span className={styles.bar} />
        <span className={styles.bar} />
        <span className={styles.bar} />
      </button>

      <ul className={`${styles.links} ${menuOpen ? styles.showMenu : ""}`}>
        <li>
          <Link
            to="/"
            className={location.pathname === "/" ? styles.active : ""}
            onClick={() => setMenuOpen(false)}
          >
            Inicio
          </Link>
        </li>
        <li>
          <Link
            to="/promociones"
            className={
              location.pathname === "/promociones" ? styles.active : ""
            }
            onClick={() => setMenuOpen(false)}
          >
            Promociones
          </Link>
        </li>
        <li>
          <Link
            to="/contacto"
            className={location.pathname === "/contacto" ? styles.active : ""}
            onClick={() => setMenuOpen(false)}
          >
            Contacto
          </Link>
        </li>

        {isAuthenticated ? (
          <>
            <li>
              <Link
                to="/perfil"
                className={
                  location.pathname.startsWith("/perfil") ? styles.active : ""
                }
                onClick={() => setMenuOpen(false)}
              >
                {user?.name ?? "Mi Perfil"}
              </Link>
            </li>
            <li>
              <Link
                to="/"
                onClick={(e) => {
                  e.preventDefault(); // evita navegación automática
                  handleLogout(); // ejecuta logout + navigate("/")
                }}
                className={location.pathname === "/" ? styles.active : ""}
              >
                Logout
              </Link>
            </li>
          </>
        ) : (
          <li>
            <Link
              to="/login"
              className={location.pathname === "/login" ? styles.active : ""}
              onClick={() => setMenuOpen(false)}
            >
              Login
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
