
import React from 'react';
import { Order, Language } from '../types';

interface InvoicePrintProps {
  order: Order;
  lang: Language;
  t: (key: string) => string;
}

const InvoicePrint: React.FC<InvoicePrintProps> = ({ order, lang, t }) => {
  return (
    <div className="bg-white p-2 text-black text-[10px] font-mono leading-tight max-w-[48mm] mx-auto">
      <div className="text-center mb-4 border-b border-black pb-2">
        <h1 className="text-sm font-bold uppercase tracking-tighter">DEVAN BRAND</h1>
        <p className="text-[8px] opacity-70">Luxury Fashion</p>
        <p className="text-[8px] mt-1 italic">Sulaymaniyah, Kurdistan</p>
      </div>

      <div className="space-y-1 mb-4">
        <div className="flex justify-between">
          <span>{t('invoice')}:</span>
          <span className="font-bold">{order.id}</span>
        </div>
        <div className="flex justify-between">
          <span>{t('date')}:</span>
          <span>{order.date.split(',')[0]}</span>
        </div>
        {order.customerName && (
          <div className="flex justify-between">
            <span>{t('customer_name')}:</span>
            <span className="text-right ml-2 break-words">{order.customerName}</span>
          </div>
        )}
        {order.customerPhone && (
          <div className="flex justify-between">
            <span>{t('customer_phone')}:</span>
            <span className="font-bold">{order.customerPhone}</span>
          </div>
        )}
        {order.customerAddress && (
          <div className="flex justify-between">
            <span>{t('customer_address')}:</span>
            <span className="text-right ml-2 break-words">{order.customerAddress}</span>
          </div>
        )}
      </div>

      <div className="border-y border-black border-dashed py-2 mb-4 space-y-1">
        <div className="flex justify-between font-bold border-b border-black/10 pb-1 mb-1">
          <span className="w-1/2">{t('items')}</span>
          <span className="w-1/4 text-center">{t('quantity')}</span>
          <span className="w-1/4 text-right">{t('price')}</span>
        </div>
        {order.items.map((item, idx) => (
          <div key={idx} className="flex justify-between gap-1">
            <span className="w-1/2 break-words">{item.name[lang]}</span>
            <span className="w-1/4 text-center">{item.quantity}</span>
            <span className="w-1/4 text-right">{(item.price * item.quantity).toLocaleString()}</span>
          </div>
        ))}
      </div>

      <div className="space-y-1 mb-6">
        <div className="flex justify-between">
          <span>{t('payment_method')}:</span>
          <span className="font-bold">{order.paymentMethod}</span>
        </div>
        <div className="flex justify-between text-sm font-bold pt-2 border-t border-black">
          <span>{t('total')}:</span>
          <span>{order.total.toLocaleString()} IQD</span>
        </div>
      </div>

      <div className="text-center mt-10 space-y-1">
        <p className="text-[8px]">Thank you for shopping with us!</p>
        <p className="text-[7px] opacity-50">Powered by Devan POS</p>
        <div className="flex justify-center mt-4">
          <div className="flex gap-[1px]">
             {[...Array(30)].map((_, i) => (
               <div key={i} className={`h-4 w-[2px] bg-black ${Math.random() > 0.5 ? 'opacity-100' : 'opacity-20'}`}></div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoicePrint;
