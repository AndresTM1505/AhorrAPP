
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import BrandLogo from './BrandLogo';
import AnimatedButton from './AnimatedButton';

const Navigation: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Products', href: '#products' },
    { name: 'Features', href: '#features' },
    { name: 'Design', href: '#design' },
    { name: 'About', href: '#about' }
  ];

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 py-4 transition-all duration-300',
        isScrolled 
          ? 'bg-background/80 backdrop-blur-lg shadow-sm' 
          : 'bg-transparent'
      )}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        <Link 
          to="/" 
          className="transition-opacity duration-200 hover:opacity-80"
          aria-label="Home"
        >
          <BrandLogo />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <ul className="flex space-x-8">
            {navLinks.map((link) => (
              <li key={link.name}>
                <a
                  href={link.href}
                  className="text-foreground/80 hover:text-foreground transition-colors duration-200 font-medium text-sm"
                >
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
          <AnimatedButton size="sm">
            Get Started
          </AnimatedButton>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden flex items-center"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-expanded={isMobileMenuOpen}
          aria-label="Toggle menu"
        >
          <div className="relative w-6 h-6">
            <span 
              className={cn(
                "absolute block h-0.5 bg-foreground rounded-full transition-all duration-300 w-6",
                isMobileMenuOpen ? "top-3 rotate-45" : "top-2"
              )}
            />
            <span 
              className={cn(
                "absolute block h-0.5 bg-foreground rounded-full transition-all duration-300 w-6 top-3",
                isMobileMenuOpen ? "opacity-0" : "opacity-100"
              )}
            />
            <span 
              className={cn(
                "absolute block h-0.5 bg-foreground rounded-full transition-all duration-300 w-6",
                isMobileMenuOpen ? "top-3 -rotate-45" : "top-4"
              )}
            />
          </div>
        </button>
      </div>

      {/* Mobile Menu */}
      <div 
        className={cn(
          "fixed inset-0 z-40 bg-background/95 backdrop-blur-lg transform transition-transform duration-300 ease-in-out pt-24",
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="container mx-auto px-6">
          <ul className="flex flex-col space-y-6 items-center">
            {navLinks.map((link) => (
              <li key={link.name} className="w-full">
                <a
                  href={link.href}
                  className="block text-center text-foreground text-2xl font-medium py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </a>
              </li>
            ))}
            <li className="w-full pt-4">
              <AnimatedButton className="w-full">
                Get Started
              </AnimatedButton>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
