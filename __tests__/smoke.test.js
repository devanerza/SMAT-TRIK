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

  test('React Testing Library renders Home page with main headings', () => {
    render(<Home />);
    
    // Check main logo or banner heading
    const mainHeading = screen.getByRole('heading', { name: /Solusi Pendingin/i });
    expect(mainHeading).toBeInTheDocument();

    const ctaLink = screen.getByRole('link', { name: /Smat-trik Freon Hemat Energi/i });
    expect(ctaLink).toBeInTheDocument();
  });
});
