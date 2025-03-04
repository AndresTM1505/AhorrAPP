
import React, { useState } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isAnimated?: boolean;
}

const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  children,
  className,
  variant = 'primary',
  size = 'md',
  isAnimated = true,
  ...props
}) => {
  const [isHovering, setIsHovering] = useState(false);

  const variants = {
    primary: 'bg-primary text-primary-foreground hover:opacity-90',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    ghost: 'bg-transparent hover:bg-secondary text-foreground',
  };

  const sizes = {
    sm: 'h-9 px-4 text-sm',
    md: 'h-10 px-6',
    lg: 'h-12 px-8 text-lg',
  };

  return (
    <button
      className={cn(
        'relative inline-flex items-center justify-center rounded-md font-medium transition-all',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        'disabled:pointer-events-none disabled:opacity-50',
        sizes[size],
        variants[variant],
        isAnimated && 'overflow-hidden',
        className
      )}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      {...props}
    >
      {isAnimated && (
        <span
          className={cn(
            'absolute inset-0 transform scale-x-0 transition-transform origin-left duration-500',
            variant === 'primary' && 'bg-primary/20',
            variant === 'secondary' && 'bg-secondary-foreground/10',
            variant === 'ghost' && 'bg-secondary',
            isHovering && 'scale-x-100'
          )}
        />
      )}
      
      <span className={cn(
        'relative z-10 flex items-center justify-center',
        isAnimated && isHovering && 'transform transition-transform duration-500'
      )}>
        {children}
      </span>
    </button>
  );
};

export default AnimatedButton;
