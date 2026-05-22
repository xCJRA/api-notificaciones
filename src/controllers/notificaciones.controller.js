const {
    crearYEnviarNotificacion,
    listarNotificaciones,
    obtenerNotificacion,
} = require('../services/notificacion.service');

const CANALES_VALIDOS = ['email', 'whatsapp', 'sms'];

async function crear(req, res) {
    const { canal, destinatario, mensaje } = req.body;

    // Validaciones
    if (!canal || !destinatario || !mensaje) {
        return res.status(422).json({
            mensaje: 'Los campos canal, destinatario y mensaje son requeridos.',
        });
    }
    if (!CANALES_VALIDOS.includes(canal)) {
        return res.status(422).json({
            mensaje: `Canal inválido. Valores permitidos: ${CANALES_VALIDOS.join(', ')}.`,
        });
    }

    try {
        const notificacion = await crearYEnviarNotificacion(canal, destinatario, mensaje);
        return res.status(201).json({
            mensaje: 'Notificación enviada correctamente.',
            data: notificacion,
        });
    } catch (error) {
        return res.status(502).json({
            mensaje: error.message,
        });
    }
}

async function listar(req, res) {
    const { canal, estado } = req.query;

    try {
        const notificaciones = await listarNotificaciones({ canal, estado });
        return res.json({ data: notificaciones, total: notificaciones.length });
    } catch (error) {
        return res.status(500).json({ mensaje: 'Error al obtener notificaciones.' });
    }
}

async function detalle(req, res) {
    const { id } = req.params;

    try {
        const notificacion = await obtenerNotificacion(id);
        if (!notificacion) {
            return res.status(404).json({ mensaje: 'Notificación no encontrada.' });
        }
        return res.json({ data: notificacion });
    } catch (error) {
        return res.status(500).json({ mensaje: 'Error al obtener la notificación.' });
    }
}

module.exports = { crear, listar, detalle };