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
        30 años de música
      </motion.h2>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className={styles.aboutText}
      >
        En <span className={styles.span}>La Araña Estudio</span> te 
        asistimos en ensayos, grabaciones y toques en vivo desde 1995. Un gran número de artistas de nuestra escena musical independiente y profesional en los últimos 30 años han pasado por aquí. El respeto por lo que hacemos es lo que nos caracteriza, brindando un espacio donde la creatividad y la música, puedan fluir.
        
      </motion.p>
    </section>
  );
};

export default About;
