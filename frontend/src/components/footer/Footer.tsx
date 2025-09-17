import styles from "./Footer.module.css";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        

       

        {/* Copyright */}
        <p className={styles.copyright}>
          © {currentYear} LA ARAÑA. Todos los derechos reservados.
        </p>

        {/* Credits */}
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
