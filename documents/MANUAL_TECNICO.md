# Manual Técnico

## 1. Propósito
Describe la estructura técnica, configuración y componentes del Sistema de Nómina y RRHH.

## 2. Alcance
Permite administrar empleados, departamentos, nóminas y reportes.

## 3. Requerimientos del Sistema
- Node.js 20+
- TypeScript 5+
- React 18 + Vite
- SQL Server Management Studio
- 8 GB RAM mínimo

## 4. Dependencias
- React Query / Zustand
- Axios
- React Hook Form + Zod
- TailwindCSS
- jsPDF / pdfmake

## 5. Arquitectura General

```
Frontend (React + Vite)
       ↓
API REST (Node.js / Express)
       ↓
SQL Server
```

Backend 
├── 📁 src/
│   ├── 📁 core/
│   │   ├── 📁 db/
│   │   │   ├── 📄 data-source.ts
│   │   │   ├── 📄 dbnomina.bak
│   │   │   ├── 📄 init.sql
│   │   │   └── 📄 sql.ts
│   │   ├── 📁 errors/
│   │   │   └── 📄 AppError.ts
│   │   ├── 📄 config.ts
│   │   ├── 📄 logger.ts
│   │   └── 📄 swagger.ts
│   ├── 📁 middlewares/
│   │   ├── 📄 auth.middleware.ts
│   │   ├── 📄 error.middleware.ts
│   │   ├── 📄 role.middleware.ts
│   │   ├── 📄 upload.middleware.ts
│   │   └── 📄 validation.middleware.ts
│   ├── 📁 modules/
│   │   ├── 📁 auth/
│   │   │   ├── 📄 auth.controller.ts
│   │   │   ├── 📄 auth.model.ts
│   │   │   ├── 📄 auth.repository.ts
│   │   │   ├── 📄 auth.routes.ts
│   │   │   ├── 📄 auth.service.ts
│   │   │   └── 📄 auth.types.ts
│   │   ├── 📁 bitacora/
│   │   │   ├── 📄 bitacora.controller.ts
│   │   │   ├── 📄 bitacora.model.ts
│   │   │   ├── 📄 bitacora.repository.ts
│   │   │   ├── 📄 bitacora.routes.ts
│   │   │   └── 📄 bitacora.service.ts
│   │   ├── 📁 departamentos/
│   │   │   ├── 📄 departamentos.controller.ts
│   │   │   ├── 📄 departamentos.model.ts
│   │   │   ├── 📄 departamentos.repository.ts
│   │   │   ├── 📄 departamentos.routes.ts
│   │   │   └── 📄 departamentos.service.ts
│   │   ├── 📁 documentos/
│   │   │   ├── 📄 documentos.controller.ts
│   │   │   ├── 📄 documentos.model.ts
│   │   │   ├── 📄 documentos.repository.ts
│   │   │   ├── 📄 documentos.routes.ts
│   │   │   └── 📄 documentos.service.ts
│   │   ├── 📁 empleados/
│   │   │   ├── 📄 empleados.controller.ts
│   │   │   ├── 📄 empleados.model.ts
│   │   │   ├── 📄 empleados.repository.ts
│   │   │   ├── 📄 empleados.routes.ts
│   │   │   └── 📄 empleados.service.ts
│   │   ├── 📁 formacion/
│   │   │   ├── 📄 formacion.controller.ts
│   │   │   ├── 📄 formacion.model.ts
│   │   │   ├── 📄 formacion.repository.ts
│   │   │   ├── 📄 formacion.routes.ts
│   │   │   └── 📄 formacion.service.ts
│   │   ├── 📁 nominas/
│   │   │   ├── 📄 nominas.controller.ts
│   │   │   ├── 📄 nominas.model.ts
│   │   │   ├── 📄 nominas.repository.ts
│   │   │   ├── 📄 nominas.routes.ts
│   │   │   └── 📄 nominas.service.ts
│   │   ├── 📁 puestos/
│   │   │   ├── 📄 puestos.controller.ts
│   │   │   ├── 📄 puestos.model.ts
│   │   │   ├── 📄 puestos.repository.ts
│   │   │   ├── 📄 puestos.routes.ts
│   │   │   └── 📄 puestos.service.ts
│   │   ├── 📁 reportes/
│   │   │   ├── 📄 reportes.controller.ts
│   │   │   ├── 📄 reportes.model.ts
│   │   │   ├── 📄 reportes.repository.ts
│   │   │   ├── 📄 reportes.routes.ts
│   │   │   └── 📄 reportes.service.ts
│   │   ├── 📁 roles/
│   │   │   ├── 📄 roles.controller.ts
│   │   │   ├── 📄 roles.model.ts
│   │   │   ├── 📄 roles.repository.ts
│   │   │   └── 📄 roles.routes.ts
│   │   ├── 📁 tiposDocumento/
│   │   │   ├── 📄 tiposDocumento.controller.ts
│   │   │   ├── 📄 tiposDocumento.model.ts
│   │   │   ├── 📄 tiposDocumento.repository.ts
│   │   │   ├── 📄 tiposDocumento.routes.ts
│   │   │   └── 📄 tiposDocumento.service.ts
│   │   └── 📁 usuarios/
│   │       ├── 📄 usuarios.controller.ts
│   │       ├── 📄 usuarios.model.ts
│   │       ├── 📄 usuarios.repository.ts
│   │       ├── 📄 usuarios.routes.ts
│   │       └── 📄 usuarios.service.ts
│   ├── 📁 routes/
│   │   └── 📄 index.ts
│   ├── 📁 types/
│   │   └── 📄 express.d.ts
│   ├── 📁 uploads/
│   │   └── 📁 empleados/
│   │       ├── 📁 academicos/
│   │       │   ├── 📕 constancia_curso_demo.pdf
│   │       │   └── 📕 titulo_demo.pdf
│   │       └── 📁 personales/
│   │           ├── 📕 contrato_demo.pdf
│   │           └── 📕 dpi_demo.pdf
│   ├── 📄 app.ts
│   └── 📄 main.ts
├── ⚙️ .env.example
├── ⚙️ .gitignore
├── ⚙️ docker-compose.yml
├── ⚙️ nodemon.json
├── ⚙️ package-lock.json
├── ⚙️ package.json
├── 📄 setup.js
└── ⚙️ tsconfig.json

Frontend

├── 📁 documents/
│   ├── 📝 MANUAL_TECNICO.md
│   └── 📝 MANUAL_USUARIO.md
├── 📁 public/
│   ├── 📁 image/
│   │   ├── 🖼️ Departamento.png
│   │   ├── 🖼️ DetalleDeNomina.png
│   │   ├── 🖼️ Empleados.png
│   │   ├── 🖼️ FormacionAcademica.png
│   │   ├── 🖼️ Icon.jpg
│   │   ├── 🖼️ Icon2.jpg
│   │   ├── 🖼️ Inicio.png
│   │   ├── 🖼️ LogotipoUMG.png
│   │   ├── 🖼️ Nomina.png
│   │   ├── 🖼️ NuevoEmpleado.png
│   │   ├── 🖼️ ReporteDocumentos.png
│   │   ├── 🖼️ ReporteGeneral.png
│   │   ├── 🖼️ Usuarios.png
│   │   ├── 🖼️ login.jpg
│   │   ├── 🖼️ login.png
│   │   └── 🖼️ puesto.png
│   ├── 📄 favicon.ico
│   └── 🖼️ vite.svg
├── 📁 src/
│   ├── 📁 api/
│   │   ├── 📄 client.ts
│   │   └── 📄 config.ts
│   ├── 📁 assets/
│   │   └── 🖼️ react.svg
│   ├── 📁 components/
│   │   ├── 📁 layout/
│   │   │   ├── 📄 MainLayout.tsx
│   │   │   └── 📄 Navbar.tsx
│   │   └── 📁 ui/
│   │       ├── 📄 Button.tsx
│   │       ├── 📄 Card.tsx
│   │       ├── 📄 Input.tsx
│   │       ├── 📄 Modal.tsx
│   │       ├── 📄 Table.tsx
│   │       └── 📄 ToggleSwitch.tsx
│   ├── 📁 context/
│   │   ├── 📄 AuthContext.tsx
│   │   └── 📄 AuthProvider.tsx
│   ├── 📁 features/
│   │   ├── 📁 auth/
│   │   │   └── 📁 pages/
│   │   │       └── 📄 LoginPage.tsx
│   │   ├── 📁 departamentos/
│   │   │   └── 📁 pages/
│   │   │       └── 📄 DepartamentosPage.tsx
│   │   ├── 📁 empleados/
│   │   │   ├── 📁 components/
│   │   │   │   ├── 📄 EmpleadoForm.tsx
│   │   │   │   ├── 📄 EmpleadoPerfilModal.tsx
│   │   │   │   └── 📄 EmpleadosFormacionModal.tsx
│   │   │   └── 📁 pages/
│   │   │       └── 📄 EmpleadosPage.tsx
│   │   ├── 📁 inicio/
│   │   │   └── 📁 pages/
│   │   │       └── 📄 InicioPage.tsx
│   │   ├── 📁 nomina/
│   │   │   ├── 📁 components/
│   │   │   │   ├── 📄 BeneficioModal.tsx
│   │   │   │   ├── 📄 NominaForm.tsx
│   │   │   │   └── 📄 VoucherEmpleado.tsx
│   │   │   └── 📁 pages/
│   │   │       ├── 📄 NominaDetallePage.tsx
│   │   │       └── 📄 NominaPage.tsx
│   │   ├── 📁 puestos/
│   │   │   └── 📁 pages/
│   │   │       └── 📄 PuestosPage.tsx
│   │   ├── 📁 reportes/
│   │   │   ├── 📁 components/
│   │   │   │   ├── 📄 ReportePDF.tsx
│   │   │   │   ├── 📄 ReportePDFDocumentos.tsx
│   │   │   │   └── 📄 ReportePDFGlobal.tsx
│   │   │   └── 📁 pages/
│   │   │       └── 📄 ReportesPage.tsx
│   │   └── 📁 usuarios/
│   │       ├── 📁 components/
│   │       │   └── 📄 UsuarioForm.tsx
│   │       ├── 📁 models/
│   │       │   └── 📄 usuario.model.ts
│   │       ├── 📁 pages/
│   │       │   └── 📄 UsuariosPage.tsx
│   │       └── 📁 services/
│   │           └── 📄 usuarios.service.ts
│   ├── 📁 hooks/
│   │   ├── 📄 useDarkMode.ts
│   │   └── 📄 useFetch.ts
│   ├── 📁 models/
│   │   ├── 📄 documento.model.ts
│   │   ├── 📄 empleado.model.ts
│   │   ├── 📄 nomina.model.ts
│   │   ├── 📄 reporte.model.ts
│   │   ├── 📄 tipoDocumento.model.ts
│   │   └── 📄 usuario.model.ts
│   ├── 📁 routes/
│   │   ├── 📄 AppRouter.tsx
│   │   └── 📄 PrivateRoute.tsx
│   ├── 📁 services/
│   │   ├── 📄 auth.service.ts
│   │   ├── 📄 departamentos.service.ts
│   │   ├── 📄 documentos.service.ts
│   │   ├── 📄 empleados.service.ts
│   │   ├── 📄 formacion.service.ts
│   │   ├── 📄 nomina.service.ts
│   │   ├── 📄 puestos.service.ts
│   │   ├── 📄 reportes.service.ts
│   │   ├── 📄 tiposDocumento.service.ts
│   │   └── 📄 usuarios.service.ts
│   ├── 📁 shared/
│   │   └── 📄 LoadingSpinner.tsx
│   ├── 📁 styles/
│   │   └── 🎨 index.css
│   ├── 📁 utils/
│   │   └── 📄 swalConfig.ts
│   ├── 🎨 App.css
│   ├── 📄 App.tsx
│   ├── 📄 main.tsx
│   └── 📄 vite-env.d.ts
├── ⚙️ .gitignore
├── 📝 README.md
├── 📄 eslint.config.js
├── 🌐 index.html
├── ⚙️ package-lock.json
├── ⚙️ package.json
├── ⚙️ tsconfig.app.json
├── ⚙️ tsconfig.json
├── ⚙️ tsconfig.node.json
└── 📄 vite.config.ts

## 6. Instalación y Configuración

```bash
cd frontend
npm install
npm run dev
npm run build
```

## 7. Autenticación y Roles
- Admin → acceso total
- RRHH → gestión de nómina
- Empleado → lectura

## 8. Mantenimiento Preventivo
Ejecutar:
```bash
npm update
npm audit fix
```

## 👨‍💻 Autor
**Pablo Raúl Arreola Contreras y Marvin Alexander**  
Universidad Mariano Gálvez de Guatemala  
Proyecto: *Sistema de Nómina RH — 2025*
