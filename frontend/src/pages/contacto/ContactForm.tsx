import { useState } from "react";
import styles from "./ContactForm.module.css"; 
import { sanitizeContactForm, ValidationError } from "../../utils/sanitize"

export default function ContactForm() {

  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<null | "success" | "error">(null);
   const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

   const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    try {
      // 👇 aplicamos sanitización/validación aquí
      const clean = sanitizeContactForm({
        name: formData.name,
        email: formData.email,
        subject: "Contacto desde web", // fijo, no tienes campo "subject"
        message: formData.message,
      });

    // Simulación de envío
   console.log("Mensaje enviado:", clean);
      setStatus("success");
      setFormData({ name: "", email: "", message: "" });
    } catch (err) {
      setStatus("error");
      if (err instanceof ValidationError) {
        setErrorMsg(err.message); // mensaje específico (ej: email inválido)
      } else {
        setErrorMsg("Ocurrió un error. Verifica los datos.");
      }
    }
  };

  return (
    <div className={styles.container}>
      <h2>Contacto</h2>
      <form onSubmit={handleSubmit} className={styles.form} noValidate>
        <input
          type="text"
          name="name"
          placeholder="name"
          value={formData.name}
          onChange={handleChange}
          maxLength={60}
          autoComplete="name"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Correo electrónico"
          value={formData.email}
          onChange={handleChange}
          maxLength={120}
          autoComplete="email"
          required
        />
        <textarea
          name="message"
          placeholder="Escribe tu mensaje..."
          value={formData.message}
          onChange={handleChange}
          maxLength={1000}
          required
        />
        <button type="submit">Enviar</button>
      </form>

      {status === "success" && (
        <p className={styles.success}>✅ Mensaje enviado con éxito.</p>
      )}
      {status === "error" && (
        <p className={styles.error}>⚠ {errorMsg ?? "Todos los campos son obligatorios."}</p>
      )}
    </div>
  );
}
