
import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import TextReveal from './TextReveal';

interface Product {
  id: number;
  name: string;
  description: string;
  image: string;
}

const products: Product[] = [
  {
    id: 1,
    name: "Premium Wireless Speaker",
    description: "Exceptional audio quality in a minimalist design that complements any space.",
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?q=80&w=2069&auto=format&fit=crop"
  },
  {
    id: 2,
    name: "Smart Home Hub",
    description: "Connect your entire home with intuitive controls and seamless integration.",
    image: "https://images.unsplash.com/photo-1558002038-1055907df827?q=80&w=2070&auto=format&fit=crop"
  },
  {
    id: 3,
    name: "Minimalist Timepiece",
    description: "Simple elegance for the modern individual, with precision engineering.",
    image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=2080&auto=format&fit=crop"
  }
];

const ProductShowcase: React.FC = () => {
  const [activeProduct, setActiveProduct] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const productRefs = useRef<(HTMLDivElement | null)[]>([]);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );
    
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    
    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveProduct((prev) => (prev + 1) % products.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  useEffect(() => {
    const handleScroll = () => {
      productRefs.current.forEach((ref, index) => {
        if (!ref) return;
        
        const rect = ref.getBoundingClientRect();
        const isInView = rect.top < window.innerHeight * 0.8 && rect.bottom > 0;
        
        if (isInView) {
          ref.classList.add('opacity-100', 'translate-y-0');
          ref.classList.remove('opacity-0', 'translate-y-12');
        }
      });
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return (
    <section 
      id="products" 
      ref={sectionRef}
      className="py-24 relative overflow-hidden"
    >
      <div className="container mx-auto px-6">
        <div className="mb-16 text-center max-w-3xl mx-auto">
          <span className="inline-block px-3 py-1 text-sm font-medium rounded-full bg-secondary text-secondary-foreground mb-4">
            Our Products
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-balance">
            <TextReveal text="Beautiful Design Meets Exceptional Functionality" />
          </h2>
          <p className="text-muted-foreground text-lg">
            Each product is meticulously crafted to deliver the perfect balance between
            form and function, with no unnecessary elements.
          </p>
        </div>
        
        {/* Desktop Product Display */}
        <div className="hidden lg:flex gap-8 items-center mb-16">
          <div className="w-1/2 aspect-[4/3] relative overflow-hidden rounded-lg shadow-lg bg-muted/30">
            {products.map((product, index) => (
              <div
                key={product.id}
                className={cn(
                  "absolute inset-0 transition-all duration-1000 ease-in-out",
                  index === activeProduct ? "opacity-100 z-10" : "opacity-0 z-0"
                )}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-8 text-white">
                  <h3 className="text-2xl font-bold mb-2">{product.name}</h3>
                  <p className="text-white/80 max-w-lg">{product.description}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="w-1/2 pl-8">
            <div className="space-y-6">
              {products.map((product, index) => (
                <div
                  key={product.id}
                  className={cn(
                    "p-6 rounded-lg cursor-pointer transition-all duration-300",
                    activeProduct === index
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary/50 hover:bg-secondary"
                  )}
                  onClick={() => setActiveProduct(index)}
                >
                  <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                  <p className={activeProduct === index ? "text-primary-foreground/80" : "text-muted-foreground"}>
                    {product.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Mobile Product Display */}
        <div className="lg:hidden space-y-8">
          {products.map((product, index) => (
            <div
              key={product.id}
              ref={el => productRefs.current[index] = el}
              className="opacity-0 translate-y-12 transition-all duration-700 ease-out"
              style={{ transitionDelay: `${index * 200}ms` }}
            >
              <div className="aspect-[16/9] overflow-hidden rounded-lg mb-4 bg-muted/30">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
              <p className="text-muted-foreground">{product.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductShowcase;
