"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { getProductById, getProductVariations, getProductsByCategory, Product, ProductVariation } from "@/lib/api";
import { useCartStore } from "@/store/cartStore";
import { generateProductWhatsAppLink } from "@/lib/whatsapp";

export const runtime = 'edge';

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);

  const [product, setProduct] = useState<Product | null>(null);
  const [variations, setVariations] = useState<ProductVariation[]>([]);
  const [selectedVariation, setSelectedVariation] = useState<ProductVariation | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  
  const [qty, setQty] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const cartAddItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const prod = await getProductById(id);
        if (prod) {
          setProduct(prod);
          const vars = await getProductVariations(id);
          setVariations(vars);
          
          
          if (vars.length > 0) {
            setSelectedVariation(vars[0]);
          }

          if (prod.category) {
            const related = await getProductsByCategory(prod.category);
            setRelatedProducts(related.filter(r => r.id !== id).slice(0, 4));
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchProduct();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen w-full bg-background-dark">
        <div className="flex space-x-2">
          <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
          <div className="w-2 h-2 bg-primary rounded-full animate-pulse delay-75"></div>
          <div className="w-2 h-2 bg-primary rounded-full animate-pulse delay-150"></div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center px-4 bg-background-dark">
        <h1 className="text-xl font-bold text-text-main mb-4">Product Not Found</h1>
        <button onClick={() => router.back()} className="px-4 py-2 bg-surface text-text-main rounded border border-border-dark">Go Back</button>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!selectedVariation) return;
    cartAddItem({
      productId: product.id,
      variationId: selectedVariation.id,
      sku: selectedVariation.sku,
      name: product.name,
      variationType: selectedVariation.variationType || {},
      price: selectedVariation.price,
      qty,
      image: selectedVariation.images?.[0] || product.mainImage
    });
    alert("Added to Inquiry list!");
  };

  const currentPrice = selectedVariation ? selectedVariation.price : product.lowerPrice;
  const currentSku = selectedVariation ? selectedVariation.sku : "N/A";
  const displayImage = selectedVariation?.images?.[0] || product.mainImage;
  const allImages = [product.mainImage, ...(product.otherImages || [])];
  
  // Format variation type description
  const variantDesc = selectedVariation ? Object.values(selectedVariation.variationType || {}).join(' - ') : '';

  return (
    <div className="bg-background-dark text-text-main font-display min-h-screen pb-40 selection:bg-primary/30 flex flex-col">
      <header className="sticky top-0 z-50 bg-surface border-b border-border-dark flex items-center justify-between h-14 px-2">
        <button onClick={() => router.back()} className="flex items-center justify-center w-11 h-11 text-text-main hover:text-primary transition-colors focus:outline-none rounded">
          <span className="material-symbols-outlined text-[24px]">arrow_back</span>
        </button>
        <div className="font-semibold tracking-wide text-[15px] uppercase text-text-main truncate">Product Details</div>
        <button onClick={() => router.push('/cart')} className="flex items-center justify-center w-11 h-11 text-text-main hover:text-primary transition-colors relative focus:outline-none rounded">
          <span className="material-symbols-outlined text-[24px]">shopping_cart</span>
        </button>
      </header>

      <main>
        <section className="relative w-full aspect-square bg-surface border-b border-border-dark overflow-hidden group">
          <div className="flex w-full h-full overflow-x-auto snap-x snap-mandatory no-scrollbar scroll-smooth">
            {allImages.length > 0 ? allImages.map((img, idx) => (
              <div key={idx} className="w-full h-full flex-none snap-center relative">
                <img src={idx === 0 ? displayImage : img} alt={`${product.name} ${idx + 1}`} className="w-full h-full object-contain" />
              </div>
            )) : (
              <div className="w-full h-full flex-none snap-center relative bg-[#1a1a1a] flex items-center justify-center text-text-muted">
                No Image
              </div>
            )}
          </div>
        </section>

        <section className="p-4 border-b border-border-dark bg-background-dark">
          <div className="flex flex-col gap-1 mb-2">
            <h1 className="text-[20px] font-semibold leading-tight tracking-tight text-text-main capitalize">
              {product.name}
              {variantDesc && <span className="text-text-muted font-normal text-[16px] ml-1">({variantDesc})</span>}
            </h1>
            <span className="text-[12px] text-text-muted font-medium tracking-widest uppercase">SKU: {currentSku}</span>
          </div>
          <div className="flex justify-between items-center mt-3">
            <span className="text-xl font-bold text-primary">₹{currentPrice}</span>
          </div>
        </section>

        {variations.length > 0 && (
          <section className="p-4 border-b border-border-dark bg-background-dark">
            <h3 className="text-[13px] font-semibold uppercase tracking-widest text-text-muted mb-3">Select Variation</h3>
            <div className="grid grid-rows-3 grid-flow-col auto-cols-max gap-2 overflow-x-auto pb-2 no-scrollbar">

              {variations.map((v) => {
                const isSelected = selectedVariation?.id === v.id;
                const label = Object.values(v.variationType || {}).join(' ');
                return (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVariation(v)}
                    className={`px-3 py-1.5 border rounded text-[13px] font-medium transition-colors capitalize ${
                      isSelected 
                        ? 'border-primary text-primary bg-primary/10' 
                        : 'border-border-dark text-text-main hover:border-text-muted'
                    }`}
                  >
                    {label || "Standard"}
                  </button>
                )
              })}
            </div>
          </section>
        )}

        <section className="p-4 border-b border-border-dark bg-background-dark">
          <h3 className="text-[13px] font-semibold uppercase tracking-widest text-text-muted mb-2">Description</h3>
          <div 
            className="text-[14px] leading-relaxed text-text-muted" 
            dangerouslySetInnerHTML={{ __html: product.description || "No description provided." }} 
          />
        </section>

        {/* Action Buttons */}
        <section className="p-4 flex flex-col gap-3 border-b border-border-dark">
          <a
            href={generateProductWhatsAppLink(product.name, variantDesc, currentSku, currentPrice, qty)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 p-3 bg-green-600/20 text-green-500 border border-green-600/30 rounded hover:bg-green-600/30 transition-colors font-semibold uppercase text-[14px] tracking-wide"
          >
            <span className="material-symbols-outlined text-[20px]">chat</span>
            Enquire on WhatsApp
          </a>
        </section>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="px-4 py-6">
            <h3 className="text-[13px] font-semibold uppercase tracking-widest text-text-muted mb-4">More from this category</h3>
            <div className="grid grid-cols-2 gap-3">
              {relatedProducts.map((rp) => (
                <div key={rp.id} onClick={() => router.push(`/product/${rp.id}`)} className="flex flex-col bg-surface border border-border-dark rounded overflow-hidden cursor-pointer hover:border-text-muted transition-colors">
                  <div className="h-[120px] w-full bg-[#1A1A1A] relative flex items-center justify-center p-2">
                    <img 
                      src={rp.mainImage} 
                      alt={rp.name} 
                      className="w-full h-full object-contain filter brightness-90 mix-blend-screen"
                    />
                  </div>
                  <div className="p-2">
                    <h4 className="text-[12px] font-medium leading-snug text-text-main line-clamp-2 capitalize">{rp.name}</h4>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      <div className="fixed bottom-[72px] left-0 w-full h-[80px] bg-background-dark/95 backdrop-blur border-t border-border-dark p-4 flex items-center gap-4 z-40">
        <div className="flex items-center h-[48px] bg-background-dark border border-border-dark rounded shrink-0 w-[120px]">
          <button onClick={() => setQty(q => Math.max(1, q - 1))} className="w-10 h-full flex items-center justify-center text-text-main hover:text-primary">
            <span className="material-symbols-outlined text-[20px]">remove</span>
          </button>
          <div className="flex-1 w-full text-center text-text-main font-semibold text-[15px]">{qty}</div>
          <button onClick={() => setQty(q => q + 1)} className="w-10 h-full flex items-center justify-center text-text-main hover:text-primary">
            <span className="material-symbols-outlined text-[20px]">add</span>
          </button>
        </div>
        <button 
          onClick={handleAddToCart}
          className="flex-1 h-[48px] bg-primary text-background-dark font-semibold text-[14px] uppercase tracking-[1px] rounded flex items-center justify-center hover:bg-primary/90 transition-colors shadow-[0_0_15px_rgba(224,182,41,0.15)]"
        >
          <span className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px]">add_shopping_cart</span>
            Add to Inquiry
          </span>
        </button>
      </div>
    </div>
  );
}
