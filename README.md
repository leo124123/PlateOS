# 🍽️ PlateOS 3D v3 — Sistema Operativo de Restaurantes & App Móvil Cliente

![PlateOS 3D](https://img.shields.io/badge/PlateOS-v3.0_Production-f59e0b?style=for-the-badge&logo=react&logoColor=black)
![Expo](https://img.shields.io/badge/Expo_Go-SDK_54-000000?style=for-the-badge&logo=expo&logoColor=white)
![React Native](https://img.shields.io/badge/React_Native-v0.76+-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-v20+-339933?style=for-the-badge&logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-v5.3+-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma_ORM-v5.22+-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Three.js](https://img.shields.io/badge/Three.js-3D_Graphics-000000?style=for-the-badge&logo=three.js&logoColor=white)
![pnpm](https://img.shields.io/badge/pnpm-Monorepo_v11+-F69220?style=for-the-badge&logo=pnpm&logoColor=white)

**PlateOS v3** es una plataforma integral de gestión y operación para restaurantes de nueva generación. Combina un **salón interactivo en 3D en tiempo real**, una **pantalla de cocina KDS**, un **punto de venta (POS) y cobros**, un **panel de gamificación y metas diarias**, y una **App Móvil en React Native / Expo** para comensales en mesa.

---

## 🌟 Características Principales

### 📱 1. App Móvil Cliente React Native (Expo SDK 54)
- **Escáner QR & Teclado PIN de Mesa**: Los clientes se conectan a su mesa en 1 segundo escaneando el código QR impreso en el acrílico de la mesa o ingresando el PIN táctil.
- **🛎️ Llamar al Mesero en Tiempo Real**: Botón flotante que emite la señal `customer:call_waiter` vía WebSockets, haciendo pulsar el halo 3D de la mesa y activando la alerta sonora en la terminal del mozo.
- **📖 Menú Digital Gourmet Interactivo**: Catálogo con buscador por platillo, fotografías gastronómicas HD, tiempos de preparación y selector de categorías.
- **🛒 Mi Pedido & Seguimiento Live**: Envío de comandas a la cocina con notas especiales y timeline en tiempo real (*Marchado*, *En Cocción*, *¡Listo para Entregar!*, *Servido*).
- **💳 Solicitar la Cuenta desde el Teléfono**: Cambia el estado de la mesa a `BILL_REQUESTED` y notifica instantáneamente al cajero y al mozo.

### 🏢 2. Salón de Restaurante en 3D Interactivo
- Visualización 3D fluida del salón con cámaras orbitales, zoom y rotación (*Three.js / React Three Fiber*).
- Indicadores luminosos en tiempo real del estado de cada mesa (*Disponible*, *Ocupada*, *Comanda Pendiente*, *Comiendo*, *Cuenta Solicitada*, *Limpieza*).
- Avatares 3D animados para clientes en mesa y halo luminoso de llamada activa.

### 👨‍🍳 3. Pantalla de Cocina (KDS) en Tiempo Real
- Recepción instantánea de comandas enviadas por meseros o comensales desde la App Móvil vía **Socket.io**.
- Asignación de tiempo de cocción estimado y temporizadores activos en vivo.
- Notificaciones dirigidas exclusivamente al mesero al marcar el platillo como finalizado.

### 💳 4. Control de Caja & Cobros (POS)
- Módulo de cobro rápido con cálculo automático de consumo, impuestos (18% ITBIS) y selección interactiva de propinas (5%, 10%, 15%, 20%).
- Modos de pago soportados: **Tarjeta**, **Efectivo** y **Transferencia**.
- **Generador de Códigos QR por Mesa (`📱 QR Mesas`)**: Mapea e imprime los códigos QR oficiales para las mesas del restaurante.

### 🏆 5. Metas Diarias & Gamificación del Personal
- Ranking de meseros e incentivos por nivel de ventas.
- Seguimiento visual del porcentaje de cumplimiento de la meta colectiva del día.

### 🔐 6. Autenticación por PIN Rápido
- Cambio ultra-rápido de sesión para meseros y chefs mediante PIN de 4 dígitos o credenciales de correo/contraseña.

---

## 🛠️ Arquitectura de Monorepo (`pnpm`)

```
PlateOS/
├── client/              # App Web (React + Vite + Three.js 3D + POS + KDS + Generador QR)
├── server/              # Backend API + Socket.io + Prisma DB / Mock Engine
├── mobile/              # App Móvil React Native (Expo SDK 54 + WebSockets + Escáner QR)
└── pnpm-workspace.yaml  # Configuración del workspace monorepo
```

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

### 1. Clonar el Repositorio e Instalar Dependencias
```bash
git clone https://github.com/leo124123/PlateOS.git
cd PlateOS

# Instalar todas las dependencias del monorepo
pnpm install
```

### 2. Iniciar el Servidor Backend (`server/`)
```bash
cd server

# Sincronizar esquema e inicializar datos en Supabase / Prisma
pnpm prisma db push
pnpm prisma:seed

# Iniciar servidor en desarrollo (Puerto 3000)
pnpm dev
```

### 3. Iniciar el Cliente Web (`client/`)
En otra terminal:
```bash
cd client
pnpm dev
```
*Abre tu navegador en **`http://localhost:5173`**.*

### 4. Iniciar la App Móvil Cliente (`mobile/`)
En otra terminal:
```bash
cd mobile
pnpm start
```
*Escanea el código QR de la terminal con la app **Expo Go** en tu dispositivo físico o probador.*

---

## 📄 Colección de Postman

El repositorio incluye la colección completa para probar todos los endpoints REST API en Postman o Thunder Client:
- 📁 **[PlateOS_API_Postman_Collection.json](./PlateOS_API_Postman_Collection.json)**

---

## 📄 Licencia

Este proyecto está bajo la licencia **MIT**. Desarrollado para ambientes de producción de alta disponibilidad.
