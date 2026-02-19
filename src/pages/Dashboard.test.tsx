import { describe, it, expect, beforeEach, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '@/test/utils';
import Dashboard from './Dashboard';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';
import { mockUser, mockGroup, mockBalance, mockBalance2 } from '@/test/mocks';

vi.mock('@/contexts/AuthContext');
vi.mock('@/lib/api');
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe('Dashboard Page', () => {
  const mockLogout = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useAuth).mockReturnValue({
      user: mockUser,
      isLoading: false,
      isAuthenticated: true,
      login: vi.fn(),
      register: vi.fn(),
      logout: mockLogout,
    });
  });

  it('should render dashboard with loading state initially', () => {
    vi.mocked(api.getGroups).mockImplementation(
      () => new Promise(() => {}) // Never resolves
    );

    renderWithProviders(<Dashboard />);

    // Dashboard header should still render
    expect(screen.getByText(/SplitQuick/i)).toBeInTheDocument();
  });

  it('should display groups list', async () => {
    vi.mocked(api.getGroups).mockResolvedValue([mockGroup]);
    vi.mocked(api.getGroupBalances).mockResolvedValue([]);

    renderWithProviders(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByText('Weekend Trip')).toBeInTheDocument();
    });
  });

  it('should show empty state when no groups', async () => {
    vi.mocked(api.getGroups).mockResolvedValue([]);

    renderWithProviders(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByText(/No groups yet/i)).toBeInTheDocument();
    });
  });

  it('should calculate and display total balances', async () => {
    vi.mocked(api.getGroups).mockResolvedValue([mockGroup]);
    vi.mocked(api.getGroupBalances).mockResolvedValue([mockBalance, mockBalance2]);

    renderWithProviders(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByText("You're owed")).toBeInTheDocument();
      expect(screen.getByText('You owe')).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('should display summary cards', async () => {
    vi.mocked(api.getGroups).mockResolvedValue([mockGroup]);
    vi.mocked(api.getGroupBalances).mockResolvedValue([]);

    renderWithProviders(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByText('Groups')).toBeInTheDocument();
      expect(screen.getByText("You're owed")).toBeInTheDocument();
      expect(screen.getByText('You owe')).toBeInTheDocument();
    });
  });

  it('should have new group button', async () => {
    vi.mocked(api.getGroups).mockResolvedValue([]);

    renderWithProviders(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /new group/i })).toBeInTheDocument();
    });
  });

  it('should create a new group when form is submitted', async () => {
    const user = userEvent.setup();
    vi.mocked(api.getGroups).mockResolvedValue([]);
    vi.mocked(api.createGroup).mockResolvedValue(mockGroup);

    renderWithProviders(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /new group/i })).toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: /new group/i }));

    // Dialog should open
    await waitFor(() => {
      expect(screen.getByText('Create a group')).toBeInTheDocument();
    });
  });
});
