
import { Resend } from "resend";
import type { IReservaDocument } from "../models/Reserva";

const resend = new Resend(process.env.RESEND_API_KEY);



// Enviar notificación de reserva (usa solo lo que viene en req.user)
export const enviarNotificacionReserva = async (
  reserva: IReservaDocument, 
  usuario: { id: string; email: string; name: string; role: string }
) => {
  const adminEmail = process.env.ADMIN_EMAIL || "gomez.pepper@gmail.com";

  const [dia, mes, ano] = reserva.fecha.split("-");
  const fechaParseada = new Date(`${ano}-${mes}-${dia}`);
  const fechaFormateada = fechaParseada.toLocaleDateString("es-ES");

  const dashboardUrl = "https://araniauy.com/admin";
  
  try {
    const { data, error } = await resend.emails.send({
      from: "La Araña Estudio <reservas@mail.araniauy.com>",
      to: [adminEmail],
      subject: "🎸 Nueva reserva - La Araña Estudio",
      html: `
        <h2>🎸 ¡Nueva reserva en La Araña Estudio!</h2>
        <p><strong>Cliente:</strong> ${usuario.name}</p>
        <p><strong>Email:</strong> ${usuario.email}</p>
        <p><strong>Fecha:</strong> ${fechaFormateada}</p>
        <p><strong>Hora:</strong> ${reserva.horaInicio} - ${reserva.horaFin}</p>
        <p>📋 <a href="${dashboardUrl}">Ver dashboard</a></p>
      `,
    });

    if (error) {
      console.error("❌ Error Resend:", error);
    } else {
      console.log("✅ Email enviado con Resend:", data?.id);
    }
  } catch (error) {
    console.error("❌ Error al enviar:", error);
  }
};

// Para el nuevo usuario, seguimos usando IUserDocument (porque viene de User.create)
import type { IUserDocument } from "../models/User";

export const enviarNotificacionNuevoUsuario = async (usuario: IUserDocument) => {
  const adminEmail = process.env.ADMIN_EMAIL || "gomez.pepper@gmail.com";
  
  const fechaRegistro = new Date().toLocaleString("es-ES", {
    timeZone: "America/Montevideo"
  });
  
  try {
    const { data, error } = await resend.emails.send({
      from: "La Araña Estudio <reservas@mail.araniauy.com>",
      to: [adminEmail],
      subject: "🆕 Nuevo usuario registrado - La Araña Estudio",
      html: `
        <h2>🆕 Nuevo usuario registrado</h2>
        <p><strong>Nombre:</strong> ${usuario.name}</p>
        <p><strong>Email:</strong> ${usuario.email}</p>
        <p><strong>ID:</strong> ${usuario._id}</p>
        <p><strong>Fecha de registro:</strong> ${fechaRegistro}</p>
        <br>
        <p>📋 <a href="https://araniauy.com/admin">Ver dashboard</a></p>
      `
    });

    if (error) {
      console.error("❌ Error email nuevo usuario:", error);
    } else {
      console.log("✅ Email de nuevo usuario enviado a admin:", data?.id);
    }
  } catch (error) {
    console.error("❌ Error al enviar email de nuevo usuario:", error);
  }
};