const express   = require('express');
const router    = express.Router();

const { login }                        = require('../controllers/auth.controller');
const { crear, listar, detalle }       = require('../controllers/notificaciones.controller');
const { verificarToken }               = require('../middlewares/auth.middleware');

// Autenticación (pública)
router.post('/login', login);

// Notificaciones (protegidas con JWT)
router.post('/notificaciones',      verificarToken, crear);
router.get('/notificaciones',       verificarToken, listar);
router.get('/notificaciones/:id',   verificarToken, detalle);

module.exports = router;