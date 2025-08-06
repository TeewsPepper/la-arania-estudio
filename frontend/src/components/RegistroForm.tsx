import { useState } from 'react';
import styles from '../styles/RegistroForm.module.css';

export default function RegistroForm() {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ nombre, email });
    // Aquí podrías enviar los datos con axios.post('/api/registro', { nombre, email })
  };

  return (
    <section className={styles.section}>
      <h2 className={styles.title}>Registro</h2>
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
        <button type="submit" className={styles.button}>Registrarse</button>
      </form>
    </section>
  );
}
