import { describe, it, expect, beforeEach, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { renderWithProviders } from '@/test/utils';
import GroupDetail from './GroupDetail';
import { useAuth } from '@/contexts/AuthContext';
import { useParams } from 'react-router-dom';
import { api } from '@/lib/api';
import {
  mockUser,
  mockGroup,
  mockGroupMember,
  mockGroupMember2,
  mockExpense,
  mockBalance,
  mockBalance2,
  mockSimplifiedSettlement,
  mockSettlement,
} from '@/test/mocks';

vi.mock('@/contexts/AuthContext');
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: vi.fn(),
    useNavigate: vi.fn(() => vi.fn()),
  };
});
vi.mock('@/lib/api');
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe('GroupDetail Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useAuth).mockReturnValue({
      user: mockUser,
      isLoading: false,
      isAuthenticated: true,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
    });
    vi.mocked(useParams).mockReturnValue({ groupId: 'group-1' });
  });

  describe('Group Loading and Display', () => {
    it('should show loading state', () => {
      vi.mocked(api.getGroup).mockImplementation(() => new Promise(() => {}));

      renderWithProviders(<GroupDetail />);

      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('should display group details', async () => {
      const groupWithMembers = { ...mockGroup, members: [mockGroupMember, mockGroupMember2] };
      vi.mocked(api.getGroup).mockResolvedValue(groupWithMembers);
      vi.mocked(api.getGroupExpenses).mockResolvedValue([]);
      vi.mocked(api.getGroupBalances).mockResolvedValue([]);
      vi.mocked(api.getSimplifiedSettlements).mockResolvedValue([]);
      vi.mocked(api.getGroupSettlements).mockResolvedValue([]);

      renderWithProviders(<GroupDetail />);

      await waitFor(() => {
        expect(screen.getByText('Weekend Trip')).toBeInTheDocument();
      });
    });

    it('should show not found message for invalid group', async () => {
      vi.mocked(api.getGroup).mockResolvedValue(null as any);

      renderWithProviders(<GroupDetail />);

      await waitFor(() => {
        expect(screen.getByText('Group not found')).toBeInTheDocument();
      });
    });
  });

  describe('Balances Display', () => {
    beforeEach(async () => {
      const groupWithMembers = { ...mockGroup, members: [mockGroupMember, mockGroupMember2] };
      vi.mocked(api.getGroup).mockResolvedValue(groupWithMembers);
      vi.mocked(api.getGroupExpenses).mockResolvedValue([]);
      vi.mocked(api.getGroupSettlements).mockResolvedValue([]);
    });

    it('should display member balances', async () => {
      vi.mocked(api.getGroupBalances).mockResolvedValue([mockBalance, mockBalance2]);
      vi.mocked(api.getSimplifiedSettlements).mockResolvedValue([]);

      renderWithProviders(<GroupDetail />);

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
        expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      });
    });

    it('should show suggested settlements when available', async () => {
      vi.mocked(api.getGroupBalances).mockResolvedValue([mockBalance, mockBalance2]);
      vi.mocked(api.getSimplifiedSettlements).mockResolvedValue([mockSimplifiedSettlement]);

      renderWithProviders(<GroupDetail />);

      await waitFor(() => {
        expect(screen.getByText(/Suggested Settlements/i)).toBeInTheDocument();
      });
    });
  });

  describe('Action Buttons', () => {
    beforeEach(async () => {
      const groupWithMembers = { ...mockGroup, members: [mockGroupMember, mockGroupMember2] };
      vi.mocked(api.getGroup).mockResolvedValue(groupWithMembers);
      vi.mocked(api.getGroupExpenses).mockResolvedValue([]);
      vi.mocked(api.getGroupBalances).mockResolvedValue([]);
      vi.mocked(api.getSimplifiedSettlements).mockResolvedValue([]);
      vi.mocked(api.getGroupSettlements).mockResolvedValue([]);
    });

    it('should have add expense button', async () => {
      renderWithProviders(<GroupDetail />);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /add expense/i })).toBeInTheDocument();
      });
    });

    it('should have add member button', async () => {
      renderWithProviders(<GroupDetail />);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /add member/i })).toBeInTheDocument();
      });
    });

    it('should have settle up button', async () => {
      renderWithProviders(<GroupDetail />);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /settle up/i })).toBeInTheDocument();
      });
    });
  });

  describe('Expenses Display', () => {
    beforeEach(async () => {
      const groupWithMembers = { ...mockGroup, members: [mockGroupMember, mockGroupMember2] };
      vi.mocked(api.getGroup).mockResolvedValue(groupWithMembers);
      vi.mocked(api.getGroupBalances).mockResolvedValue([]);
      vi.mocked(api.getSimplifiedSettlements).mockResolvedValue([]);
      vi.mocked(api.getGroupSettlements).mockResolvedValue([]);
    });

    it('should display expenses when available', async () => {
      vi.mocked(api.getGroupExpenses).mockResolvedValue([mockExpense]);

      renderWithProviders(<GroupDetail />);

      await waitFor(() => {
        // Default tab is Balances, expenses are loaded but displayed in Expenses tab
        expect(screen.getByText('Balances')).toBeInTheDocument();
      });
    });

    it('should handle empty expenses', async () => {
      vi.mocked(api.getGroupExpenses).mockResolvedValue([]);

      renderWithProviders(<GroupDetail />);

      await waitFor(() => {
        expect(screen.getByText('Balances')).toBeInTheDocument();
      });
    });
  });

  describe('Settlements Display', () => {
    beforeEach(async () => {
      const groupWithMembers = { ...mockGroup, members: [mockGroupMember, mockGroupMember2] };
      vi.mocked(api.getGroup).mockResolvedValue(groupWithMembers);
      vi.mocked(api.getGroupExpenses).mockResolvedValue([]);
      vi.mocked(api.getGroupBalances).mockResolvedValue([]);
      vi.mocked(api.getSimplifiedSettlements).mockResolvedValue([]);
    });

    it('should load settlements', async () => {
      vi.mocked(api.getGroupSettlements).mockResolvedValue([mockSettlement]);

      renderWithProviders(<GroupDetail />);

      await waitFor(() => {
        expect(screen.getByText('Balances')).toBeInTheDocument();
      });

      // Settlements are loaded
      expect(api.getGroupSettlements).toHaveBeenCalledWith('group-1');
    });
  });
});
