# SpainClouds Directory

Mejoras incluidas en esta iteración:

- filtros laterales con contadores dinámicos
- página de contacto
- página para reclamar una empresa o preguntar por promoción
- área de empresas con creación de cuentas en local (demo)
- propuestas guardadas localmente y visibles en `/admin`
- posibilidad de publicar propuestas desde `/admin`
- opción de eliminar startups desde `/admin`
- edición manual y reset de clicks de referral desde `/admin`
- ficha pública sin bloque de clicks de referral
- etiquetas y especializaciones mostradas en Title Case

## Nota

Esta versión funciona como demo persistiendo cambios en `localStorage` del navegador.


## Cambios v5
- Contacto y reclamar empresa se fusionan en `/contacto`.
- La navegación pública elimina el enlace independiente a reclamar empresa.
- Las solicitudes unificadas siguen llegando a `/admin` y preparan un correo a `smartclouds@globaltech.tv`.
