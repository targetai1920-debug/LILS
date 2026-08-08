#!/usr/bin/env node
/**
 * Verifica de forma reproducible que un build hecho con
 * NEXT_PUBLIC_BASE_PATH=/LILS (`npm run build:pages`) generó referencias
 * internas bajo "/LILS/_next/" y no bajo "/_next/", y que "out/.nojekyll"
 * existe. No publica ni sube nada: solo valida el contenido local de
 * `out/`, listo para el workflow autorizado de GitHub Pages.
 *
 * Uso:
 *   npm run build:pages
 *   npm run verify:pages
 */
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

function findHtmlFiles(dir) {
  const results = [];
  for (const entry of readdirSync(dir)) {
    const fullPath = join(dir, entry);
    if (statSync(fullPath).isDirectory()) {
      results.push(...findHtmlFiles(fullPath));
    } else if (entry.endsWith('.html')) {
      results.push(fullPath);
    }
  }
  return results;
}

const OUT_DIR = 'out';
const EXPECTED_PREFIX = '/LILS/_next/';
const FORBIDDEN_PREFIX = '"/_next/';
const EXPECTED_PRODUCT_ASSETS = [
  'products/hawaiana.webp',
  'products/sweet-bacon.webp',
];

function fail(message) {
  console.error(`✖ ${message}`);
  process.exitCode = 1;
}

function pass(message) {
  console.log(`✓ ${message}`);
}

if (!existsSync(OUT_DIR)) {
  fail(`No existe "${OUT_DIR}/". Ejecuta primero: npm run build:pages`);
  process.exit(1);
}

const nojekyllPath = join(OUT_DIR, '.nojekyll');
if (existsSync(nojekyllPath)) {
  pass('out/.nojekyll existe.');
} else {
  fail('Falta out/.nojekyll (necesario para publicar en GitHub Pages sin que Jekyll ignore _next/).');
}

const htmlFiles = findHtmlFiles(OUT_DIR);
if (htmlFiles.length === 0) {
  fail('No se encontraron archivos .html en out/. ¿El build falló?');
  process.exit(1);
}

let checkedAny = false;
for (const file of htmlFiles) {
  const contents = readFileSync(file, 'utf8');
  checkedAny = true;

  if (contents.includes(FORBIDDEN_PREFIX)) {
    fail(`${file} contiene referencias a "/_next/" sin el prefijo "/LILS". El basePath no se aplicó.`);
  }

  if (!contents.includes(EXPECTED_PREFIX)) {
    fail(`${file} no contiene ninguna referencia a "${EXPECTED_PREFIX}". Revisa NEXT_PUBLIC_BASE_PATH.`);
  }
}

if (checkedAny && process.exitCode !== 1) {
  pass(`Todas las páginas HTML (${htmlFiles.length}) referencian "${EXPECTED_PREFIX}" y no "/_next/" sin prefijo.`);
}

for (const relativePath of EXPECTED_PRODUCT_ASSETS) {
  const assetPath = join(OUT_DIR, relativePath);
  if (existsSync(assetPath)) {
    pass(`${relativePath} está incluido en el export público.`);
  } else {
    fail(`Falta ${relativePath} en el export público.`);
  }
}

if (process.exitCode === 1) {
  console.error('\nLa verificación del build /LILS falló. Ver detalles arriba.');
} else {
  console.log('\nBuild /LILS verificado correctamente.');
}
