import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

import styles from "./LoginForm.module.css";

export default function LoginForm() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");

   const { login } = useAuth(); // 🔹 usamos directamente el contexto
  const navigate = useNavigate();
  const location = useLocation();

  const registered = location.state?.registered; 
  const from = location.state?.from?.pathname || "/perfil";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Simulación de login: usamos el nombre como usuario
    login({ id: "1", email, name: nombre });  // 🔹 activa isAuthenticated y guarda el user
    navigate(from, { replace: true }); // 🔹 redirige a la página que intentaba acceder
  };

  return (
    <section className={styles.registroForm}>
      <h2 className={styles.title}>Ingresar</h2>

      {registered && (
        <p className={styles.successMessage}>
          Registro exitoso, ahora inicia sesión.
        </p>
      )}

      <form className={styles.form} onSubmit={handleSubmit}>
        <label className={styles.label}>
          Nombre:
          <input
            type="text"
            className={styles.input}
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
        </label>
        <label className={styles.label}>
          Email:
          <input
            type="email"
            className={styles.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <button type="submit" className={styles.button}>
          Ingresar
        </button>
      </form>

      <p className={styles.redirectText}>
        ¿No tienes cuenta?{" "}
        <Link to="/registro" className={styles.link}>
          Regístrate aquí
        </Link>
      </p>
    </section>
  );
}
