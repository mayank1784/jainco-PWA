"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { searchProducts, Product } from "@/lib/api";

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchTerm.trim() === "") {
        setProducts([]);
        return;
      }
      setIsSearching(true);
      try {
        const results = await searchProducts(searchTerm);
        setProducts(results);
      } catch (err) {
        console.error(err);
      } finally {
        setIsSearching(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  return (
    <div className="flex flex-col min-h-screen bg-background-dark text-text-main pb-[72px] selection:bg-primary/30">
      <header className="sticky top-0 z-40 bg-surface border-b border-border-dark flex items-center gap-3 p-3">
        <div className="flex-1 relative flex items-center">
          <span className="material-symbols-outlined absolute left-3 text-text-muted text-[20px]">search</span>
          <input 
            autoFocus
            type="text" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search SKUs, items..." 
            className="w-full h-10 bg-background-dark border border-border-dark rounded-sm pl-10 pr-10 text-[15px] focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary placeholder:text-text-muted"
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm('')} className="absolute right-3 text-text-muted hover:text-text-main">
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          )}
        </div>
        <button 
          onClick={() => setIsFilterOpen(true)}
          className="w-10 h-10 shrink-0 flex items-center justify-center bg-surface border border-border-dark rounded text-primary hover:text-primary/80 transition-colors"
        >
          <span className="material-symbols-outlined text-[24px]">tune</span>
        </button>
      </header>

      <main className="flex-1 p-3">
        {isSearching ? (
           <div className="flex justify-center items-center py-6 w-full">
            <div className="flex space-x-2">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse delay-75"></div>
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse delay-150"></div>
            </div>
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-2 gap-3">
             {products.map((product) => (
                <Link key={product.id} href={`/product/${product.id}`} className="flex flex-col bg-surface border border-border-dark rounded overflow-hidden group cursor-pointer hover:border-text-muted transition-colors">
                  <div className="h-[160px] w-full bg-[#1A1A1A] relative flex items-center justify-center p-4">
                    <img 
                      src={product.mainImage} 
                      alt={product.name} 
                      className="w-full h-full object-contain filter brightness-90 group-hover:brightness-100 transition-all mix-blend-screen"
                    />
                  </div>
                  <div className="p-3 flex flex-col flex-1 gap-1.5">
                    <h2 className="text-[14px] font-medium leading-snug text-text-main line-clamp-2">{product.name}</h2>
                    <div className="mt-auto pt-2 flex justify-between items-center">
                      <span className="inline-block px-2 py-0.5 border border-primary text-primary text-[11px] font-semibold rounded tracking-wide">
                        ₹{product.lowerPrice} - ₹{product.upperPrice}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        ) : searchTerm ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center mt-4">
            <span className="material-symbols-outlined text-4xl text-text-muted mb-4">search_off</span>
            <p className="text-[15px] font-medium text-text-main">No products found for "{searchTerm}"</p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center mt-4 text-text-muted">
             <span className="material-symbols-outlined text-4xl mb-4 opacity-50">keyboard</span>
             <p className="text-[14px]">Start typing to search catalog...</p>
          </div>
        )}
      </main>

      {/* Filter Modal Slider */}
      {isFilterOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80">
          <div className="w-full h-[85vh] sm:h-[80vh] sm:max-w-md bg-surface border border-border-dark flex flex-col rounded-t-xl sm:rounded-xl shadow-2xl animate-in slide-in-from-bottom">
            <header className="flex items-center justify-between p-4 border-b border-border-dark sticky top-0">
              <button onClick={() => setIsFilterOpen(false)} aria-label="Close filters" className="flex w-10 h-10 items-center justify-center text-text-muted hover:text-text-main transition-colors">
                <span className="material-symbols-outlined text-[24px]">close</span>
              </button>
              <h1 className="text-text-main text-[16px] font-bold tracking-wide flex-1 text-center pr-10 uppercase">Filter &amp; Sort</h1>
            </header>
            
            <div className="flex-1 overflow-y-auto no-scrollbar pb-24">
               <section className="p-4 border-b border-border-dark">
                  <h2 className="text-text-main text-[13px] font-semibold uppercase tracking-widest mb-4">Sort By</h2>
                  <div className="space-y-3">
                    <label className="flex items-center justify-between cursor-pointer group">
                      <span className="text-text-main text-sm">Newest Arrivals</span>
                      <input name="sort" type="radio" className="form-radio text-primary bg-background-dark border-border-dark focus:ring-primary size-4" defaultChecked />
                    </label>
                    <label className="flex items-center justify-between cursor-pointer group">
                      <span className="text-text-muted text-sm group-hover:text-text-main">Price: Low to High</span>
                      <input name="sort" type="radio" className="form-radio text-primary bg-background-dark border-border-dark focus:ring-primary size-4" />
                    </label>
                    <label className="flex items-center justify-between cursor-pointer group">
                      <span className="text-text-muted text-sm group-hover:text-text-main">Price: High to Low</span>
                      <input name="sort" type="radio" className="form-radio text-primary bg-background-dark border-border-dark focus:ring-primary size-4" />
                    </label>
                  </div>
                </section>
                
                <section className="p-4 border-b border-border-dark">
                  <h2 className="text-text-main text-[13px] font-semibold uppercase tracking-widest mb-4">Availability</h2>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-text-main text-sm font-medium">In-Stock Only</p>
                      <p className="text-text-muted text-[11px] mt-1">Hide items with lead times</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" value="" className="sr-only peer" />
                      <div className="w-11 h-6 bg-border-dark peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                    </label>
                  </div>
                </section>
                
                <section className="p-4">
                  <h2 className="text-text-main text-[13px] font-semibold uppercase tracking-widest mb-4">Price Tier</h2>
                  <div className="grid grid-cols-2 gap-3">
                    <label className="flex items-center gap-2 p-3 border border-border-dark rounded bg-background-dark cursor-pointer hover:border-text-muted">
                      <input type="checkbox" className="form-checkbox text-primary bg-background-dark border-border-dark rounded-sm focus:ring-primary size-4" />
                      <span className="text-text-muted text-sm">$ - Economy</span>
                    </label>
                    <label className="flex items-center gap-2 p-3 border border-border-dark rounded bg-background-dark cursor-pointer hover:border-text-muted">
                      <input type="checkbox" className="form-checkbox text-primary bg-background-dark border-border-dark rounded-sm focus:ring-primary size-4" />
                      <span className="text-text-muted text-sm">$$ - Premium</span>
                    </label>
                  </div>
                </section>
            </div>
            
            <footer className="absolute bottom-0 left-0 right-0 p-4 bg-surface border-t border-border-dark">
              <div className="flex gap-3">
                <button onClick={() => setIsFilterOpen(false)} className="w-1/3 h-12 rounded border border-border-dark bg-background-dark text-text-main text-[13px] font-bold uppercase tracking-wider hover:bg-border-dark transition-colors">
                  Clear
                </button>
                <button onClick={() => setIsFilterOpen(false)} className="w-2/3 h-12 rounded bg-primary text-background-dark text-[13px] font-bold uppercase tracking-wider hover:bg-primary/90 transition-colors">
                  Apply Filters
                </button>
              </div>
            </footer>
          </div>
        </div>
      )}
    </div>
  );
}
