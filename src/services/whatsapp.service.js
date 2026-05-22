const twilio = require('twilio');

const client = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
);

/**
 * Envía un mensaje de WhatsApp usando el sandbox de Twilio.
 * El destinatario debe estar registrado en el sandbox.
 * @param {string} destinatario - Número en formato whatsapp:+521XXXXXXXXXX
 * @param {string} mensaje      - Texto del mensaje
 * @returns {Promise<void>}
 */
async function enviarWhatsApp(destinatario, mensaje) {
    await client.messages.create({
        from: process.env.TWILIO_WHATSAPP_FROM,
        to:   destinatario,
        body: mensaje,
    });
}

module.exports = { enviarWhatsApp };