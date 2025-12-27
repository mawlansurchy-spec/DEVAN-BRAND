
export type Language = 'ku' | 'ar' | 'en';

export interface Product {
  id: number;
  name: { [key in Language]: string };
  description: { [key in Language]: string };
  price: number;
  category: string;
  image: string;
  stock: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export type PaymentMethod = 'Cash' | 'FIB' | 'FastPay' | 'QiCard';

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  paymentMethod: PaymentMethod;
  date: string;
  customerName?: string;
  customerAddress?: string;
  customerPhone?: string;
}

export interface Analytics {
  dailyVisitors: number;
  totalVisitors: number;
  lastVisitDate: string;
}

export type View = 'shop' | 'pos' | 'orders' | 'checkout' | 'admin';
