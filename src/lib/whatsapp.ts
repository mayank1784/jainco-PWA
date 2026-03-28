import { CartItem } from "../store/cartStore";

const WHATSAPP_NUMBER = "919891521784"; // Replace with real number or env variable

export const generateProductWhatsAppLink = (
  productName: string, 
  variantName: string, 
  sku: string, 
  price: number, 
  qty: number,
  customerName: string = "",
  mobile: string = ""
) => {
  const text = `Hello Jainco Decor,

Product:
${productName}

Variant:
${variantName}

SKU:
${sku}

Price:
₹${price}

Quantity:
${qty}

${customerName ? `Name:
${customerName}

` : ''}${mobile ? `Mobile:
${mobile}` : ''}`;

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
};

export const generateCartWhatsAppLink = (
  items: CartItem[]
) => {
  let text = `Hello Jainco Decor, I would like to place an order.\n\n`;
  text += `*Order Items*\n`;
  
  let total = 0;
  
  items.forEach((item, index) => {
    const vName = Object.values(item.variationType).join(' ');
    text += `${index + 1}. ${item.name} (${vName})\n`;
    text += `SKU: ${item.sku}\n`;
    text += `Qty: ${item.qty} x ₹${item.price} = ₹${item.qty * item.price}\n\n`;
    total += item.qty * item.price;
  });
  
  text += `*Total Amount:* ₹${total}`;
  
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
};
