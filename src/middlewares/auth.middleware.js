const jwt = require('jsonwebtoken');

/**
 * Verifica que la petición incluya un token JWT válido en el header Authorization.
 * Uso: Authorization: Bearer <token>
 */
function verificarToken(req, res, next) {
    const authHeader = req.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            mensaje: 'Token de acceso requerido. Usa el header: Authorization: Bearer <token>',
        });
    }

    const token = authHeader.split(' ')[1];

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.usuario = payload; // El payload queda disponible en el controller
        next();
    } catch (error) {
        return res.status(403).json({
            mensaje: 'Token inválido o expirado.',
        });
    }
}

module.exports = { verificarToken };