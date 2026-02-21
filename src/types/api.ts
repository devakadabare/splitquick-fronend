// Types matching the backend API

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Group {
  id: string;
  name: string;
  currency: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  members?: GroupMember[];
  memberCount?: number;
}

export interface GroupMember {
  userId: string;
  groupId: string;
  role: 'admin' | 'member';
  joinedAt: string;
  isGuest: boolean;
  guestEmail: string | null;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export interface Expense {
  id: string;
  groupId: string;
  title: string;
  amount: number;
  paidBy: string;
  paidByName?: string;
  splitMethod: 'equal' | 'percentage' | 'custom';
  category?: string;
  note?: string;
  date?: string;
  createdAt: string;
  updatedAt: string;
  splits: ExpenseSplit[];
}

export interface ExpenseSplit {
  id: string;
  expenseId: string;
  userId: string;
  userName?: string;
  amount: number;
  percentage?: number;
}

export interface Balance {
  userId: string;
  userName: string;
  balance: number;
}

export interface SimplifiedSettlement {
  from: string;
  fromName: string;
  to: string;
  toName: string;
  amount: number;
}

export interface Settlement {
  id: string;
  groupId: string;
  fromUserId: string;
  fromUserName?: string;
  toUserId: string;
  toUserName?: string;
  amount: number;
  note?: string;
  status: 'pending' | 'confirmed';
  recordedBy: string;
  createdAt: string;
  confirmedAt?: string;
}

export interface CreateExpenseRequest {
  groupId: string;
  title: string;
  amount: number;
  paidBy: string;
  splitMethod: 'equal' | 'percentage' | 'custom';
  category?: string;
  note?: string;
  splits: { userId: string; amount: number; percentage?: number }[];
}

export interface CreateGroupRequest {
  name: string;
  currency: string;
}

export interface RecordSettlementRequest {
  groupId: string;
  fromUserId: string;
  toUserId: string;
  amount: number;
  note?: string;
}

export interface FriendGroupBalance {
  groupId: string;
  groupName: string;
  currency: string;
  balance: number;
}

export interface FriendWithBalance {
  friendId: string;
  friendName: string;
  friendEmail: string;
  netBalance: number;
  groupBreakdown: FriendGroupBalance[];
}

export interface FriendSearchResult {
  friendId: string;
  friendName: string;
  friendEmail: string;
}

export interface FriendSettlementResult {
  settlements: {
    groupId: string;
    groupName: string;
    settlementId: string;
    amount: number;
  }[];
}
