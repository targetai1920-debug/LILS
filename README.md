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
>
> **GitHub Pages sigue deshabilitado.** El sitio está preparado para
> publicarse bajo `/LILS`, pero no existe ningún workflow de despliegue en
> este repositorio. Publicar requiere autorización explícita posterior y un
> workflow separado.

## Stack técnico

- [Next.js 16](https://nextjs.org/) (App Router) + React 18 + TypeScript estricto
- Tailwind CSS, con la paleta de marca centralizada en variables CSS (`src/app/globals.css`)
- Exportación estática (`output: 'export'`) — compatible con GitHub Pages
- [Leaflet](https://leafletjs.com/) + [react-leaflet](https://react-leaflet.js.org/) sobre OpenStreetMap (sin API keys)
- [Vitest](https://vitest.dev/) + [React Testing Library](https://testing-library.com/react) para pruebas
- ESLint 9 (configuración flat, `eslint.config.mjs`, basada en `eslint-config-next`)

## Empezar

```bash
npm install
cp .env.example .env.local   # NEXT_PUBLIC_DEMO_MODE=true
npm run dev                  # http://localhost:3000
```

## Scripts

| Comando               | Qué hace                                                          |
| ---------------------- | ------------------------------------------------------------------ |
| `npm run dev`           | Servidor de desarrollo (sirve en `/`)                               |
| `npm run build`         | Build de producción + exportación estática a `out/` (sirve en `/`)  |
| `npm run build:pages`   | Igual, pero con `NEXT_PUBLIC_BASE_PATH=/LILS` (rutas/assets bajo `/LILS`) + genera `out/.nojekyll` |
| `npm run verify:pages`  | Comprueba que el build de `build:pages` referencia `/LILS/_next/` y no `/_next/` |
| `npm run lint`          | `eslint .` (configuración flat, `next lint` ya no existe en esta versión de Next) |
| `npm run typecheck`     | `tsc --noEmit`                                                      |
| `npm test`              | Suite de pruebas con Vitest                                         |

Antes de dar por terminado cualquier cambio, deben pasar todos:

```bash
npm run lint
npm run typecheck
npm test
npm run build
npm audit
npm run build:pages && npm run verify:pages
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
.github/workflows/ci.yml   CI de validación (lint/typecheck/test/audit/build). Nunca despliega.
```

Los precios, ingredientes, extras, zonas de delivery y datos del negocio están
centralizados en `src/data/*` — **no** están dispersos en los componentes.
Añadir un producto o una sucursal nueva no requiere tocar componentes.

## Pedido: cambio de tipo de entrega e idempotencia

`src/lib/orders/checkoutReducer.ts` reinicia el método de pago y cualquier
estado de finalización previo cada vez que el usuario cambia realmente entre
"envío a domicilio" y "recojo en sucursal", y limpia los datos exclusivos
del tipo que se abandona (dirección/tarifa/distancia al pasar a recojo;
datos de recojo al pasar a delivery). El carrito y la facturación se
conservan siempre. `src/lib/orders/draftValidation.ts` es la última barrera
antes de generar un comprobante: nunca se finaliza un pedido con una
combinación inválida (por ejemplo, un método de pago que no corresponde al
tipo de entrega elegido).

`DemoOrderService` implementa idempotencia dentro de la misma sesión del
navegador: una clave de intento (`attemptId`) más una huella (`fingerprint`)
del contenido del pedido evitan crear pedidos duplicados ante un doble clic
o un reintento tras error. El patrón está inspirado en el mecanismo de
`Esquece/apps-script/Appointments.gs` (clave de idempotencia generada en el
cliente, verificada en el servidor antes de escribir), adaptado como
referencia arquitectónica — **no** es una garantía de backend real ni
funciona entre dispositivos o recargas de página. Ver
`docs/DEMO_LIMITATIONS.md` para el detalle completo.

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
marcado en el código (en comentarios y datos internos, nunca en texto
visible de la interfaz) como `DEMO_DATA_REPLACE_BEFORE_PRODUCTION` o
`DEMO_APPROXIMATE_COORDINATES_REPLACE`. El texto de "Nosotros" es
provisional (`TODO_CLIENT_APPROVAL` solo en comentarios/datos internos). Ver
`docs/CLIENT_INFORMATION_REQUIRED.md` para la lista completa de información
pendiente del cliente.

## Publicación bajo `/LILS` (preparada, no habilitada)

El proyecto admite construirse con una ruta base para una futura publicación
en `https://targetai1920-debug.github.io/LILS/`, vía `NEXT_PUBLIC_BASE_PATH`:

```bash
npm run build:pages    # NEXT_PUBLIC_BASE_PATH=/LILS next build && genera out/.nojekyll
npm run verify:pages   # valida que las rutas/assets usan /LILS/_next/, no /_next/
```

Sin esa variable (`npm run dev`, `npm run build`), el sitio sigue sirviéndose
normalmente en `/`. Esto **no publica nada**: solo prepara el build. No hay
ningún workflow de despliegue en `.github/workflows/` — `ci.yml` únicamente
valida (lint, typecheck, test, `npm audit`, ambos builds); publicar en
GitHub Pages requeriría un workflow separado y autorización explícita
posterior.

## CI

`.github/workflows/ci.yml` corre en cada push y pull request: `npm ci`,
lint, typecheck, test, `npm audit`, build normal y build `/LILS`. No
contiene ningún paso de despliegue (sin `deploy-pages`, sin permisos
`pages`/`id-token`, sin entorno `github-pages`).

## Documentación relacionada

- [`docs/DEMO_LIMITATIONS.md`](docs/DEMO_LIMITATIONS.md) — qué es simulado, qué no, y por qué.
- [`docs/CLIENT_INFORMATION_REQUIRED.md`](docs/CLIENT_INFORMATION_REQUIRED.md) — checklist de información que LILS debe confirmar antes de producción.
- [`docs/ASSET_MANIFEST.md`](docs/ASSET_MANIFEST.md) — inventario de recursos visuales (logo, mascota, fotos) y cuáles son placeholders.
- [`CLAUDE.md`](CLAUDE.md) — invariantes del proyecto para trabajo asistido por IA.

## Publicar la demo (futuro, no hecho aquí)

El sitio exporta a HTML/CSS/JS estático en `out/` (`npm run build` o
`npm run build:pages`), listo para GitHub Pages o cualquier hosting
estático. No requiere servidor Node en producción. Antes de publicar en un
dominio real:

1. Confirmar con el cliente toda la información listada en
   `docs/CLIENT_INFORMATION_REQUIRED.md`.
2. Sustituir los datos `DEMO_DATA_REPLACE_BEFORE_PRODUCTION` por los valores reales.
3. Reemplazar los assets de marca provisionales (ver `docs/ASSET_MANIFEST.md`).
4. Decidir e implementar el backend real de pedidos (`OrderService`), con
   idempotencia persistida y atómica en el servidor (no solo en memoria del
   navegador), el QR bancario oficial y el método autorizado de
   verificación de pagos.
5. Cambiar `NEXT_PUBLIC_DEMO_MODE` a `false` solo cuando exista un backend real.
6. Crear un workflow de despliegue separado (con autorización explícita) y
   habilitar GitHub Pages — ninguno de los dos existe todavía.
