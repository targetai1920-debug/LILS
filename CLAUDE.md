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
   el cliente no deben añadirse. El texto de "Nosotros" permanece marcado
   `TODO_CLIENT_APPROVAL` hasta que el cliente lo apruebe.
3. **Los datos de menú/precios/delivery/coordenadas son de demostración.**
   Están centralizados en `src/data/*` y marcados
   `DEMO_DATA_REPLACE_BEFORE_PRODUCTION` (menú, tarifas) o
   `DEMO_APPROXIMATE_COORDINATES_REPLACE` (coordenada de la sucursal). No
   dispersar precios ni ingredientes dentro de componentes: todo pasa por
   `src/data/menu.ts`, `src/data/delivery.ts`, `src/data/branches.ts`,
   `src/data/business.ts`.
4. **Modo demo por defecto.** `isDemoMode()` en `src/data/business.ts`
   devuelve `true` a menos que `NEXT_PUBLIC_DEMO_MODE` sea exactamente
   `"false"` — el valor seguro por defecto es demo activo.
5. **El QR de pago es explícitamente falso.** Nunca debe parecer un QR
   bancario real ni afirmar que se recibió un pago verdadero. El texto "QR
   DE DEMOSTRACIÓN — NO REALIZAR PAGOS" debe permanecer visible junto al QR.
6. **No reutilizar nada de otros proyectos/clientes del mismo entorno**
   (por ejemplo, cualquier sistema de reservas, CRM o modelo de citas de
   otro negocio). Este repositorio es independiente.
7. **Estructura extensible sin reescribir componentes.** Añadir un producto,
   categoría, extra o sucursal debe lograrse editando `src/data/*`, no los
   componentes de `src/components/*`.
8. **Mobile-first y accesible.** Objetivos táctiles grandes, foco gestionado
   en modales y cambios de paso, `aria-live` en totales/confirmaciones,
   respeto de `prefers-reduced-motion`, y ningún estado comunicado solo por
   color.

## Comandos de validación

Antes de considerar terminado cualquier cambio:

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

## Estructura relevante

- `src/data/` — toda la información "de negocio" (menú, sucursales, delivery, business).
- `src/lib/` — lógica pura y testeable (precios de carrito, distancia/tarifa Haversine,
  validaciones, horarios de Cochabamba, reducer del checkout, split de pago).
- `src/context/CartContext.tsx` — estado del carrito con persistencia en `localStorage`.
- `src/components/order/OrderFlow.tsx` — orquestador del flujo de pedido por pasos
  (`useReducer` en `src/lib/orders/checkoutReducer.ts`).
- `src/components/order/ReceiptStep.tsx` — QR de demostración y comprobante simulado.

## Ver también

- `docs/DEMO_LIMITATIONS.md` — qué está simulado y qué no.
- `docs/CLIENT_INFORMATION_REQUIRED.md` — información pendiente de LILS.
- `docs/ASSET_MANIFEST.md` — estado de los recursos visuales.
