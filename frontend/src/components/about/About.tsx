import { motion } from "framer-motion";
import styles from "./About.module.css";

const About = () => {
  return (
    <section className={styles.aboutSection}>
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className={styles.aboutTitle}
      >
        30 años acompañando a la música nacional
      </motion.h2>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className={styles.aboutText}
      >
        En <span className={styles.span}>La Araña Estudio</span>, 
        hemos asistido, entre ensayos, grabaciones y toques en vivo, a una gran cantidad de amigos y amigas de la escena musical independiente y profesional en los últimos 30 años. 
        Somos más que un estudio: somos parte de tu historia.
      </motion.p>
    </section>
  );
};

export default About;
