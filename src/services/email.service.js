const nodemailer = require('nodemailer');

// El transporter es la conexión configurada con Gmail SMTP
const transporter = nodemailer.createTransport({
    host:   process.env.MAIL_HOST,
    port:   process.env.MAIL_PORT,
    secure: false, // false = STARTTLS en puerto 587
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    },
});

/**
 * Envía un email al destinatario indicado.
 * @param {string} destinatario - Correo destino
 * @param {string} mensaje      - Cuerpo del email
 * @returns {Promise<void>}
 */
async function enviarEmail(destinatario, mensaje) {
    await transporter.sendMail({
        from:    `"API Notificaciones" <${process.env.MAIL_USER}>`,
        to:      destinatario,
        subject: 'Nueva notificación',
        text:    mensaje,
    });
}

module.exports = { enviarEmail };