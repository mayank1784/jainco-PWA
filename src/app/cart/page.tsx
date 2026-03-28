"use client";

import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cartStore";
import { generateCartWhatsAppLink } from "@/lib/whatsapp";
import { createOrder } from "@/lib/api";

export default function CartPage() {
  const router = useRouter();
  const { items, removeItem, updateQty, getCartTotal, clearCart } = useCartStore();

  const handleCheckout = () => {
    if (items.length === 0) return;
    
    // Generate WhatsApp Link
    const link = generateCartWhatsAppLink(items);
    
    // Clear Cart (Optional, but usually a good idea post-checkout)
    clearCart();
    
    // Open WhatsApp
    window.open(link, "_blank");
    router.push("/");
  };

  return (
    <div className="bg-background-dark min-h-screen flex flex-col font-display selection:bg-primary/30 text-text-main pb-20">
      <header className="sticky top-0 z-40 bg-surface border-b border-border-dark flex items-center h-14 px-4">
        <button onClick={() => router.back()} aria-label="Go back" className="flex items-center justify-center w-10 h-10 -ml-2 text-text-main transition-colors hover:text-primary">
          <span className="material-symbols-outlined text-2xl">arrow_back_ios</span>
        </button>
        <h1 className="flex-1 text-center text-lg font-semibold tracking-wide pr-8">
          Inquiry Cart ({items.length})
        </h1>
      </header>

      <main className="flex-1 flex flex-col overflow-y-auto no-scrollbar pt-2">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center flex-1 p-8 text-center pt-24">
            <span className="material-symbols-outlined text-6xl text-text-muted mb-4">shopping_cart</span>
            <h2 className="text-xl font-bold mb-2">Cart is empty</h2>
            <p className="text-text-muted mb-8 max-w-xs">Looks like you haven't added anything to your inquiry list yet.</p>
            <button onClick={() => router.push('/')} className="px-6 py-3 bg-primary text-background-dark font-bold uppercase rounded hover:bg-primary/90">
              Browse Catalog
            </button>
          </div>
        ) : (
          <>
             <div className="flex flex-col">
              {items.map((item) => {
                const variantDesc = Object.values(item.variationType || {}).join(' - ');
                return (
                  <div key={item.cartId} className="relative group border-b border-border-dark overflow-hidden bg-background-dark flex items-center h-20 px-4">
                    <div className="w-16 h-16 shrink-0 bg-surface border border-border-dark flex items-center justify-center overflow-hidden">
                      <img src={item.image} alt={item.name} className="w-full h-full object-contain mix-blend-screen opacity-80" />
                    </div>
                    
                    <div className="flex-1 min-w-0 px-4 flex flex-col justify-center">
                      <h2 className="text-[13px] font-medium text-text-main truncate leading-tight capitalize">{item.name}</h2>
                      <p className="text-[11px] text-primary mt-0.5 capitalize">{variantDesc}</p>
                      <p className="text-[11px] text-text-muted">SKU: {item.sku} | ₹{item.price}</p>
                    </div>
                    
                    <div className="shrink-0 flex items-center gap-1 bg-surface border border-border-dark p-1">
                      <button onClick={() => updateQty(item.cartId, item.qty - 1)} className="w-6 h-6 flex items-center justify-center text-text-muted hover:text-primary">
                        <span className="material-symbols-outlined text-[16px]">remove</span>
                      </button>
                      <input 
                        className="w-8 h-6 bg-transparent border-none text-center text-[13px] font-semibold p-0 focus:ring-0 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" 
                        type="number" 
                        value={item.qty} 
                        readOnly
                      />
                      <button onClick={() => updateQty(item.cartId, item.qty + 1)} className="w-6 h-6 flex items-center justify-center text-text-muted hover:text-primary">
                        <span className="material-symbols-outlined text-[16px]">add</span>
                      </button>
                    </div>
                    
                    <button onClick={() => removeItem(item.cartId)} className="ml-3 shrink-0 text-text-muted hover:text-red-500">
                      <span className="material-symbols-outlined text-[20px]">delete</span>
                    </button>
                  </div>
                )
              })}
            </div>



            <div className="px-4 py-6 border-t border-border-dark mt-auto">
              <div className="flex justify-between items-center text-[15px]">
                <span className="text-text-muted">Total Amount</span>
                <span className="font-bold text-primary text-xl">₹{getCartTotal()}</span>
              </div>
            </div>
             <footer className="px-4 py-6 border-t border-border-dark mt-auto">
              <button onClick={handleCheckout} className="w-full h-12 bg-[#25D366] hover:bg-[#128C7E] text-white font-bold text-[14px] uppercase tracking-[1px] transition-colors flex items-center justify-center gap-2 rounded shadow-lg shadow-[#25D366]/20">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path d="M12.031 0C5.385 0 .002 5.382.002 12.029c0 2.126.554 4.198 1.606 6.02L.034 23.993l6.095-1.594c1.78.966 3.791 1.474 5.898 1.474h.005c6.645 0 12.027-5.382 12.027-12.029S18.675 0 12.031 0zm0 21.874h-.005c-1.8 0-3.565-.484-5.115-1.4l-.367-.217-3.801.996.997-3.708-.238-.379c-.999-1.589-1.528-3.418-1.528-5.313 0-5.549 4.516-10.065 10.062-10.065 2.688 0 5.216 1.047 7.116 2.946A10.016 10.016 0 0 1 22.1 12.029c0 5.549-4.517 10.064-10.069 10.064zm5.522-7.536c-.302-.151-1.789-.884-2.066-.984-.276-.1-.478-.151-.679.151-.202.302-.78 1.054-.956 1.255-.176.202-.352.226-.653.075-.302-.151-1.277-.471-2.433-1.503-.9-.803-1.507-1.794-1.683-2.096-.176-.301-.019-.464.132-.614.135-.135.302-.351.453-.527.151-.176.202-.302.302-.503.101-.202.05-.378-.025-.529-.075-.151-.679-1.638-.93-2.242-.244-.59-.494-.509-.679-.519l-.578-.01c-.201 0-.528.075-.805.377-.276.302-1.056 1.03-1.056 2.511 0 1.482 1.082 2.914 1.233 3.115.151.202 2.126 3.245 5.148 4.549.718.31 1.279.494 1.716.632.721.229 1.378.196 1.897.119.584-.087 1.789-.731 2.041-1.437.252-.707.252-1.312.176-1.438-.076-.126-.277-.201-.579-.352z"/>
                </svg>
                SEND TO WHATSAPP
              </button>
            </footer>

            {/* <footer className="fixed bottom-0 left-0 right-0 w-full bg-surface border-t border-border-dark p-4 z-50 pb-safe">
              <button onClick={handleCheckout} className="w-full h-12 bg-[#25D366] hover:bg-[#128C7E] text-white font-bold text-[14px] uppercase tracking-[1px] transition-colors flex items-center justify-center gap-2 rounded shadow-lg shadow-[#25D366]/20">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path d="M12.031 0C5.385 0 .002 5.382.002 12.029c0 2.126.554 4.198 1.606 6.02L.034 23.993l6.095-1.594c1.78.966 3.791 1.474 5.898 1.474h.005c6.645 0 12.027-5.382 12.027-12.029S18.675 0 12.031 0zm0 21.874h-.005c-1.8 0-3.565-.484-5.115-1.4l-.367-.217-3.801.996.997-3.708-.238-.379c-.999-1.589-1.528-3.418-1.528-5.313 0-5.549 4.516-10.065 10.062-10.065 2.688 0 5.216 1.047 7.116 2.946A10.016 10.016 0 0 1 22.1 12.029c0 5.549-4.517 10.064-10.069 10.064zm5.522-7.536c-.302-.151-1.789-.884-2.066-.984-.276-.1-.478-.151-.679.151-.202.302-.78 1.054-.956 1.255-.176.202-.352.226-.653.075-.302-.151-1.277-.471-2.433-1.503-.9-.803-1.507-1.794-1.683-2.096-.176-.301-.019-.464.132-.614.135-.135.302-.351.453-.527.151-.176.202-.302.302-.503.101-.202.05-.378-.025-.529-.075-.151-.679-1.638-.93-2.242-.244-.59-.494-.509-.679-.519l-.578-.01c-.201 0-.528.075-.805.377-.276.302-1.056 1.03-1.056 2.511 0 1.482 1.082 2.914 1.233 3.115.151.202 2.126 3.245 5.148 4.549.718.31 1.279.494 1.716.632.721.229 1.378.196 1.897.119.584-.087 1.789-.731 2.041-1.437.252-.707.252-1.312.176-1.438-.076-.126-.277-.201-.579-.352z"/>
                </svg>
                SEND TO WHATSAPP
              </button>
            </footer> */}
          </>
        )}
      </main>

    </div>
  );
}
