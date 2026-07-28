# 🍽️ PlateOS 3D — Sistema Operativo de Restaurantes de Última Generación

![PlateOS 3D](https://img.shields.io/badge/PlateOS-3D_Production-f59e0b?style=for-the-badge&logo=react&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-v20+-339933?style=for-the-badge&logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-v5.3+-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma_ORM-v5.22+-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Three.js](https://img.shields.io/badge/Three.js-3D_Graphics-000000?style=for-the-badge&logo=three.js&logoColor=white)
![pnpm](https://img.shields.io/badge/pnpm-v11+-F69220?style=for-the-badge&logo=pnpm&logoColor=white)

**PlateOS 3D** es una plataforma integral de gestión y operación para restaurantes modernos. Combina un **salón interactivo en 3D en tiempo real**, un **pantalla de cocina (KDS)** con sincronización por WebSockets, un **punto de venta (POS) y sistema de cobros**, y un **panel de gamificación y metas diarias** para el personal.

---

## 🌟 Características Principales

### 🏢 1. Salón de Restaurante en 3D Interactivo
- Visualización 3D fluida del salón con cámaras orbitales, zoom y rotación (*Three.js / React Three Fiber*).
- Indicadores luminosos en tiempo real del estado de cada mesa (*Disponible*, *Ocupada*, *Comanda Pendiente*, *Comiendo*, *Cuenta Solicitada*, *Limpieza*).
- Avatares 3D animados para clientes en mesa.

### 👨‍🍳 2. Pantalla de Cocina (KDS) en Tiempo Real
- Recepción instantánea de comandas enviadas por los meseros vía **Socket.io**.
- Contadores de tiempo de preparación por comanda.
- Alertas sonoras y visuales cuando un platillo es marcado como listo.

### 💳 3. Control de Caja & Cobros (POS)
- Módulo de cobro rápido con cálculo automático de consumo, impuestos (18% ITBIS) y selección interactiva de propinas (5%, 10%, 15%, 20%).
- Modos de pago soportados: **Tarjeta**, **Efectivo** y **Transferencia**.
- Liberación automática de la mesa a estado de limpieza tras el pago.

### 🏆 4. Metas Diarias & Gamificación del Personal
- Ranking de meseros e incentivos por nivel de ventas.
- Seguimiento visual del porcentaje de cumplimiento de la meta colectiva del día.
- Registro de turnos e ingresos individuales.

### 🔐 5. Autenticación por PIN Rápido
- Cambio ultra-rápido de sesión para meseros y chefs mediante PIN de 4 dígitos o credenciales de correo/contraseña.

---

## 🛠️ Tecnologías Utilizadas

### **Backend (`server/`)**
- **Core**: Node.js & Express.js con TypeScript.
- **ORM & DB**: Prisma ORM v5 conectado a **Supabase PostgreSQL** en la nube.
- **Transacciones Atómicas**: Operaciones ACID (`prisma.$transaction`) para creación de órdenes y cobros.
- **WebSockets**: Socket.io con middleware de autenticación por apretón de manos (*handshake*).
- **Seguridad & Rendimiento**: Helmet (cabeceras HTTP), Express Rate Limit (fuerza bruta) y Winston Logger (archivos `error.log` y `combined.log`).

### **Frontend (`client/`)**
- **Core**: React 18 & Vite en TypeScript.
- **Gráficos 3D**: Three.js, `@react-three/fiber` y `@react-three/drei`.
- **Estilos**: Sistema de diseño Vanilla CSS con variables nativas, tema oscuro de lujo (*slate/amber/emerald*) y glassmorphism en `src/index.css`.
- **Gestión de Estado**: Zustand & TanStack React Query v5.
- **Iconografía**: Lucide React.

---

## 🔑 Cuentas y PINs de Prueba Predeterminados

| Rol | Usuario / Correo | Contraseña | Código PIN |
|---|---|---|---|
| 👑 **Administrador** | `admin@plateos.com` | `admin123` | **`1234`** |
| 🕺 **Mesero Star** | `mesero@plateos.com` | `staff123` | **`5678`** |
| 👨‍🍳 **Chef de Cocina** | `cocina@plateos.com` | `staff123` | **`9999`** |
| 💳 **Cajera** | `caja@plateos.com` | `staff123` | **`4321`** |

---

## 🚀 Guía de Instalación y Ejecución Local

### 1. Clonar el Repositorio
```bash
git clone https://github.com/leo124123/PlateOS.git
cd PlateOS
```

### 2. Iniciar el Servidor Backend (`server/`)
```bash
cd server
pnpm install --ignore-workspace

# Sincronizar esquema e inicializar datos en Supabase
pnpm prisma db push
pnpm prisma:seed

# Iniciar servidor en desarrollo (Puerto 3000)
pnpm dev
```

### 3. Iniciar el Cliente Frontend (`client/`)
En otra terminal:
```bash
cd client
pnpm install --ignore-workspace

# Iniciar Vite dev server (Puerto 5173)
pnpm dev
```

Abre tu navegador en **`http://localhost:5173`** para acceder a la aplicación.

---

## 📄 Colección de Postman

El repositorio incluye la colección completa para probar todos los endpoints REST API en Postman o Thunder Client:
- 📁 **[PlateOS_API_Postman_Collection.json](./PlateOS_API_Postman_Collection.json)**

---

## 📄 Licencia

Este proyecto está bajo la licencia **MIT**. Desarrollado para ambientes de producción de alta disponibilidad.
