
import React, { useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import AnimatedButton from "@/components/AnimatedButton";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-6">
      <div className="text-center max-w-lg">
        <div className="relative mb-8 mx-auto w-32 h-32">
          <div className="absolute inset-0 bg-secondary rounded-full"></div>
          <div className="absolute inset-4 bg-background rounded-full flex items-center justify-center">
            <span className="text-4xl font-bold">404</span>
          </div>
        </div>
        
        <h1 className="text-4xl font-bold mb-4 tracking-tight">Page not found</h1>
        <p className="text-lg text-muted-foreground mb-8">
          We couldn't find the page you're looking for. It might have been moved or doesn't exist.
        </p>
        
        <div className="flex justify-center">
          <Link to="/">
            <AnimatedButton>
              Return Home
            </AnimatedButton>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
