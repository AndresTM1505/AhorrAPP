
import React, { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import TextReveal from './TextReveal';

const features = [
  {
    title: "Exceptional Attention to Detail",
    description: "Every element is meticulously considered, from pixel-perfect alignment to subtle animations that delight users.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6">
        <path d="M22 12C22 17.5228 17.5228 22 12 22M22 12C22 6.47715 17.5228 2 12 2M22 12H2M12 22C6.47715 22 2 17.5228 2 12M12 22C14.5 19.5 16 15.5 16 12C16 8.5 14.5 4.5 12 2M12 22C9.5 19.5 8 15.5 8 12C8 8.5 9.5 4.5 12 2M2 12C2 6.47715 6.47715 2 12 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  },
  {
    title: "Intuitive User Experience",
    description: "Designed with the user in mind, creating interfaces that feel natural and effortless to navigate and use.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6">
        <path d="M7 11.5V14M8.5 9.5L5.5 12.5M10 8H7.5M16.5 11.5V14M15 9.5L18 12.5M13.5 8H16M12 16C12 16 7 13.5 7 10.5C7 9.11929 8.11929 8 9.5 8C10.4488 8 11.2795 8.52373 11.7299 9.30376C11.8155 9.46459 12 9.73676 12 9.73676C12 9.73676 12.1845 9.46459 12.2701 9.30376C12.7205 8.52373 13.5512 8 14.5 8C15.8807 8 17 9.11929 17 10.5C17 13.5 12 16 12 16Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  },
  {
    title: "Beautiful Simplicity",
    description: "Embracing minimalism to create designs that are both functionally and aesthetically timeless.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6">
        <path d="M9 17H5C3.89543 17 3 16.1046 3 15V5C3 3.89543 3.89543 3 5 3H19C20.1046 3 21 3.89543 21 5V15C21 16.1046 20.1046 17 19 17H15M9 17L12 21M9 17C9 18.1046 9.89543 19 11 19H13C14.1046 19 15 18.1046 15 17M15 17L12 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  },
  {
    title: "Perfect Proportions",
    description: "Balanced design with precise proportions that create harmony and visual appeal across all elements.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6">
        <path d="M3 7H21M3 12H21M3 17H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    )
  },
  {
    title: "Subtle Animations",
    description: "Thoughtful motion design that enhances user experience without overwhelming or distracting.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6">
        <path d="M14.7519 20.8284L12 18.0765L9.24807 20.8284M14.7519 3.17157L12 5.92349L9.24807 3.17157M4.92893 14.7519L7.68085 12L4.92893 9.24807M19.0711 14.7519L16.3192 12L19.0711 9.24807M12 7.5V16.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  },
  {
    title: "Seamless Responsiveness",
    description: "Adaptive designs that maintain beauty and functionality across all devices and screen sizes.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6">
        <path d="M10 16.5V7.5M7 14L10 17L13 14M14 7.5L14 16.5M17 10L14 7L11 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
];

const Features: React.FC = () => {
  const featureRefs = useRef<(HTMLDivElement | null)[]>([]);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('opacity-100', 'translate-y-0');
            entry.target.classList.remove('opacity-0', 'translate-y-10');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -100px 0px' }
    );
    
    featureRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });
    
    return () => {
      featureRefs.current.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, []);
  
  return (
    <section id="features" className="py-24 bg-secondary/50">
      <div className="container mx-auto px-6">
        <div className="mb-16 text-center max-w-3xl mx-auto">
          <span className="inline-block px-3 py-1 text-sm font-medium rounded-full bg-primary/10 text-primary mb-4">
            Features
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-balance">
            <TextReveal text="Designed with Purpose and Precision" />
          </h2>
          <p className="text-muted-foreground text-lg">
            Every feature is thoughtfully considered to enhance functionality
            while maintaining elegant simplicity.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              ref={el => featureRefs.current[index] = el}
              className={cn(
                "p-8 rounded-xl bg-background border border-border/50",
                "opacity-0 translate-y-10 transition-all duration-700 ease-out",
                "hover:shadow-md hover:border-primary/20 transition-all duration-300"
              )}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-primary/10 text-primary mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
