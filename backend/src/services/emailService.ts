import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const enviarNotificacionReserva = async (reserva: any, usuario: any) => {
    const adminEmail = process.env.ADMIN_EMAIL || 'gomez.pepper@gmail.com';
    
    const fechaFormateada = new Date(reserva.fecha).toLocaleDateString('es-ES');
    
    try {
        const { data, error } = await resend.emails.send({
            from: 'La Araña Estudio <reservas@mail.araniauy.com>', // ← TU DOMINIO VERIFICADO
            to: [adminEmail],
            subject: '🎸 Nueva reserva - La Araña Estudio',
            html: `
                <h2>🎸 ¡Nueva reserva en La Araña Estudio!</h2>
                <p><strong>Cliente:</strong> ${usuario.nombre || usuario.email}</p>
                <p><strong>Email:</strong> ${usuario.email}</p>
                <p><strong>Fecha:</strong> ${fechaFormateada}</p>
                <p><strong>Hora:</strong> ${reserva.horaInicio} - ${reserva.horaFin}</p>
                <p>📋 <a href="https://araniauy.com/admin/dashboard">Ver dashboard</a></p>
                <br>
                <p><small>Este es un mensaje automático de La Araña Estudio.</small></p>
            `
        });

        if (error) {
            console.error('❌ Error Resend:', error);
        } else {
            console.log('✅ Email enviado con Resend:', data?.id);
        }
    } catch (error) {
        console.error('❌ Error al enviar:', error);
    }
};