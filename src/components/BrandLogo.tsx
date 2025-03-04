
import React from 'react';
import { cn } from '@/lib/utils';

interface BrandLogoProps {
  className?: string;
  textClassName?: string;
  showText?: boolean;
  iconOnly?: boolean;
}

const BrandLogo: React.FC<BrandLogoProps> = ({
  className,
  textClassName,
  showText = true,
  iconOnly = false,
}) => {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className="relative w-8 h-8 flex items-center justify-center">
        <div className="absolute inset-0 bg-primary rounded-full opacity-10 animate-pulse-subtle"></div>
        <svg
          className="relative w-5 h-5 text-primary"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12 18C15.3137 18 18 15.3137 18 12C18 8.68629 15.3137 6 12 6C8.68629 6 6 8.68629 6 12C6 15.3137 8.68629 18 12 18Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12 14C13.1046 14 14 13.1046 14 12C14 10.8954 13.1046 10 12 10C10.8954 10 10 10.8954 10 12C10 13.1046 10.8954 14 12 14Z"
            fill="currentColor"
          />
        </svg>
      </div>
      
      {showText && !iconOnly && (
        <span className={cn('font-semibold text-lg tracking-tight text-foreground', textClassName)}>
          Minimalist
        </span>
      )}
    </div>
  );
};

export default BrandLogo;
