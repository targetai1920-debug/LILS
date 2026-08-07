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
  facturación (con/sin NIT) → pago → revisión final → comprobante.
- Cálculo de tarifa de delivery por distancia (fórmula de Haversine) usando
  zonas configurables de demostración.
- Generación de un identificador único de intento de pedido para evitar el
  doble envío del mismo pedido.
- Un QR **claramente rotulado como demostración**, que codifica solo un
  texto identificador (`DEMO-LILS-{ORDER_ID}-{AMOUNT}`), y un botón para
  simular la recepción del pago.
- Un comprobante de demostración, sin validez fiscal, con estado "Pago
  simulado" o "Pago pendiente" según el método elegido.

## Qué NO hace (y por qué)

| Área | Estado | Motivo |
| --- | --- | --- |
| Envío de pedidos a un backend/CRM real | No implementado | No existe backend definido por el cliente. `DemoOrderService` resuelve localmente. |
| Contacto real por WhatsApp | No implementado | Evita que la demo dispare mensajes al número real del restaurante. |
| Verificación real de pagos | No implementado | No hay QR bancario oficial ni proveedor de pagos autorizado. |
| Envío real del formulario de sugerencias | No implementado | `DemoSuggestionService` no hace solicitudes de red; falta definir el destino (correo, CRM, etc.). |
| Coordenada exacta de la sucursal | Aproximada | Se usa una coordenada de demostración centrada en la referencia pública, marcada `DEMO_APPROXIMATE_COORDINATES_REPLACE`. |
| Zonas y tarifas de delivery | Provisionales | Configuradas en `src/data/delivery.ts`, marcadas como estimadas y pendientes de confirmación. |
| Tiempo de preparación | Provisional | Valor configurable en `src/data/delivery.ts`, mostrado con aviso "pendiente de confirmación del restaurante". |
| Historia / fundadores / sucursales adicionales | No incluido | No se inventa información de negocio no confirmada. El texto de "Nosotros" está marcado `TODO_CLIENT_APPROVAL`. |
| Reglas fiscales (NIT) | No implementado | Solo se capturan los campos; no hay lógica de facturación real. |

## Modo demo

Controlado por `NEXT_PUBLIC_DEMO_MODE` (por defecto activo si la variable no
está definida). Mientras esté activo, el sitio nunca realiza solicitudes de
red para enviar pedidos, sugerencias o verificar pagos, y lo comunica con un
aviso visible en la parte superior de cada página.

## Antes de producción

Ver `docs/CLIENT_INFORMATION_REQUIRED.md` para el checklist completo de
información y decisiones pendientes del cliente antes de conectar backend,
pagos reales o publicar en un dominio definitivo.
