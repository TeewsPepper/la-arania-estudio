# La Araña Estudio / Sala - Frontend

## Descripción
Aplicación web para un estudio de grabación y sala de ensayo musical. Permite:  
- Registro e inicio de sesión de usuarios.  
- Acceso a promociones y servicios.  
- Dashboard de administrador para gestionar reservas.  
- Diseño underground/punk/indie con React, Vite y CSS Modules.  
- Validación y sanitización de formularios en tiempo real.

## Tecnologías
- **Frontend:** React 19.1, TypeScript, Vite, CSS Modules, Framer Motion  
- **Routing:** React Router DOM  
- **Autenticación:** Context + Google OAuth (preparado para backend)  
- **Validación:** Funciones personalizadas de sanitización (`src/utils/sanitize.ts`)


## Funcionalidades principales

### Registro y Login
- Registro con validación en tiempo real de nombre, email y contraseñas.  
- Sanitización de todas las entradas para evitar inyección de código.  
- Redirección al login con mensaje de éxito tras registro.  
- Login con rol `user` o `admin` para controlar accesos.  

### Navbar y Rutas Protegidas
- Navbar dinámico: muestra enlaces según rol.  
- `ProtectedRoute` para páginas de usuario logueado.  
- `AdminRoute` para el dashboard de administrador.  

### Formularios
- Validación y sanitización en tiempo real.  
- Mensajes de error visibles solo después de interactuar con cada campo (`touched`).  
- Botón de envío deshabilitado mientras haya errores.  

### Dashboard Admin
- Acceso exclusivo para usuarios con rol `admin`.  
- Interfaz inicial con datos hardcodeados (preparada para integración backend).  
 

## Instrucciones para ejecutar
1. Clonar el repositorio: 

```bash

  git clone <repo-url>
  cd frontend

```
2. Instalar dependencias:

```bash

 npm install

```

3. Ejecutar en modo desarrollo:

```bash

 npm run dev

```