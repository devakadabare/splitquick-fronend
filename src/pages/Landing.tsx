import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import HeroSection from '@/components/landing/HeroSection';
import FeaturesSection from '@/components/landing/FeaturesSection';
import SettlementDemo from '@/components/landing/SettlementDemo';
import ComparisonSection from '@/components/landing/ComparisonSection';
import CTASection from '@/components/landing/CTASection';

export default function Landing() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading) return null;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/60 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <img src="/splitquick-logo.png" alt="SplitQuick" className="w-9 h-9 rounded-xl" />
              <span className="text-xl font-bold tracking-tight font-display">SplitQuick</span>
            </div>
            <div className="flex items-center gap-3">
              <Link to="/login">
                <Button variant="outline" size="sm" className="border-border text-foreground">Sign In</Button>
              </Link>
              <Link to="/register">
                <Button size="sm" className="gradient-primary text-primary-foreground shadow-glow">Sign Up Free</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <HeroSection />
      <FeaturesSection />
      <SettlementDemo />
      <ComparisonSection />
      <CTASection />

      {/* Footer */}
      <footer className="border-t border-border py-10">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">&copy; 2026 SplitQuick. All rights reserved.</p>
          <p className="text-xs text-muted-foreground/60 mt-1">The ACTUALLY Free Splitwise Alternative</p>
        </div>
      </footer>
    </div>
  );
}
