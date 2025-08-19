
import styles from '../styles/Marcas.module.css';
import logoBg from "../assets/images/logo-bg-transparent.png";

// Array de marcas con sus colores característicos
const marcas = [
  { nombre: "Laney", color: "#FF0000", bgColor: "rgba(255, 0, 0, 0.1)" },
  { nombre: "Marshall", color: "#000000", bgColor: "rgba(0, 0, 0, 0.1)" },
  { nombre: "Shure", color: "#0099CC", bgColor: "rgba(0, 153, 204, 0.1)" },
  { nombre: "Yamaha", color: "#E41F26", bgColor: "rgba(228, 31, 38, 0.1)" },
  { nombre: "Audio-Technica", color: "#000000", bgColor: "rgba(0, 0, 0, 0.1)" },
  { nombre: "Mapex", color: "#003366", bgColor: "rgba(0, 51, 102, 0.1)" },
  { nombre: "Focusrite", color: "#FF6A00", bgColor: "rgba(255, 106, 0, 0.1)" }
];

export default function Marcas() {
  return (
    <div className={styles.container}>
      <img src={logoBg} alt="La Araña Logo" className={styles.backgroundLogo} />
      
      
        
        <div className={styles.marcas}>
          {marcas.map((marca, index) => (
            <div 
              key={index}
              className={styles.marcaCard}
              style={{ 
                backgroundColor: marca.bgColor,
                borderColor: marca.color
              }}
            >
              <span 
                className={styles.marcaNombre}
                style={{ color: marca.color }}
              >
                {marca.nombre}
              </span>
              <div 
                className={styles.colorBlock}
                style={{ backgroundColor: marca.color }}
              />
            </div>
          ))}
        </div>
      
      
    </div>
  );
}