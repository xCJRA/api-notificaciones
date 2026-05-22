# API de Notificaciones Multi-canal 🔔

API REST para el envío de notificaciones por **Email**, **WhatsApp** y **SMS**, construida con Node.js y Express. Cualquier sistema puede integrarse a esta API para enviar notificaciones sin preocuparse por el canal de entrega.

Desarrollada como proyecto de portafolio basado en experiencia real integrando servicios de comunicación en producción.

---

## 🚀 Tecnologías

- **Node.js v22** / **Express**
- **MySQL** — base de datos relacional
- **Nodemailer** — envío de emails via Gmail SMTP
- **Twilio** — envío de WhatsApp por sandbox
- **jsonwebtoken** — autenticación con tokens JWT
- **swagger-jsdoc + swagger-ui-express** — documentación interactiva OpenAPI 3.0

---

## ✨ Funcionalidades

- Autenticación con tokens Bearer (JWT)
- Envío de notificaciones por Email (Gmail SMTP)
- Envío de notificaciones por WhatsApp (Twilio sandbox)
- Envío de notificaciones por SMS (simulado)
- Historial de notificaciones con filtros por canal y estado
- Reintentos automáticos: hasta 3 intentos si el canal externo falla
- Registro de errores por notificación en base de datos
- Documentación interactiva con Swagger UI

---

## 📋 Instalación

### Requisitos previos

- Node.js 18+
- MySQL

### Pasos

```bash
# 1. Clonar el repositorio
git clone https://github.com/xCJRA/api-notificaciones.git
cd api-notificaciones

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env
# Edita .env con tus credenciales reales

# 4. Crear la base de datos en MySQL
# CREATE DATABASE api_notificaciones CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# 5. Ejecutar migración
npm run migrate

# 6. Levantar el servidor
npm run dev
```

---

## ⚙️ Variables de entorno

Copia `.env.example` a `.env` y completa cada valor:

| Variable | Descripción |
|---|---|
| `PORT` | Puerto del servidor (default: 3000) |
| `DB_HOST` | Host de MySQL |
| `DB_USER` | Usuario de MySQL |
| `DB_PASSWORD` | Contraseña de MySQL |
| `DB_NAME` | Nombre de la base de datos |
| `JWT_SECRET` | Cadena secreta para firmar tokens JWT |
| `JWT_EXPIRES_IN` | Tiempo de expiración del token (ej. `24h`) |
| `MAIL_HOST` | Host SMTP (smtp.gmail.com) |
| `MAIL_PORT` | Puerto SMTP (587) |
| `MAIL_USER` | Correo Gmail |
| `MAIL_PASS` | Contraseña de aplicación de Google |
| `TWILIO_ACCOUNT_SID` | Account SID de Twilio |
| `TWILIO_AUTH_TOKEN` | Auth Token de Twilio |
| `TWILIO_WHATSAPP_FROM` | Número sandbox de Twilio (whatsapp:+14155238886) |

### Configurar Gmail SMTP

1. Ve a tu cuenta Google → **Seguridad** → **Verificación en dos pasos** (debe estar activa)
2. Busca **Contraseñas de aplicación**
3. Crea una nueva con el nombre "API Notificaciones"
4. Copia la contraseña de 16 caracteres generada y pégala en `MAIL_PASS`

### Configurar Twilio WhatsApp Sandbox

1. Crea cuenta gratuita en [twilio.com](https://www.twilio.com)
2. Ve a **Messaging → Try it out → Send a WhatsApp message**
3. Envía el código de activación desde tu WhatsApp al número indicado
4. Copia tu `ACCOUNT_SID` y `AUTH_TOKEN` del dashboard

---

## 📖 Documentación

Con el servidor corriendo, accede a la documentación interactiva:

**http://localhost:3000/api/docs**

Desde ahí puedes autenticarte y probar todos los endpoints directamente en el navegador.

---

## 🔐 Autenticación

Todos los endpoints de notificaciones requieren un token Bearer. Para obtenerlo:

```bash
POST /api/login
Content-Type: application/json

{
    "usuario": "admin",
    "password": "admin123"
}
```

Usa el token en el header de todas las peticiones:

```
Authorization: Bearer <tu_token_aquí>
```

---

## 📌 Endpoints

| Método | Endpoint | Auth | Descripción |
|---|---|---|---|
| POST | `/api/login` | ❌ | Obtener token JWT |
| POST | `/api/notificaciones` | ✅ | Enviar notificación |
| GET | `/api/notificaciones` | ✅ | Listar notificaciones |
| GET | `/api/notificaciones/:id` | ✅ | Detalle de notificación |

---

## 💡 Ejemplos de uso

### Enviar notificación por email

```bash
curl -X POST http://localhost:3000/api/notificaciones \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "canal": "email",
    "destinatario": "destino@ejemplo.com",
    "mensaje": "Tu pedido ha sido confirmado."
  }'
```

### Enviar notificación por WhatsApp

```bash
curl -X POST http://localhost:3000/api/notificaciones \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "canal": "whatsapp",
    "destinatario": "whatsapp:+521XXXXXXXXXX",
    "mensaje": "Tu cita está confirmada para mañana a las 10am."
  }'
```

### Enviar notificación por SMS (simulado)

```bash
curl -X POST http://localhost:3000/api/notificaciones \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "canal": "sms",
    "destinatario": "+521XXXXXXXXXX",
    "mensaje": "Tu código de verificación es: 482910"
  }'
```

### Listar notificaciones con filtros

```bash
# Solo las fallidas
curl http://localhost:3000/api/notificaciones?estado=fallido \
  -H "Authorization: Bearer <token>"

# Solo las de WhatsApp
curl http://localhost:3000/api/notificaciones?canal=whatsapp \
  -H "Authorization: Bearer <token>"
```

### Respuesta de una notificación enviada

```json
{
    "mensaje": "Notificación enviada correctamente.",
    "data": {
        "id": 1,
        "canal": "email",
        "destinatario": "destino@ejemplo.com",
        "mensaje": "Tu pedido ha sido confirmado.",
        "estado": "enviado",
        "intentos": 1,
        "enviado_at": "2026-05-22T10:00:00.000Z",
        "error": null,
        "created_at": "2026-05-22T10:00:00.000Z"
    }
}
```

---

## 🗄️ Estructura de la base de datos

### Tabla `notificaciones`

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | INT UNSIGNED | Identificador único |
| `canal` | ENUM | `email`, `whatsapp`, `sms` |
| `destinatario` | VARCHAR(255) | Dirección de destino |
| `mensaje` | TEXT | Contenido de la notificación |
| `estado` | ENUM | `pendiente`, `enviado`, `fallido` |
| `intentos` | TINYINT | Número de intentos realizados |
| `enviado_at` | DATETIME | Fecha de envío exitoso |
| `error` | TEXT | Mensaje del último error (si falló) |
| `created_at` | DATETIME | Fecha de creación |
| `updated_at` | DATETIME | Última actualización |

---

## 📁 Estructura del proyecto

```
api-notificaciones/
├── src/
│   ├── config/
│   │   ├── database.js             ← Pool de conexiones MySQL
│   │   └── migrate.js              ← Script de migración
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   └── notificaciones.controller.js
│   ├── services/
│   │   ├── email.service.js        ← Nodemailer + Gmail SMTP
│   │   ├── whatsapp.service.js     ← Twilio sandbox
│   │   ├── sms.service.js          ← Simulado
│   │   └── notificacion.service.js ← Orquestador con reintentos
│   ├── routes/
│   │   └── notificaciones.routes.js
│   ├── middlewares/
│   │   └── auth.middleware.js
│   ├── docs/
│   │   └── swagger.js
│   └── index.js
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

---

## 👨‍💻 Autor

**César Reyes** — Backend Developer  
[LinkedIn](https://linkedin.com/in/xcjra) · [GitHub](https://github.com/xCJRA)
