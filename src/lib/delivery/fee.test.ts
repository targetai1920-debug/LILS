import { describe, expect, it } from 'vitest';
import { calculateDeliveryFee } from './fee';
import { haversineDistanceKm } from './haversine';
import { deliveryConfig } from '@/data/delivery';

describe('haversineDistanceKm', () => {
  it('devuelve 0 para el mismo punto', () => {
    const point = { lat: -17.3895, lng: -66.1568 };
    expect(haversineDistanceKm(point, point)).toBeCloseTo(0, 5);
  });

  it('calcula una distancia positiva entre dos puntos distintos', () => {
    const distance = haversineDistanceKm({ lat: -17.3895, lng: -66.1568 }, { lat: -17.4, lng: -66.16 });
    expect(distance).toBeGreaterThan(0);
  });
});

describe('calculateDeliveryFee', () => {
  it('cobra la tarifa de la primera zona hasta 2 km', () => {
    expect(calculateDeliveryFee(1.5, deliveryConfig)).toEqual({ inCoverage: true, feeBs: 7, distanceKm: 1.5 });
  });

  it('cobra la tarifa correspondiente entre 2 y 4 km', () => {
    expect(calculateDeliveryFee(3.9, deliveryConfig).feeBs).toBe(10);
  });

  it('cobra la tarifa correspondiente entre 4 y 6 km', () => {
    expect(calculateDeliveryFee(5, deliveryConfig).feeBs).toBe(15);
  });

  it('cobra la tarifa correspondiente entre 6 y 8 km', () => {
    expect(calculateDeliveryFee(7.9, deliveryConfig).feeBs).toBe(20);
  });

  it('marca fuera de cobertura por encima del límite configurado', () => {
    const result = calculateDeliveryFee(8.1, deliveryConfig);
    expect(result.inCoverage).toBe(false);
    expect(result.feeBs).toBeNull();
  });

  it('es inclusivo en los límites exactos de zona', () => {
    expect(calculateDeliveryFee(2, deliveryConfig).feeBs).toBe(7);
    expect(calculateDeliveryFee(8, deliveryConfig).feeBs).toBe(20);
  });
});
