# Inventario de recursos visuales (Asset Manifest)

## Contexto importante

El cliente compartió varias imágenes de referencia directamente en la
conversación (capturas del menú, un mapa de ubicación, el logotipo sobre un
fondo de carne, la mascota en un círculo, una foto del producto "Sweet
Bacon", una foto del producto "Hawaiana" y un calendario promocional de
diciembre). El entorno de este proyecto **no tuvo forma de guardar esas
imágenes como archivos** (no llegaron como adjuntos con ruta en disco, solo
como contenido visual dentro del chat), por lo que **no pudieron
incorporarse directamente como archivos de imagen al repositorio.**

En su lugar:

- El logotipo se **recreó tipográficamente en SVG** (`src/components/brand/Logo.tsx`),
  imitando el estilo de letras "burbuja" en azul de marca visto en las
  referencias, ya que no existe todavía un archivo vectorial oficial.
- La mascota se representó con un **placeholder SVG propio** inspirado en su
  personalidad (hamburguesa con anteojos, gesto de "ok"), no como copia
  exacta del arte original (`src/components/brand/Mascot.tsx`).
- Los productos usan un **placeholder de marca consistente**
  (`src/components/brand/BurgerPlaceholder.tsx`, patrón a cuadros +
  ilustración simple), en lugar de fotografías de stock o de las capturas de
  menú, siguiendo la instrucción explícita de no usar fotos genéricas ni
  capturas como interfaz final.

**Acción pendiente:** LILS debe entregar los archivos originales (logo
vectorial, arte de la mascota, fotografías de producto en alta resolución,
incluyendo Sweet Bacon y Hawaiana) para reemplazar estos placeholders antes
de producción. Ver `docs/CLIENT_INFORMATION_REQUIRED.md`.

## Contenido descartado intencionalmente

- El calendario promocional de diciembre (con fechas tachadas) **no se usó**
  en ningún lugar del sitio: es una promoción con fecha vencida y las
  instrucciones del proyecto piden no mostrar promociones antiguas con
  fechas límite como si estuvieran vigentes.
- La foto de "Hawaiana" mostraba el texto "Disponible del 24 al 30 de
  noviembre": ese producto se incluyó en el menú como ítem permanente (según
  el menú confirmado por el cliente), pero **sin** la etiqueta de
  disponibilidad limitada, que corresponde a una promoción pasada.
- Las capturas de pantalla del menú (con barras negras de la interfaz de
  WhatsApp) se usaron **únicamente para extraer datos** (nombres,
  ingredientes, precios) hacia `src/data/menu.ts`, nunca como imágenes de
  interfaz.

## Inventario actual

| Recurso | Archivo | Estado |
| --- | --- | --- |
| Logo/wordmark | `src/components/brand/Logo.tsx` | Recreación tipográfica en SVG. Pendiente de logo vectorial oficial. |
| Mascota | `src/components/brand/Mascot.tsx` | Placeholder SVG propio. Pendiente de arte oficial del personaje. |
| Fotos de producto (todas) | `src/components/brand/BurgerPlaceholder.tsx` | Placeholder de marca consistente (patrón a cuadros + ilustración). Pendiente de fotografía real por producto. |
| Colores de marca | `src/app/globals.css` (`:root`) | Provisionales, extraídos visualmente de las referencias. Pendiente de códigos HEX oficiales. |
| Ícono de marcador de mapa | `src/components/map/leafletIcons.ts` | SVG propio en color de marca (no depende de assets externos). |

## Cómo reemplazar un asset

1. Añadir el archivo real (SVG/PNG optimizado) donde corresponda, o crear un
   componente equivalente que lo use.
2. Actualizar el componente placeholder correspondiente (`Logo`, `Mascot`,
   `BurgerPlaceholder`) para renderizar el archivo real en vez del SVG
   generado.
3. Quitar la entrada de este manifiesto una vez reemplazado, o marcarla como
   "Definitivo".
