
import React from 'react';
import { Trash2, Plus, Minus, ShoppingBag, Sparkles } from 'lucide-react';
import { CartItem, Language } from '../types';

interface CartPanelProps {
  cart: CartItem[];
  updateQuantity: (id: number, delta: number) => void;
  removeFromCart: (id: number) => void;
  total: number;
  onCheckout: () => void;
  t: (key: string) => string;
  lang: Language;
  handleAiAssist: () => void;
  aiSuggestion: string | null;
}

const CartPanel: React.FC<CartPanelProps> = ({ 
  cart, 
  updateQuantity, 
  removeFromCart, 
  total, 
  onCheckout, 
  t, 
  lang,
  handleAiAssist,
  aiSuggestion
}) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm flex flex-col h-full sticky top-6 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <ShoppingBag size={24} />
          {t('cart')}
        </h2>
        <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm font-bold">
          {cart.reduce((s, i) => s + i.quantity, 0)}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto min-h-[300px] mb-6 space-y-4">
        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-400">
            <ShoppingBag size={48} className="mb-4 opacity-20" />
            <p>{t('empty_cart')}</p>
          </div>
        ) : (
          cart.map((item) => (
            <div key={item.id} className="flex gap-4 group">
              <div className="w-16 h-16 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0">
                <img src={item.image} alt={item.name[lang]} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-gray-900 text-sm truncate">{item.name[lang]}</h4>
                <p className="text-sm font-black mt-1">{(item.price * item.quantity).toLocaleString()} IQD</p>
                <div className="flex items-center gap-3 mt-2">
                  <div className="flex items-center bg-gray-100 rounded-lg p-1">
                    <button onClick={() => updateQuantity(item.id, -1)} className="p-1 hover:bg-white rounded-md transition"><Minus size={14}/></button>
                    <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, 1)} className="p-1 hover:bg-white rounded-md transition"><Plus size={14}/></button>
                  </div>
                  <button onClick={() => removeFromCart(item.id)} className="text-red-400 hover:text-red-600 transition"><Trash2 size={16}/></button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {cart.length > 0 && (
        <div className="space-y-4">
          <button 
            onClick={handleAiAssist}
            className="w-full bg-indigo-50 text-indigo-700 py-3 px-4 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 border border-indigo-100 hover:bg-indigo-100 transition"
          >
            <Sparkles size={16} className="animate-pulse" />
            {t('suggest_ai')}
          </button>

          {aiSuggestion && (
            <div className="bg-indigo-600 text-white p-4 rounded-xl text-sm animate-in slide-in-from-bottom-2 duration-300">
              <p className="italic">"{aiSuggestion}"</p>
            </div>
          )}

          <div className="pt-4 border-t space-y-2">
            <div className="flex justify-between items-center text-gray-500">
              <span>{t('items')}</span>
              <span className="font-bold">{total.toLocaleString()} IQD</span>
            </div>
            <div className="flex justify-between items-center text-xl font-black">
              <span>{t('total')}</span>
              <span>{total.toLocaleString()} IQD</span>
            </div>
          </div>

          <button 
            onClick={onCheckout}
            className="w-full bg-black text-white py-4 rounded-xl font-bold text-lg hover:bg-gray-800 transition active:scale-[0.98] shadow-lg shadow-black/10"
          >
            {t('checkout')}
          </button>
        </div>
      )}
    </div>
  );
};

export default CartPanel;
