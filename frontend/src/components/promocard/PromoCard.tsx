/* import styles from './PromoCard.module.css';
interface PromoCardProps {
  title: string;
  description: string;
}

export default function PromoCard({ title, description }: PromoCardProps) {
  return (
    <div className={styles.promoCard}>
      <h3 className={styles.cardTitle}>{title}</h3>
      <p className={styles.cardDesc}>{description}<span><a className={styles.anchorCard} href=''>ver condiciones</a></span></p>
    </div>
  );
} */
import styles from './PromoCard.module.css';
import { Link } from 'react-router-dom'; // Importa Link

interface PromoCardProps {
  id: string; // Añade id como prop
  title: string;
  description: string;
}

export default function PromoCard({ id, title }: PromoCardProps) {
  return (
    <div className={styles.promoCard}>
      <h3 className={styles.cardTitle}>{title}</h3>
      <p className={styles.cardDesc}>
        
        <span>
          {/* Cambia <a> por <Link> y usa el id en la ruta */}
          <Link to={`/promocion-detalles/${id}`} className={styles.anchorCard}>
            ver condiciones
          </Link>
        </span>
      </p>
    </div>
  );
}

