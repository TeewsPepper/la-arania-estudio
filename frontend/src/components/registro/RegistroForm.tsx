import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
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
  const location = useLocation();
  const from = location.state?.from || "/";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.nombre.trim()) newErrors.nombre = "El nombre es obligatorio";
    if (!formData.email) newErrors.email = "El email es obligatorio";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email inválido";

    if (!formData.password) newErrors.password = "La contraseña es obligatoria";
    else if (formData.password.length < 6)
      newErrors.password = "Debe tener al menos 6 caracteres";

    if (formData.confirmPassword !== formData.password)
      newErrors.confirmPassword = "Las contraseñas no coinciden";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    console.log("Formulario válido ✅", formData);

    // Aquí iría la llamada real al backend
    localStorage.setItem("isAuthenticated", "true");
    navigate(from, { replace: true });
  };

  return (
    <section className={styles.registroForm}>
      <h2 className={styles.title}>Crea una Cuenta</h2>
      <form className={styles.form} onSubmit={handleSubmit}>
        <label className={styles.label}>
          Nombre:
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            className={`${styles.input} ${errors.nombre ? styles.errorInput : ""}`}
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
            className={`${styles.input} ${errors.nombre ? styles.errorInput : ""}`}
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
            className={`${styles.input} ${errors.nombre ? styles.errorInput : ""}`}
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
            className={`${styles.input} ${errors.nombre ? styles.errorInput : ""}`}
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

      <p className={styles.redirectText}>
        ¿Ya tienes cuenta?{" "}
        <Link to="/login" className={styles.link}>
          Inicia sesión
        </Link>
      </p>
    </section>
  );
}
