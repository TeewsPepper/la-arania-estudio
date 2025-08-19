


import { motion } from "framer-motion";
import RegistroForm from "../../components/registroForm/RegistroForm";
import styles from "./Login.module.css";

const Login = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className={styles.loginContainer}
    >
      <main>
        <RegistroForm />
      </main>
    </motion.div>
  );
};

export default Login;