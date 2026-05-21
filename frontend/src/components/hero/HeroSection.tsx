import { motion } from "framer-motion";
import { API_URL } from "../../config/api";
import styles from "./HeroSection.module.css";

const HeroSection = () => {
  return (
    <section className={styles.hero}>
      <motion.div
        className={styles.textContainer}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        <h1 className={styles.title}>
          <span>La Araña</span> Estudio
        </h1>
        <h2>Registrate y acumulá tu primer hora gratis<br></br>
        <button className={styles.googleButton} onClick={() => window.open(`${API_URL}/auth/google`, "_self")}>
  <img src="/google-logo.svg" alt="Google" className={styles.googleLogo} />
</button> 
        <br />
        O también podés</h2>

        {/* <p className={styles.subtitle}>
          Sala de ensayo y grabación en Montevideo para músicos y bandas.
        </p> */}
      </motion.div>
    </section>
  );
};

export default HeroSection;
