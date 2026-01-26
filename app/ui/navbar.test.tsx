import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Navbar from './navbar';

// mock Next router hooks
vi.mock('next/navigation', () => ({
  usePathname: () => '/'
}));

// mock fetch /api/session, da ne kliče pravega API-ja
global.fetch = vi.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ user: null })
  } as any)
) as any;

describe('Navbar', () => {
  it('renders main navigation links', async () => {
    render(<Navbar />);

    expect(await screen.findByText('NutriTrack')).toBeInTheDocument();
    expect(screen.getByText('Domov')).toBeInTheDocument();
    expect(screen.getByText('O aplikaciji')).toBeInTheDocument();
    expect(screen.getByText('Moji obroki')).toBeInTheDocument();
    expect(screen.getByText('Profil')).toBeInTheDocument();
  });
});
