import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

export function renderConRouter(ui, ruta = '/') {
  return render(ui, {
    wrapper: ({ children }) => (
      <MemoryRouter initialEntries={[ruta]}>{children}</MemoryRouter>
    ),
  });
}
