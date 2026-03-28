"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getCategories, Category, getActiveBanners, Banner } from "@/lib/api";
import SplashScreen from "@/components/SplashScreen";

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [cats, bans] = await Promise.all([
          getCategories(),
          getActiveBanners()
        ]);
        setCategories(cats);
        setBanners(bans);
      } catch (err) {
        console.error("Failed to fetch data:", err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  return (
    <>
      <SplashScreen />
      <header className="sticky top-0 z-40 bg-surface backdrop-blur-sm flex flex-col w-full border-b border-border-dark">
        {/* Branding Row */}
        <div className="flex items-center justify-between px-2 h-14 border-b border-border-dark bg-background-dark/50 gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <img src="/favicon/favicon.svg" alt="Jainco Decor" className="w-8 h-8 shrink-0 object-contain drop-shadow-md" />
            <h1 className="font-display font-bold text-[13px] sm:text-[14px] uppercase tracking-wide text-primary ">Jainco Decor Pvt. Ltd.</h1>
          </div>
          <a href="tel:+917889806993" className="flex items-center gap-1 text-text-muted hover:text-primary transition-colors shrink-0 whitespace-nowrap">
            <span className="material-symbols-outlined text-[16px]">call</span>
            <span className="text-xs sm:text-sm font-bold tracking-widest">+91 9891521784</span>
          </a>
        </div>
        
        {/* Search Row */}
        <div className="flex items-center h-14 px-4 w-full">
          <Link href="/search" className="w-full relative block">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-primary" style={{ fontSize: "20px" }}>magnification_large</span>
            <div className="w-full h-10 flex items-center bg-background-dark border border-border-dark rounded-sm pl-10 pr-4 text-[15px] text-text-muted cursor-text transition-colors">
              Search SKUs, materials, or items...
            </div>
          </Link>
        </div>
      </header>

      <main className="flex-1 flex flex-col w-full overflow-y-auto pb-[72px]">
        {/* Dynamic Banners */}
        {!isLoading && banners.length > 0 && (
          <section className="px-4 py-4 w-full flex flex-col gap-4">
            {banners.map((banner) => (
              <Link key={banner.id} href={banner.landingUrl || "#"} className="relative w-full rounded-sm overflow-hidden border border-border-dark group cursor-pointer block bg-background-dark">
                <img src={banner.imageUrl} alt={banner.title || "Banner"} className="w-full h-auto object-contain" />
                <div className="absolute inset-0 bg-black/30 transition-opacity group-hover:bg-black/15"></div>
                {(banner.title || banner.subtitle) && (
                  <div className="absolute inset-0 p-5 flex flex-col justify-end">
                    {banner.subtitle && <p className="text-xs font-semibold text-primary tracking-widest uppercase mb-1 drop-shadow-md">{banner.subtitle}</p>}
                    {banner.title && <h2 className="text-lg sm:text-2xl font-bold text-white leading-tight w-4/5 drop-shadow-lg">{banner.title}</h2>}
                  </div>
                )}
              </Link>
            ))}
          </section>
        )}

        {/* Categories Grid */}
        <section className="px-4 pb-6 w-full">
          <h3 className="text-sm font-semibold text-text-muted uppercase tracking-widest mb-4">Browse Catalog</h3>
          
          {isLoading ? (
            <div className="grid grid-cols-2 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="flex flex-col border border-border-dark rounded-sm bg-surface overflow-hidden h-40 group animate-pulse">
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {categories.map((category) => (
                <Link key={category.id} href={`/category/${category.id}`} className="flex flex-col border border-border-dark rounded-sm bg-surface overflow-hidden group hover:border-primary/50 transition-colors">
                  <div className="w-full aspect-square relative bg-[#1A1A1A] flex items-center justify-center p-4">
                    <img 
                      src={category.image} 
                      alt={category.name} 
                      className="w-full h-full object-contain filter brightness-90 group-hover:brightness-100 transition-all mix-blend-screen" 
                    />
                  </div>
                  <div className="p-3 text-center border-t border-border-dark">
                    <span className="text-sm font-semibold text-text-main capitalize">{category.name}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Footer Address */}
        <section className="px-4 py-8 border-t border-border-dark mt-2 bg-surface w-full">
          <h3 className="text-[13px] font-bold text-text-main uppercase tracking-widest mb-3 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[18px]">location_on</span>
            Our Location
          </h3>
          <p className="text-text-muted text-[14px] leading-relaxed mb-5 font-medium">
            2966/40-41, Beadon Pura, Karol Bagh, <br />New Delhi - 110005
          </p>
          <div className="w-full h-[220px] bg-[#1a1a1a] border border-border-dark rounded overflow-hidden">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3501.2976703011273!2d77.18716417554282!3d28.650804483250653!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d029c6c99bbd5%3A0xc2af68f4609465a8!2sJain%20Enterprises!5e0!3m2!1sen!2sin!4v1774712340720!5m2!1sen!2sin" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </section>
      </main>
    </>
  );
}
