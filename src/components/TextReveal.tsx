
import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface TextRevealProps {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
  as?: React.ElementType;
  once?: boolean;
}

export const TextReveal: React.FC<TextRevealProps> = ({
  text,
  className,
  delay = 0,
  duration = 0.5,
  as: Component = 'div',
  once = true,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) {
            observer.disconnect();
          }
        } else if (!once) {
          setIsVisible(false);
        }
      },
      {
        threshold: 0.1,
      }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [once]);

  const words = text.split(' ');

  return (
    <Component
      ref={ref}
      className={cn("inline-block overflow-hidden", className)}
    >
      <span className="sr-only">{text}</span>
      <span aria-hidden="true" className="inline-block">
        {words.map((word, i) => (
          <span key={i} className="inline-block whitespace-nowrap">
            {word.split('').map((char, j) => (
              <span
                key={j}
                className="inline-block opacity-0 translate-y-[40%] transition-all duration-[800ms]"
                style={{
                  transitionDelay: `${delay + (i * 0.1) + (j * 0.03)}s`,
                  transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
                  transform: isVisible ? 'translateY(0)' : 'translateY(40%)',
                  opacity: isVisible ? 1 : 0,
                }}
              >
                {char}
              </span>
            ))}
            <span className="inline-block">&nbsp;</span>
          </span>
        ))}
      </span>
    </Component>
  );
};

export default TextReveal;
