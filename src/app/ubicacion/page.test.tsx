import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import UbicacionPage from './page';

vi.mock('@/components/map/BranchMapLoader', () => ({
  BranchMapLoader: () => <div data-testid="mock-map" />,
}));

const FORBIDDEN_MARKERS = [
  'TODO_CLIENT_APPROVAL',
  'DEMO_APPROXIMATE_COORDINATES_REPLACE',
  'DEMO_DATA_REPLACE_BEFORE_PRODUCTION',
];

describe('UbicacionPage: sin marcadores técnicos visibles', () => {
  it('no muestra ningún identificador técnico interno en el DOM', () => {
    render(<UbicacionPage />);
    const bodyText = document.body.textContent ?? '';
    for (const marker of FORBIDDEN_MARKERS) {
      expect(bodyText).not.toContain(marker);
    }
  });

  it('muestra un aviso entendible sobre el mapa referencial', () => {
    render(<UbicacionPage />);
    expect(
      screen.getByText(/Mapa referencial de la demostración\. La ubicación exacta se confirmará con LILS/),
    ).toBeInTheDocument();
  });

  it('el botón "Cómo llegar" busca la dirección pública, no una coordenada afirmada como exacta', () => {
    render(<UbicacionPage />);
    const link = screen.getByRole('link', { name: 'Cómo llegar' });
    const href = link.getAttribute('href') ?? '';
    expect(href).toContain('maps/search');
    expect(href).not.toContain('maps/dir');
  });
});
