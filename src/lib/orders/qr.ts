/**
 * Contenido codificado por el QR de demostración. NO es un QR bancario real:
 * solo codifica un texto identificador del pedido y el importe, para dejar
 * absolutamente claro que no debe usarse para realizar pagos verdaderos.
 */
export function buildDemoQrPayload(orderId: string, amountBs: number): string {
  return `DEMO-LILS-${orderId}-${amountBs.toFixed(2)}`;
}
