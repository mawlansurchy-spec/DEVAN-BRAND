
import React, { useState, useRef } from 'react';
import { Plus, Edit, Trash2, TrendingUp, AlertTriangle, X, Upload, Info, Download, RefreshCw, Users, Eye, ShoppingCart, DollarSign, Printer, MessageCircle } from 'lucide-react';
import { Product, Order, Language, Analytics } from '../types';

interface AdminDashboardProps {
  products: Product[];
  orders: Order[];
  analytics: Analytics;
  onUpdateProduct: (product: Product) => void;
  onDeleteProduct: (id: number) => void;
  t: (key: string) => string;
  lang: Language;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ products, orders, analytics, onUpdateProduct, onDeleteProduct, t, lang }) => {
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const outOfStockProducts = products.filter(p => p.stock === 0);
  const lowStockProducts = products.filter(p => p.stock > 0 && p.stock <= 5);
  const totalOrders = orders.length;

  const handleOpenForm = (product?: Product) => {
    setEditingProduct(product || {
      id: Date.now(),
      name: { ku: '', ar: '', en: '' },
      description: { ku: '', ar: '', en: '' },
      price: 0,
      category: 'Clothing',
      image: '',
      stock: 0
    });
    setIsFormOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      onUpdateProduct(editingProduct);
      setIsFormOpen(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && editingProduct) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditingProduct({ ...editingProduct, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const sendSummaryToWhatsApp = () => {
    const phoneNumber = "9647507276624";
    const dateStr = new Date().toLocaleDateString('en-GB');
    
    let message = `*📊 ڕاپۆرتی گشتی DEVAN BRAND*\n`;
    message += `*بەروار:* \`${dateStr}\`\n\n`;
    message += `💰 *کۆی داهات:* ${totalRevenue.toLocaleString()} IQD\n`;
    message += `📦 *کۆی فرۆشتن:* ${totalOrders} فاکتۆر\n`;
    message += `👥 *سەردانیکەری ئەمڕۆ:* ${analytics.dailyVisitors}\n\n`;
    
    if (outOfStockProducts.length > 0) {
      message += `⚠️ *کاڵای تەواوبوو (${outOfStockProducts.length}):*\n`;
      outOfStockProducts.slice(0, 5).forEach(p => message += `- ${p.name[lang]}\n`);
    }

    if (lowStockProducts.length > 0) {
      message += `\n📉 *کاڵای کەمماوە (${lowStockProducts.length}):*\n`;
      lowStockProducts.slice(0, 5).forEach(p => message += `- ${p.name[lang]} (${p.stock} دانە)\n`);
    }

    message += `\n_تێبینی: ئەم ڕاپۆرتە بە شێوەی خۆکار لە سیستەمەوە نێردراوە._`;

    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
          <h2 className="text-4xl font-black tracking-tighter mb-1">{t('admin_panel')}</h2>
          <p className="text-gray-400 font-medium">Global Management & Real-time Analytics</p>
        </div>
        <div className="flex gap-3">
           <button 
             onClick={sendSummaryToWhatsApp} 
             title="Send Report to WhatsApp" 
             className="p-4 bg-green-50 rounded-2xl border border-green-100 text-green-600 hover:bg-green-600 hover:text-white hover:shadow-lg transition flex items-center gap-2 font-bold"
           >
             <MessageCircle size={20} />
             <span className="hidden md:inline text-xs uppercase tracking-widest">واتسئاپ</span>
           </button>
           <button onClick={() => window.print()} title="Print Report" className="p-4 bg-white rounded-2xl border border-gray-100 text-gray-400 hover:text-black hover:shadow-lg transition">
             <Printer size={20} />
           </button>
           <button onClick={() => window.location.reload()} title="Refresh Data" className="p-4 bg-white rounded-2xl border border-gray-100 text-indigo-400 hover:bg-indigo-50 hover:shadow-lg transition">
             <RefreshCw size={20} />
           </button>
        </div>
      </div>

      {/* Analytics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Total Revenue Card */}
        <div className="bg-black text-white rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform duration-700">
            <DollarSign size={120} />
          </div>
          <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] mb-4">{t('revenue')}</p>
          <h3 className="text-4xl font-black tracking-tight leading-none">
            {totalRevenue.toLocaleString()} 
            <span className="text-[10px] block font-normal opacity-50 mt-2 uppercase">Iraqi Dinar</span>
          </h3>
          <div className="mt-6 flex items-center gap-2 text-green-400 text-[10px] font-bold">
            <TrendingUp size={14} /> کۆی داهاتی هەموو فرۆشتنەکان
          </div>
        </div>

        {/* Daily Visitors Card */}
        <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 group hover:border-blue-200 transition-colors">
          <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] mb-4">{t('visitors_daily')}</p>
          <div className="flex items-end gap-2">
            <h3 className="text-5xl font-black">{analytics.dailyVisitors}</h3>
            <span className="text-xs font-bold text-gray-400 mb-2">Visitor(s)</span>
          </div>
          <div className="mt-6 flex items-center gap-2 text-blue-500 text-[10px] font-bold uppercase tracking-widest">
            <Eye size={14} /> سەردانیکەری ئەمڕۆ
          </div>
        </div>

        {/* Total Orders Card */}
        <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 group hover:border-indigo-200 transition-colors">
          <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] mb-4">Total Sales</p>
          <div className="flex items-end gap-2">
            <h3 className="text-5xl font-black">{totalOrders}</h3>
            <span className="text-xs font-bold text-gray-400 mb-2">Orders</span>
          </div>
          <div className="mt-6 flex items-center gap-2 text-indigo-500 text-[10px] font-bold uppercase tracking-widest">
            <ShoppingCart size={14} /> کۆی فاکتۆرەکان
          </div>
        </div>

        {/* Out of Stock Card */}
        <div className={`rounded-[2.5rem] p-8 shadow-sm border transition-all ${outOfStockProducts.length > 0 ? 'bg-red-50 border-red-100' : 'bg-white border-gray-100'}`}>
          <p className={`${outOfStockProducts.length > 0 ? 'text-red-400' : 'text-gray-400'} text-[10px] font-black uppercase tracking-[0.2em] mb-4`}>{t('out_of_stock')}</p>
          <h3 className={`text-5xl font-black ${outOfStockProducts.length > 0 ? 'text-red-600' : 'text-gray-900'}`}>{outOfStockProducts.length}</h3>
          <div className="mt-6 flex items-center gap-2 text-red-400 text-[10px] font-bold uppercase tracking-widest">
            <AlertTriangle size={14} /> پێویستی بە بارە
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[3rem] shadow-xl shadow-black/5 border border-gray-100 overflow-hidden">
        <div className="p-10 border-b border-gray-50 flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h2 className="text-2xl font-black tracking-tight">{t('products')}</h2>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Manage Inventory</p>
          </div>
          <button 
            onClick={() => handleOpenForm()}
            className="w-full md:w-auto bg-black text-white px-10 py-5 rounded-[2rem] font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-gray-800 transition shadow-2xl shadow-black/20"
          >
            <Plus size={20} />
            {t('add_product')}
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 text-gray-400 text-[10px] uppercase tracking-[0.2em] font-black">
                <th className="px-10 py-6">{t('products')}</th>
                <th className="px-10 py-6">{t('category')}</th>
                <th className="px-10 py-6">{t('price')}</th>
                <th className="px-10 py-6">{t('stock')}</th>
                <th className="px-10 py-6 text-center">{t('edit')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {products.map(product => (
                <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 rounded-2xl bg-gray-100 overflow-hidden shadow-sm">
                        <img src={product.image} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="font-black text-gray-900 text-lg">{product.name[lang]}</p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">ID: #{product.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-6">
                    <span className="px-4 py-2 bg-gray-100 rounded-full text-[10px] font-black text-gray-600 uppercase tracking-widest">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-10 py-6 font-black text-lg">{product.price.toLocaleString()} <span className="text-[10px] font-normal opacity-40">IQD</span></td>
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${product.stock === 0 ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]' : product.stock <= 5 ? 'bg-orange-500' : 'bg-green-500'}`}></div>
                      <span className={`font-black text-lg ${product.stock === 0 ? 'text-red-500' : ''}`}>{product.stock}</span>
                    </div>
                  </td>
                  <td className="px-10 py-6">
                    <div className="flex justify-center gap-3">
                      <button onClick={() => handleOpenForm(product)} className="p-3 text-gray-400 hover:text-black hover:bg-gray-100 rounded-xl transition"><Edit size={20} /></button>
                      <button onClick={() => onDeleteProduct(product.id)} className="p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition"><Trash2 size={20} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isFormOpen && editingProduct && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-2xl animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-4xl rounded-[3rem] overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-10 border-b flex justify-between items-center bg-gray-50">
              <div>
                <h3 className="text-3xl font-black tracking-tighter truncate">{editingProduct.name[lang] || t('add_product')}</h3>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Product Configuration</p>
              </div>
              <button onClick={() => setIsFormOpen(false)} className="p-4 hover:bg-gray-200 rounded-full transition text-gray-400"><X size={28}/></button>
            </div>
            
            <form onSubmit={handleSave} className="p-10 space-y-10 overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-6 md:col-span-2">
                   <h4 className="text-xs font-black border-b pb-4 flex items-center gap-2 uppercase tracking-[0.2em] text-gray-400"><Info size={16}/> {t('products')} Titles</h4>
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Kurdish (کوردی)</label>
                        <input required value={editingProduct.name.ku} onChange={e => setEditingProduct({...editingProduct, name: {...editingProduct.name, ku: e.target.value}})} className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-black focus:bg-white transition font-bold"/>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Arabic (العربية)</label>
                        <input required value={editingProduct.name.ar} onChange={e => setEditingProduct({...editingProduct, name: {...editingProduct.name, ar: e.target.value}})} className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-black focus:bg-white transition font-bold"/>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">English</label>
                        <input required value={editingProduct.name.en} onChange={e => setEditingProduct({...editingProduct, name: {...editingProduct.name, en: e.target.value}})} className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-black focus:bg-white transition font-bold"/>
                      </div>
                   </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">{t('price')} (IQD)</label>
                  <input type="number" required value={editingProduct.price} onChange={e => setEditingProduct({...editingProduct, price: parseInt(e.target.value) || 0})} className="w-full px-6 py-5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-black font-black text-2xl"/>
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">{t('stock')}</label>
                  <input type="number" required value={editingProduct.stock} onChange={e => setEditingProduct({...editingProduct, stock: parseInt(e.target.value) || 0})} className="w-full px-6 py-5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-black font-black text-2xl"/>
                </div>

                <div className="md:col-span-2 space-y-4">
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">{t('product_image')}</label>
                  <div className="flex flex-col md:flex-row gap-8 items-start bg-gray-50 p-8 rounded-[2rem] border border-dashed border-gray-200">
                    <div onClick={() => fileInputRef.current?.click()} className="w-full md:w-48 h-48 bg-white rounded-3xl flex flex-col items-center justify-center text-gray-300 hover:border-black hover:text-black transition cursor-pointer overflow-hidden relative group shadow-inner border border-gray-100">
                      {editingProduct.image ? (
                        <>
                          <img src={editingProduct.image} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white">
                            <Upload size={32} />
                          </div>
                        </>
                      ) : (
                        <>
                          <Upload size={32} className="mb-2" />
                          <span className="text-[10px] font-black tracking-widest uppercase">Select Image</span>
                        </>
                      )}
                    </div>
                    <div className="flex-1 w-full space-y-6">
                       <input type="file" ref={fileInputRef} accept="image/*" onChange={handleImageUpload} className="hidden"/>
                       <input placeholder="Image URL..." value={editingProduct.image.startsWith('data:') ? '' : editingProduct.image} onChange={e => setEditingProduct({...editingProduct, image: e.target.value})} className="w-full px-6 py-4 bg-white border-none rounded-2xl focus:ring-2 focus:ring-black text-sm font-medium shadow-sm"/>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-10">
                <button type="button" onClick={() => setIsFormOpen(false)} className="flex-1 px-8 py-5 border-2 border-gray-100 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-gray-50 transition">Cancel</button>
                <button type="submit" className="flex-[2] bg-black text-white py-5 rounded-2xl font-black text-lg uppercase tracking-widest hover:bg-gray-800 transition shadow-2xl shadow-black/20 active:scale-95">
                  {t('save')} Configuration
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
