


import { motion } from "framer-motion";
import LoginForm from "../../components/loginForm/LoginForm";
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
        <LoginForm />
      </main>
    </motion.div>
  );
};

export default Login;