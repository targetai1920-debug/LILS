import { describe, expect, it } from 'vitest';
import { calculatePaymentSplit } from './payment';

describe('calculatePaymentSplit', () => {
  it('delivery + QR productos: el QR cubre solo el subtotal, el delivery queda pendiente', () => {
    const result = calculatePaymentSplit('delivery', 'qr-productos', 100, 10);
    expect(result).toEqual({ totalBs: 110, paidNowBs: 100, pendingBs: 10 });
  });

  it('delivery + efectivo: todo el total queda pendiente al recibir', () => {
    const result = calculatePaymentSplit('delivery', 'efectivo', 100, 10);
    expect(result).toEqual({ totalBs: 110, paidNowBs: 0, pendingBs: 110 });
  });

  it('pickup + QR total: el QR cubre el total completo, nada queda pendiente', () => {
    const result = calculatePaymentSplit('pickup', 'qr-total', 80, 0);
    expect(result).toEqual({ totalBs: 80, paidNowBs: 80, pendingBs: 0 });
  });

  it('pickup + caja: el total completo queda pendiente para el recojo', () => {
    const result = calculatePaymentSplit('pickup', 'caja', 80, 0);
    expect(result).toEqual({ totalBs: 80, paidNowBs: 0, pendingBs: 80 });
  });

  it('nunca mezcla la tarifa de delivery con el subtotal de productos en el QR', () => {
    const result = calculatePaymentSplit('delivery', 'qr-productos', 55, 20);
    expect(result.paidNowBs).toBe(55);
    expect(result.paidNowBs).not.toBe(result.totalBs);
  });
});
