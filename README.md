# LILS Burger — Demo Web

Demostración comercial funcional de la página web de **LILS Burger** (Cochabamba,
Bolivia). Permite navegar la marca, ver el menú completo y recorrer una
simulación realista de pedido (productos → personalización → entrega →
facturación → pago → comprobante), sin conectarse a ningún backend, CRM,
banco o WhatsApp real.

> ⚠️ Este es un sitio de **demostración**. No procesa pedidos ni pagos reales.
> Ver [`docs/DEMO_LIMITATIONS.md`](docs/DEMO_LIMITATIONS.md) para el detalle
> completo de qué es simulado y qué falta confirmar con el cliente antes de
> producción (ver [`docs/CLIENT_INFORMATION_REQUIRED.md`](docs/CLIENT_INFORMATION_REQUIRED.md)).

## Stack técnico

- [Next.js 14](https://nextjs.org/) (App Router) + React 18 + TypeScript estricto
- Tailwind CSS, con la paleta de marca centralizada en variables CSS (`src/app/globals.css`)
- Exportación estática (`output: 'export'`) — compatible con GitHub Pages
- [Leaflet](https://leafletjs.com/) + [react-leaflet](https://react-leaflet.js.org/) sobre OpenStreetMap (sin API keys)
- [Vitest](https://vitest.dev/) + [React Testing Library](https://testing-library.com/react) para pruebas
- ESLint (`next/core-web-vitals`)

## Empezar

```bash
npm install
cp .env.example .env.local   # NEXT_PUBLIC_DEMO_MODE=true
npm run dev                  # http://localhost:3000
```

## Scripts

| Comando            | Qué hace                                            |
| ------------------- | ---------------------------------------------------- |
| `npm run dev`        | Servidor de desarrollo                                |
| `npm run build`       | Build de producción + exportación estática a `out/`   |
| `npm run lint`        | ESLint                                                |
| `npm run typecheck`   | `tsc --noEmit`                                        |
| `npm test`            | Suite de pruebas con Vitest                           |

Antes de dar por terminado cualquier cambio, deben pasar los cuatro:

```bash
npm run lint && npm run typecheck && npm test && npm run build
```

## Estructura del proyecto

```
src/
  app/            Rutas (App Router): /, /menu, /ordenar, /nosotros, /ubicacion, /redes, /contacto
  components/      Componentes de UI, agrupados por dominio (menu, cart, order, map, brand, layout, ui)
  context/         CartContext (estado del carrito + persistencia en localStorage)
  data/            Datos "de negocio": business.ts, menu.ts, branches.ts, delivery.ts
  lib/             Lógica pura y testeable: cart, delivery, orders, validation, time, contact
  types/           Tipos compartidos de TypeScript
docs/              Documentación del proyecto (ver abajo)
```

Los precios, ingredientes, extras, zonas de delivery y datos del negocio están
centralizados en `src/data/*` — **no** están dispersos en los componentes.
Añadir un producto o una sucursal nueva no requiere tocar componentes.

## Modo demo

Con `NEXT_PUBLIC_DEMO_MODE=true` (valor por defecto si la variable no está
definida):

- No se envían pedidos reales a ningún backend.
- No se contacta al WhatsApp oficial de LILS.
- No se guardan datos en servidores: el carrito vive en `localStorage` del navegador.
- No se verifican pagos reales: el QR es de demostración y el "pago" se simula con un botón.
- Se muestra un aviso discreto de que es una demostración en la parte superior del sitio.

## Datos de demostración

Todo el contenido de menú, precios, tarifas de delivery y coordenadas está
marcado en el código como `DEMO_DATA_REPLACE_BEFORE_PRODUCTION` o
`DEMO_APPROXIMATE_COORDINATES_REPLACE`. El texto de "Nosotros" está marcado
como `TODO_CLIENT_APPROVAL`. Ver `docs/CLIENT_INFORMATION_REQUIRED.md` para
la lista completa de información pendiente del cliente.

## Documentación relacionada

- [`docs/DEMO_LIMITATIONS.md`](docs/DEMO_LIMITATIONS.md) — qué es simulado, qué no, y por qué.
- [`docs/CLIENT_INFORMATION_REQUIRED.md`](docs/CLIENT_INFORMATION_REQUIRED.md) — checklist de información que LILS debe confirmar antes de producción.
- [`docs/ASSET_MANIFEST.md`](docs/ASSET_MANIFEST.md) — inventario de recursos visuales (logo, mascota, fotos) y cuáles son placeholders.
- [`CLAUDE.md`](CLAUDE.md) — invariantes del proyecto para trabajo asistido por IA.

## Publicar la demo

El sitio exporta a HTML/CSS/JS estático en `out/` (`npm run build`), listo
para GitHub Pages o cualquier hosting estático. No requiere servidor Node en
producción. Antes de publicar en un dominio real:

1. Confirmar con el cliente toda la información listada en
   `docs/CLIENT_INFORMATION_REQUIRED.md`.
2. Sustituir los datos `DEMO_DATA_REPLACE_BEFORE_PRODUCTION` por los valores reales.
3. Reemplazar los assets de marca provisionales (ver `docs/ASSET_MANIFEST.md`).
4. Decidir e implementar el backend real de pedidos (`OrderService`), el QR
   bancario oficial y el método autorizado de verificación de pagos.
5. Cambiar `NEXT_PUBLIC_DEMO_MODE` a `false` solo cuando exista un backend real.
