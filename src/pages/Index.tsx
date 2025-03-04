
import React from 'react';
import { Link } from 'react-router-dom';
import AnimatedButton from '@/components/AnimatedButton';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-primary/10 to-background p-6">
      <div className="text-center max-w-lg animate-fade-in">
        <h1 className="text-4xl font-bold mb-6 tracking-tight">AhorroAPP</h1>
        <p className="text-lg mb-8 text-muted-foreground">
          Una aplicación de ahorro personal con múltiples funcionalidades para ayudarte a controlar tus finanzas.
        </p>
        
        <div className="flex justify-center">
          <Link to="/login">
            <AnimatedButton variant="primary" size="lg">
              Iniciar Sesión
            </AnimatedButton>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Index;
