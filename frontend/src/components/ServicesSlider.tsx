import { motion, AnimatePresence } from "framer-motion";
import type { Variants } from "framer-motion";
import { useState, useEffect } from "react";
import styles from '../styles/ServicesSlider.module.css';

interface Service {
  id: number;
  title: string;
  description: string;
}

const ServicesSlider = () => {
  const services: Service[] = [
    {
      id: 1,
      title: 'Grabaciones',
      description: 'No dejes que la música se te escape'
    },
    {
      id: 2,
      title: 'Ensayos',
      description: 'Espacio equipado para bandas y artistas'
    },
    {
      id: 3,
      title: 'Producciones',
      description: 'Ayuda en la creación y mezcla de tus tracks'
    },
    {
      id: 4,
      title: 'Sesiones en Vivo',
      description: 'Grabación de presentaciones en directo'
    }
  ];

  const [activeIndex, setActiveIndex] = useState(0);

  // Configuración de tiempos (milisegundos)
  const ENTER_DURATION = 1000;
  const CENTER_DURATION = 900; // 4 segundos en centro
  const EXIT_DURATION = 6000;

  useEffect(() => {
    const totalDuration = ENTER_DURATION + CENTER_DURATION + EXIT_DURATION;
    const timer = setTimeout(() => {
      setActiveIndex((prev) => (prev + 1) % services.length);
    }, totalDuration);

    return () => clearTimeout(timer);
  }, [activeIndex, services.length]);

  // Efecto GLITCH para letras
  const glitchEffect: Variants = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.3
      }
    }
  };

  const glitchLetter: Variants = {
    hidden: { 
      y: -30, 
      x: -10, 
      opacity: 0,
      scale: 1.5
    },
    visible: {
      y: 0,
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring" as const,
        stiffness: 300,
        damping: 15
      }
    }
  };

  // Animación principal con parpadeo
  const slideVariants: Variants = {
    enter: {
      x: "100vw",
      opacity: 0,
      scale: 1.5,
      rotate: 20,
      filter: "blur(10px) drop-shadow(0 0 15px var(--accent-color))",
      transition: {
        type: "spring" as const,
        stiffness: 200,
        damping: 20,
        duration: ENTER_DURATION / 1000
      }
    },
    center: {
      x: 0,
      opacity: [1, 0.7, 1, 0.8, 1], // Parpadeo
      scale: [1, 1.03, 1], // Pulso sutil
      rotate: 0,
      filter: "blur(0px)",
      transition: {
        duration: CENTER_DURATION / 1000,
        ease: "linear",
        times: [0, 0.3, 0.6, 0.8, 1]
      }
    },
    exit: {
      x: "-100vw",
      opacity: 0,
      scale: 0.7,
      rotate: -25,
      filter: "blur(12px) hue-rotate(45deg)",
      transition: {
        type: "tween" as const,
        ease: "easeIn",
        duration: EXIT_DURATION / 1000
      }
    }
  };

  return (
    <div className={styles.sliderContainer}>
      <AnimatePresence mode="wait">
        <motion.div
          key={services[activeIndex].id}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          className={styles.slide}
        >
          {/* Título con efecto GLITCH */}
          <motion.h3
            className={styles.serviceTitle}
            variants={glitchEffect}
            initial="hidden"
            animate="visible"
          >
            {services[activeIndex].title.split("").map((letter, index) => (
              <motion.span 
                key={index} 
                variants={glitchLetter}
                style={{ display: letter === ' ' ? 'inline' : 'inline-block' }}
              >
                {letter}
              </motion.span>
            ))}
          </motion.h3>

          {/* Descripción con parpadeo independiente */}
          <motion.p
            className={styles.serviceDescription}
            initial={{ opacity: 0, y: 10 }}
            animate={{ 
              opacity: [1, 0.8, 1],
              y: 0,
              scale: [1, 1.01, 1]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5
            }}
          >
            {services[activeIndex].description}
          </motion.p>
        </motion.div>
      </AnimatePresence>

      {/* Indicadores de posición */}
      <div className={styles.dotsContainer}>
        {services.map((_, index) => (
          <motion.button
            key={index}
            className={`${styles.dot} ${index === activeIndex ? styles.activeDot : ''}`}
            onClick={() => setActiveIndex(index)}
            whileHover={{ scale: 1.3 }}
            whileTap={{ scale: 0.9 }}
            aria-label={`Ir a servicio ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default ServicesSlider;