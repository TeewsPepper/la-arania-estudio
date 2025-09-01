import { useState } from "react";
import { motion, useAnimation } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import logoBg from "../../assets/images/logo-bg-transparent.png";
import styles from "./Navbar.module.css";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth(); // ✅ solo user y logout
  const [menuOpen, setMenuOpen] = useState(false);
  const controls = useAnimation();

  const toggleMenu = () => setMenuOpen((v) => !v);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate("/");
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        <Link to="/" onClick={() => setMenuOpen(false)}>
          <motion.img
            src={logoBg}
            alt="Logo La Araña"
            animate={controls}
            initial={{ y: 0, x: 0, rotate: 0 }}
            style={{ position: "relative", zIndex: 20, transformOrigin: "center" }}
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
            className={location.pathname === "/promociones" ? styles.active : ""}
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

        {user ? (
          <>
            {user.role === "admin" ? (
              <li>
                <Link
                  to="/admin"
                  className={location.pathname.startsWith("/admin") ? styles.active : ""}
                  onClick={() => setMenuOpen(false)}
                >
                  Admin
                </Link>
              </li>
            ) : (
              <li>
                <Link
                  to="/perfil"
                  className={location.pathname.startsWith("/perfil") ? styles.active : ""}
                  onClick={() => setMenuOpen(false)}
                >
                  {user.nombre ?? "Mi Perfil"}
                </Link>
              </li>
            )}

            <li>
              <Link
                to="/"
                onClick={(e) => {
                  e.preventDefault();
                  handleLogout();
                }}
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
