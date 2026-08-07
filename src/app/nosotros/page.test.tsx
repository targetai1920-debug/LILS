import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import NosotrosPage from './page';

const FORBIDDEN_MARKERS = [
  'TODO_CLIENT_APPROVAL',
  'DEMO_APPROXIMATE_COORDINATES_REPLACE',
  'DEMO_DATA_REPLACE_BEFORE_PRODUCTION',
];

describe('NosotrosPage: sin marcadores técnicos visibles', () => {
  it('no muestra ningún identificador técnico interno en el DOM', () => {
    render(<NosotrosPage />);
    const bodyText = document.body.textContent ?? '';
    for (const marker of FORBIDDEN_MARKERS) {
      expect(bodyText).not.toContain(marker);
    }
  });

  it('sigue mostrando el texto comercial provisional', () => {
    render(<NosotrosPage />);
    expect(screen.getByText(/LILS es una propuesta local de smash burgers/)).toBeInTheDocument();
  });
});
