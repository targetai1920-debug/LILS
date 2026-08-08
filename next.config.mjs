/**
 * NEXT_PUBLIC_BASE_PATH configura, solo en tiempo de build, la ruta base
 * bajo la que se serviría el sitio (por ejemplo "/LILS" para
 * https://targetai1920-debug.github.io/LILS/). Sin esta variable, el sitio
 * se construye para servirse en la raíz "/", que es el comportamiento
 * normal de `npm run dev` y de `npm run build`.
 *
 * Esto no publica nada por sí mismo: solo prepara las rutas y los assets.
 * La publicación autorizada vive en `.github/workflows/deploy-pages.yml`.
 */
const rawBasePath = process.env.NEXT_PUBLIC_BASE_PATH?.trim() ?? '';

if (rawBasePath && !rawBasePath.startsWith('/')) {
  throw new Error(
    `NEXT_PUBLIC_BASE_PATH debe empezar con "/" (por ejemplo "/LILS"). Valor recibido: "${rawBasePath}"`,
  );
}

const basePath = rawBasePath.replace(/\/$/, '');

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  ...(basePath
    ? {
        basePath,
        assetPrefix: basePath,
      }
    : {}),
  images: {
    unoptimized: true,
  },
  /**
   * react-leaflet@4 (react-leaflet@5 requiere React 19, un salto mayor no
   * necesario para esta demo) crea el mapa de Leaflet de forma imperativa
   * en un callback de ref. El doble montaje sintético que StrictMode aplica
   * solo en desarrollo (para detectar efectos no idempotentes) hace que
   * Leaflet intente inicializar el mismo contenedor DOM dos veces y lance
   * "Map container is already initialized". Es una incompatibilidad
   * conocida entre react-leaflet@4 y StrictMode, no afecta al build de
   * producción (`next build`/`next export`), que nunca hace ese doble
   * montaje. Se desactiva aquí para que el mapa funcione en `next dev`.
   */
  reactStrictMode: false,
};

export default nextConfig;
