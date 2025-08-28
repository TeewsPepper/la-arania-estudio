import { useParams, Navigate } from 'react-router-dom';
import { promociones } from '../../data/promociones';
import styles from './PromocionDetalles.module.css';

export default function PromotionDetalles() {
  const { id } = useParams();
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  const promo = promociones.find((p) => p.id === id);

  if (!promo) return <div>Promoción no encontrada</div>;
  if (!isAuthenticated) return <Navigate to="/login" state={{ from: `/promocion-detalles/${id}` }} replace />;

  return (
    <div className={styles.detailContainer}>
      <header className={styles.header}>
        <h1 className={`${styles.title} ${styles.neonText}`}>{promo.title}</h1>
        
      </header>
      
      <section className={styles.conditions}>
        <h2>Condiciones:</h2>
        <p className={styles.condiciones}>{promo.condiciones}</p>
        {/* Lista opcional para condiciones complejas */}
        {/* <ul>
          <li>Válido hasta agotar existencias</li>
          <li>Presentar DNI al momento de reclamar</li>
        </ul> */}
      </section>
    </div>
  );
}