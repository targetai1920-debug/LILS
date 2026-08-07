// `next lint` fue eliminado del CLI de Next.js (>= 16). ESLint 9 usa
// configuración "flat" por defecto, así que este archivo reemplaza al
// antiguo `.eslintrc.json` y se ejecuta con `eslint .` directamente
// (ver el script "lint" en package.json).
import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';

const config = [
  ...nextCoreWebVitals,
  {
    ignores: ['.next/**', 'out/**', 'node_modules/**', 'next-env.d.ts', 'scripts/**'],
  },
];

export default config;
