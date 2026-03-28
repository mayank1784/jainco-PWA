import { collection, doc, getDoc, getDocs, limit, orderBy, query, where, addDoc } from "firebase/firestore";
import { db } from "./firebase";
import { liteClient as algoliasearch } from 'algoliasearch/lite';

const searchClient = algoliasearch("95US8GNWM6", "09c00a1cdcb6eb4365f3834409ed7042");

export interface Category {
  id: string;
  name: string;
  description: string;
  image: string;
}

export interface Banner {
  id: string;
  imageUrl: string;
  landingUrl: string;
  title?: string;
  subtitle?: string;
  isActive: boolean;
  order: number;
}

export interface ProductVariation {
  id: string;
  sku: string;
  price: number;
  stock: number;
  isAvailable: boolean;
  images: string[];
  variationType: Record<string, string>;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  mainImage: string;
  otherImages: string[];
  lowerPrice: number;
  upperPrice: number;
  createdAt: any;
  variationTypes: Record<string, string[]>;
}

export const getCategories = async (): Promise<Category[]> => {
  const q = query(collection(db, "categories"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category));
};

export const getActiveBanners = async (): Promise<Banner[]> => {
  const q = query(collection(db, "banners"), where("isActive", "==", true), orderBy("order", "asc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Banner));
};

export const getTopCategories = async (count: number = 6): Promise<Category[]> => {
  const q = query(collection(db, "categories"), limit(count));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category));
};

export const getCategoryById = async (id: string): Promise<Category | null> => {
  const docRef = doc(db, "categories", id);
  const snapshot = await getDoc(docRef);
  if (snapshot.exists()) {
    return { id: snapshot.id, ...snapshot.data() } as Category;
  }
  return null;
};

export const getProductsByCategory = async (categoryId: string): Promise<Product[]> => {
  const q = query(collection(db, "products"), where("category", "==", categoryId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
};

export const getProductById = async (id: string): Promise<Product | null> => {
  const docRef = doc(db, "products", id);
  const snapshot = await getDoc(docRef);
  if (snapshot.exists()) {
    return { id: snapshot.id, ...snapshot.data() } as Product;
  }
  return null;
};

export const getProductVariations = async (productId: string): Promise<ProductVariation[]> => {
  const variationsRef = collection(db, "products", productId, "variations");
  const q = query(variationsRef, where("isAvailable", "==", true));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ProductVariation));
};

export const searchProducts = async (term: string): Promise<Product[]> => {
  if (!term.trim()) return [];
  
  try {
    const { results } = await searchClient.search({
      requests: [{
        indexName: 'products',
        query: term,
      }]
    });
    
    // Results is an array since we can batch multiple requests. 
    // We only made one request, so we take results[0].
    const hits = (results[0] as any)?.hits || [];
    
    return hits.map((hit: any) => ({
      id: hit.objectID,
      name: hit.name,
      category: hit.category,
      description: hit.description,
      mainImage: hit.mainImage,
      otherImages: [],
      lowerPrice: hit.lowerPrice,
      upperPrice: hit.upperPrice,
      createdAt: hit.createdAt,
      variationTypes: hit.variationTypes || {}
    })) as Product[];
  } catch (err) {
    console.error("Algolia search error:", err);
    return [];
  }
};

export const createOrder = async (orderData: any): Promise<string> => {
  const docRef = await addDoc(collection(db, "orders"), {
    ...orderData,
    createdAt: new Date(),
    status: "PENDING"
  });
  return docRef.id;
};
