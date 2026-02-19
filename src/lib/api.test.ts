import { describe, it, expect, beforeEach, vi } from 'vitest';
import { api } from './api';
import { mockApiResponses, mockUser, mockGroup } from '@/test/mocks';

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('ApiClient', () => {
  beforeEach(() => {
    mockFetch.mockClear();
    localStorage.clear();
    api.setToken(null);
  });

  describe('Authentication', () => {
    it('should register a new user', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockApiResponses.register,
      });

      const result = await api.register('John Doe', 'john@example.com', 'password123');

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/auth/register'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({
            name: 'John Doe',
            email: 'john@example.com',
            password: 'password123',
          }),
        })
      );
      expect(result).toEqual(mockApiResponses.register);
      expect(api.getToken()).toBe('mock-jwt-token');
    });

    it('should login a user', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockApiResponses.login,
      });

      const result = await api.login('john@example.com', 'password123');

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/auth/login'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({
            email: 'john@example.com',
            password: 'password123',
          }),
        })
      );
      expect(result).toEqual(mockApiResponses.login);
      expect(api.getToken()).toBe('mock-jwt-token');
    });

    it('should get current user', async () => {
      api.setToken('mock-jwt-token');
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockApiResponses.getMe,
      });

      const result = await api.getMe();

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/auth/me'),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: 'Bearer mock-jwt-token',
          }),
        })
      );
      expect(result).toEqual(mockApiResponses.getMe);
    });

    it('should logout and clear token', () => {
      api.setToken('mock-jwt-token');
      expect(api.getToken()).toBe('mock-jwt-token');

      api.logout();

      expect(api.getToken()).toBeNull();
      expect(localStorage.getItem('auth_token')).toBeNull();
    });
  });

  describe('Groups', () => {
    beforeEach(() => {
      api.setToken('mock-jwt-token');
    });

    it('should create a group', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockApiResponses.createGroup,
      });

      const result = await api.createGroup({ name: 'Weekend Trip', currency: 'USD' });

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/groups'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ name: 'Weekend Trip', currency: 'USD' }),
        })
      );
      expect(result).toEqual(mockApiResponses.createGroup);
    });

    it('should get all groups', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockApiResponses.getGroups,
      });

      const result = await api.getGroups();

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/groups'),
        expect.any(Object)
      );
      expect(result).toEqual(mockApiResponses.getGroups);
    });

    it('should get a single group', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockApiResponses.getGroup,
      });

      const result = await api.getGroup('group-1');

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/groups/group-1'),
        expect.any(Object)
      );
      expect(result).toEqual(mockApiResponses.getGroup);
    });

    it('should delete a group', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ message: 'Group deleted' }),
      });

      const result = await api.deleteGroup('group-1');

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/groups/group-1'),
        expect.objectContaining({
          method: 'DELETE',
        })
      );
      expect(result).toEqual({ message: 'Group deleted' });
    });

    it('should add a member to group', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockApiResponses.addMember,
      });

      const result = await api.addMember('group-1', 'jane@example.com');

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/groups/group-1/members'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ email: 'jane@example.com' }),
        })
      );
      expect(result).toEqual(mockApiResponses.addMember);
    });
  });

  describe('Expenses', () => {
    beforeEach(() => {
      api.setToken('mock-jwt-token');
    });

    it('should create an expense', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockApiResponses.createExpense,
      });

      const expenseData = {
        groupId: 'group-1',
        title: 'Dinner',
        amount: 100,
        paidBy: 'user-1',
        splitMethod: 'equal' as const,
        splits: [
          { userId: 'user-1', amount: 50 },
          { userId: 'user-2', amount: 50 },
        ],
      };

      const result = await api.createExpense(expenseData);

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/expenses'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(expenseData),
        })
      );
      expect(result).toEqual(mockApiResponses.createExpense);
    });

    it('should get group expenses', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockApiResponses.getGroupExpenses,
      });

      const result = await api.getGroupExpenses('group-1');

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/expenses/group/group-1'),
        expect.any(Object)
      );
      expect(result).toEqual(mockApiResponses.getGroupExpenses);
    });

    it('should delete an expense', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ message: 'Expense deleted' }),
      });

      const result = await api.deleteExpense('expense-1');

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/expenses/expense-1'),
        expect.objectContaining({
          method: 'DELETE',
        })
      );
      expect(result).toEqual({ message: 'Expense deleted' });
    });

    it('should get group balances', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockApiResponses.getGroupBalances,
      });

      const result = await api.getGroupBalances('group-1');

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/expenses/group/group-1/balances'),
        expect.any(Object)
      );
      expect(result).toEqual(mockApiResponses.getGroupBalances);
    });
  });

  describe('Settlements', () => {
    beforeEach(() => {
      api.setToken('mock-jwt-token');
    });

    it('should get simplified settlements', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockApiResponses.getSimplifiedSettlements,
      });

      const result = await api.getSimplifiedSettlements('group-1');

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/settlements/group/group-1/simplified'),
        expect.any(Object)
      );
      expect(result).toEqual(mockApiResponses.getSimplifiedSettlements);
    });

    it('should record a settlement', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockApiResponses.recordSettlement,
      });

      const settlementData = {
        groupId: 'group-1',
        fromUserId: 'user-2',
        toUserId: 'user-1',
        amount: 50,
        note: 'Cash payment',
      };

      const result = await api.recordSettlement(settlementData);

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/settlements'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(settlementData),
        })
      );
      expect(result).toEqual(mockApiResponses.recordSettlement);
    });

    it('should confirm a settlement', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockApiResponses.confirmSettlement,
      });

      const result = await api.confirmSettlement('settlement-1');

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/settlements/settlement-1/confirm'),
        expect.objectContaining({
          method: 'PATCH',
        })
      );
      expect(result.status).toBe('confirmed');
    });
  });

  describe('Error Handling', () => {
    beforeEach(() => {
      api.setToken('mock-jwt-token');
    });

    it('should throw error on failed request', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({ error: 'Invalid request' }),
      });

      await expect(api.getGroups()).rejects.toThrow('Invalid request');
    });

    it('should throw generic error when error response is invalid', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => {
          throw new Error('Invalid JSON');
        },
      });

      await expect(api.getGroups()).rejects.toThrow('Request failed');
    });
  });
});
