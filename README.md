# Dev Academy

Plataforma de cursos con foro de dudas, progreso por lecciones y panel de administración, hecha con Next.js 16 y React 19.

Dev Academy es un LMS: un alumno se inscribe en un curso, avanza lección a lección, pregunta sus dudas en un foro con hilos de respuestas anidadas y gana experiencia y logros a medida que progresa. Un administrador gestiona usuarios, cursos y contenido desde un panel aparte, con métricas reales sobre esos datos.

## Por qué lo hice

Quería construir algo con piezas que sí aparecen en un puesto de desarrollador junior real: autenticación de verdad (no un login de juguete), roles de usuario que cambian lo que cada persona puede ver y hacer, y una funcionalidad social —el foro— que obliga a pensar en modelos de datos jerárquicos y no solo en tablas planas.

Elegí un LMS porque tiene la superficie de un proyecto de empresa completo: hay contenido que estructurar (cursos y lecciones ordenadas), hay progreso que persistir y bloquear en orden, hay una comunidad con votos y respuestas, y hay un panel de administración con datos agregados de verdad. No quería otro CRUD de tareas; quería tocar login social, relaciones de base de datos más complejas que un uno-a-muchos, y Server Components de Next.js en un caso donde de verdad ayudan.

## Qué hace

Para el alumno:

- Se registra con email y contraseña o con GitHub, Google o GitLab, y puede combinar ambos métodos en la misma cuenta.
- Se inscribe en cursos organizados por categoría (Web, Bases de Datos, Programación) y avanza lección a lección; completar una lección desbloquea la siguiente.
- Algunas lecciones incluyen un editor de código embebido (vía StackBlitz) para practicar sin salir de la plataforma.
- Al terminar todas las lecciones de un curso, genera un certificado imprimible.
- Toma apuntes personales por lección con autoguardado.
- Participa en el foro: crea preguntas, responde en hilos anidados (una respuesta puede tener respuestas a su vez), vota posts y puede marcar una respuesta como solución.
- Gana experiencia por completar lecciones, publicar, comentar y recibir votos; esa experiencia se traduce en nivel y rango.
- Guarda cursos, lecciones y posts como favoritos, y recibe notificaciones (por ejemplo, cuando alguien responde su pregunta).
- Tiene un perfil público con bio, enlaces y los logros que va desbloqueando.

Para el administrador:

- Panel con métricas globales (usuarios, cursos, lecciones, posts, comentarios, apuntes) y un ranking de usuarios por experiencia.
- Gestión de usuarios y gestión completa de cursos y lecciones: crear, editar y borrar.
- Un panel de ajustes con la configuración visual y de comportamiento general de la plataforma.

## Decisiones técnicas

- **App Router con Server Components en vez de páginas todo-cliente.** La mayoría de páginas (dashboard, foro, panel admin) leen directamente de la base de datos en el servidor con funciones `async` de página, sin pasar por una API intermedia ni por `useEffect` más `fetch`. Menos código, menos estados de carga que gestionar a mano, y el cliente solo recibe JavaScript donde de verdad hace falta interactividad: formularios, votos, el hilo de comentarios.

- **Prisma más PostgreSQL (Neon) en vez de un ORM más ligero o una base NoSQL.** El dominio tiene relaciones reales: un usuario tiene inscripciones, progreso, posts, votos y notas; un curso tiene lecciones ordenadas. Prisma me da tipado end-to-end contra ese esquema y ha aguantado bien que el modelo fuera creciendo (empecé sin gamificación y fui añadiendo experiencia, logros y favoritos sobre la misma base).

- **Hilos de comentarios con una relación reflexiva, no con anidamiento en JSON.** El modelo `Comment` tiene un `parentId` opcional que apunta a otro comentario del mismo modelo (`parent` / `replies`). Al pedir los comentarios de un post los traigo todos en una sola consulta ordenados por fecha, y construyo el árbol en memoria con una función recursiva antes de renderizarlo. Es más simple que guardar la jerarquía como JSON y sigue permitiendo consultas planas —contar comentarios, marcar una solución— sin tocar la estructura del árbol.

- **Auth.js v5 con adaptador de Prisma y varios proveedores sociales.** Quería login social real (GitHub, Google, GitLab) conviviendo con email y contraseña sobre las mismas tablas de usuario, con sesión JWT que lleva el rol (`STUDENT` o `ADMIN`) para no tener que consultar la base de datos en cada página o middleware protegido.

- **Progreso lineal con una tabla intermedia (`UserProgress`) en vez de un array de IDs en el usuario.** Cada lección completada es una fila con `userId`, `lessonId` y un booleano, con restricción de unicidad por pareja. Así el porcentaje de progreso de un curso y el certificado final son una simple cuenta contra esa tabla, sin parsear ni migrar estructuras cada vez que cambian los cursos.

## Stack

- **Framework**: Next.js 16 (App Router) + React 19
- **Estilos**: Tailwind CSS v4
- **Base de datos**: PostgreSQL (Neon) + Prisma 7, con el adaptador `@prisma/adapter-pg`
- **Autenticación**: Auth.js v5 (NextAuth) con adaptador de Prisma — Credentials, GitHub, Google y GitLab
- **Otros**: bcryptjs para el hash de contraseñas, next-themes para el modo oscuro, lucide-react para iconos

## Cómo ejecutarlo en local

Clona el repositorio e instala dependencias:

```bash
git clone https://github.com/rubensimon1/dev-academy.git
cd dev-academy
npm install
```

Crea un archivo `.env` en la raíz con al menos estas variables:

```env
DATABASE_URL="postgresql://usuario:password@host/basededatos"

AUTH_SECRET="un_valor_aleatorio_largo"
AUTH_URL="http://localhost:3000"

AUTH_GITHUB_ID="..."
AUTH_GITHUB_SECRET="..."
AUTH_GOOGLE_ID="..."
AUTH_GOOGLE_SECRET="..."
AUTH_GITLAB_ID="..."
AUTH_GITLAB_SECRET="..."
```

`DATABASE_URL` puede apuntar a cualquier PostgreSQL; yo uso Neon. Las variables de los proveedores sociales son opcionales: sin ellas, el login por email y contraseña sigue funcionando.

Sincroniza el esquema y carga los datos de ejemplo:

```bash
npx prisma db push
npx prisma db seed
```

El seed crea varios cursos con sus lecciones y un usuario administrador de prueba.

Arranca el servidor de desarrollo:

```bash
npm run dev
```

La app queda disponible en `http://localhost:3000`.

### Usuario de prueba

El seed crea un administrador pensado solo para entorno local:

- Email: `ruben@dev.com`
- Contraseña: `1234`

No uses estas credenciales fuera de tu máquina.

---

Rubén Simón — [GitHub](https://github.com/rubensimon1)
