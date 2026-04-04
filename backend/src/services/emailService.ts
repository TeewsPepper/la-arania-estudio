import nodemailer from 'nodemailer';

console.log("📧 Configurando transporter para Zoho...");
const transporter = nodemailer.createTransport({
    host: 'smtp.zoho.com',   
    port: 465,
    secure: true,
    auth: {
        user: 'admin@araniauy.com',     
        pass: process.env.ZOHO_PASSWORD  
    }
});

export const enviarNotificacionReserva = async (reserva: any, usuario: any) => {
    console.log("📧 enviarNotificacionReserva fue llamada"); // 👈 LOG NUEVO
    
    const adminEmail = process.env.ADMIN_EMAIL || process.env.ZOHO_EMAIL;
    const fechaFormateada = new Date(reserva.fecha).toLocaleDateString('es-ES');
    
    const mensajeHtml = `
        <h2>🎸 ¡Nueva reserva en La Araña Estudio!</h2>
        <p><strong>Cliente:</strong> ${usuario.nombre || usuario.email || 'Cliente'}</p>
        <p><strong>Email del cliente:</strong> ${usuario.email}</p>
        <p><strong>Fecha:</strong> ${fechaFormateada}</p>
        <p><strong>Hora:</strong> ${reserva.horaInicio} - ${reserva.horaFin}</p>
        <p><strong>Estado:</strong> Pendiente de confirmación</p>
        <br>
        <p>📋 <a href="https://tuaplicacion.onrender.com/admin/dashboard">Ver todas las reservas en el dashboard</a></p>
    `;

    try {
        await transporter.sendMail({
            from: `"La Araña Estudio" <admin@araniauy.com>`,  // ← Nombre correcto
            to: adminEmail,
            subject: '🎸 Nueva reserva - La Araña Estudio',
            html: mensajeHtml
        });
        console.log('✅ Notificación enviada a', adminEmail);
    } catch (error) {
        console.error('❌ Error al enviar email:', error);
    }
};