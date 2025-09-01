import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  sanitizeHumanName, 
  sanitizeEmail, 
  ValidationError, 
  sanitizeRegisterForm 
} from "../../utils/sanitize";
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

  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof FormData, boolean>>>({});

  const navigate = useNavigate();

  const validateField = (field: keyof FormData, value: string) => {
    try {
      switch (field) {
        case "nombre":
          sanitizeHumanName(value);
          break;
        case "email":
          sanitizeEmail(value);
          break;
        case "password":
          if (value.length < 8) throw new ValidationError("La contraseña debe tener al menos 8 caracteres.");
          break;
        case "confirmPassword":
          if (value !== formData.password) throw new ValidationError("Las contraseñas no coinciden.");
          break;
      }
      setErrors(prev => ({ ...prev, [field]: undefined }));
    } catch (err) {
      if (err instanceof ValidationError) {
        setErrors(prev => ({ ...prev, [field]: err.message }));
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (touched[name as keyof FormData]) {
      validateField(name as keyof FormData, value);
    }
    if (name === "password" && touched.confirmPassword) {
      // revalidar confirmPassword si cambió password
      validateField("confirmPassword", formData.confirmPassword);
    }
  };

  const handleBlur = (field: keyof FormData) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    validateField(field, formData[field]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // marcar todos como touched
    setTouched({ nombre: true, email: true, password: true, confirmPassword: true });

    try {
      // Validación final
      sanitizeRegisterForm(formData);

      // Redirigir al login con mensaje de éxito
      navigate("/login", { replace: true, state: { registered: true } });
    } catch (err) {
      if (err instanceof ValidationError) {
        // Actualiza todos los errores que pueda haber
        const msg = err.message.toLowerCase();
        setErrors({
          nombre: msg.includes("nombre") ? err.message : undefined,
          email: msg.includes("email") ? err.message : undefined,
          password: msg.includes("contraseña") ? err.message : undefined,
          confirmPassword: msg.includes("contraseñas") ? err.message : undefined,
        });
      } else {
        console.error(err);
      }
    }
  };

  const isDisabled = !formData.nombre || !formData.email || !formData.password || !formData.confirmPassword ||
    !!errors.nombre || !!errors.email || !!errors.password || !!errors.confirmPassword;

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
            onBlur={() => handleBlur("nombre")}
            className={`${styles.input} ${errors.nombre ? styles.errorInput : ""}`}
            maxLength={60}
            required
          />
          {touched.nombre && errors.nombre && (
            <span className={styles.error}>{errors.nombre}</span>
          )}
        </label>

        <label className={styles.label}>
          Email:
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            onBlur={() => handleBlur("email")}
            className={`${styles.input} ${errors.email ? styles.errorInput : ""}`}
            maxLength={120}
            required
          />
          {touched.email && errors.email && (
            <span className={styles.error}>{errors.email}</span>
          )}
        </label>

        <label className={styles.label}>
          Contraseña:
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            onBlur={() => handleBlur("password")}
            className={`${styles.input} ${errors.password ? styles.errorInput : ""}`}
            minLength={8}
            required
          />
          {touched.password && errors.password && (
            <span className={styles.error}>{errors.password}</span>
          )}
        </label>

        <label className={styles.label}>
          Confirmar contraseña:
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            onBlur={() => handleBlur("confirmPassword")}
            className={`${styles.input} ${errors.confirmPassword ? styles.errorInput : ""}`}
            required
          />
          {touched.confirmPassword && errors.confirmPassword && (
            <span className={styles.error}>{errors.confirmPassword}</span>
          )}
        </label>

        <button type="submit" className={styles.button} disabled={isDisabled}>
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
