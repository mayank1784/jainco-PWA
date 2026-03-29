"use client";

import Link from "next/link";

export default function OfflinePage() {
  return (
    <div className="flex flex-[1] flex-col items-center justify-center px-6 text-center animate-in fade-in duration-500 mt-20">
      <div className="w-24 h-24 bg-background-dark rounded-full border border-border-dark flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(255,255,255,0.02)]">
        <span className="material-symbols-outlined text-4xl text-text-muted">wifi_off</span>
      </div>
      <h1 className="text-[22px] font-display font-bold text-text-main mb-3 uppercase tracking-wide">
        No Connection
      </h1>
      <p className="text-text-muted text-[14px] max-w-[280px] leading-relaxed mb-8">
        It looks like you are currently offline. Please check your network connection and try again.
      </p>
      <button 
        onClick={() => {
          if (typeof window !== 'undefined') window.location.reload();
        }} 
        className="px-8 py-3 bg-primary text-[#0a0a0a] font-bold text-[14px] rounded-sm tracking-widest uppercase hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
      >
        Retry
      </button>
    </div>
  );
}
