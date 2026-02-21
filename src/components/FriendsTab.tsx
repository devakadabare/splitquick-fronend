import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible';
import { motion } from 'framer-motion';
import { ChevronDown, ArrowRightLeft, UserCheck, Plus, Receipt } from 'lucide-react';
import { formatCurrency } from '@/lib/currency';
import type { FriendWithBalance, Expense, CurrencyBalance } from '@/types/api';

const CATEGORIES = [
  'Food', 'Transport', 'Accommodation', 'Utilities',
  'Entertainment', 'Groceries', 'Other',
];

export default function FriendsTab() {
  const { data: friends = [], isLoading } = useQuery({
    queryKey: ['friendsWithBalances'],
    queryFn: () => api.getFriendsWithBalances(),
  });

  if (isLoading) {
    return (
      <div className="space-y-3 mt-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="border-0 shadow-md animate-pulse">
            <CardContent className="p-5 h-20" />
          </Card>
        ))}
      </div>
    );
  }

  if (friends.length === 0) {
    return (
      <Card className="border-0 shadow-md mt-4">
        <CardContent className="p-10 text-center">
          <UserCheck className="w-12 h-12 mx-auto mb-3 text-muted-foreground/40" />
          <p className="text-muted-foreground">
            No friends yet. Add members to a group to start connecting!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3 mt-4">
      {friends.map((friend, i) => (
        <motion.div
          key={friend.friendId}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
        >
          <FriendCard friend={friend} />
        </motion.div>
      ))}
    </div>
  );
}

function FriendCard({ friend }: { friend: FriendWithBalance }) {
  const [settleOpen, setSettleOpen] = useState(false);
  const [expenseOpen, setExpenseOpen] = useState(false);
  const [showExpenses, setShowExpenses] = useState(false);

  const hasBalance = friend.currencyBalances.some((cb) => Math.abs(cb.amount) > 0.01);

  // Build a summary text like "owes you $50.00, €20.00"
  const owedToYou = friend.currencyBalances.filter((cb) => cb.amount > 0.01);
  const youOwe = friend.currencyBalances.filter((cb) => cb.amount < -0.01);

  let balanceColor = 'text-muted-foreground';
  let balanceSummary = 'Settled up';

  if (owedToYou.length > 0 && youOwe.length === 0) {
    balanceColor = 'text-success';
    balanceSummary = `${friend.friendName} owes you ${owedToYou.map((cb) => formatCurrency(cb.amount, cb.currency)).join(', ')}`;
  } else if (youOwe.length > 0 && owedToYou.length === 0) {
    balanceColor = 'text-destructive';
    balanceSummary = `You owe ${friend.friendName} ${youOwe.map((cb) => formatCurrency(cb.amount, cb.currency)).join(', ')}`;
  } else if (owedToYou.length > 0 && youOwe.length > 0) {
    // Mixed: show both directions
    balanceColor = 'text-foreground';
    const owedPart = owedToYou.map((cb) => formatCurrency(cb.amount, cb.currency)).join(', ');
    const owePart = youOwe.map((cb) => formatCurrency(cb.amount, cb.currency)).join(', ');
    balanceSummary = `Owed ${owedPart} · Owe ${owePart}`;
  }

  return (
    <Card className="border-0 shadow-md">
      <CardContent className="p-4">
        <Collapsible>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-accent flex items-center justify-center text-sm font-semibold text-accent-foreground">
                {friend.friendName.charAt(0).toUpperCase()}
              </div>
              <div>
                <span className="font-medium text-foreground">{friend.friendName}</span>
                <p className={`text-sm font-display font-bold ${balanceColor}`}>
                  {balanceSummary}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" onClick={() => setExpenseOpen(true)}>
                <Plus className="w-3.5 h-3.5 mr-1" /> Expense
              </Button>
              {hasBalance && (
                <Button size="sm" variant="outline" onClick={() => setSettleOpen(true)}>
                  <ArrowRightLeft className="w-3.5 h-3.5 mr-1" /> Settle
                </Button>
              )}
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </CollapsibleTrigger>
            </div>
          </div>

          <CollapsibleContent>
            <div className="mt-3 ml-12 space-y-1.5">
              {friend.groupBreakdown.length > 0 && (
                <>
                  {friend.groupBreakdown.map((g) => (
                    <div key={g.groupId} className="text-sm flex justify-between gap-4">
                      <span className="text-muted-foreground">@ {g.groupName}</span>
                      <span className={g.balance > 0 ? 'text-success' : 'text-destructive'}>
                        {g.balance > 0
                          ? `${friend.friendName} owes you ${formatCurrency(g.balance, g.currency)}`
                          : `You owe ${friend.friendName} ${formatCurrency(g.balance, g.currency)}`}
                      </span>
                    </div>
                  ))}
                </>
              )}
              <div className="pt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs text-muted-foreground"
                  onClick={() => setShowExpenses(!showExpenses)}
                >
                  <Receipt className="w-3.5 h-3.5 mr-1" />
                  {showExpenses ? 'Hide direct expenses' : 'Show direct expenses'}
                </Button>
                {showExpenses && <DirectExpensesList friendId={friend.friendId} friendName={friend.friendName} />}
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        <SettleFriendDialog
          friend={friend}
          open={settleOpen}
          onOpenChange={setSettleOpen}
        />
        <AddFriendExpenseDialog
          friend={friend}
          open={expenseOpen}
          onOpenChange={setExpenseOpen}
        />
      </CardContent>
    </Card>
  );
}

function DirectExpensesList({ friendId, friendName }: { friendId: string; friendName: string }) {
  const { user } = useAuth();
  const { data: expenses = [], isLoading } = useQuery({
    queryKey: ['directExpenses', friendId],
    queryFn: () => api.getDirectExpenses(friendId),
  });

  if (isLoading) {
    return <p className="text-xs text-muted-foreground py-2">Loading expenses...</p>;
  }

  if (expenses.length === 0) {
    return <p className="text-xs text-muted-foreground py-2">No direct expenses yet.</p>;
  }

  return (
    <div className="space-y-2 mt-2">
      {expenses.map((expense: Expense) => {
        const paidByYou = expense.paidBy === user?.id;
        const yourSplit = expense.splits.find((s) => s.userId === user?.id);
        const owedAmount = yourSplit ? expense.amount - yourSplit.amount : 0;

        return (
          <div key={expense.id} className="text-sm flex justify-between items-center gap-2 py-1 border-b border-border/50 last:border-0">
            <div>
              <span className="font-medium">{expense.title}</span>
              <span className="text-muted-foreground ml-2">
                ${expense.amount.toFixed(2)}
              </span>
              {expense.date && (
                <span className="text-muted-foreground ml-2 text-xs">
                  {new Date(expense.date).toLocaleDateString()}
                </span>
              )}
            </div>
            <span className={paidByYou ? 'text-success text-xs' : 'text-destructive text-xs'}>
              {paidByYou
                ? `${friendName} owes $${owedAmount.toFixed(2)}`
                : `You owe $${owedAmount.toFixed(2)}`}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function AddFriendExpenseDialog({
  friend,
  open,
  onOpenChange,
}: {
  friend: FriendWithBalance;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [paidBy, setPaidBy] = useState<'me' | 'friend'>('me');
  const [currency, setCurrency] = useState('USD');
  const [category, setCategory] = useState('');
  const [note, setNote] = useState('');
  const queryClient = useQueryClient();

  useEffect(() => {
    if (open) {
      setTitle('');
      setAmount('');
      setPaidBy('me');
      setCurrency('USD');
      setCategory('');
      setNote('');
    }
  }, [open]);

  const mutation = useMutation({
    mutationFn: () =>
      api.createDirectExpense(friend.friendId, {
        title,
        amount: parseFloat(amount),
        paidBy,
        currency,
        category: category || undefined,
        note: note || undefined,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['friendsWithBalances'] });
      queryClient.invalidateQueries({ queryKey: ['allBalances'] });
      queryClient.invalidateQueries({ queryKey: ['directExpenses', friend.friendId] });
      onOpenChange(false);
      toast.success(`Expense added with ${friend.friendName}`);
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to add expense');
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-display">
            Add expense with {friend.friendName}
          </DialogTitle>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            mutation.mutate();
          }}
          className="space-y-4 mt-2"
        >
          <div className="space-y-2">
            <Label>Title</Label>
            <Input
              placeholder="Lunch, Coffee, etc."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Amount</Label>
              <Input
                type="number"
                step="0.01"
                min="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Currency</Label>
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD ($)</SelectItem>
                  <SelectItem value="EUR">EUR</SelectItem>
                  <SelectItem value="GBP">GBP</SelectItem>
                  <SelectItem value="LKR">LKR</SelectItem>
                  <SelectItem value="INR">INR</SelectItem>
                  <SelectItem value="AUD">AUD</SelectItem>
                  <SelectItem value="CAD">CAD</SelectItem>
                  <SelectItem value="JPY">JPY</SelectItem>
                  <SelectItem value="SGD">SGD</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Paid by</Label>
            <div className="grid grid-cols-2 gap-2">
              <Button
                type="button"
                variant={paidBy === 'me' ? 'default' : 'outline'}
                className={paidBy === 'me' ? 'gradient-primary text-primary-foreground' : ''}
                onClick={() => setPaidBy('me')}
              >
                You
              </Button>
              <Button
                type="button"
                variant={paidBy === 'friend' ? 'default' : 'outline'}
                className={paidBy === 'friend' ? 'gradient-primary text-primary-foreground' : ''}
                onClick={() => setPaidBy('friend')}
              >
                {friend.friendName}
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Category (optional)</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Note (optional)</Label>
            <Input
              placeholder="Add a note..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>
          <div className="text-xs text-muted-foreground">
            Split equally (50/50) between you and {friend.friendName}.
          </div>
          <Button
            type="submit"
            className="w-full gradient-primary text-primary-foreground"
            disabled={mutation.isPending || !title || !amount}
          >
            {mutation.isPending ? 'Adding...' : 'Add Expense'}
          </Button>
          {mutation.isError && (
            <p className="text-sm text-destructive">
              {(mutation.error as Error).message}
            </p>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
}

function SettleFriendDialog({
  friend,
  open,
  onOpenChange,
}: {
  friend: FriendWithBalance;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [selectedCurrency, setSelectedCurrency] = useState('');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const queryClient = useQueryClient();

  const activeBals = friend.currencyBalances.filter((cb) => Math.abs(cb.amount) > 0.01);

  // Auto-select if only one currency, reset on open
  useEffect(() => {
    if (open) {
      setNote('');
      if (activeBals.length === 1) {
        setSelectedCurrency(activeBals[0].currency);
        setAmount(Math.abs(activeBals[0].amount).toFixed(2));
      } else {
        setSelectedCurrency('');
        setAmount('');
      }
    }
  }, [open]);

  const selectedBal = activeBals.find((cb) => cb.currency === selectedCurrency);

  const handleCurrencySelect = (currency: string) => {
    setSelectedCurrency(currency);
    const bal = activeBals.find((cb) => cb.currency === currency);
    if (bal) setAmount(Math.abs(bal.amount).toFixed(2));
  };

  const mutation = useMutation({
    mutationFn: () =>
      api.settleFriend(friend.friendId, parseFloat(amount), note || undefined, selectedCurrency),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['friendsWithBalances'] });
      queryClient.invalidateQueries({ queryKey: ['allBalances'] });
      queryClient.invalidateQueries({ queryKey: ['groups'] });
      queryClient.invalidateQueries({ queryKey: ['directExpenses', friend.friendId] });
      data.settlements.forEach((s) => {
        queryClient.invalidateQueries({ queryKey: ['balances', s.groupId] });
        queryClient.invalidateQueries({ queryKey: ['settlements', s.groupId] });
        queryClient.invalidateQueries({ queryKey: ['simplified', s.groupId] });
      });
      onOpenChange(false);
      toast.success(
        `Settled ${formatCurrency(parseFloat(amount), selectedCurrency)} with ${friend.friendName}`
      );
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to settle');
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-display">
            Settle with {friend.friendName}
          </DialogTitle>
        </DialogHeader>

        {/* Currency selection */}
        {activeBals.length > 1 && (
          <div className="space-y-2">
            <Label>Select currency to settle</Label>
            <div className="space-y-2">
              {activeBals.map((cb) => {
                const direction = cb.amount > 0
                  ? `${friend.friendName} owes you`
                  : `You owe ${friend.friendName}`;
                return (
                  <button
                    key={cb.currency}
                    type="button"
                    onClick={() => handleCurrencySelect(cb.currency)}
                    className={`w-full text-left px-3 py-2 rounded-lg border text-sm transition-colors ${
                      selectedCurrency === cb.currency
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:bg-accent/50'
                    }`}
                  >
                    <span className="font-medium">{cb.currency}</span>
                    <span className={`float-right font-display font-bold ${cb.amount > 0 ? 'text-success' : 'text-destructive'}`}>
                      {direction} {formatCurrency(cb.amount, cb.currency)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {activeBals.length === 1 && selectedBal && (
          <p className="text-sm text-muted-foreground">
            {selectedBal.amount > 0
              ? `${friend.friendName} owes you ${formatCurrency(selectedBal.amount, selectedBal.currency)}`
              : `You owe ${friend.friendName} ${formatCurrency(selectedBal.amount, selectedBal.currency)}`}
          </p>
        )}

        {selectedCurrency && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              mutation.mutate();
            }}
            className="space-y-4 mt-2"
          >
            <div className="space-y-2">
              <Label>Amount ({selectedCurrency})</Label>
              <Input
                type="number"
                step="0.01"
                min="0.01"
                max={selectedBal ? Math.abs(selectedBal.amount).toFixed(2) : undefined}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Note (optional)</Label>
              <Input
                placeholder="Settlement note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>
            <div className="text-xs text-muted-foreground">
              This will settle {selectedCurrency} balances across the relevant groups.
            </div>
            <Button
              type="submit"
              className="w-full gradient-primary text-primary-foreground"
              disabled={mutation.isPending || !amount || !selectedCurrency}
            >
              {mutation.isPending ? 'Settling...' : `Settle ${selectedCurrency}`}
            </Button>
            {mutation.isError && (
              <p className="text-sm text-destructive">
                {(mutation.error as Error).message}
              </p>
            )}
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
