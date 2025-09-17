
import { FaFacebookF, FaInstagram, FaYoutube } from "react-icons/fa";
import styles from "./SocialNavbar.module.css";

export default function SocialNavbar() {
  return (
    <>
    <h2 className={styles.title}>Contacto</h2>
    {/* Correo de contacto */}
    <div className={styles.contact}>
        <p>
          <a
            className={styles.links}
            aria-label="Enviar correo a contacto@laraniauy.com"
            href="mailto:contacto@laraniauy.com"
          >
            contacto@laraniauy.com
          </a>
        </p>
        <p>O visitanos en nuestras redes sociales</p>
    </div>
      
    <nav className={styles.socialNavbar}>
      <ul className={styles.links}>
        <li>
          <a
            href="https://www.facebook.com/tuestudio"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaFacebookF />
          </a>
        </li>
        <li>
          <a
            href="https://www.instagram.com/tuestudio"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaInstagram />
          </a>
        </li>
        <li>
          <a
            href="https://www.youtube.com/tuestudio"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaYoutube />
          </a>
        </li>
      </ul>
    </nav>
    </>
  );
}
