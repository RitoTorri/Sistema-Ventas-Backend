# 🛒 Sistema de Ventas e Inventario (Backend)

Este proyecto consiste en el diseño y estructuración de una Base de Datos Relacional y una API REST para un Sistema de Gestión de Ventas e Inventario, optimizada para garantizar la integridad de los datos, la trazabilidad de las operaciones y la persistencia de información histórica.

El sistema está pensado para manejar el flujo completo de una transacción comercial: desde la catalogación de productos hasta el registro detallado de pagos.

### 🌟 Características principales de la API

- **Autenticación y Autorización JWT:** Seguridad robusta mediante tokens JWT para proteger los endpoints y gestionar sesiones de usuario.
- **RBAC Dinámico:** Control de acceso basado en roles y permisos, permitiendo una gestión granular de usuarios, clientes, proveedores y módulos.
- **Auto-Seed de Permisos:** Al registrar un nuevo módulo, el sistema vincula automáticamente los permisos CRUD necesarios en la base de datos.
- **Documentación Swagger:** Toda la API está documentada y disponible mediante Swagger para facilitar la integración y pruebas.
- **Rate Limiting y CORS:** Protección avanzada de los endpoints sensibles mediante limitación de peticiones y configuración de CORS.
- **Gestión completa de ventas y compras:** Endpoints para registrar, consultar y actualizar transacciones de ventas y compras.
- **Gestión de inventario y productos:** Operaciones CRUD para productos, categorías y métodos de pago.
- **Gestión de clientes y proveedores:** Registro, actualización y seguimiento de clientes y proveedores con validaciones y datos completos.
- **Gestión de usuarios y roles:** Administración de usuarios, roles y permisos asignados, con endpoints para su gestión.
- **Auditoría y trazabilidad:** Registro automático de fechas de creación, actualización y eliminación (created_at, updated_at, deleted_at) en todas las entidades principales.
- **Inicialización automatizada:** Script de inicialización para preparar la base de datos y el entorno de ejecución tanto en desarrollo como en producción.

### 📑 Índice

- [Stack tecnológico](#️-stack-tecnológico)
- [Arquitectura RBAC / MER del sistema](#️-arquitectura-rbac--mer-del-sistema)
- [Instalación](#-instalación)
- [Configuración inicial](#-configuración-inicial)
- [Guía de inicio rápido](#-guía-de-inicio-rápido)
- [Documentación](#-documentación)

<br>

# 🛠️ Stack tecnológico

<div align="center">

![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white)
![NodeJS](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![Swagger](https://img.shields.io/badge/Swagger-85EA2D?style=for-the-badge&logo=swagger&logoColor=black)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)

</div>

<br>

# ⚙️ Arquitectura RBAC / MER del sistema

### 📑 Modelo Entidad-Relación (MER)

<div align="center">
  <img src="./public/MER_auth.png" alt="RBAC / MER" width="1000" height="400">
</div>

<div align="center">
  <img src="./src/database/MER/MER.png" alt="RBAC / MER" width="1000" height="400">
</div>

### 🔑 Composición de los TOKENS (JWT)

**TOKEN ACCESS:**

```json
{
  "userID":"1",
  "roleId":"1",
  "iat": 1516239022,
  "exp": 1516242622,
  "TOKEN_ACCESS"=LA_Clave_que_TU_QUIERAS
}
```

**Json del cliente al logearse**

```json
{
  "userID": "1",
  "name": "JESUS FRANCISCO CORTEZ TORRES",
  "email": "jesus@gmail.com",
  "role": {
    "roleId": "1",
    "name": "administrador"
  },
  "permissions": [
    {
      "name_module": "inventario",
      "permissions": ["READ", "UPDATE"]
    },
    {
      "name_module": "ventas",
      "permissions": ["READ", "UPDATE", "DELETE", "CREATE"]
    }
  ],
  "token": "ABCGDxs283..."
}
```

### ⌨️ Codigo de la Base de datos

Puedes ver el codigo de la base de datos [📍Aqui](https://github.com/RitoTorri/Sistema-Ventas-Backend/tree/main/database/SQL)

<br>

# 📦 Instalación:

```bash
# Clona el repositorio
git clone https://github.com/RitoTorri/Sistema-Ventas-Backend

# Entra al directorio
cd Sistema-Ventas-Backend

# Instala las dependencias
npm install
```

### ⚠️ Importante:

Si el proyecto es ejecutado de manera local, Recuerda crear la base de datos primero en PostgreSQL.

<br>

# 🔧 Configuración inicial

### 🔐 Variables de entorno (.env):

Debes renombrar `.env.example` a `.env` y configurar:

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `PORT` | Puerto de la aplicación | `3000` |
| `API_RATE_LIMIT_MAX` | Cantidad máxima de peticiones por ventana de tiempo | `100` |
| `API_RATE_LIMIT_WINDOW` | Ventana de tiempo para rate limiting (ms) | `900000` |
| `TOKEN_ACCESS` | Llave secreta para tokens JWT | `tu_clave_secreta` |
| `POSTGRES_HOST` | Host de la base de datos | `localhost` |
| `POSTGRES_PORT` | Puerto de PostgreSQL | `5432` |
| `POSTGRES_USER` | Usuario de la base de datos | `postgres` |
| `POSTGRES_PASSWORD` | Contraseña de la base de datos | `postgres123` |
| `POSTGRES_DB` | Nombre de la base de datos | `sistema_ventas` |
| `PORCENTAGE_AUMENT_FOR_PURCHASE` | Porcentaje que se suma al precio del producto al comprar | `15` |
| `FRONTEND_URL` | URL del frontend para CORS | `http://localhost:3543` |

<br>

# 🚀 Guía de inicio rápido

Este proyecto incluye un script de inicialización (`script.sh`) que configura la base de datos y arranca el servidor.  
**Su comportamiento varía según el entorno:**

- En **modo desarrollo**, solo debe ejecutarse **una vez** para preparar la base de datos.
- En **modo producción** (Docker), el script se ejecuta automáticamente al levantar los contenedores.

### 🐳 Docker (producción)

Sigue estos pasos para levantar el proyecto con Docker:

```bash
# Construir la imagen
docker compose build

# Levantar los contenedores
docker compose up
```

> El script `script.sh` se ejecuta automáticamente dentro del contenedor y deja el servidor listo en modo producción.

### 💻 Entorno local (desarrollo)

#### 🔁 Primera vez

Si es la primera vez que ejecutas el proyecto:

```bash
# Compilar el proyecto
npm run build

# Ejecutar el script de inicialización
./script.sh
```

> ⚠️ Este script inicia el servidor en **modo producción**.  
> Una vez que haya hecho su trabajo (configurar la base de datos y arrancar), puedes detenerlo con `Ctrl + C` y continuar con el modo desarrollo.

#### 🔁 Ejecuciones posteriores

Después de haber ejecutado el script al menos una vez:

```bash
# Iniciar el servidor con hot-reload
npm run start:dev
```

### 📌 Resumen

| Entorno        | Comandos                                                                 |
|----------------|--------------------------------------------------------------------------|
| 🐳 Producción  | `docker compose build` → `docker compose up`                             |
| 💻 Desarrollo  | **Primera vez:** `npm run build` → `./script.sh`<br>**Siguientes:** `npm run start:dev` |

<br>

# 📄 Documentación

Para ver la documentación de la API REST, visite la siguiente URL:

```bash
http://localhost:PUERTO/docs
```
