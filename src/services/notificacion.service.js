const db                = require('../config/database');
const { enviarEmail }   = require('./email.service');
const { enviarWhatsApp }= require('./whatsapp.service');
const { enviarSMS }     = require('./sms.service');

const MAX_INTENTOS = 3;

// Mapa de canales a sus funciones de envío
const canales = {
    email:    enviarEmail,
    whatsapp: enviarWhatsApp,
    sms:      enviarSMS,
};

/**
 * Registra una notificación en BD y la envía con reintentos.
 * @param {string} canal        - 'email' | 'whatsapp' | 'sms'
 * @param {string} destinatario - Dirección de destino según el canal
 * @param {string} mensaje      - Contenido de la notificación
 * @returns {Promise<object>}   - Registro de la notificación creada
 */
async function crearYEnviarNotificacion(canal, destinatario, mensaje) {

    // 1. Guardar en BD con estado 'pendiente'
    const [result] = await db.execute(
        `INSERT INTO notificaciones (canal, destinatario, mensaje, estado)
         VALUES (?, ?, ?, 'pendiente')`,
        [canal, destinatario, mensaje]
    );
    const id = result.insertId;

    // 2. Intentar enviar con reintentos
    const fnEnvio = canales[canal];
    let intentos = 0;
    let ultimoError = null;

    while (intentos < MAX_INTENTOS) {
        intentos++;
        try {
            await fnEnvio(destinatario, mensaje);

            // Éxito: actualizar BD
            await db.execute(
                `UPDATE notificaciones
                 SET estado = 'enviado', intentos = ?, enviado_at = NOW(), error = NULL
                 WHERE id = ?`,
                [intentos, id]
            );

            return await obtenerNotificacion(id);

        } catch (error) {
            ultimoError = error.message;
            console.error(`Intento ${intentos} fallido para notificación ${id}:`, ultimoError);

            if (intentos < MAX_INTENTOS) {
                // Esperar 1 segundo antes del siguiente intento
                await new Promise(r => setTimeout(r, 1000));
            }
        }
    }

    // Si llegamos aquí, todos los intentos fallaron
    await db.execute(
        `UPDATE notificaciones
         SET estado = 'fallido', intentos = ?, error = ?
         WHERE id = ?`,
        [intentos, ultimoError, id]
    );

    throw new Error(`Envío fallido tras ${MAX_INTENTOS} intentos: ${ultimoError}`);
}

/**
 * Obtiene todas las notificaciones con filtros opcionales.
 */
async function listarNotificaciones({ canal, estado } = {}) {
    let query  = 'SELECT * FROM notificaciones WHERE 1=1';
    const params = [];

    if (canal) {
        query += ' AND canal = ?';
        params.push(canal);
    }
    if (estado) {
        query += ' AND estado = ?';
        params.push(estado);
    }

    query += ' ORDER BY created_at DESC';

    const [rows] = await db.execute(query, params);
    return rows;
}

/**
 * Obtiene una notificación por ID.
 */
async function obtenerNotificacion(id) {
    const [rows] = await db.execute(
        'SELECT * FROM notificaciones WHERE id = ?',
        [id]
    );
    return rows[0] || null;
}

module.exports = {
    crearYEnviarNotificacion,
    listarNotificaciones,
    obtenerNotificacion,
};