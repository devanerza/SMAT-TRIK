import { render, screen } from '@testing-library/react';
import { useRouter } from 'next/router';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

jest.mock('../../hooks/useAuth', () => ({
  useAuth: jest.fn(),
}));

import { useAuth } from '../../hooks/useAuth';
import ProtectedRoute from '../../components/shared/ProtectedRoute';

beforeEach(() => {
  jest.clearAllMocks();
  useRouter.mockReturnValue({ push: jest.fn(), replace: jest.fn() });
});

describe('ProtectedRoute', () => {
  test('shows loading spinner while auth is loading', () => {
    useAuth.mockReturnValue({
      user: null,
      role: null,
      loading: true,
    });

    const { container } = render(
      <ProtectedRoute allowedRole="admin">
        <div>Dashboard Content</div>
      </ProtectedRoute>
    );

    expect(container.querySelector('.loading-spinner')).toBeInTheDocument();
    expect(screen.queryByText('Dashboard Content')).not.toBeInTheDocument();
  });

  test('Property 10: redirects to /login when not authenticated', () => {
    const replace = jest.fn();
    useRouter.mockReturnValue({ push: jest.fn(), replace });

    useAuth.mockReturnValue({
      user: null,
      role: null,
      loading: false,
    });

    const { container } = render(
      <ProtectedRoute allowedRole="admin">
        <div>Dashboard Content</div>
      </ProtectedRoute>
    );

    expect(replace).toHaveBeenCalledWith('/login');
    expect(container.innerHTML).toBe('');
  });

  test('shows 403 when user has wrong role', () => {
    useAuth.mockReturnValue({
      user: { id: 'teknisi-1' },
      role: 'teknisi',
      loading: false,
    });

    render(
      <ProtectedRoute allowedRole="admin">
        <div>Admin Content</div>
      </ProtectedRoute>
    );

    expect(screen.getByText('403')).toBeInTheDocument();
    expect(screen.queryByText('Admin Content')).not.toBeInTheDocument();
  });

  test('renders children when user has correct role', () => {
    useAuth.mockReturnValue({
      user: { id: 'admin-1' },
      role: 'admin',
      loading: false,
    });

    render(
      <ProtectedRoute allowedRole="admin">
        <div>Admin Content</div>
      </ProtectedRoute>
    );

    expect(screen.getByText('Admin Content')).toBeInTheDocument();
  });

  test('renders children when no allowedRole is specified', () => {
    useAuth.mockReturnValue({
      user: { id: 'user-1' },
      role: 'teknisi',
      loading: false,
    });

    render(
      <ProtectedRoute>
        <div>Any Authenticated Content</div>
      </ProtectedRoute>
    );

    expect(screen.getByText('Any Authenticated Content')).toBeInTheDocument();
  });
});
