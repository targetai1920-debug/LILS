# CLAUDE.md — LILS Burger Demo Web

Este archivo describe **exclusivamente** el proyecto LILS Burger: una
demostración comercial web para una hamburguesería de Cochabamba, Bolivia.
No pertenece a ningún otro proyecto o cliente.

## Qué es este repositorio

Un sitio Next.js (App Router, exportación estática) que presenta la marca
LILS Burger y permite recorrer una simulación completa de pedido: productos,
personalización, entrega (domicilio o recojo), facturación, pago (QR de
demostración o efectivo/caja) y comprobante. **No tiene backend real.** No
procesa pedidos ni pagos reales, no contacta al WhatsApp oficial y no
verifica pagos.

## Invariantes del proyecto (no romper)

1. **Nunca conectar servicios reales sin autorización explícita del usuario.**
   No hay backend de pedidos, CRM, QR bancario real, ni integración de pagos.
   `DemoOrderService` (`src/lib/orders/DemoOrderService.ts`) es la única
   implementación de `OrderService` y no debe hacer solicitudes de red.
2. **No inventar información de negocio.** Historia, fundadores, sucursales,
   premios, ingredientes de proveedores o cifras de ventas no confirmados por
   el cliente no deben añadirse. El texto de "Nosotros" es provisional
   (marcado `TODO_CLIENT_APPROVAL` solo en comentarios/datos internos, nunca
   visible en la interfaz) hasta que el cliente lo apruebe.
3. **Los datos de menú/precios/delivery/coordenadas son de demostración.**
   Están centralizados en `src/data/*` y marcados
   `DEMO_DATA_REPLACE_BEFORE_PRODUCTION` (menú, tarifas) o
   `DEMO_APPROXIMATE_COORDINATES_REPLACE` (coordenada de la sucursal) —
   estos marcadores viven en comentarios/datos internos, nunca en texto
   visible de la interfaz. No dispersar precios ni ingredientes dentro de
   componentes: todo pasa por `src/data/menu.ts`, `src/data/delivery.ts`,
   `src/data/branches.ts`, `src/data/business.ts`.
4. **Modo demo por defecto.** `isDemoMode()` en `src/data/business.ts`
   devuelve `true` a menos que `NEXT_PUBLIC_DEMO_MODE` sea exactamente
   `"false"` — el valor seguro por defecto es demo activo.
5. **El QR de pago es explícitamente falso.** Nunca debe parecer un QR
   bancario real ni afirmar que se recibió un pago verdadero. El texto "QR
   DE DEMOSTRACIÓN — NO REALIZAR PAGOS" debe permanecer visible junto al QR.
6. **No reutilizar nada de otros proyectos/clientes del mismo entorno**
   (por ejemplo, cualquier sistema de reservas, CRM o modelo de citas de
   otro negocio). Este repositorio es independiente. El patrón de
   idempotencia de `DemoOrderService` está *inspirado* en
   `Esquece/apps-script/Appointments.gs` y `Esquece/web-reservas/app/page.tsx`
   únicamente como referencia arquitectónica (clave de intento generada en
   el cliente + verificación de "misma clave, mismo contenido" antes de
   escribir) — no se copió ningún modelo de datos, endpoint, `LockService`
   ni dependencia de ese repositorio.
7. **Estructura extensible sin reescribir componentes.** Añadir un producto,
   categoría, extra o sucursal debe lograrse editando `src/data/*`, no los
   componentes de `src/components/*`.
8. **Mobile-first y accesible.** Objetivos táctiles grandes, foco gestionado
   en modales y cambios de paso, `aria-live` en totales/confirmaciones,
   respeto de `prefers-reduced-motion`, y ningún estado comunicado solo por
   color.
9. **Un pedido nunca se finaliza con datos contradictorios.**
   `validateOrderDraftForFinalization` (`src/lib/orders/draftValidation.ts`)
   es la última barrera antes de generar un comprobante: rechaza cualquier
   combinación inválida (método de pago que no corresponde al tipo de
   entrega, datos de recojo en un pedido de delivery o viceversa), aunque la
   interfaz ya debería impedirlo. Nunca se debe quitar esta validación ni
   llamar a `DemoOrderService.submit` sin pasar por ella antes.
10. **Idempotencia de la demo es local, no una garantía de backend.**
    `DemoOrderService` evita crear pedidos duplicados dentro de la misma
    sesión del navegador (reintentos tras error, doble clic) usando una
    clave de intento (`attemptId`) más un `fingerprint` del contenido,
    guardados en un `Map` en memoria — se pierde al recargar la página y no
    se comparte entre pestañas ni dispositivos. Cuando exista un backend
    real, la garantía definitiva contra duplicados debe implementarse en el
    servidor: una clave de idempotencia persistida y una operación
    atómica/transaccional de "buscar, comparar y escribir" sin condiciones
    de carrera. No declarar ni implementar esa garantía en el frontend.
11. **GitHub Pages sigue deshabilitado.** El proyecto está preparado para
    publicarse en `/LILS` (`NEXT_PUBLIC_BASE_PATH`, ver más abajo), pero no
    existe ningún workflow de despliegue. Publicar requiere autorización
    explícita posterior y un workflow separado de este repositorio de CI.

## Comandos de validación

Antes de considerar terminado cualquier cambio:

```bash
npm run lint
npm run typecheck
npm test
npm run build
npm audit
npm run build:pages   # build estático con NEXT_PUBLIC_BASE_PATH=/LILS
npm run verify:pages  # comprueba que las rutas/assets usan el prefijo /LILS
```

`npm run lint` ejecuta `eslint .` con configuración flat
(`eslint.config.mjs`): `next lint` fue eliminado del CLI de Next.js a partir
de la versión instalada (16.x).

## Estructura relevante

- `src/data/` — toda la información "de negocio" (menú, sucursales, delivery, business).
- `src/lib/` — lógica pura y testeable (precios de carrito, distancia/tarifa Haversine,
  validaciones, horarios de Cochabamba, reducer del checkout, split de pago,
  idempotencia y validación final del pedido).
- `src/lib/orders/checkoutReducer.ts` — reducer del asistente de pedido; al
  cambiar de tipo de entrega limpia los datos exclusivos del otro tipo y
  reinicia pago/finalización, conservando siempre carrito y facturación.
- `src/lib/orders/fingerprint.ts` + `src/lib/orders/attemptId.ts` — huella
  canónica del pedido y resolución de la clave de intento (reutilizar vs.
  generar una nueva), el equivalente adaptado a `idempotencyKeyRef`/
  `idempotencyPayloadRef` de Esquece.
- `src/lib/orders/draftValidation.ts` — última validación antes de finalizar.
- `src/context/CartContext.tsx` — estado del carrito con persistencia en `localStorage`.
- `src/components/order/OrderFlow.tsx` — orquestador del flujo de pedido por pasos;
  incluye la guarda sincrónica (`useRef`) contra doble clic en "Finalizar pedido".
- `src/components/order/ReceiptStep.tsx` — QR de demostración y comprobante simulado.
- `next.config.mjs` — lee `NEXT_PUBLIC_BASE_PATH` en tiempo de build para
  generar rutas/assets bajo `/LILS` sin afectar `npm run dev` normal en `/`.

## Ver también

- `docs/DEMO_LIMITATIONS.md` — qué está simulado y qué no.
- `docs/CLIENT_INFORMATION_REQUIRED.md` — información pendiente de LILS.
- `docs/ASSET_MANIFEST.md` — estado de los recursos visuales.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
