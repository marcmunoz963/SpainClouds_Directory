# SpainClouds Directory · versión con base de datos y backoffice

Esta iteración añade:

- base de datos local con Prisma + SQLite
- formulario de propuestas guardado en base de datos
- panel de gestión para editar contenidos rápidamente
- feature listings / patrocinados / prioridad editorial
- lógica de referral con tracking de clicks
- filtros tipo landscape por sector, comunidad, especialización y estado comercial
- publicación manual de propuestas desde `/admin`

## Arranque local

```bash
cp .env.example .env
npm install
npm run prisma:generate
npm run db:push
npm run db:seed
npm run dev
```

## Importante

`npm run db:seed` vuelve a cargar las 150 startups del directorio en la base de datos local.
Si no ejecutas el seed, el panel y el listado pueden aparecer vacíos.

## Flujo de propuestas

1. El formulario de `/proponer` guarda la propuesta en la tabla `Proposal`.
2. La propuesta aparece en `/admin` en la bandeja de revisión.
3. Con `Publicar`, se crea una nueva startup en la tabla `Startup`.
4. Después se puede editar desde `/admin/startups/[slug]`.

## Rutas clave

- `/` → directorio público con filtros avanzados
- `/startup/[slug]` → ficha pública
- `/proponer` → alta de propuestas guardada en base de datos
- `/admin` → backoffice
- `/admin/startups/[slug]` → edición de una startup
- `/r/[slug]` → redirect/referral con contador de clicks


## Autenticación del admin

Solo `/admin` y `/admin/startups/[slug]` requieren login.

Después del seed se crea un usuario administrador usando estas variables:

- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`

Ruta de acceso:

- `/login` → login del administrador
- `/admin` → panel protegido

Si quieres cambiar las credenciales iniciales, edita `.env`, elimina la base de datos local y vuelve a ejecutar:

```bash
npm run db:push
npm run db:seed
```
