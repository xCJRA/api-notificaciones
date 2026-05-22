/**
 * Simula el envío de un SMS.
 * En lugar de integrarse con una pasarela real (costo),
 * registra el intento en BD y marca como enviado.
 * @param {string} destinatario - Número telefónico
 * @param {string} mensaje      - Texto del SMS
 * @returns {Promise<void>}
 */
async function enviarSMS(destinatario, mensaje) {
    // Simulación: en producción aquí iría Twilio SMS, AWS SNS, etc.
    console.log(`[SMS SIMULADO] Para: ${destinatario} | Mensaje: ${mensaje}`);
}

module.exports = { enviarSMS };