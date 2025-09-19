/* 
import { FaFacebookF, FaInstagram, FaYoutube } from "react-icons/fa";
import styles from "./SocialNavbar.module.css";

export default function SocialNavbar() {
  return (
    <>
    <h2 className={styles.title}>Contacto</h2>
    
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
 */

import { FaFacebookF, FaInstagram, FaYoutube } from "react-icons/fa";
import styles from "./SocialNavbar.module.css";

export default function SocialNavbar() {
  return (
    <>
      <h2 className={styles.title}>Contacto</h2>

      {/* Correos de contacto */}
      <div className={styles.contact}>
        <ul className={styles.emailList}>
          <li>
            <span className={styles.label}>Información General:</span>
            <a
              className={styles.link}
              href="mailto:info@araniauy.com"
              aria-label="Enviar correo a info@araniauy.com"
            >
              info@araniauy.com
            </a>
          </li>
          <li>
            <span className={styles.label}>Por Reservas:</span>
            <a
              className={styles.link}
              href="mailto:reservas@araniauy.com"
              aria-label="Enviar correo a reservas@araniauy.com"
            >
              reservas@araniauy.com
            </a>
          </li>
          <li>
            <span className={styles.label}>Administración:</span>
            <a
              className={styles.link}
              href="mailto:admin@araniauy.com"
              aria-label="Enviar correo a admin@araniauy.com"
            >
              admin@araniauy.com
            </a>
          </li>
        </ul>
        <p className={styles.socialText}>O visitanos en nuestras redes sociales:</p>
      </div>

      {/* Redes sociales */}
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
