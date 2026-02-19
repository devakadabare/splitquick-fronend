import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export default function CTASection() {
  return (
    <section className="py-12 sm:py-16">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative rounded-3xl gradient-hero p-10 sm:p-14 text-center overflow-hidden"
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,hsl(263_70%_40%/0.3),transparent_60%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,hsl(280_70%_30%/0.2),transparent_60%)]" />

          <div className="relative">
            <h2 className="text-3xl sm:text-5xl font-extrabold text-primary-foreground mb-5 font-display leading-tight">
              Ready to ditch the
              <br />expense drama?
            </h2>
            <p className="text-lg text-primary-foreground/60 mb-10 max-w-lg mx-auto">
              Join thousands splitting expenses without the headache. Free forever, no strings attached.
            </p>
            <Link to="/register">
              <Button size="lg" className="gradient-primary text-primary-foreground shadow-glow px-12 h-14 text-lg group">
                Start Splitting Free
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
