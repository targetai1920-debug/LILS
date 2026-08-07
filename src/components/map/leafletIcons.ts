import L from 'leaflet';

/**
 * react-leaflet no resuelve automáticamente las rutas de los íconos por
 * defecto cuando se empaqueta con Next.js. Se reconstruye el ícono con
 * data URIs simples en el color de marca para evitar depender de assets
 * externos o de una carpeta /public específica.
 */
export const brandMarkerIcon = L.divIcon({
  className: 'lils-marker',
  html: `<svg width="34" height="44" viewBox="0 0 34 44" xmlns="http://www.w3.org/2000/svg">
    <path d="M17 0C7.6 0 0 7.6 0 17c0 12.7 17 27 17 27s17-14.3 17-27C34 7.6 26.4 0 17 0Z" fill="#2537a0"/>
    <circle cx="17" cy="17" r="8" fill="#f5f1ee"/>
  </svg>`,
  iconSize: [34, 44],
  iconAnchor: [17, 44],
  popupAnchor: [0, -40],
});
