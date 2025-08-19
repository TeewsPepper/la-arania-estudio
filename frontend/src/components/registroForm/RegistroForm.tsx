import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./RegistroForm.module.css";

export default function RegistroForm() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // Ruta a la que redirigir después del registro (ej: /promocion-detalles/1)
  const from = location.state?.from || "/";


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ nombre, email });
    
    
    // 1. Aquí harías el registro real (ej: con axios.post)
    // 2. LUEGO rediriges a la ruta guardada (from)
    navigate(from, { replace: true });

    // Opcional: Guarda el estado de autenticación (ej: con un contexto)
    localStorage.setItem("isAuthenticated", "true"); // Solución temporal
  };

  return (
    <section className={styles.registroForm}>
        <h2 className={styles.title}>Registrate y empezá a ganar</h2>
      
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
            Registrarse
          </button>
        </form>
      </section>
    
  );
}
