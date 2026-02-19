import { motion } from 'framer-motion';
import { ArrowRight, Check, X } from 'lucide-react';

export default function SettlementDemo() {
  return (
    <section className="py-12 sm:py-16 relative overflow-hidden">
      <div className="absolute inset-0 gradient-accent opacity-50" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(263_50%_50%/0.06),transparent_70%)]" />

      <div className="relative max-w-5xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <span className="text-sm font-semibold text-primary uppercase tracking-widest">Smart Settlements</span>
          <h2 className="text-3xl sm:text-5xl font-extrabold mt-3 font-display">
            Fewer transactions.
            <br />
            <span className="text-muted-foreground">Less awkwardness.</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-[1fr_auto_1fr] gap-6 items-center">
          {/* Before */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl border border-destructive/20 bg-card p-8"
          >
            <div className="flex items-center gap-2 mb-6">
              <X className="w-5 h-5 text-destructive" />
              <h4 className="font-bold text-lg text-destructive font-display">Without SplitQuick</h4>
            </div>
            <div className="space-y-3">
              {[
                'Alice \u2192 Bob: $30',
                'Alice \u2192 Carol: $20',
                'Bob \u2192 Carol: $10',
                'Carol \u2192 David: $40',
              ].map((t, i) => (
                <motion.div
                  key={t}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="flex items-center gap-3 text-sm text-muted-foreground bg-destructive/5 rounded-lg px-4 py-3"
                >
                  <span className="w-2 h-2 rounded-full bg-destructive/40" />
                  {t}
                </motion.div>
              ))}
            </div>
            <p className="mt-6 text-sm font-semibold text-destructive">4 transactions</p>
          </motion.div>

          {/* Arrow */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="hidden md:flex items-center justify-center"
          >
            <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center shadow-glow">
              <ArrowRight className="w-7 h-7 text-primary-foreground" />
            </div>
          </motion.div>

          {/* After */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl border-2 border-primary bg-card p-8 shadow-glow"
          >
            <div className="flex items-center gap-2 mb-6">
              <Check className="w-5 h-5 text-primary" />
              <h4 className="font-bold text-lg text-primary font-display">With SplitQuick</h4>
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="flex items-center gap-3 text-sm bg-primary/10 rounded-lg px-4 py-4 font-medium"
            >
              <span className="w-3 h-3 rounded-full bg-primary" />
              {'Alice \u2192 David: $50'}
            </motion.div>
            <p className="mt-6 text-sm font-semibold text-primary">Just 1 transaction</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
