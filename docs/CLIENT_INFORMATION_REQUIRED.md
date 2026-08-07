# Información pendiente de confirmación por LILS Burger

Checklist de información y decisiones que el cliente (LILS Burger) debe
entregar o confirmar antes de llevar este sitio a producción. Nada de esto
fue inventado para la demo: donde faltaba información, se usó un dato
provisional marcado explícitamente en el código.

## Identidad visual

- [ ] Logo oficial en alta calidad (SVG o vector) y sus variantes (fondo
      claro/oscuro, monocromo, favicon/ícono cuadrado).
- [ ] Archivo original del personaje/mascota.
- [ ] Tipografías oficiales de marca (nombre y licencia).
- [ ] Colores de marca exactos (códigos HEX oficiales), si difieren de los
      provisionales usados (`src/app/globals.css`).

## Historia y contenido

- [ ] Historia oficial de LILS Burger para reemplazar el texto provisional
      de "Nosotros" (`TODO_CLIENT_APPROVAL` en `src/data/business.ts`).
- [ ] Fundadores, año de fundación (si se desea mostrar públicamente).

## Fotografía

- [ ] Fotografías originales de cada producto del menú (en alta resolución,
      sin marcas de agua ni texto superpuesto), incluyendo Sweet Bacon y
      Hawaiana. Ver `docs/ASSET_MANIFEST.md` para el detalle de qué producto
      usa actualmente un placeholder.

## Menú y precios

- [ ] Confirmación del menú y precios vigentes (los actuales, en
      `src/data/menu.ts`, están marcados `DEMO_DATA_REPLACE_BEFORE_PRODUCTION`
      y provienen de material público reunido para la demo).
- [ ] Qué ingredientes pueden retirarse realmente por producto (actualmente
      se asumió que todo ingrediente distinto del pan y la carne es
      retirable sin costo).
- [ ] Qué extras aplican a cada producto (actualmente todos los extras
      aplican a todas las hamburguesas, y solo papas a LILS Kids).
- [ ] Disponibilidad real de promociones o productos por temporada (ninguna
      promoción con fecha vencida fue incluida en esta demo).

## Sucursales y delivery

- [ ] Coordenadas GPS exactas de la sucursal (la coordenada actual es
      aproximada, marcada `DEMO_APPROXIMATE_COORDINATES_REPLACE` en
      `src/data/branches.ts`).
- [ ] Sucursales adicionales, si existen o se planean (la demo solo incluye
      "Sucursal Melchor Urquidi").
- [ ] Zonas reales de cobertura de delivery y sus tarifas (las actuales son
      de demostración, en `src/data/delivery.ts`).
- [ ] Tiempo real mínimo de preparación (el actual es un estimado
      configurable, marcado como pendiente de confirmación).
- [ ] Política de cobertura fuera de zona (actualmente se bloquea el pedido
      por completo más allá de 8 km).

## Contacto y pedidos

- [ ] Número oficial para recibir pedidos por WhatsApp (si es distinto al
      de contacto general ya confirmado: +591 64818054).
- [ ] Backend, CRM o sistema donde deben ingresar los pedidos reales
      (actualmente `DemoOrderService` no envía nada; ver interfaz
      `OrderService` en `src/lib/orders/OrderService.ts` para conectar un
      backend real).
- [ ] Destino real de las sugerencias del formulario de contacto (correo,
      CRM, WhatsApp Business, etc.); actualmente `DemoSuggestionService` no
      envía nada.

## Pagos

- [ ] QR bancario oficial (imagen o datos para generarlo) — nunca se debe
      usar un QR real como si fuera de demostración, ni al revés.
- [ ] Proveedor o método autorizado para verificar pagos reales (banco,
      pasarela, etc.). El "pago simulado" actual es solo un botón de
      demostración sin ninguna verificación real.

## Facturación y políticas

- [ ] Reglas de facturación reales (validación de NIT, datos obligatorios
      según normativa boliviana vigente).
- [ ] Política de cancelación de pedidos.
- [ ] Confirmación de horarios (actual: todos los días 17:00–22:00) y de
      excepciones (feriados, cierres temporales).
