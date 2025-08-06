
import { motion } from 'framer-motion'
import styles from '../styles/HeroSection.module.css'
/* import logoBg from '../assets/images/logo-bg-transparent.png' */
/* import ServicesSlider from './ServicesSlider' */

const HeroSection = () => {
  return (
    <section className={styles.hero}>
      {/* <img src={logoBg} alt="La Araña Logo" className={styles.backgroundLogo} /> */}
      {/* <ServicesSlider /> */}
      <motion.div
        className={styles.textContainer}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: 'easeOut' }}
      >
        <h1 className={styles.title}><span>La Araña</span> Estudio</h1>
        <p className={styles.subtitle}>
          Un espacio overground para crear sin límites.
        </p>
      </motion.div>
    </section>
  )
}

export default HeroSection
