# TaskFlow Backend (API)

Backend profesional para gestión de tareas con autenticación, construido con:
- NestJS 11 (arquitectura modular, validación y filtros globales)
- Prisma 6 (ORM tipado)
- PostgreSQL (Docker)
- JWT almacenado en cookie HttpOnly
- Envío de correos vía SMTP (restablecimiento de contraseña)
- Documentación con Swagger (OpenAPI)

Base URL de la API: http://localhost:3001/api/v1  
Documentación Swagger: http://localhost:3001/docs

Nota: Las rutas de la API están bajo el prefijo global `/api/v1`, mientras que Swagger está expuesto en `/docs`.

---

## Tabla de contenido

- Requisitos
- Variables de entorno (.env)
- Puesta en marcha con Docker (PostgreSQL)
- Instalación y ejecución
- Swagger (OpenAPI)
- Estructura del proyecto
- Resumen de endpoints
- Modelos principales
- Diagrama ER
- Scripts útiles
- Notas y buenas prácticas
- Licencia

---

## Requisitos

- Node.js 18+
- npm 9+
- Docker y Docker Compose (para la base de datos PostgreSQL)

---

## Variables de entorno (.env)

Crea un archivo `.env` en la raíz del proyecto con:

```
# App
PORT=3001
JWT_SECRET=super_secret_key
FRONTEND_URL=http://localhost:3000

# Base de datos (PostgreSQL)
# Ajusta usuario/contraseña/host/puerto si cambias el docker-compose
DATABASE_URL=postgresql://taskflow:taskflow@localhost:5432/taskflow?schema=public

# SMTP (correo)
SMTP_HOST=smtp.tu-proveedor.com
SMTP_PORT=587
SMTP_USER=usuario@dominio.com
SMTP_PASS=contraseña
SMTP_FROM=no-reply@dominio.com
```

- `FRONTEND_URL` se usa para CORS y para construir el enlace de restablecimiento de contraseña.
- El servicio de correo usa claves `SMTP_*` (no `MAIL_*`).

---

## Puesta en marcha con Docker (PostgreSQL)

Este repositorio incluye un `docker-compose.yml` con PostgreSQL.

1) Levanta la base de datos:
```
docker compose up -d
# o bien, específicamente:
# docker compose up -d taskflow-db
```

2) Verifica que el contenedor esté arriba:
```
docker ps
```

La base de datos estará en `localhost:5432` con las credenciales definidas en `docker-compose.yml`.

---

## Instalación y ejecución

1) Instala dependencias
```
npm install
```

2) Genera el cliente de Prisma (opcional si ya lo hizo la migración)
```
npm run prisma:generate
```

3) Ejecuta migraciones (desarrollo)
```
npm run migrate:dev
# equivalente a: npx prisma migrate dev
```

4) Inicia la aplicación
```
# Desarrollo (watch)
npm run start:dev

# Producción (construido previamente con `npm run build`)
npm run start:prod
```

- API: http://localhost:${PORT}/api/v1 (por defecto http://localhost:3001/api/v1)
- Swagger: http://localhost:${PORT}/docs

En despliegue, usa:
```
npm run migrate:deploy
```

---

## Swagger (OpenAPI)

- Endpoint de documentación: http://localhost:3001/docs
- El prefijo global `/api/v1` aplica a las rutas de la API, no a Swagger.
- Para probar endpoints protegidos que usan cookies HttpOnly, realiza primero el login y reutiliza la cookie en tus peticiones (tu cliente debe soportarlo).

## Estructura del proyecto

```
taskflow-backend/
├─ prisma/
│  ├─ migrations/
│  └─ schema.prisma
├─ src/
│  ├─ app.module.ts
│  ├─ main.ts
│  ├─ common/
│  │  ├─ decorators/
│  │  │  ├─ auth.decorator.ts
│  │  │  ├─ get-user.decorator.ts
│  │  │  └─ row-headers.decorator.ts
│  │  └─ filters/
│  │     └─ prisma-exception.filter.ts
│  ├─ database/
│  │  ├─ prisma.module.ts
│  │  └─ prisma.service.ts
│  └─ modules/
│     ├─ auth/
│     │  ├─ auth.controller.ts
│     │  ├─ auth.module.ts
│     │  ├─ auth.service.ts
│     │  ├─ dto/
│     │  │  ├─ forgot-password.dto.ts
│     │  │  └─ login-user.dto.ts
│     │  ├─ interfaces/
│     │  │  └─ jwt.payload.ts
│     │  └─ strategies/
│     │     └─ jwt.strategy.ts
│     ├─ mail/
│     │  ├─ mail.controller.ts
│     │  ├─ mail.module.ts
│     │  └─ mail.service.ts
│     ├─ task/
│     │  ├─ task.controller.ts
│     │  ├─ task.module.ts
│     │  ├─ task.service.ts
│     │  └─ dto/
│     │     ├─ create-task.dto.ts
│     │     └─ update-task.dto.ts
│     └─ user/
│        ├─ user.controller.ts
│        ├─ user.module.ts
│        ├─ user.service.ts
│        └─ dto/
│           ├─ create-user.dto.ts
│           └─ update-user.dto.ts
├─ docker-compose.yml
├─ package.json
├─ tsconfig.json
└─ README.md
```

Notas:
- `src/modules` agrupa los módulos de dominio (auth, user, task, mail).
- `src/common` contiene decoradores y filtros globales reutilizables.
- `src/database` expone el `PrismaService` y su módulo.
- Prisma genera el cliente en `generated/prisma` (configurado en `prisma/schema.prisma`).

---

## Resumen de endpoints

Prefijo global: `/api/v1`

- Auth
  - POST `/auth/register` — Registro de usuario
  - POST `/auth/login` — Login; devuelve cookie `auth_token` (HttpOnly)
  - POST `/auth/logout` — Logout (requiere autenticación; limpia cookie)
  - POST `/auth/forgot-password` — Envío de email con enlace de reseteo
  - POST `/auth/reset-password` — Restablecer contraseña con token

- User (protegido)
  - GET `/user` — Datos del usuario autenticado (name, email)

- Task (protegido)
  - POST `/task` — Crear tarea
  - GET `/task` — Listar tareas del usuario autenticado
  - PATCH `/task/:id` — Actualizar tarea
  - DELETE `/task/:id` — Eliminar tarea

Notas:
- Autenticación vía JWT en cookie `auth_token` (HttpOnly, SameSite=None, Secure).
- En desarrollo local sin HTTPS, los navegadores pueden bloquear cookies con `Secure=true`. Considera usar un proxy HTTPS para pruebas locales.

---

## Modelos principales

- User
  - id, name (único), email (único), password (hash)
  - resetToken, resetTokenExpires
  - createdAt

- Task
  - id, title, description?, priority (LOW|MEDIUM|HIGH; por defecto MEDIUM)
  - category, dueDate, completed (por defecto false)
  - createdAt, updatedAt
  - userId (FK -> User, onDelete: Cascade)

## Diagrama ER

```mermaid
erDiagram
  User {
    Int id PK
    String name UNIQUE
    String email UNIQUE
    String password
    String resetToken
    DateTime resetTokenExpires
    DateTime createdAt
  }

  Task {
    Int id PK
    String title
    String description
    String category
    Enum priority
    DateTime dueDate
    Boolean completed
    DateTime createdAt
    DateTime updatedAt
    Int userId FK
  }

  User ||--o{ Task : "has many"

  Priority {
    enum LOW
    enum MEDIUM
    enum HIGH
  }
```

---

## Scripts útiles

- Lint: `npm run lint`
- Formato: `npm run format`
- Build: `npm run build`
- Test unitarios: `npm run test`
- Test e2e: `npm run test:e2e`
- Prisma
  - Generar cliente: `npm run prisma:generate`
  - Migraciones (dev): `npm run migrate:dev`
  - Migraciones (deploy): `npm run migrate:deploy`

---

## Notas y buenas prácticas

- CORS: Configurado con `FRONTEND_URL` (por defecto http://localhost:3000). Ajusta este valor en `.env` para tu frontend.
- Cookies: El servicio Auth configura la cookie `auth_token` como `httpOnly`, `sameSite=none` y `secure=true`. Para entornos no-HTTPS, considera usar un túnel/proxy con HTTPS durante el desarrollo.
- Prisma: El cliente se genera en `generated/prisma`. No cambies la ruta de salida a menos que actualices las importaciones en el código.
- Swagger: Generado en tiempo de ejecución; no requiere pasos adicionales.
- Producción: Usa `npm run migrate:deploy` antes de arrancar la app y define `DATABASE_URL`, `JWT_SECRET` y las variables `SMTP_*` en tu entorno.

---

## Licencia

UNLICENSED. Este proyecto no otorga permisos de uso/redistribución más allá de los implícitos por su visualización.