import { motion } from "framer-motion";
import { Users, Zap, DollarSign, Shield, Globe, Clock } from "lucide-react";

const features = [
  {
    icon: DollarSign,
    title: "Truly Free",
    desc: "Unlimited expenses, forever. No sneaky 4-expense limit. We believe splitting should be free.",
    gradient: "from-green-500/20 to-emerald-500/20",
    iconColor: "text-green-400",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    desc: "Add an expense in 10 seconds flat. Balance-first dashboard. In and out, no friction.",
    gradient: "from-yellow-500/20 to-orange-500/20",
    iconColor: "text-yellow-400",
  },
  {
    icon: Users,
    title: "Guest Friendly",
    desc: "Friends don't need accounts. Share a link, they see what they owe. Simple as that.",
    gradient: "from-blue-500/20 to-cyan-500/20",
    iconColor: "text-blue-400",
  },
  {
    icon: Shield,
    title: "Smart Settlements",
    desc: "Our algorithm minimizes transactions. 4 debts? We simplify it to 1 payment.",
    gradient: "from-primary/20 to-purple-500/20",
    iconColor: "text-primary",
  },
  {
    icon: Globe,
    title: "Works Everywhere",
    desc: "Responsive web app. Works on your phone, tablet, or desktop. No app download needed.",
    gradient: "from-pink-500/20 to-rose-500/20",
    iconColor: "text-pink-400",
  },
  {
    icon: Clock,
    title: "Real-time Sync",
    desc: 'Everyone sees updates instantly. No more "did you add that expense?" messages.',
    gradient: "from-teal-500/20 to-cyan-500/20",
    iconColor: "text-teal-400",
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

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
