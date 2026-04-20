import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import HomePage from '../pages/HomePage.jsx';

describe('HomePage', () => {
  it('renders Quiz System heading (text split across elements)', () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );
    // "Quiz System" is split: <h1>Quiz <span>System</span></h1>
    // Use getByRole heading with regex matcher
    const heading = screen.getByRole('heading', { name: /quiz system/i });
    expect(heading).toBeDefined();
  });

  it('renders Vietnamese subtitle', () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );
    // Match partial text from the subtitle
    expect(
      screen.getByText(/hệ thống trắc nghiệm/i)
    ).toBeDefined();
  });

  it('renders name input field with Vietnamese placeholder', () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );
    const input = screen.getByRole('textbox');
    expect(input).toBeDefined();
    expect(input.placeholder).toMatch(/nguyễn văn a/i);
  });

  it('renders start button', () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );
    const btn = screen.getByRole('button');
    expect(btn).toBeDefined();
    // Button text contains Vietnamese
    expect(btn.textContent).toMatch(/bắt đầu/i);
  });

  it('renders history link', () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );
    const link = screen.getByRole('link');
    expect(link).toBeDefined();
    expect(link.getAttribute('href')).toBe('/history');
  });
});
