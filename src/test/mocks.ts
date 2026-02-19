import type { User, Group, Expense, Balance, Settlement, SimplifiedSettlement, GroupMember } from '@/types/api';

export const mockUser: User = {
  id: 'user-1',
  name: 'John Doe',
  email: 'john@example.com',
  createdAt: '2024-01-01T00:00:00.000Z',
};

export const mockUser2: User = {
  id: 'user-2',
  name: 'Jane Smith',
  email: 'jane@example.com',
  createdAt: '2024-01-01T00:00:00.000Z',
};

export const mockGroup: Group = {
  id: 'group-1',
  name: 'Weekend Trip',
  currency: 'USD',
  createdBy: 'user-1',
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
  memberCount: 2,
};

export const mockGroupMember: GroupMember = {
  id: 'member-1',
  userId: 'user-1',
  groupId: 'group-1',
  role: 'admin',
  userName: 'John Doe',
  userEmail: 'john@example.com',
  joinedAt: '2024-01-01T00:00:00.000Z',
};

export const mockGroupMember2: GroupMember = {
  id: 'member-2',
  userId: 'user-2',
  groupId: 'group-1',
  role: 'member',
  userName: 'Jane Smith',
  userEmail: 'jane@example.com',
  joinedAt: '2024-01-01T00:00:00.000Z',
};

export const mockExpense: Expense = {
  id: 'expense-1',
  groupId: 'group-1',
  title: 'Dinner',
  amount: 100,
  paidBy: 'user-1',
  paidByName: 'John Doe',
  splitMethod: 'equal',
  category: 'Food',
  note: 'Italian restaurant',
  date: '2024-01-15T00:00:00.000Z',
  createdAt: '2024-01-15T00:00:00.000Z',
  updatedAt: '2024-01-15T00:00:00.000Z',
  splits: [
    {
      id: 'split-1',
      expenseId: 'expense-1',
      userId: 'user-1',
      userName: 'John Doe',
      amount: 50,
    },
    {
      id: 'split-2',
      expenseId: 'expense-1',
      userId: 'user-2',
      userName: 'Jane Smith',
      amount: 50,
    },
  ],
};

export const mockBalance: Balance = {
  userId: 'user-1',
  userName: 'John Doe',
  balance: 50,
};

export const mockBalance2: Balance = {
  userId: 'user-2',
  userName: 'Jane Smith',
  balance: -50,
};

export const mockSimplifiedSettlement: SimplifiedSettlement = {
  from: 'user-2',
  fromName: 'Jane Smith',
  to: 'user-1',
  toName: 'John Doe',
  amount: 50,
};

export const mockSettlement: Settlement = {
  id: 'settlement-1',
  groupId: 'group-1',
  fromUserId: 'user-2',
  fromUserName: 'Jane Smith',
  toUserId: 'user-1',
  toUserName: 'John Doe',
  amount: 50,
  note: 'Cash payment',
  status: 'pending',
  recordedBy: 'user-2',
  createdAt: '2024-01-20T00:00:00.000Z',
};

export const mockAuthResponse = {
  token: 'mock-jwt-token',
  user: mockUser,
};

// Mock API responses
export const mockApiResponses = {
  login: mockAuthResponse,
  register: mockAuthResponse,
  getMe: { user: mockUser },
  getGroups: [mockGroup],
  getGroup: { ...mockGroup, members: [mockGroupMember, mockGroupMember2] },
  createGroup: mockGroup,
  getGroupExpenses: [mockExpense],
  getExpense: mockExpense,
  createExpense: mockExpense,
  getGroupBalances: [mockBalance, mockBalance2],
  getSimplifiedSettlements: [mockSimplifiedSettlement],
  getGroupSettlements: [mockSettlement],
  recordSettlement: mockSettlement,
  confirmSettlement: { ...mockSettlement, status: 'confirmed' as const },
  addMember: mockGroupMember2,
};
