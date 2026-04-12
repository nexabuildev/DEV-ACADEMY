# 🎓 Dev Academy

Dev Academy es una plataforma moderna de aprendizaje (LMS) diseñada para ofrecer una experiencia premium a estudiantes y administradores. Construida con las tecnologías más punteras de la web.

## 🚀 Tecnologías Principales

- **Framework:** [Next.js 16 (App Router)](https://nextjs.org/) con arquitectura de servidor.
- **Frontend:** [React 19](https://react.dev/) + [Tailwind CSS v4](https://tailwindcss.com/) para un diseño minimalista y ultra-rápido.
- **Base de Datos:** [PostgreSQL (Neon)](https://neon.tech/) gestionado a través de [Prisma 7](https://www.prisma.io/).
- **Autenticación:** [Auth.js v5 (NextAuth)](https://authjs.dev/) con soporte para:
  - Email/Password (Local).
  - Social Login (Google, GitHub, GitLab).
- **Estilo:** Diseño con Micro-animaciones, soporte nativo de **Dark Mode** y estética minimalista premium.

## ✨ Características Principales

### 👨‍🎓 Para Alumno
- **Dashboard Personalizado:** Seguimiento del progreso, cursos inscritos y logros.
- **Comunidad:** Foro de dudas con soporte para hilos de comentarios anidados (replies).
- **Perfil:** Gestión completa de datos personales y sincronización social automática.
- **Lecciones:** Visor de lecciones optimizado para el aprendizaje sin distracciones.

### 🔐 Administración
- **Panel de Control:** Gestión de usuarios (estudiantes y administradores).
- **Estado del Sistema:** Monitorización en tiempo real del estado de la plataforma y temas del sistema.
- **Configuración:** Ajustes globales de la academia directamente desde la UI.

---

## 🛠️ Instalación y Configuración

### 1. Clonar el repositorio
```bash
git clone https://github.com/rubensimon1/dev-academy.git
cd DevAcademy
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar Variables de Entorno
Crea un archivo `.env` en la raíz (puedes usar `.env.example` como guía):
```env
# Database
DATABASE_URL="tu_url_de_neon"

# Auth.js
AUTH_SECRET="un_valor_aleatorio_muy_largo"
AUTH_URL="http://localhost:3000"

# Social IDs
AUTH_GITHUB_ID="..."
AUTH_GITHUB_SECRET="..."
AUTH_GOOGLE_ID="..."
AUTH_GOOGLE_SECRET="..."
```

### 4. Preparar la Base de Datos
```bash
npx prisma db push
npx prisma db seed
```

### 5. Iniciar Desarrollo
```bash
npm run dev
```

---

## 🌎 Despliegue (Vercel)

1. Sube el repositorio a GitHub.
2. Conéctalo a **Vercel**.
3. Asegúrate de añadir la URL de Vercel en los paneles de Google y GitHub (Redirect URIs).
4. Configura las variables de entorno en el panel de Vercel (incluyendo `AUTH_TRUST_HOST=true`).

---

## 📝 Usuario Administrador Inicial
Para las pruebas de desarrollo, el sistema incluye un usuario administrador mediante el seed:
- **Email:** `ruben@dev.com`
- **Contraseña:** `1234`

---

Desarrollado con ❤️ para la comunidad de desarrolladores.
