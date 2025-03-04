
import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import TextReveal from './TextReveal';
import AnimatedButton from './AnimatedButton';

const Hero: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    setIsLoaded(true);
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!heroRef.current) return;
      
      const { clientX, clientY } = e;
      const { left, top, width, height } = heroRef.current.getBoundingClientRect();
      
      const x = (clientX - left) / width;
      const y = (clientY - top) / height;
      
      const circles = heroRef.current.querySelectorAll('.parallax-circle');
      circles.forEach((circle, index) => {
        const factor = (index + 1) * 15;
        (circle as HTMLElement).style.transform = `translate(${(x - 0.5) * factor}px, ${(y - 0.5) * factor}px)`;
      });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  
  return (
    <div 
      ref={heroRef}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden py-20 px-6"
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="parallax-circle absolute top-1/4 -left-24 w-64 h-64 rounded-full bg-primary/5"></div>
        <div className="parallax-circle absolute top-1/2 -right-32 w-96 h-96 rounded-full bg-primary/5"></div>
        <div className="parallax-circle absolute bottom-1/4 left-1/4 w-40 h-40 rounded-full bg-primary/3"></div>
      </div>
      
      {/* Hero content */}
      <div className="relative z-10 max-w-5xl mx-auto text-center">
        <span 
          className={cn(
            "inline-block px-4 py-1.5 mb-6 text-sm font-medium rounded-full bg-secondary text-secondary-foreground",
            "transform transition-all duration-1000 opacity-0 translate-y-8",
            isLoaded && "opacity-100 translate-y-0"
          )}
        >
          Simplicity meets elegance
        </span>
        
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-4 text-balance">
          <TextReveal 
            text="Design Perfection in Every Detail" 
            delay={0.2}
            className="text-balance"
          />
        </h1>
        
        <p 
          className={cn(
            "max-w-2xl mx-auto text-xl text-muted-foreground mb-12 text-balance",
            "transform transition-all duration-1000 delay-300 opacity-0 translate-y-8",
            isLoaded && "opacity-100 translate-y-0"
          )}
        >
          Crafted with precision and care, our approach to design emphasizes minimalism, 
          functionality, and beauty in perfect harmony.
        </p>
        
        <div 
          className={cn(
            "flex flex-col sm:flex-row items-center justify-center gap-4",
            "transform transition-all duration-1000 delay-500 opacity-0 translate-y-8",
            isLoaded && "opacity-100 translate-y-0"
          )}
        >
          <AnimatedButton size="lg">
            Explore Products
          </AnimatedButton>
          <AnimatedButton variant="ghost" size="lg">
            Learn More
          </AnimatedButton>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div 
        className={cn(
          "absolute bottom-12 left-1/2 transform -translate-x-1/2",
          "transition-all duration-1000 delay-700 opacity-0",
          isLoaded && "opacity-100"
        )}
      >
        <div className="flex flex-col items-center">
          <span className="text-sm text-muted-foreground mb-2">Scroll to explore</span>
          <div className="w-6 h-10 border-2 border-primary/20 rounded-full flex items-start justify-center p-1">
            <div className="w-1 h-2 bg-primary rounded-full animate-float"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
