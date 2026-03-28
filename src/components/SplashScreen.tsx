"use client";

import { useEffect, useState } from "react";

export default function SplashScreen() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Hide splash screen after 2 seconds
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-background-dark flex flex-col items-center justify-center animate-out fade-out duration-500 delay-1500 fill-mode-forwards">
      <div className="w-32 h-32 relative mb-6 animate-pulse">
        <img 
          src="/favicon/web-app-manifest-512x512.png" 
          alt="Jainco Decor Logo" 
          className="w-full h-full object-contain drop-shadow-[0_0_15px_rgba(224,182,41,0.3)]"
          onError={(e) => {
            // Fallback if logo not loaded immediately
            e.currentTarget.src = "/logo.png";
          }}
        />
      </div>
      <h1 className="text-2xl font-display font-bold text-primary tracking-widest uppercase mb-2 text-center">
        Jainco Decor
      </h1>
      <p className="text-text-muted text-sm font-medium tracking-wide uppercase text-center px-4">
        Premium Wholesale Catalog
      </p>
    </div>
  );
}
