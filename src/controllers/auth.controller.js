const jwt = require('jsonwebtoken');

/**
 * Genera un token JWT de prueba.
 * En producción aquí verificarías usuario/contraseña en BD.
 */
function login(req, res) {
    const { usuario, password } = req.body;

    // Credenciales hardcodeadas solo para demo/portafolio
    if (usuario !== 'admin' || password !== 'admin123') {
        return res.status(401).json({ mensaje: 'Credenciales incorrectas.' });
    }

    const token = jwt.sign(
        { id: 1, usuario: 'admin' },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );

    res.json({
        mensaje: 'Autenticación exitosa.',
        token,
        expira_en: process.env.JWT_EXPIRES_IN || '24h',
    });
}

module.exports = { login };