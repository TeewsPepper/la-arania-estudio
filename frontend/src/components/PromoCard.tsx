// components/PromoCard/PromoCard.tsx
import styles from '../styles/PromoCard.module.css';


export default function PromoCard() {
  return (
    <div className={styles.card}>
      <h2>🎁 Promo especial</h2>
      <p>2 horas en sala + beneficios</p>
      <strong>Solo $1200</strong>
      <p>¡Podés usar tu hora ese mismo día!</p>
    </div>
  );
}

