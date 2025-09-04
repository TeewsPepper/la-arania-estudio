
import styles from './PromoCard.module.css';
import { Link } from 'react-router-dom'; 

interface PromoCardProps {
  id: string; 
  title: string;
  description: string;
}

export default function PromoCard({ id, title }: PromoCardProps) {
  return (
    <div className={styles.promoCard}>
      <h3 className={styles.cardTitle}>{title}</h3>
      <p className={styles.cardDesc}>
        
        <span>
          
          <Link to={`/promocion-detalles/${id}`} className={styles.anchorCard}>
            ver condiciones
          </Link>
        </span>
      </p>
    </div>
  );
}

