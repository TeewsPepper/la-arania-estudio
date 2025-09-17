import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import styles from "./LoginForm.module.css";

export default function LoginForm() {
  const { fetchUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Detectar redirección desde backend después del login con Google
  useEffect(() => {
    const handleGoogleLogin = async () => {
      const user = await fetchUser();
      if (!user) return;
      navigate(user.role === "admin" ? "/admin" : "/perfil", { replace: true });
    };

    // Solo intentar obtener usuario si venimos del callback de Google
    if (location.pathname === "/login") {
      handleGoogleLogin();
    }
  }, [location.pathname, navigate, fetchUser]);

  return (
    <section className={styles.registroForm}>
      <h2 className={styles.title}>Ingresar</h2>

      <button
        className={styles.googleButton}
        onClick={() =>
          window.open(`${import.meta.env.VITE_BACKEND_URL}/auth/google`, "_self")
        }
      >
        <img
          src="/google-logo.svg"
          alt="Google"
          className={styles.googleLogo}
        />
        
      </button>
      <div className={styles.legal}>
        <p>
          <a className={styles.link} href="/privacidad">
            Política de Privacidad
          </a>{" | "}
          <a className={styles.link} href="/aviso-legal">
            Aviso Legal
          </a>
        </p>
      </div>
    </section>
  );
}
