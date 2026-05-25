import * as fc from 'fast-check';
import { render, screen } from '@testing-library/react';
import Home from '../pages/index';

describe('Smoke Test Suite', () => {
  test('fast-check property works', () => {
    fc.assert(
      fc.property(fc.integer(), (x) => {
        return x === x;
      })
    );
  });

  test('React Testing Library renders Home page with Tailwind primary color button', () => {
    render(<Home />);
    const heading = screen.getByRole('heading', { name: /AC Maintenance/i });
    expect(heading).toBeInTheDocument();

    const button = screen.getByRole('button', { name: /Get Started/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('btn-primary');
  });
});
