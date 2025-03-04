
import React, { useEffect } from 'react';

const Loading = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-primary/30 rounded-full"></div>
        <div className="absolute top-0 left-0 w-16 h-16 border-4 border-primary rounded-full animate-spin border-t-transparent"></div>
      </div>
      <p className="mt-6 text-xl font-medium animate-pulse">LOADING...</p>
    </div>
  );
};

export default Loading;
