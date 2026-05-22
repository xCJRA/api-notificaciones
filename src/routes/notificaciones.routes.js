const express   = require('express');
const router    = express.Router();

const { login }                        = require('../controllers/auth.controller');
const { crear, listar, detalle }       = require('../controllers/notificaciones.controller');
const { verificarToken }               = require('../middlewares/auth.middleware');

/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: Autenticación y obtención de token
 *   - name: Notificaciones
 *     description: Envío y consulta de notificaciones
 */

/**
 * @swagger
 * /login:
 *   post:
 *     tags: [Auth]
 *     summary: Obtener token JWT
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [usuario, password]
 *             properties:
 *               usuario:
 *                 type: string
 *                 example: admin
 *               password:
 *                 type: string
 *                 example: admin123
 *     responses:
 *       200:
 *         description: Token generado correctamente
 *       401:
 *         description: Credenciales incorrectas
 */
router.post('/login', login);

/**
 * @swagger
 * /notificaciones:
 *   post:
 *     tags: [Notificaciones]
 *     summary: Enviar una notificación
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [canal, destinatario, mensaje]
 *             properties:
 *               canal:
 *                 type: string
 *                 enum: [email, whatsapp, sms]
 *                 example: email
 *               destinatario:
 *                 type: string
 *                 example: destino@ejemplo.com
 *               mensaje:
 *                 type: string
 *                 example: Esta es una notificación de prueba.
 *     responses:
 *       201:
 *         description: Notificación enviada correctamente
 *       422:
 *         description: Datos inválidos
 *       502:
 *         description: Error al enviar por el canal externo
 */
router.post('/notificaciones', verificarToken, crear);

/**
 * @swagger
 * /notificaciones:
 *   get:
 *     tags: [Notificaciones]
 *     summary: Listar notificaciones
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: canal
 *         schema:
 *           type: string
 *           enum: [email, whatsapp, sms]
 *         description: Filtrar por canal
 *       - in: query
 *         name: estado
 *         schema:
 *           type: string
 *           enum: [pendiente, enviado, fallido]
 *         description: Filtrar por estado
 *     responses:
 *       200:
 *         description: Lista de notificaciones
 */
router.get('/notificaciones', verificarToken, listar);

/**
 * @swagger
 * /notificaciones/{id}:
 *   get:
 *     tags: [Notificaciones]
 *     summary: Detalle de una notificación
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la notificación
 *     responses:
 *       200:
 *         description: Detalle de la notificación
 *       404:
 *         description: No encontrada
 */
router.get('/notificaciones/:id', verificarToken, detalle);

module.exports = router;