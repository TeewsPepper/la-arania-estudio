import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth"; // tu contexto de auth
import CTAButton from "../ui/CTAButton";

export default function HomeCTA() {
  const navigate = useNavigate();
  const { user } = useAuth(); // user = null si no está logueado

  const handleClick = () => {
    if (user) {
      navigate("/perfil/nueva-reserva"); // usuario logueado → MisReservas
    } else {
      navigate("/login"); // no logueado → LoginForm
    }
  };

  return <CTAButton onClick={handleClick}>Hacé tu Reserva</CTAButton>;
}
