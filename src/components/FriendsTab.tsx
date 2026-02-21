import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible';
import { motion } from 'framer-motion';
import { ChevronDown, ArrowRightLeft, UserCheck } from 'lucide-react';
import type { FriendWithBalance } from '@/types/api';

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

  const hasBalance = Math.abs(friend.netBalance) > 0.01;
  const balanceColor = friend.netBalance > 0.01
    ? 'text-success'
    : friend.netBalance < -0.01
      ? 'text-destructive'
      : 'text-muted-foreground';

  const balanceText = friend.netBalance > 0.01
    ? `${friend.friendName} owes you`
    : friend.netBalance < -0.01
      ? `You owe ${friend.friendName}`
      : 'Settled up';

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
                  {hasBalance
                    ? `${balanceText} $${Math.abs(friend.netBalance).toFixed(2)}`
                    : 'Settled up'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {hasBalance && (
                <Button size="sm" variant="outline" onClick={() => setSettleOpen(true)}>
                  <ArrowRightLeft className="w-3.5 h-3.5 mr-1" /> Settle
                </Button>
              )}
              {friend.groupBreakdown.length > 0 && (
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </CollapsibleTrigger>
              )}
            </div>
          </div>

          <CollapsibleContent>
            <div className="mt-3 ml-12 space-y-1.5">
              {friend.groupBreakdown.map((g) => (
                <div key={g.groupId} className="text-sm flex justify-between gap-4">
                  <span className="text-muted-foreground">@ {g.groupName}</span>
                  <span className={g.balance > 0 ? 'text-success' : 'text-destructive'}>
                    {g.balance > 0
                      ? `${friend.friendName} owes you ${g.currency} ${Math.abs(g.balance).toFixed(2)}`
                      : `You owe ${friend.friendName} ${g.currency} ${Math.abs(g.balance).toFixed(2)}`}
                  </span>
                </div>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>

        <SettleFriendDialog
          friend={friend}
          open={settleOpen}
          onOpenChange={setSettleOpen}
        />
      </CardContent>
    </Card>
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
  const [amount, setAmount] = useState('');

  // Reset amount when dialog opens or friend balance changes
  useEffect(() => {
    if (open) {
      setAmount(Math.abs(friend.netBalance).toFixed(2));
      setNote('');
    }
  }, [open, friend.netBalance]);
  const [note, setNote] = useState('');
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () =>
      api.settleFriend(friend.friendId, parseFloat(amount), note || undefined),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['friendsWithBalances'] });
      queryClient.invalidateQueries({ queryKey: ['allBalances'] });
      queryClient.invalidateQueries({ queryKey: ['groups'] });
      data.settlements.forEach((s) => {
        queryClient.invalidateQueries({ queryKey: ['balances', s.groupId] });
        queryClient.invalidateQueries({ queryKey: ['settlements', s.groupId] });
        queryClient.invalidateQueries({ queryKey: ['simplified', s.groupId] });
      });
      onOpenChange(false);
      toast.success(
        `Settled $${parseFloat(amount).toFixed(2)} with ${friend.friendName} across ${data.settlements.length} group(s)`
      );
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to settle');
    },
  });

  const directionText =
    friend.netBalance > 0
      ? `${friend.friendName} owes you $${Math.abs(friend.netBalance).toFixed(2)}`
      : `You owe ${friend.friendName} $${Math.abs(friend.netBalance).toFixed(2)}`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-display">
            Settle with {friend.friendName}
          </DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          {directionText} across all groups
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            mutation.mutate();
          }}
          className="space-y-4 mt-2"
        >
          <div className="space-y-2">
            <Label>Amount ($)</Label>
            <Input
              type="number"
              step="0.01"
              min="0.01"
              max={Math.abs(friend.netBalance).toFixed(2)}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Note (optional)</Label>
            <Input
              placeholder="Cross-group settlement"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>
          <div className="text-xs text-muted-foreground">
            This will create settlement records in the relevant groups to clear
            the balances.
          </div>
          <Button
            type="submit"
            className="w-full gradient-primary text-primary-foreground"
            disabled={mutation.isPending || !amount}
          >
            {mutation.isPending ? 'Settling...' : 'Settle Up'}
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
