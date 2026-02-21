import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden flex items-center">
      {/* Animated background */}
      <div className="absolute inset-0 gradient-hero" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,hsl(263_70%_40%/0.3),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,hsl(280_70%_30%/0.25),transparent_50%)]" />

      {/* Floating orbs */}
      <motion.div
        className="absolute top-20 left-[15%] w-72 h-72 rounded-full bg-primary/10 blur-3xl"
        animate={{ y: [0, -30, 0], x: [0, 15, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-20 right-[10%] w-96 h-96 rounded-full bg-primary/8 blur-3xl"
        animate={{ y: [0, 20, 0], x: [0, -20, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl"
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="relative max-w-5xl mx-auto px-4 py-16 sm:py-24 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, type: 'spring' }}
        >
          <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold bg-primary/20 text-primary-foreground/90 border border-primary/30 mb-8 backdrop-blur-sm">
            <Sparkles className="w-4 h-4" />
            The ACTUALLY Free Splitwise Alternative
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-primary-foreground leading-[1.1] mb-8 font-display"
        >
          Split Expenses,
          <br />
          <motion.span
            className="bg-gradient-to-r from-primary/70 via-primary-foreground to-primary/60 bg-clip-text text-transparent bg-[length:200%_auto]"
            animate={{ backgroundPosition: ['0% center', '100% center', '0% center'] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
          >
            Not Friendships.
          </motion.span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-lg sm:text-xl text-primary-foreground/60 max-w-2xl mx-auto mb-12 leading-relaxed"
        >
          Track shared expenses, settle debts with friends, and get spending insights — all in one place.
          <span className="text-primary-foreground/80 font-medium"> Multi-currency. Analytics. No limits. No paywalls.</span>
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link to="/register">
            <Button size="lg" className="gradient-primary text-primary-foreground shadow-glow px-10 text-base h-14 text-lg group">
              Get Started Free
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
          <Link to="/login">
            <Button size="lg" className="bg-primary-foreground text-foreground hover:bg-primary-foreground/90 px-10 text-base h-14 text-lg font-semibold">
              Sign In
            </Button>
          </Link>
        </motion.div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="mt-10 flex flex-wrap justify-center gap-8 sm:gap-16"
        >
          {[
            { value: '\u221E', label: 'Expenses' },
            { value: '$0', label: 'Forever' },
            { value: '20+', label: 'Currencies' },
            { value: '4', label: 'Split Ways' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl sm:text-4xl font-extrabold text-primary-foreground font-display">
                {stat.value}
              </div>
              <div className="text-sm text-primary-foreground/50 mt-1">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
