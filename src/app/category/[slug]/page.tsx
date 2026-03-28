"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getProductsByCategory, getCategoryById, Product } from "@/lib/api";

export default function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const router = useRouter();
  const { slug } = use(params);
  
  const [products, setProducts] = useState<Product[]>([]);
  const [categoryName, setCategoryName] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [data, catData] = await Promise.all([
          getProductsByCategory(slug),
          getCategoryById(slug)
        ]);
        setProducts(data);
        if (catData) setCategoryName(catData.name);
      } catch (err) {
        console.error("Failed to fetch data:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [slug]);

  const goBack = () => router.back();

  return (
    <div className="flex-1 flex flex-col overflow-x-hidden min-h-screen pb-[72px]">
      <header className="sticky top-0 z-50 h-12 bg-surface border-b border-border-dark flex items-center justify-between px-2">
        <button 
          onClick={goBack}
          aria-label="Go back" 
          className="h-11 w-11 flex items-center justify-center text-text-main hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 rounded"
        >
          <span className="material-symbols-outlined text-2xl">chevron_left</span>
        </button>
        <h1 className="text-[18px] font-semibold tracking-wide text-text-main truncate px-2 capitalize">
          {categoryName || slug.replace(/-/g, ' ')}
        </h1>
        <button 
          aria-label="Filter products" 
          className="h-11 w-11 flex items-center justify-center text-primary hover:text-primary/80 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 rounded"
        >
          <span className="material-symbols-outlined text-2xl">tune</span>
        </button>
      </header>

      <main className="flex-1 p-3">
        {isLoading ? (
          <div className="flex justify-center items-center py-6 w-full">
            <div className="flex space-x-2">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse delay-75"></div>
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse delay-150"></div>
            </div>
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center border border-border-dark border-dashed rounded mt-4">
            <span className="material-symbols-outlined text-4xl text-text-muted mb-4">search_off</span>
            <p className="text-[15px] font-medium text-text-main mb-6 max-w-[280px]">No products match this category.</p>
            <Link href="/" className="h-10 px-6 flex items-center bg-primary text-background-dark text-[14px] font-bold uppercase tracking-[0.015em] rounded focus:outline-none transition-colors">
              Browse Categories
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 pb-8">
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
                  <h2 className="text-[14px] font-medium leading-snug text-text-main line-clamp-2 capitalize">{product.name}</h2>
                  <div className="mt-auto pt-2 flex justify-between items-center">
                    <span className="inline-block px-2 py-0.5 border border-primary text-primary text-[11px] font-semibold rounded tracking-wide">
                      ₹{product.lowerPrice} - ₹{product.upperPrice}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
