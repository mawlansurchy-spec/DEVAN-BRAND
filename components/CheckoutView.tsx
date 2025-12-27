
import React, { useState } from 'react';
import { CreditCard, Wallet, Banknote, User, MapPin, Tag, Phone, X, ShoppingBag } from 'lucide-react';
import { CartItem, PaymentMethod, Language } from '../types';

interface CheckoutViewProps {
  cart: CartItem[];
  total: number;
  onComplete: (paymentMethod: PaymentMethod, customerName: string, customerAddress: string, customerPhone: string) => void;
  t: (key: string) => string;
  lang: Language;
  onCancel: () => void;
}

const CheckoutView: React.FC<CheckoutViewProps> = ({ cart, total, onComplete, t, lang, onCancel }) => {
  const [method, setMethod] = useState<PaymentMethod>('Cash');
  const [customer, setCustomer] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');

  const methods: { id: PaymentMethod; label: string; icon: React.ReactNode; color: string }[] = [
    { id: 'Cash', label: t('cash'), icon: <Banknote />, color: 'bg-green-100 text-green-700' },
    { id: 'FIB', label: t('fib'), icon: <Wallet />, color: 'bg-blue-100 text-blue-700' },
    { id: 'FastPay', label: t('fastpay'), icon: <CreditCard />, color: 'bg-pink-100 text-pink-700' },
    { id: 'QiCard', label: t('qicard'), icon: <CreditCard />, color: 'bg-yellow-100 text-yellow-700' },
  ];

  if (cart.length === 0) {
    return (
      <div className="max-w-md mx-auto bg-white rounded-3xl p-12 shadow-sm text-center">
        <ShoppingBag className="mx-auto text-gray-200 mb-6" size={64} />
        <h2 className="text-2xl font-black mb-4">{t('empty_cart')}</h2>
        <button onClick={onCancel} className="bg-black text-white px-8 py-3 rounded-xl font-bold">{t('home')}</button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto flex flex-col lg:flex-row gap-8 animate-in fade-in duration-300">
      <div className="flex-1 bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-black">{t('checkout')}</h2>
          <button onClick={onCancel} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition">
            <X size={20} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-gray-400 uppercase mb-3">{t('customer_name')}</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Name Surname..."
                value={customer}
                onChange={(e) => setCustomer(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-black transition"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-3">{t('customer_address')}</label>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Sulaymaniyah, Bakrajo..."
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-black transition"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-3">{t('customer_phone')}</label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="tel" 
                placeholder="0750..."
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-black transition"
                required
              />
            </div>
          </div>
        </div>

        <div className="mb-8">
          <label className="block text-xs font-bold text-gray-400 uppercase mb-3">{t('payment_method')}</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {methods.map((m) => (
              <button
                key={m.id}
                onClick={() => setMethod(m.id)}
                className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${
                  method === m.id ? 'border-black bg-gray-50' : 'border-transparent bg-gray-50 hover:bg-gray-100'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${m.color}`}>
                  {m.icon}
                </div>
                <span className="font-bold text-xs">{m.label}</span>
              </button>
            ))}
          </div>
        </div>

        <button 
          onClick={() => onComplete(method, customer, address, phone)}
          className="w-full bg-black text-white py-5 rounded-2xl font-bold text-xl hover:bg-gray-800 transition active:scale-[0.98] shadow-xl shadow-black/10"
        >
          {t('order_success')}
        </button>
      </div>

      <div className="w-full lg:w-96 space-y-6">
        <div className="bg-gray-900 text-white rounded-3xl p-8 shadow-xl">
          <h3 className="font-bold mb-6 opacity-60 uppercase text-xs tracking-widest">{t('cart')}</h3>
          <div className="space-y-4 mb-8 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
            {cart.map(item => (
              <div key={item.id} className="flex justify-between items-center text-sm">
                <span className="opacity-80 truncate mr-2">{item.quantity}x {item.name[lang]}</span>
                <span className="font-bold whitespace-nowrap">{(item.price * item.quantity).toLocaleString()}</span>
              </div>
            ))}
          </div>
          
          <div className="pt-6 border-t border-white/10 space-y-3">
            <div className="flex justify-between items-center pt-3">
              <span className="text-xl opacity-60 font-bold">{t('total')}</span>
              <span className="text-3xl font-black">{total.toLocaleString()} <span className="text-xs font-normal">IQD</span></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutView;
