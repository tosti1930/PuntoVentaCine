# 🎬 CinePOS - Sistema de Gestión de Cine Fullstack

![React](https://img.shields.io/badge/Frontend-React-61DAFB?style=for-the-badge&logo=react)
![PHP](https://img.shields.io/badge/Backend-PHP-777BB4?style=for-the-badge&logo=php)
![MySQL](https://img.shields.io/badge/Database-MySQL-4479A1?style=for-the-badge&logo=mysql)
![Vite](https://img.shields.io/badge/Build-Vite-646CFF?style=for-the-badge&logo=vite)

**CinePOS** es una solución integral de Punto de Venta (POS) diseñada para la administración operativa de un cine. El sistema gestiona desde la programación de carteleras hasta la venta de boletos con selección de asientos en tiempo real y cierre de caja.

---

## 🚀 Características Principales

### 🎟️ Para el Cajero (Punto de Venta)
* **Mapa de Asientos Interactivo:** Renderizado dinámico de salas basado en matrices (filas x columnas). Lógica de bloqueo para asientos ocupados/vendidos.
* **Generación de Tickets:** Creación automática de boletos con código **QR único** para validación de acceso.
* **Corte de Caja:** Panel financiero con cálculo de ventas diarias, boletos emitidos y generación de reporte imprimible (CSS Print Media).

### ⚙️ Para el Administrador (Backoffice)
* **Gestión de Cartelera:** Alta de películas y programación de horarios (Funciones).
* **Protección de Rutas:** Sistema de autenticación (Login) con manejo de sesiones y roles de usuario.

---

## 🛠️ Stack Tecnológico

* **Frontend:** React.js (Vite), Axios, React Router DOM, SweetAlert2, QRCode.react.
* **Backend:** PHP Nativo (API RESTful), PDO para consultas seguras.
* **Base de Datos:** MySQL (Relacional).
* **Estilos:** CSS3 con diseño responsivo y Media Queries para impresión térmica.

---

## 💾 Estructura de Base de Datos

El proyecto utiliza un modelo relacional normalizado para garantizar la integridad de las transacciones.

```sql
[Salas] 1 ---- N [Funciones] 1 ---- N [Boletos_Vendidos]
                     |
                 [Peliculas]