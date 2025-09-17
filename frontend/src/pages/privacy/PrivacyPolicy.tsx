// frontend/src/pages/PrivacyPolicy.tsx
import styles from "./PrivacyPolicy.module.css";

export default function PrivacyPolicy() {
  return (
    <main className={styles.legal}>
      <h1>Política de Privacidad</h1>
      <p>
        En <strong>La Araña Estudio</strong> respetamos tu privacidad. 
        Esta política explica cómo tratamos los datos personales de nuestros usuarios.
      </p>

      <h2>Datos que recopilamos</h2>
      <p>
        Podemos recopilar información como tu nombre, correo electrónico y datos de contacto 
        únicamente cuando los proporciones de forma voluntaria (por ejemplo, al registrarte o contactarnos).
      </p>

      <h2>Uso de la información</h2>
      <p>
        Utilizamos los datos para gestionar reservas, responder consultas y mejorar nuestros servicios. 
        Nunca compartiremos tu información con terceros sin tu consentimiento, salvo obligación legal.
      </p>

      <h2>Cookies</h2>
      <p>
        Este sitio utiliza cookies técnicas para el correcto funcionamiento de la página. 
        Puedes deshabilitarlas en la configuración de tu navegador.
      </p>

      <h2>Tus derechos</h2>
      <p>
        Puedes solicitar acceso, corrección o eliminación de tus datos en cualquier momento 
        escribiendo a <strong>contacto@laaranaestudio.com</strong>.
      </p>
    </main>
  );
}
