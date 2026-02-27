import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Users, UserCheck, TrendingUp, TrendingDown, LogOut, ArrowRight } from 'lucide-react';
import FriendsTab from '@/components/FriendsTab';
import { formatCurrency } from '@/lib/currency';
import { useDefaultCurrency } from '@/hooks/use-default-currency';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const queryClient = useQueryClient();
  const defaultCurrency = useDefaultCurrency();
  const [createOpen, setCreateOpen] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [currency, setCurrency] = useState(defaultCurrency);

  const { data: groups = [], isLoading } = useQuery({
    queryKey: ['groups'],
    queryFn: () => api.getGroups(),
  });

  const { data: allBalances = [] } = useQuery({
    queryKey: ['allBalances', groups.map(g => g.id)],
    queryFn: async () => {
      const results = await Promise.all(
        groups.map(async (group) => {
          const balances = await api.getGroupBalances(group.id);
          return balances;
        })
      );
      return results.flat();
    },
    enabled: groups.length > 0,
  });

  const owedByCurrency = useMemo(() => {
    const map: Record<string, number> = {};
    allBalances
      .filter((b) => b.userId === user?.id && b.balance > 0)
      .forEach((b) => { map[b.currency] = (map[b.currency] || 0) + b.balance; });
    return Object.entries(map).map(([currency, amount]) => ({ currency, amount }));
  }, [allBalances, user?.id]);

  const oweByCurrency = useMemo(() => {
    const map: Record<string, number> = {};
    allBalances
      .filter((b) => b.userId === user?.id && b.balance < 0)
      .forEach((b) => { map[b.currency] = (map[b.currency] || 0) + Math.abs(b.balance); });
    return Object.entries(map).map(([currency, amount]) => ({ currency, amount }));
  }, [allBalances, user?.id]);

  const createGroup = useMutation({
    mutationFn: () => api.createGroup({ name: groupName, currency }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] });
      setCreateOpen(false);
      setGroupName('');
      toast.success('Group created successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create group');
    },
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <img src="/splitquick-logo.png" alt="SplitQuick" className="w-9 h-9 rounded-xl" />
            <h1 className="text-xl font-display font-bold text-foreground">SplitQuick</h1>
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground hidden sm:block">Hi, {user?.name}</span>
            <Button variant="ghost" size="sm" onClick={logout}>
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* Summary cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 }}>
            <Card className="border-0 shadow-md">
              <CardContent className="p-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
                    <Users className="w-5 h-5 text-accent-foreground" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Groups</p>
                    <p className="text-2xl font-display font-bold text-foreground">{groups.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="border-0 shadow-md">
              <CardContent className="p-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-success" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">You're owed</p>
                    {owedByCurrency.length > 0 ? (
                      <div className="space-y-0.5">
                        {owedByCurrency.map(({ currency: c, amount }) => (
                          <p key={c} className="text-2xl font-display font-bold text-success leading-tight">
                            {formatCurrency(amount, c)}
                          </p>
                        ))}
                      </div>
                    ) : (
                      <p className="text-2xl font-display font-bold text-success">0.00</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="border-0 shadow-md">
              <CardContent className="p-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center">
                    <TrendingDown className="w-5 h-5 text-destructive" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">You owe</p>
                    {oweByCurrency.length > 0 ? (
                      <div className="space-y-0.5">
                        {oweByCurrency.map(({ currency: c, amount }) => (
                          <p key={c} className="text-2xl font-display font-bold text-destructive leading-tight">
                            {formatCurrency(amount, c)}
                          </p>
                        ))}
                      </div>
                    ) : (
                      <p className="text-2xl font-display font-bold text-destructive">0.00</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <Tabs defaultValue="groups" className="mt-2">
          <TabsList className="grid w-full grid-cols-2 sm:max-w-xs">
            <TabsTrigger value="groups">
              <Users className="w-4 h-4 mr-1.5" /> Groups
            </TabsTrigger>
            <TabsTrigger value="friends">
              <UserCheck className="w-4 h-4 mr-1.5" /> Friends
            </TabsTrigger>
          </TabsList>

          <TabsContent value="groups">
            {/* Groups section */}
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-display font-bold text-foreground">Your Groups</h2>
              <Dialog open={createOpen} onOpenChange={setCreateOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="gradient-primary text-primary-foreground hidden sm:inline-flex">
                    <Plus className="w-4 h-4 mr-1" /> New Group
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className="font-display">Create a group</DialogTitle>
                  </DialogHeader>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      createGroup.mutate();
                    }}
                    className="space-y-4 mt-2"
                  >
                    <div className="space-y-2">
                      <Label>Group Name</Label>
                      <Input placeholder="Weekend Trip" value={groupName} onChange={(e) => setGroupName(e.target.value)} required />
                    </div>
                    <div className="space-y-2">
                      <Label>Currency</Label>
                      <Select value={currency} onValueChange={setCurrency}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USD">USD ($)</SelectItem>
                          <SelectItem value="EUR">EUR (€)</SelectItem>
                          <SelectItem value="GBP">GBP (£)</SelectItem>
                          <SelectItem value="LKR">LKR (Rs)</SelectItem>
                          <SelectItem value="INR">INR (₹)</SelectItem>
                          <SelectItem value="AUD">AUD (A$)</SelectItem>
                          <SelectItem value="CAD">CAD (C$)</SelectItem>
                          <SelectItem value="JPY">JPY (¥)</SelectItem>
                          <SelectItem value="CNY">CNY (¥)</SelectItem>
                          <SelectItem value="CHF">CHF (Fr)</SelectItem>
                          <SelectItem value="SGD">SGD (S$)</SelectItem>
                          <SelectItem value="AED">AED (د.إ)</SelectItem>
                          <SelectItem value="MYR">MYR (RM)</SelectItem>
                          <SelectItem value="THB">THB (฿)</SelectItem>
                          <SelectItem value="KRW">KRW (₩)</SelectItem>
                          <SelectItem value="BRL">BRL (R$)</SelectItem>
                          <SelectItem value="ZAR">ZAR (R)</SelectItem>
                          <SelectItem value="SEK">SEK (kr)</SelectItem>
                          <SelectItem value="NZD">NZD (NZ$)</SelectItem>
                          <SelectItem value="PKR">PKR (₨)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button type="submit" className="w-full gradient-primary text-primary-foreground" disabled={createGroup.isPending}>
                      {createGroup.isPending ? 'Creating...' : 'Create Group'}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="border-0 shadow-md animate-pulse">
                    <CardContent className="p-5 h-24" />
                  </Card>
                ))}
              </div>
            ) : groups.length === 0 ? (
              <Card className="border-0 shadow-md">
                <CardContent className="p-10 text-center">
                  <Users className="w-12 h-12 mx-auto mb-3 text-muted-foreground/40" />
                  <p className="text-muted-foreground">No groups yet. Create one to start splitting!</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {groups.map((group, i) => (
                  <motion.div
                    key={group.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <GroupCard group={group} />
                  </motion.div>
                ))}
              </div>
            )}

            {/* Floating Action Button for mobile */}
            <button
              type="button"
              onClick={() => setCreateOpen(true)}
              className="sm:hidden fixed bottom-6 right-6 z-50 gradient-primary text-primary-foreground rounded-full shadow-lg hover:shadow-xl active:scale-95 transition-all flex items-center gap-2 px-5 py-3.5"
            >
              <Plus className="w-5 h-5" />
              <span className="font-semibold text-sm">New Group</span>
            </button>
          </TabsContent>

          <TabsContent value="friends">
            <FriendsTab />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

function GroupCard({ group }: { group: any }) {
  return (
    <Card className="border-0 shadow-md hover:shadow-lg hover:shadow-primary/5 transition-all group/groupcard">
      <CardContent className="p-5">
        <Link to={`/groups/${group.id}`} className="flex items-center justify-between">
          <div>
            <h3 className="font-display font-semibold text-foreground group-hover/groupcard:text-primary transition-colors">
              {group.name}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              {group.currency} · {group.members?.length ?? group.memberCount ?? 0} members
            </p>
          </div>
          <ArrowRight className="w-5 h-5 text-muted-foreground group-hover/groupcard:text-primary transition-colors" />
        </Link>
      </CardContent>
    </Card>
  );
}
