import type {
  AuthResponse,
  User,
  Group,
  Expense,
  Balance,
  SimplifiedSettlement,
  Settlement,
  CreateExpenseRequest,
  CreateGroupRequest,
  RecordSettlementRequest,
  GroupMember,
  FriendWithBalance,
  FriendSearchResult,
  FriendSettlementResult,
  CreateDirectExpenseRequest,
} from '@/types/api';

// Configure your backend API base URL here
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

class ApiClient {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem('auth_token');
  }

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('auth_token', token);
    } else {
      localStorage.removeItem('auth_token');
    }
  }

  getToken() {
    return this.token;
  }

  private async request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const res = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers,
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({ error: 'Request failed' }));
      // For structured errors (e.g. 409 with code), pass the full JSON as the message
      if (error.code) {
        throw new Error(JSON.stringify(error));
      }
      throw new Error(error.error || error.message || `HTTP ${res.status}`);
    }

    return res.json();
  }

  // Auth
  async register(name: string, email: string, password: string): Promise<AuthResponse> {
    const data = await this.request<AuthResponse>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
    this.setToken(data.token);
    return data;
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    const data = await this.request<AuthResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    this.setToken(data.token);
    return data;
  }

  async firebaseLogin(firebaseToken: string): Promise<AuthResponse> {
    const data = await this.request<AuthResponse>('/api/auth/firebase-login', {
      method: 'POST',
      body: JSON.stringify({ token: firebaseToken }),
    });
    this.setToken(data.token);
    return data;
  }

  async getMe(): Promise<{ user: User }> {
    return this.request('/api/auth/me');
  }

  // Groups
  async createGroup(data: CreateGroupRequest): Promise<Group> {
    return this.request('/api/groups', { method: 'POST', body: JSON.stringify(data) });
  }

  async getGroups(): Promise<Group[]> {
    return this.request('/api/groups');
  }

  async getGroup(groupId: string): Promise<Group & { members: GroupMember[] }> {
    return this.request(`/api/groups/${groupId}`);
  }

  async deleteGroup(groupId: string, force = false): Promise<{ message: string }> {
    return this.request(`/api/groups/${groupId}${force ? '?force=true' : ''}`, { method: 'DELETE' });
  }

  async addMember(groupId: string, email: string): Promise<GroupMember> {
    return this.request(`/api/groups/${groupId}/members`, {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async removeMember(groupId: string, memberId: string): Promise<{ message: string }> {
    return this.request(`/api/groups/${groupId}/members/${memberId}`, { method: 'DELETE' });
  }

  // Expenses
  async createExpense(data: CreateExpenseRequest): Promise<Expense> {
    return this.request('/api/expenses', { method: 'POST', body: JSON.stringify(data) });
  }

  async getGroupExpenses(groupId: string, limit = 50, offset = 0): Promise<Expense[]> {
    const raw: any[] = await this.request(`/api/expenses/group/${groupId}?limit=${limit}&offset=${offset}`);
    return raw.map((e) => ({
      ...e,
      amount: Number(e.amount),
      paidByName: e.payer?.name || 'Unknown',
      splits: e.splits?.map((s: any) => ({
        ...s,
        amount: Number(s.amount),
        percentage: s.percentage != null ? Number(s.percentage) : undefined,
        userName: s.user?.name,
      })) || [],
    }));
  }

  async getExpense(expenseId: string): Promise<Expense> {
    const e: any = await this.request(`/api/expenses/${expenseId}`);
    return {
      ...e,
      amount: Number(e.amount),
      paidByName: e.payer?.name || 'Unknown',
      splits: e.splits?.map((s: any) => ({
        ...s,
        amount: Number(s.amount),
        percentage: s.percentage != null ? Number(s.percentage) : undefined,
        userName: s.user?.name,
      })) || [],
    };
  }

  async updateExpense(expenseId: string, data: { title?: string; amount?: number; category?: string; note?: string; date?: string }): Promise<Expense> {
    const e: any = await this.request(`/api/expenses/${expenseId}`, { method: 'PATCH', body: JSON.stringify(data) });
    return {
      ...e,
      amount: Number(e.amount),
      paidByName: e.payer?.name || 'Unknown',
      splits: e.splits?.map((s: any) => ({
        ...s,
        amount: Number(s.amount),
        percentage: s.percentage != null ? Number(s.percentage) : undefined,
        userName: s.user?.name,
      })) || [],
    };
  }

  async deleteExpense(expenseId: string): Promise<{ message: string }> {
    return this.request(`/api/expenses/${expenseId}`, { method: 'DELETE' });
  }

  async getGroupBalances(groupId: string): Promise<Balance[]> {
    const res: any = await this.request(`/api/expenses/group/${groupId}/balances`);
    const currency = res.currency || 'USD';
    return (res.balances || []).map((b: any) => ({
      userId: b.userId,
      userName: b.name,
      balance: Number(b.balance),
      currency,
    }));
  }

  // Settlements
  async getSimplifiedSettlements(groupId: string): Promise<SimplifiedSettlement[]> {
    const res: any = await this.request(`/api/settlements/group/${groupId}/simplified`);
    return (res.simplifiedSettlements || []).map((s: any) => ({
      from: s.from,
      fromName: s.fromName || s.from,
      to: s.to,
      toName: s.toName || s.to,
      amount: Number(s.amount),
    }));
  }

  async recordSettlement(data: RecordSettlementRequest): Promise<Settlement> {
    return this.request('/api/settlements', { method: 'POST', body: JSON.stringify(data) });
  }

  async getGroupSettlements(groupId: string): Promise<Settlement[]> {
    const raw: any[] = await this.request(`/api/settlements/group/${groupId}`);
    return raw.map((s) => ({
      ...s,
      amount: Number(s.amount),
      fromUserName: s.fromUser?.name,
      toUserName: s.toUser?.name,
    }));
  }

  async confirmSettlement(settlementId: string): Promise<Settlement> {
    return this.request(`/api/settlements/${settlementId}/confirm`, { method: 'PATCH' });
  }

  async deleteSettlement(settlementId: string): Promise<{ message: string }> {
    return this.request(`/api/settlements/${settlementId}`, { method: 'DELETE' });
  }

  // Friends
  async searchFriends(query: string): Promise<FriendSearchResult[]> {
    return this.request(`/api/friends/search?q=${encodeURIComponent(query)}`);
  }

  async getFriendsWithBalances(): Promise<FriendWithBalance[]> {
    return this.request('/api/friends/balances');
  }

  async settleFriend(friendId: string, amount: number, note?: string, currency?: string): Promise<FriendSettlementResult> {
    return this.request(`/api/friends/${friendId}/settle`, {
      method: 'POST',
      body: JSON.stringify({ amount, note, currency }),
    });
  }

  async createDirectExpense(friendId: string, data: CreateDirectExpenseRequest): Promise<Expense> {
    const e: any = await this.request(`/api/friends/${friendId}/expenses`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return {
      ...e,
      amount: Number(e.amount),
      paidByName: e.payer?.name || 'Unknown',
      splits: e.splits?.map((s: any) => ({
        ...s,
        amount: Number(s.amount),
        percentage: s.percentage != null ? Number(s.percentage) : undefined,
        userName: s.user?.name,
      })) || [],
    };
  }

  async getDirectExpenses(friendId: string): Promise<Expense[]> {
    const raw: any[] = await this.request(`/api/friends/${friendId}/expenses`);
    return raw.map((e) => ({
      ...e,
      amount: Number(e.amount),
      paidByName: e.payer?.name || 'Unknown',
      splits: e.splits?.map((s: any) => ({
        ...s,
        amount: Number(s.amount),
        percentage: s.percentage != null ? Number(s.percentage) : undefined,
        userName: s.user?.name,
      })) || [],
    }));
  }

  logout() {
    this.setToken(null);
  }
}

export const api = new ApiClient();
