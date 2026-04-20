import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import HomePage from '../pages/HomePage.jsx';

describe('HomePage', () => {
  it('renders Quiz System title', () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );
    expect(screen.getByText('Quiz System')).toBeDefined();
  });

  it('renders name input field', () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );
    const input = screen.getByRole('textbox');
    expect(input).toBeDefined();
  });

  it('renders start button', () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );
    expect(screen.getByRole('button')).toBeDefined();
  });
});
