# Limitaciones de la demostración

Este documento resume, de forma explícita, qué hace y qué **no** hace esta
demostración web de LILS Burger.

## Qué SÍ hace

- Navegación completa de los siete apartados públicos (Inicio, Ordenar,
  Menú, Nosotros, Ubicación, Redes sociales, Sugerencias y contacto).
- Personalización de productos (variante, ingredientes retirables, extras,
  sin papas, notas) y carrito persistente en `localStorage` del navegador.
- Flujo de pedido completo por pasos: productos → forma de entrega →
  dirección (con mapa Leaflet/OpenStreetMap) o recojo en sucursal →
  facturación (con/sin NIT) → pago → revisión final → comprobante. Cambiar
  de tipo de entrega reinicia el método de pago y limpia los datos
  exclusivos del tipo que se abandona, conservando siempre carrito y
  facturación (`src/lib/orders/checkoutReducer.ts`).
- Una validación final del pedido (`src/lib/orders/draftValidation.ts`)
  que nunca permite generar un comprobante con una combinación inválida
  (por ejemplo, un método de pago que no corresponde al tipo de entrega, o
  datos de recojo y de delivery mezclados) — es la última barrera, aunque
  la interfaz ya debería impedir llegar a ese estado.
- Cálculo de tarifa de delivery por distancia (fórmula de Haversine) usando
  zonas configurables de demostración.
- Un QR **claramente rotulado como demostración**, que codifica solo un
  texto identificador (`DEMO-LILS-{ORDER_ID}-{AMOUNT}`), y un botón para
  simular la recepción del pago.
- Un comprobante de demostración, sin validez fiscal, con estado "Pago
  simulado" o "Pago pendiente" según el método elegido.

## Idempotencia y protección contra doble finalización

`DemoOrderService` (`src/lib/orders/DemoOrderService.ts`) evita crear
pedidos duplicados **dentro de la misma sesión del navegador**:

- El frontend genera una clave de intento (`attemptId`) y una huella
  (`fingerprint`) del contenido significativo del pedido
  (`src/lib/orders/attemptId.ts`, `src/lib/orders/fingerprint.ts`). Si el
  usuario reintenta el mismo pedido tras un error, o hace doble clic, se
  reutiliza la misma clave; si cambió algo relevante del pedido, se genera
  una clave nueva.
- El botón "Finalizar pedido" tiene una guarda sincrónica (`useRef` en
  `OrderFlow.tsx`), no solo un estado de React deshabilitando el botón, para
  que dos clics casi simultáneos no puedan colar dos llamadas al servicio.
- `DemoOrderService` guarda en memoria (`Map<attemptId, resultado>`) el
  resultado de cada clave. La misma clave con el mismo contenido devuelve
  exactamente el mismo resultado (mismo número de pedido, misma fecha),
  marcado como reutilizado. La misma clave con un contenido distinto lanza
  un error de conflicto de idempotencia en vez de crear un segundo pedido.

Este mecanismo está **inspirado como patrón arquitectónico** en el sistema
de reservas de Esquece (`Esquece/web-reservas/app/page.tsx` —
`idempotencyKeyRef`/`idempotencyPayloadRef` — y
`Esquece/apps-script/Appointments.gs` — buscar por clave, comparar y
escribir bajo un bloqueo). No se reutilizó ningún modelo de datos, endpoint,
`LockService` ni dependencia de ese proyecto: LILS es un negocio distinto
(hamburguesería, no barbería) y este repositorio es independiente.

**Límites importantes de esta protección, que no deben ocultarse:**

- El registro de intentos vive solo en memoria del propio
  `DemoOrderService` (un `Map`, no `localStorage` ni ningún almacenamiento
  persistente). Se pierde al recargar la página.
- No se comparte entre pestañas, dispositivos ni sesiones.
- No hace ninguna solicitud de red: no hay backend real que aplicar esta
  garantía.

**Cuando exista un backend real**, la garantía definitiva contra pedidos
duplicados debe implementarse en el servidor: una clave de idempotencia
persistida (base de datos) y una operación atómica/transaccional de
"buscar, comparar y escribir" que no tenga condiciones de carrera entre
dispositivos concurrentes — el equivalente a `withScriptLock_` en Esquece,
pero implementado con el backend que LILS decida usar (no tiene que ser
Google Sheets ni `LockService`). La demo actual no debe presentarse como
si ya ofreciera esa garantía.

## Qué NO hace (y por qué)

| Área | Estado | Motivo |
| --- | --- | --- |
| Envío de pedidos a un backend/CRM real | No implementado | No existe backend definido por el cliente. `DemoOrderService` resuelve localmente, sin red. |
| Idempotencia persistente entre dispositivos/recargas | No implementado | Ver sección anterior: solo protege duplicados dentro de la misma sesión del navegador. |
| Contacto real por WhatsApp | No implementado | Evita que la demo dispare mensajes al número real del restaurante. |
| Verificación real de pagos | No implementado | No hay QR bancario oficial ni proveedor de pagos autorizado. |
| Envío real del formulario de sugerencias | No implementado | `DemoSuggestionService` no hace solicitudes de red; falta definir el destino (correo, CRM, etc.). |
| Coordenada exacta de la sucursal | Aproximada | Coordenada de demostración centrada en la referencia pública; el aviso visible en Ubicación lo explica en lenguaje llano, sin mostrar nombres de variables. |
| Zonas y tarifas de delivery | Provisionales | Configuradas en `src/data/delivery.ts`, marcadas como estimadas y pendientes de confirmación. |
| Tiempo de preparación | Provisional | Valor configurable en `src/data/delivery.ts`, mostrado con aviso "pendiente de confirmación del restaurante". |
| Historia / fundadores / sucursales adicionales | No incluido | No se inventa información de negocio no confirmada. El texto de "Nosotros" es provisional. |
| Reglas fiscales (NIT) | No implementado | Solo se capturan los campos; no hay lógica de facturación real. |
| Publicación en GitHub Pages | Deshabilitada | El build `/LILS` está preparado (`npm run build:pages`), pero no existe workflow de despliegue ni GitHub Pages habilitado. Ver más abajo. |

## Modo demo

Controlado por `NEXT_PUBLIC_DEMO_MODE` (por defecto activo si la variable no
está definida). Mientras esté activo, el sitio nunca realiza solicitudes de
red para enviar pedidos, sugerencias o verificar pagos, y lo comunica con un
aviso visible en la parte superior de cada página.

## Publicación en `/LILS`: preparada, no habilitada

El proyecto puede construirse con `NEXT_PUBLIC_BASE_PATH=/LILS`
(`npm run build:pages`) para generar rutas y assets bajo `/LILS`, pensando
en una futura publicación en
`https://targetai1920-debug.github.io/LILS/`. Esto es solo preparación:

- No existe ningún workflow de despliegue en `.github/workflows/`. El único
  workflow (`ci.yml`) valida (lint, typecheck, test, `npm audit`, build
  normal y build `/LILS`) y nunca publica nada.
- GitHub Pages no ha sido habilitado en la configuración del repositorio.
- No se ha hecho merge a `main` de este trabajo de endurecimiento.
- Publicar en un dominio real requiere autorización explícita posterior y
  un workflow de despliegue separado, además de completar el checklist de
  `docs/CLIENT_INFORMATION_REQUIRED.md`.

## Antes de producción

Ver `docs/CLIENT_INFORMATION_REQUIRED.md` para el checklist completo de
información y decisiones pendientes del cliente antes de conectar backend,
pagos reales o publicar en un dominio definitivo.
