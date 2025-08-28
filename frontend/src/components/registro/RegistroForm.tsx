import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { sanitizeRegisterForm, ValidationError } from "../../utils/sanitize"; 
import styles from "./RegistroForm.module.css";

interface FormData {
  nombre: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function RegistroForm() {
  const [formData, setFormData] = useState<FormData>({
    nombre: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const navigate = useNavigate();

   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    try {
      // 👇 Sanitización y validación
      sanitizeRegisterForm(formData);
      console.log("Registro exitoso:", formData);
      

      // Redirige al login con mensaje de registro exitoso
      navigate("/login", { replace: true, state: { registered: true } });
    } catch (err) {
      if (err instanceof ValidationError) {
        setErrors({ general: err.message });
      } else {
        setErrors({ general: "Ocurrió un error al registrarse." });
      }
    }
  };

  return (
     <section className={styles.registroForm}>
      <h2 className={styles.title}>Crea una Cuenta</h2>
      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <label className={styles.label}>
          Nombre:
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            className={`${styles.input} ${errors.nombre ? styles.errorInput : ""}`}
            maxLength={60}
            required
          />
          {errors.nombre && <span className={styles.error}>{errors.nombre}</span>}
        </label>

        <label className={styles.label}>
          Email:
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`${styles.input} ${errors.email ? styles.errorInput : ""}`}
            maxLength={120}
            required
          />
          {errors.email && <span className={styles.error}>{errors.email}</span>}
        </label>

        <label className={styles.label}>
          Contraseña:
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={`${styles.input} ${errors.password ? styles.errorInput : ""}`}
            minLength={6}
            required
          />
          {errors.password && <span className={styles.error}>{errors.password}</span>}
        </label>

        <label className={styles.label}>
          Confirmar contraseña:
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className={`${styles.input} ${errors.confirmPassword ? styles.errorInput : ""}`}
            required
          />
          {errors.confirmPassword && (
            <span className={styles.error}>{errors.confirmPassword}</span>
          )}
        </label>

        <button type="submit" className={styles.button}>
          Registrarse
        </button>
      </form>

      {errors.general && <p className={styles.error}>{errors.general}</p>}

      <p className={styles.redirectText}>
        ¿Ya tienes cuenta?{" "}
        <Link to="/login" className={styles.link}>
          Inicia sesión
        </Link>
      </p>
    </section>
  );
}
