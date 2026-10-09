# MH Garage

Catálogo online de herramientas de MH Garage. Los clientes navegan los productos y consultan por WhatsApp; no hay carrito ni pagos online.

| App | Qué es | Producción | Proyecto de Vercel |
|---|---|---|---|
| [`store/`](store) | La tienda pública | [mhgarage.ar](https://mhgarage.ar) | `store-mh-garage` |
| [`admin/`](admin) | El panel para cargar productos, precios, categorías, marcas, billboards y combos, con las visitas y consultas de la tienda | [admin.mhgarage.ar](https://admin.mhgarage.ar) | `mh-garage` |

La tienda no tiene base de datos propia: todo lo lee de la API pública del admin (`/api/<storeId>/...`).

## Stack

- **Next.js 14** (App Router), **React 18**, **TypeScript** y **Tailwind CSS 3** en las dos apps.
- **Admin:** Prisma 5 sobre **MongoDB Atlas**, **Clerk** para el login, **Cloudinary** para subir imágenes y TanStack Table y Charts.
- **Tienda:** Zustand, `next-pwa` (service worker) y **PostHog** para visitas, Web Vitals y consultas.
- Las imágenes se sirven desde Cloudinary con un loader propio (`lib/cloudinary-loader.ts`), no con el optimizador de Vercel.

## Requisitos

- **Node 24** (está en el `.nvmrc` de cada app).
- **pnpm 10**. La versión exacta está en el campo `packageManager` de cada `package.json`; con `corepack enable`, o con cualquier pnpm instalado, se usa esa sola.

Cada app es un proyecto independiente, con su propio `pnpm-lock.yaml` y su propio `pnpm-workspace.yaml`, donde están los overrides de seguridad y qué dependencias pueden correr scripts al instalarse.

## Levantar en local

```bash
# Admin: http://localhost:3000
cd admin
cp .env.example .env.local   # completar
pnpm install                 # corre `prisma generate`
pnpm dev

# Tienda: http://localhost:3001
cd store
cp .env.example .env.local   # ADMIN_API_URL apunta al admin local
pnpm install
pnpm dev
```

Los `.env.example` explican cada variable. Si la tienda no tiene `ADMIN_API_URL`, lee del admin de producción. PostHog no registra nada en desarrollo.

Si tu `~/.npmrc` tiene `ignore-scripts=true`, pnpm no ejecuta `prisma generate` al instalar. En ese caso corrélo a mano con `pnpm exec prisma generate`.

## Scripts

En las dos apps: `pnpm dev`, `pnpm build`, `pnpm start` y `pnpm lint`.

En `admin/scripts/` hay scripts de mantenimiento que se corren a mano con `npx tsx` (cada archivo explica su uso):

- `clone-db.ts`: copia la base a otra del mismo cluster, para tener un entorno de pruebas descartable.
- `normalize-categories.ts` y `split-manual-tools.ts`: recategorizan productos por nombre (sacan productos de "OTRO" y dividen "HERRAMIENTAS MANUALES"). Primero generan una propuesta en CSV para revisar, después la aplican y guardan un backup para poder volver atrás.
- `seed-combos.ts`: carga los combos iniciales, uno por rubro, sin duplicar los que ya existen.

## Versiones

Las dos apps comparten el mismo número de versión. Para publicar una:

1. Subir `version` en `admin/package.json` y en `store/package.json`.
2. Sumar la entrada **arriba** en `admin/lib/changelog.ts`, escrita para quien administra la tienda. El Panel la muestra como "NUEVO".
3. Commit con la versión entre paréntesis en el título y un tag anotado `vX.Y.Z`.

Cada push a `main` despliega las dos apps en Vercel.
