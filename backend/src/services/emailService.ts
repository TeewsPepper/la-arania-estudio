import nodemailer from 'nodemailer';

console.log("📧 [INICIO] Cargando emailService...");

// Configuración del transporter para Zoho
// Probamos primero con puerto 587 (TLS) que suele estar más abierto
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: 'gomez.pepper@gmail.com',
        pass: process.env.GMAIL_APP_PASSWORD
    }
});

console.log("📧 [INICIO] Transporter configurado con:");
console.log("   host: smtp.zoho.com");
console.log("   port: 587");
console.log("   secure: false");
console.log("   ZOHO_EMAIL definido:", !!process.env.ZOHO_EMAIL);
console.log("   ZOHO_PASSWORD definido:", !!process.env.ZOHO_PASSWORD);

export const enviarNotificacionReserva = async (reserva: any, usuario: any) => {
    console.log("📧 [ENVIO] enviarNotificacionReserva fue llamada");
    
    // Determinar a quién enviar el correo
    const adminEmail = process.env.ADMIN_EMAIL || process.env.ZOHO_EMAIL;
    const fromEmail = process.env.ZOHO_EMAIL;
    
    console.log("📧 [ENVIO] Desde (from):", fromEmail);
    console.log("📧 [ENVIO] Para (to):", adminEmail);
    console.log("📧 [ENVIO] Usuario que reservó:", usuario.email);
    console.log("📧 [ENVIO] Fecha reserva:", reserva.fecha);
    console.log("📧 [ENVIO] Hora:", reserva.horaInicio, "-", reserva.horaFin);
    
    const fechaFormateada = new Date(reserva.fecha).toLocaleDateString('es-ES');
    
    const mensajeHtml = `
        <h2>🎸 ¡Nueva reserva en La Araña Estudio!</h2>
        <p><strong>Cliente:</strong> ${usuario.nombre || usuario.email || 'Cliente'}</p>
        <p><strong>Email del cliente:</strong> ${usuario.email}</p>
        <p><strong>Fecha:</strong> ${fechaFormateada}</p>
        <p><strong>Hora:</strong> ${reserva.horaInicio} - ${reserva.horaFin}</p>
        <p><strong>Estado:</strong> Pendiente de confirmación</p>
        <br>
        <p>📋 <a href="https://araniauy.com/admin/dashboard">Ver todas las reservas en el dashboard</a></p>
        <br>
        <p><small>Este es un mensaje automático de La Araña Estudio.</small></p>
    `;

    try {
        console.log("📧 [ENVIO] Intentando enviar email...");
        
        const info = await transporter.sendMail({
            from: `"La Araña Estudio" <${fromEmail}>`,
            to: adminEmail,
            subject: '🎸 Nueva reserva - La Araña Estudio',
            html: mensajeHtml
        });
        
        console.log("✅ [ENVIO] ¡Correo enviado con éxito!");
        console.log("✅ [ENVIO] Message ID:", info.messageId);
        console.log("✅ [ENVIO] Respuesta completa:", info.response);
        
        return info;
        
    } catch (error) {
        console.error("❌ [ENVIO] Error al enviar email:");
        console.error("❌ [ENVIO] Mensaje:", error instanceof Error ? error.message : error);
        
        if (error instanceof Error && 'code' in error) {
            console.error("❌ [ENVIO] Código de error:", (error as any).code);
        }
        
        // No relanzamos el error para que no bloquee la creación de la reserva
        return null;
    }
};

console.log("📧 [INICIO] emailService cargado correctamente");