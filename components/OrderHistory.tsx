
import React from 'react';
import { Printer, Search, Calendar, CreditCard, Download, MessageCircle, Eye } from 'lucide-react';
import { Order, Language } from '../types';

interface OrderHistoryProps {
  orders: Order[];
  t: (key: string) => string;
  lang: Language;
  onPrint: (order: Order) => void;
  onDownload: (order: Order) => void;
  onWhatsApp: (order: Order) => void;
  onViewInvoice: (order: Order) => void;
}

const OrderHistory: React.FC<OrderHistoryProps> = ({ orders, t, lang, onPrint, onDownload, onWhatsApp, onViewInvoice }) => {
  return (
    <div className="max-w-5xl mx-auto animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
        <h2 className="text-2xl font-black">{t('invoice')}</h2>
        <div className="flex gap-4 w-full md:w-auto">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder={t('search')} 
              className="w-full md:w-64 pl-10 pr-4 py-2 bg-white border border-gray-100 rounded-xl focus:ring-0 focus:border-black transition shadow-sm"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {orders.map((order) => (
          <div key={order.id} className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-500 flex flex-col group">
            <div className="flex justify-between items-start mb-6">
              <div>
                <span className="text-[10px] font-black text-gray-400 tracking-widest uppercase mb-1 block">Invoice Reference</span>
                <h3 className="font-black text-gray-900 text-xl tracking-tighter">{order.id}</h3>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => onViewInvoice(order)}
                  title="View Invoice"
                  className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
                >
                  <Eye size={20} />
                </button>
                <button 
                  onClick={() => onWhatsApp(order)}
                  title="Share to WhatsApp"
                  className="p-3 bg-green-50 text-green-600 rounded-2xl hover:bg-green-600 hover:text-white transition-all shadow-sm"
                >
                  <MessageCircle size={20} />
                </button>
                <button 
                  onClick={() => onDownload(order)}
                  title="Download PDF"
                  className="p-3 bg-blue-50 text-blue-600 rounded-2xl hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                >
                  <Download size={20} />
                </button>
                <button 
                  onClick={() => onPrint(order)}
                  title="Print Thermal"
                  className="p-3 bg-gray-50 text-gray-600 rounded-2xl hover:bg-black hover:text-white transition-all shadow-sm"
                >
                  <Printer size={20} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50/50 p-4 rounded-2xl">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{t('customer_name')}</p>
                <p className="font-bold text-gray-800 truncate">{order.customerName || 'Walk-in'}</p>
              </div>
              <div className="bg-gray-50/50 p-4 rounded-2xl">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{t('customer_phone')}</p>
                <p className="font-bold text-gray-800">{order.customerPhone || 'N/A'}</p>
              </div>
            </div>

            <div className="space-y-3 mb-6 flex-1">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Calendar size={14} />
                <span className="font-medium">{order.date}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <CreditCard size={14} />
                <span className="font-bold text-gray-700">{order.paymentMethod}</span>
              </div>
              
              <div className="bg-white border border-gray-100 p-4 rounded-2xl mt-2">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 pb-2 border-b border-gray-50">Ordered Items</p>
                <div className="space-y-2 max-h-32 overflow-y-auto custom-scrollbar">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex justify-between items-center text-xs">
                      <span className="text-gray-600 font-medium">
                        <span className="text-black font-black">{item.quantity}x</span> {item.name[lang]}
                      </span>
                      <span className="font-black text-gray-900">{(item.price * item.quantity).toLocaleString()} IQD</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-100 flex justify-between items-center">
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{t('total')}</p>
                <p className="text-2xl font-black tracking-tight text-gray-900">{order.total.toLocaleString()} <span className="text-xs font-normal">IQD</span></p>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-600 rounded-full text-[10px] font-black uppercase tracking-widest">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                Completed
              </div>
            </div>
          </div>
        ))}
        {orders.length === 0 && (
          <div className="col-span-full h-96 flex flex-col items-center justify-center text-gray-400 bg-white rounded-[3rem] border border-dashed border-gray-200">
            <Printer size={64} className="mb-4 opacity-10" />
            <p className="font-black text-xl opacity-30 tracking-widest uppercase">No orders found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;
