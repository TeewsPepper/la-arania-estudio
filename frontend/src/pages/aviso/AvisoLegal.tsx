// frontend/src/pages/LegalNotice.tsx
import styles from "./AvisoLegal.module.css";

export default function LegalNotice() {
  return (
    <main className={styles.legal}>
      <h1>Aviso Legal</h1>
      <p>
        Este sitio web pertenece a <strong>La Araña Estudio</strong>, un espacio de ensayo 
        y grabación musical ubicado en Montevideo, Uruguay.
      </p>

      <h2>Propiedad intelectual</h2>
      <p>
        Todos los contenidos de este sitio (textos, imágenes, logotipos, etc.) son propiedad de 
        La Araña Estudio o de sus respectivos autores y no pueden ser utilizados sin autorización previa.
      </p>

      <h2>Responsabilidad</h2>
      <p>
        La Araña Estudio no se hace responsable del mal uso que los usuarios hagan de la información publicada 
        en este sitio ni de los problemas técnicos que puedan surgir durante su uso.
      </p>

      <h2>Contacto</h2>
      <p>
        Para cualquier consulta legal, puedes escribirnos a 
        <strong> contacto@laraniauy.com</strong>.
      </p>
    </main>
  );
}
