import { FaFacebookF, /* FaInstagram, */ FaYoutube } from "react-icons/fa";
import styles from "./SocialNavbar.module.css";

export default function SocialNavbar() {
  return (
    <>
      <h2 className={styles.title}>Contacto</h2>

      {/* Correos de contacto */}
      <div className={styles.contact}>
        <ul className={styles.emailList}>
          {/* <li>
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
          </li> */}
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
        <p className={styles.socialText}>
          O visitanos en nuestras redes sociales:
        </p>
      </div>

      {/* Redes sociales */}
      <nav className={styles.socialNavbar}>
        <ul className={styles.links}>
          <li>
            <a
              href="https://www.facebook.com/profile.php?id=100054545105176"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visitar Facebook de La Araña Estudio"
              title="Facebook"
            >
              <FaFacebookF />
            </a>
          </li>
          {/* <li>
            <a
              href="https://www.instagram.com/jose_noel_gomez/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visitar Instagram de La Araña Estudio"
              title="Instagram"
            >
              <FaInstagram />
            </a>
          </li> */}
          <li>
            <a
              href="https://www.youtube.com/@TejiendoLaRed895"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visitar YouTube de La Araña Estudio"
              title="YouTube"
            >
              <FaYoutube />
            </a>
          </li>
        </ul>
      </nav>
    </>
  );
}
