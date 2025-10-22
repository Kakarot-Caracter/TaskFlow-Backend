<div align="center">
  <br />
  <h1>🚀 TaskFlow API</h1>
  <p>
    Backend profesional para gestión de tareas, construido con NestJS, Prisma y PostgreSQL.
  </p>
</div>

<p align="center">
  <img alt="NestJS" src="https://img.shields.io/badge/NestJS-11.x-red?style=for-the-badge&logo=nestjs"/>
  <img alt="Prisma" src="https://img.shields.io/badge/Prisma-6.x-blue?style=for-the-badge&logo=prisma"/>
  <img alt="PostgreSQL" src="https://img.shields.io/badge/PostgreSQL-blue?style=for-the-badge&logo=postgresql"/>
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5.x-blue?style=for-the-badge&logo=typescript"/>
  <img alt="Docker" src="https://img.shields.io/badge/Docker-blue?style=for-the-badge&logo=docker"/>
</p>

---

## ✨ Características

- **Autenticación JWT**: Sistema seguro basado en cookies `HttpOnly`.
- **Gestión de Usuarios**: Registro, login, logout y recuperación de contraseña.
- **Gestión de Tareas (CRUD)**: Crea, lee, actualiza y elimina tareas por usuario.
- **Envío de Correos**: Notificaciones para restablecimiento de contraseña.
- **Base de Datos Tipada**: Conexión segura y tipada a PostgreSQL usando Prisma ORM.
- **Documentación Automática**: Endpoints documentados con Swagger (OpenAPI).
- **Validación de Datos**: DTOs con `class-validator` para asegurar la integridad de los datos.
- **Contenerización**: Configuración lista para usar con Docker.

---

## 🛠️ Stack de Tecnologías

- **Framework**: [NestJS](https://nestjs.com/)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Base de Datos**: [PostgreSQL](https://www.postgresql.org/) (vía Docker)
- **Lenguaje**: [TypeScript](https://www.typescriptlang.org/)
- **Autenticación**: [Passport.js](http://www.passportjs.org/) (JWT Strategy)
- **Documentación**: [Swagger](https://swagger.io/)
- **Manejo de correos**: [Nodemailer](https://nodemailer.com/)

---

## 🚀 Cómo Empezar

Sigue estos pasos para tener una copia del proyecto funcionando localmente.

### Requisitos Previos

- [Node.js](https://nodejs.org/) (v18+ recomendado)
- [Docker](https://www.docker.com/get-started) y Docker Compose

### 1. Clona el Repositorio

```bash
git clone https://github.com/tu-usuario/taskflow-backend.git
cd taskflow-backend
```

### 2. Configura las Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto y añade las siguientes variables. Puedes usar el siguiente template:

```env
# Aplicación
PORT=3001
JWT_SECRET=tu_super_secreto_jwt
FRONTEND_URL=http://localhost:3000

# Base de Datos (PostgreSQL con Docker)
DATABASE_URL="postgresql://taskflow:taskflow@localhost:5432/taskflow?schema=public"

# Servidor de Correo (SMTP)
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=user@example.com
SMTP_PASS=password
SMTP_FROM="No Reply" <no-reply@example.com>
```

### 3. Inicia la Base de Datos

Usa Docker Compose para levantar el contenedor de PostgreSQL:

```bash
docker-compose up -d
```

### 4. Instala Dependencias y Ejecuta las Migraciones

```bash
# Instala los paquetes de Node.js
npm install

# Genera el cliente de Prisma
npm run prisma:generate

# Aplica las migraciones a la base de datos
npm run migrate:dev
```

### 5. ¡Inicia la Aplicación!

```bash
# Inicia el servidor en modo de desarrollo (con hot-reload)
npm run start:dev
```

¡Listo! La API estará disponible en `http://localhost:3001` y la documentación de Swagger en `http://localhost:3001/docs`.

---

## ⚙️ Uso de la API

- **URL Base**: `http://localhost:3001/api/v1`
- **Documentación Interactiva**: `http://localhost:3001/docs`

### Autenticación

La autenticación se maneja a través de una cookie `HttpOnly` llamada `auth_token`. El endpoint de `login` la establece automáticamente, y el de `logout` la elimina. Las peticiones a endpoints protegidos deben incluir esta cookie.

### Resumen de Endpoints

| Método | Ruta                      | Descripción                                  | Requiere Auth |
| :----- | :------------------------ | :------------------------------------------- | :-----------: |
| `POST` | `/auth/register`          | Registra un nuevo usuario.                   |       ❌       |
| `POST` | `/auth/login`             | Inicia sesión y obtiene la cookie de auth.   |       ❌       |
| `POST` | `/auth/logout`            | Cierra la sesión del usuario.                |       ✅       |
| `POST` | `/auth/forgot-password`   | Envía un correo para resetear la contraseña. |       ❌       |
| `POST` | `/auth/reset-password`    | Cambia la contraseña usando un token.        |       ❌       |
| `GET`  | `/user`                   | Obtiene los datos del usuario autenticado.   |       ✅       |
| `POST` | `/task`                   | Crea una nueva tarea.                        |       ✅       |
| `GET`  | `/task`                   | Lista todas las tareas del usuario.          |       ✅       |
| `PATCH`| `/task/:id`               | Actualiza una tarea específica.              |       ✅       |
| `DELETE`| `/task/:id`              | Elimina una tarea específica.                |       ✅       |

---

## 📜 Scripts Útiles

| Script              | Descripción                                            |
| :------------------ | :----------------------------------------------------- |
| `npm run start:dev` | Inicia la app en modo desarrollo con `watch`.          |
| `npm run build`     | Compila el proyecto para producción.                   |
| `npm run start:prod`| Inicia la app en modo producción (requiere `build`).   |
| `npm run lint`      | Analiza el código con ESLint y corrige errores.        |
| `npm run format`    | Formatea el código con Prettier.                       |
| `npm run test`      | Ejecuta las pruebas unitarias.                         |
| `npm run test:e2e`  | Ejecuta las pruebas end-to-end.                        |
| `npm run migrate:dev`| Crea y aplica nuevas migraciones de Prisma.           |

---

## 📄 Licencia

Este proyecto es de código privado y no tiene una licencia de código abierto.

UNLICENSED