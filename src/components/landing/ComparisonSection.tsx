import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

const rows = [
  { feature: 'Expense Limit', sq: 'Unlimited', sw: 'Only 4 free', sqWin: true },
  { feature: 'Price', sq: 'Free forever', sw: '$4.99/mo', sqWin: true },
  { feature: 'Add Expense Speed', sq: '~10 seconds', sw: '60+ seconds', sqWin: true },
  { feature: 'Guest Users', sq: 'Full support', sw: 'Limited', sqWin: true },
  { feature: 'Smart Settlements', sq: true, sw: true, sqWin: false },
  { feature: 'Multi-Currency', sq: '20+ currencies', sw: 'Limited free', sqWin: true },
  { feature: 'Expense Analytics', sq: 'Charts & trends', sw: 'Pro only', sqWin: true },
  { feature: 'Friends System', sq: 'Direct expenses', sw: 'Basic', sqWin: true },
  { feature: 'Split Methods', sq: '4 flexible ways', sw: 'Equal or exact', sqWin: true },
];

export default function ComparisonSection() {
  return (
    <section className="py-12 sm:py-16 bg-background">
      <div className="max-w-3xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-sm font-semibold text-primary uppercase tracking-widest">Comparison</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold mt-3 font-display">SplitQuick vs Splitwise</h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl border border-border overflow-hidden bg-card"
        >
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-6 py-4 text-sm font-semibold text-muted-foreground">Feature</th>
                <th className="px-6 py-4 text-sm font-bold text-primary">SplitQuick</th>
                <th className="px-6 py-4 text-sm font-semibold text-muted-foreground">Splitwise</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rows.map((row) => (
                <tr key={row.feature} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4 font-medium text-sm">{row.feature}</td>
                  <td className="px-6 py-4">
                    {typeof row.sq === 'boolean' ? (
                      <Check className="w-5 h-5 text-primary" />
                    ) : (
                      <span className={`text-sm font-semibold ${row.sqWin ? 'text-primary' : ''}`}>{row.sq}</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {typeof row.sw === 'boolean' ? (
                      <Check className="w-5 h-5 text-muted-foreground" />
                    ) : (
                      <span className="text-sm text-muted-foreground">{row.sw}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </div>
    </section>
  );
}
