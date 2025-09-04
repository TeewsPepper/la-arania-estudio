import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export default function LoginRedirect() {
  const { fetchUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const init = async () => {
      const u = await fetchUser(); // trae user desde /auth/me
      if (!u) return;

      if (u.role === "admin") navigate("/admin");
      else navigate("/perfil");
    };
    init();
  }, [fetchUser, navigate]);

  return <p>Redirigiendo...</p>;
}
