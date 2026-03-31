# SpainClouds Directory · Versión pública v3

Esta carpeta contiene una revisión del directorio web pensada ya para publicación pública:

- 150 startups cargadas desde la hoja `Startups`
- Home con buscador y filtros
- Página individual por startup
- Formulario "Proponer una startup"
- Backoffice editorial de demo
- Enfoque de información pública y objetiva

## Cómo arrancarlo

```bash
cd spainclouds_next_directory_public_v3
npm install
npm run dev
```

Después abre:

```bash
http://localhost:3000
```

## Rutas incluidas

- `/` → directorio principal
- `/startup/[slug]` → ficha individual
- `/proponer` → formulario de propuesta
- `/admin` → backoffice demo

## Ajustes aplicados en esta revisión

- Se ha retirado el enlace público a LinkedIn en tarjetas y fichas.
- Se ha eliminado la fase de startup del filtro del directorio.
- Se han retirado fase y estado de la ficha pública.
- Se han cargado las 150 startups disponibles en la hoja principal.
- Se han generado logos placeholder para todas las startups que no tenían uno preparado.
- Cuando una startup no tiene web válida para mostrar, el botón aparece como no disponible.

## Notas

- El formulario y el backoffice siguen siendo visuales; todavía no guardan en base de datos.
- Algunos registros pueden requerir revisión manual adicional antes de una publicación definitiva.
