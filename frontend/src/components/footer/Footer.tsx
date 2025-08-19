import styles from "./Footer.module.css";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <p>
          <a
            className={styles.link}
            aria-label="Enviar correo a contacto@laraniayu.com"
            href="mailto:contacto@laraniayu.com"
          >
            contacto@laraniauy.com
          </a>
        </p>
        <p className={styles.copyright}>
          © {currentYear} LA ARAÑA. Todos los derechos reservados.
        </p>
        <p className={styles.credits}>
          Powered by{" "}
          <a
            href="https://teewspepper.com"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.link}
          >
            TeewsPepper
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
