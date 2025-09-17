
import { motion } from 'framer-motion'
import styles from './HeroSection.module.css'


const HeroSection = () => {
  return (
    <section className={styles.hero}>
      <motion.div
        className={styles.textContainer}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: 'easeOut' }}
      >
        <h1 className={styles.title}><span>La Araña</span> Estudio</h1>
        <h2>30 años de música</h2>
       {/*  <p className={styles.subtitle}>
          Un espacio overground, donde las reglas... las ponés vos, y la música... también.
        </p> */}
      </motion.div>
    </section>
  )
}

export default HeroSection
