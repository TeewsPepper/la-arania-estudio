
import styles from "./MapSection.module.css";

export default function MapSection() {
  return (
    <section className={styles.mapContainer}>
      <h2 className={styles.title}>Dónde estamos</h2>
      <iframe
        className={styles.map}
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d104699.10273654122!2d-56.33220235664059!3d-34.91028989999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x959f810cbc012605%3A0xe25bb17c4faf8fce!2sEstudio%20La%20Ara%C3%B1a!5e0!3m2!1ses-419!2suy!4v1755593580348!5m2!1ses-419!2suy"
        width="500"
        height="350"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      ></iframe>
    </section>
  );
}
