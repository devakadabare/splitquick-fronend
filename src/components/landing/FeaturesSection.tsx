import { motion } from "framer-motion";
import { Users, Zap, DollarSign, Shield, Globe, BarChart3, Coins, UserCheck, SlidersHorizontal } from "lucide-react";

const features = [
  {
    icon: DollarSign,
    title: "Truly Free",
    desc: "Unlimited expenses, groups, and friends — forever. No sneaky limits, no paywalls, no premium tiers.",
    gradient: "from-green-500/20 to-emerald-500/20",
    iconColor: "text-green-400",
  },
  {
    icon: SlidersHorizontal,
    title: "Flexible Splitting",
    desc: "Split equally, by percentage, or custom amounts. Choose who's in — your split, your rules.",
    gradient: "from-yellow-500/20 to-orange-500/20",
    iconColor: "text-yellow-400",
  },
  {
    icon: UserCheck,
    title: "Friends & Direct Expenses",
    desc: "Add friends, track balances across groups, and log 1-on-1 expenses without needing a group.",
    gradient: "from-blue-500/20 to-cyan-500/20",
    iconColor: "text-blue-400",
  },
  {
    icon: Shield,
    title: "Smart Settlements",
    desc: "Our algorithm minimizes transactions. 4 debts? We simplify it to 1 payment. Settle per friend too.",
    gradient: "from-primary/20 to-purple-500/20",
    iconColor: "text-primary",
  },
  {
    icon: Coins,
    title: "Multi-Currency",
    desc: "Support for 20+ currencies — USD, EUR, GBP, INR, LKR, JPY and more. Travel and split globally.",
    gradient: "from-pink-500/20 to-rose-500/20",
    iconColor: "text-pink-400",
  },
  {
    icon: BarChart3,
    title: "Expense Analytics",
    desc: "Pie charts by category, spending timelines, and group insights — see exactly where the money goes.",
    gradient: "from-teal-500/20 to-cyan-500/20",
    iconColor: "text-teal-400",
  },
  {
    icon: Globe,
    title: "Works Everywhere",
    desc: "Responsive web app. Works on your phone, tablet, or desktop. No app download needed.",
    gradient: "from-violet-500/20 to-indigo-500/20",
    iconColor: "text-violet-400",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    desc: "Step-by-step expense wizard, balance-first dashboard, and mobile FAB — add an expense in seconds.",
    gradient: "from-amber-500/20 to-yellow-500/20",
    iconColor: "text-amber-400",
  },
  {
    icon: Users,
    title: "Guest Members",
    desc: "Friends don't need accounts. Add them as guests to any group and they still show up in splits.",
    gradient: "from-rose-500/20 to-red-500/20",
    iconColor: "text-rose-400",
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-12 sm:py-16 bg-background relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/5 rounded-full blur-3xl" />

      <div className="relative max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <span className="text-sm font-semibold text-primary uppercase tracking-widest">
            Features
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold mt-3 font-display">
            Everything you need,
            <br />
            <span className="text-muted-foreground">Nothing you don't.</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="group relative rounded-2xl border border-border bg-card p-8 hover:border-primary/40 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5"
            >
              <div
                className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${f.gradient} mb-5`}
              >
                <f.icon className={`w-6 h-6 ${f.iconColor}`} />
              </div>
              <h3 className="text-lg font-bold mb-2 font-display">{f.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {f.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
