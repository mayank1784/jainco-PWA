import Link from "next/link";

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 flex gap-2 border-t border-border-dark bg-surface px-4 pb-safe pt-2 h-[72px]">
      <Link href="/" className="flex flex-1 flex-col items-center justify-center gap-1 text-primary">
        <div className="flex h-8 items-center justify-center">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1", fontSize: "24px" }}>house</span>
        </div>
        <p className="text-[11px] font-medium leading-normal tracking-wide">Home</p>
      </Link>
      
      <Link href="/search" className="flex flex-1 flex-col items-center justify-center gap-1 text-text-muted hover:text-text-main transition-colors">
        <div className="flex h-8 items-center justify-center">
          <span className="material-symbols-outlined" style={{ fontSize: "24px" }}>magnification_large</span>
        </div>
        <p className="text-[11px] font-medium leading-normal tracking-wide">Search</p>
      </Link>
      
      <Link href="/cart" className="flex flex-1 flex-col items-center justify-center gap-1 text-text-muted hover:text-text-main transition-colors relative">
        <div className="flex h-8 items-center justify-center relative">
          <span className="material-symbols-outlined" style={{ fontSize: "24px" }}>shopping_cart</span>
          {/* We will bind this to zustand store later */}
          {/* <span className="absolute -top-1 -right-2 bg-primary text-background-dark text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">3</span> */}
        </div>
        <p className="text-[11px] font-medium leading-normal tracking-wide">Inquiry</p>
      </Link>
      

    </nav>
  );
}
