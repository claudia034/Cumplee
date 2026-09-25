# Invitación de cumpleaños de Ale

Aplicación estática con React y Vite. Requiere Node.js 24 y npm.

## Desarrollo local

```sh
npm ci
npm run dev
```

## Desplegar en GitHub Pages

1. En el repositorio, abre **Settings → Pages → Build and deployment** y selecciona **GitHub Actions** como **Source**.
2. Sube estos cambios a la rama `main`.
3. En **Actions**, espera a que termine **Deploy to GitHub Pages**. También puedes ejecutarlo con **Run workflow**.

La dirección esperada para este repositorio es https://claudia034.github.io/Cumplee/.
El enlace definitivo aparece en el entorno `github-pages` al completar el despliegue.
No necesitas agregar secretos: el workflow utiliza el token automático de GitHub.

El workflow instala las dependencias con `npm ci`, compila y publica únicamente `dist/`.
Obtiene la ruta base desde GitHub Pages; las fotos, el video y el audio usan esa misma ruta.
Los cambios posteriores que subas a `main` se publican automáticamente.

Para comprobar localmente la compilación bajo la ruta del repositorio:

```sh
npm run build -- --base=/Cumplee/
npm run preview -- --base=/Cumplee/
```

Abre http://127.0.0.1:4173/Cumplee/.

`node_modules/` y `dist/` ya estaban versionados al agregar este workflow.
El `.gitignore` evita agregar archivos nuevos de esas carpetas, pero no retira los existentes del historial ni del índice. No hace falta actualizarlos para desplegar: Actions los reconstruye.

Referencia: [guía oficial de Vite para GitHub Pages](https://vite.dev/guide/static-deploy#github-pages).
