require('dotenv').config();
const db = require('./database');

async function migrate() {
    try {
        console.log('Ejecutando migraciones...');

        await db.execute(`
            CREATE TABLE IF NOT EXISTS notificaciones (
                id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
                canal       ENUM('email', 'whatsapp', 'sms') NOT NULL,
                destinatario VARCHAR(255) NOT NULL,
                mensaje     TEXT NOT NULL,
                estado      ENUM('pendiente', 'enviado', 'fallido') NOT NULL DEFAULT 'pendiente',
                intentos    TINYINT UNSIGNED NOT NULL DEFAULT 0,
                enviado_at  DATETIME NULL,
                error       TEXT NULL,
                created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                updated_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        `);

        console.log('✅ Tabla "notificaciones" creada correctamente.');
        process.exit(0);

    } catch (error) {
        console.error('❌ Error en migración:', error.message);
        process.exit(1);
    }
}

migrate();