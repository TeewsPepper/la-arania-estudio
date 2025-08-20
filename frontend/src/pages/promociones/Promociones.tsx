import PromoCard from "../../components/promocard/PromoCard";
import styles from "./Promociones.module.css";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import type { Variants } from "framer-motion";
import { promociones } from "../../data/promociones"; // Asegúrate de que la ruta es correcta

// Definición de tipos para las variantes de animación
const pageVariants: Variants = {
  initial: {
    opacity: 0,
    x: "10%",
  },
  in: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 20,
      staggerChildren: 0.1,
      when: "beforeChildren",
    },
  },
  out: {
    opacity: 0,
    x: "-10%",
    transition: {
      duration: 0.3,
    },
  },
};

const cardVariants: Variants = {
  initial: {
    y: 20,
    opacity: 0,
    scale: 0.95,
  },
  in: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 150,
      damping: 15,
    },
  },
  hover: {
    y: -5,
    boxShadow: "0 0 15px var(--accent-color)",
    transition: {
      duration: 0.3,
    },
  },
};

const titleVariants: Variants = {
  initial: {
    y: -30,
    opacity: 0,
  },
  in: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 120,
      damping: 10,
    },
  },
};

const containerVariants: Variants = {
  in: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};



export default function Promociones() {
  // Suavizar el scroll y resetear animaciones al entrar
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="promociones-page"
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        className={styles.promocionesWrapper}
      >
        <motion.h2 className={styles.sectionTitle} variants={titleVariants}>
          Más tiempo para tocar
        </motion.h2>

        <motion.div
          className={styles.promocionContainer}
          variants={containerVariants}
        >
          {promociones.map((promo) => (
            <motion.div
              key={promo.id}
              variants={cardVariants}
              /* whileHover="hover" */
              className={styles.promoCard}
            >
              <PromoCard
                id={promo.id}
                title={promo.title}
                description={promo.description}
              />
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
