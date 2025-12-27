
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { ShoppingBag, CheckCircle, Lock, X, MessageCircle, Download, Eye, Printer } from 'lucide-react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { Language, Product, CartItem, Order, View, PaymentMethod, Analytics } from './types';
import { TRANSLATIONS, MOCK_PRODUCTS } from './constants';

// Components
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import ProductGrid from './components/ProductGrid';
import CheckoutView from './components/CheckoutView';
import OrderHistory from './components/OrderHistory';
import InvoicePrint from './components/InvoicePrint';
import AdminDashboard from './components/AdminDashboard';

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('ku');
  const [view, setView] = useState<View>('shop');
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('blak_products');
    return saved ? JSON.parse(saved) : MOCK_PRODUCTS;
  });
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('blak_orders');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [analytics, setAnalytics] = useState<Analytics>(() => {
    const saved = localStorage.getItem('blak_analytics');
    return saved ? JSON.parse(saved) : { dailyVisitors: 0, totalVisitors: 0, lastVisitDate: '' };
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [viewingInvoice, setViewingInvoice] = useState<Order | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');
  
  const invoiceRef = useRef<HTMLDivElement>(null);

  const t = (key: string) => TRANSLATIONS[lang][key] || key;
  const isRtl = lang === 'ku' || lang === 'ar';

  // Advanced Visitor Tracking
  useEffect(() => {
    const today = new Date().toLocaleDateString('en-GB'); // Use en-GB for consistent numeric comparison
    const sessionKey = `visited_${today}`;
    const alreadyCountedInSession = sessionStorage.getItem(sessionKey);

    if (!alreadyCountedInSession) {
      setAnalytics(prev => {
        const isNewDay = prev.lastVisitDate !== today;
        return {
          dailyVisitors: isNewDay ? 1 : prev.dailyVisitors + 1,
          totalVisitors: prev.totalVisitors + 1,
          lastVisitDate: today
        };
      });
      sessionStorage.setItem(sessionKey, 'true');
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('blak_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('blak_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('blak_analytics', JSON.stringify(analytics));
  }, [analytics]);

  useEffect(() => {
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang, isRtl]);

  const addToCart = (product: Product) => {
    if (product.stock <= 0) return;
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        if (existing.quantity >= product.stock) return prev;
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const cartTotal = useMemo(() => cart.reduce((sum, item) => sum + (item.price * item.quantity), 0), [cart]);

  const handleCheckout = (paymentMethod: PaymentMethod, customerName: string, customerAddress: string, customerPhone: string) => {
    setProducts(prevProducts => prevProducts.map(p => {
      const cartItem = cart.find(ci => ci.id === p.id);
      if (cartItem) {
        return { ...p, stock: p.stock - cartItem.quantity };
      }
      return p;
    }));

    const newOrder: Order = {
      id: `BLAK-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      items: [...cart],
      total: cartTotal,
      paymentMethod,
      // Fixed: Using en-GB to ensure Western Arabic numerals (0-9) on invoices
      date: new Date().toLocaleString('en-GB', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      customerName,
      customerAddress,
      customerPhone
    };
    setOrders([newOrder, ...orders]);
    setCart([]);
    setCurrentOrder(newOrder);
    setView('checkout');
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginForm.username === 'DEVAN23' && loginForm.password === 'sardam1234@') {
      setIsAuthenticated(true);
      setShowLoginModal(false);
      setLoginError('');
      setLoginForm({ username: '', password: '' });
    } else {
      setLoginError(isRtl ? 'زانیارییەکان هەڵەیە' : 'Incorrect credentials');
    }
  };

  const onSidebarViewChange = (newView: View) => {
    const restrictedViews: View[] = ['admin', 'orders', 'pos'];
    if (restrictedViews.includes(newView) && !isAuthenticated) {
      setShowLoginModal(true);
    } else {
      setView(newView);
    }
  };

  const sendWhatsApp = (order: Order) => {
    const phoneNumber = "9647507276624";
    const itemsList = order.items.map(i => `▫️ ${i.quantity}x ${i.name[lang]}`).join('\n');
    const message = `*DEVAN BRAND - داواکاری نوێ* 🛍️\n\n*کۆدی پسوڵە:* \`${order.id}\`\n*ناوی کڕیار:* ${order.customerName || 'دیاری نەکراوە'}\n*ژمارە مۆبایل:* ${order.customerPhone || 'دیاری نەکراوە'}\n*ناونیشان:* ${order.customerAddress || 'دیاری نەکراوە'}\n\n*لیستی کاڵاکان:*\n${itemsList}\n\n*💰 کۆی گشتی:* ${order.total.toLocaleString()} IQD\n*💳 شێوازی پارەدان:* ${order.paymentMethod}\n\n_بەروار: ${order.date}_\n\n_Devan Brand Official POS_`;
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const downloadPDF = async (orderToDownload: Order) => {
    if (!invoiceRef.current) return;
    const canvas = await html2canvas(invoiceRef.current, { scale: 2, useCORS: true, backgroundColor: '#ffffff' });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: [80, 200] });
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`DEVAN-${orderToDownload.id}.pdf`);
  };

  const printInvoice = (order: Order) => {
    setViewingInvoice(order);
    setTimeout(() => window.print(), 200);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row font-sans selection:bg-black selection:text-white">
      <div className="absolute left-[-9999px] top-[-9999px]">
        <div ref={invoiceRef}>
          {(viewingInvoice || currentOrder) && <InvoicePrint order={(viewingInvoice || currentOrder)!} lang={lang} t={t} />}
        </div>
      </div>

      <Sidebar view={view} setView={onSidebarViewChange} t={t} isRtl={isRtl} isAuthenticated={isAuthenticated} />
      
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <Header 
          lang={lang} setLang={setLang} t={t} 
          searchQuery={searchQuery} setSearchQuery={setSearchQuery} 
          cartCount={cart.length} onCartClick={() => setView('pos')}
          isAuthenticated={isAuthenticated} onLoginClick={() => isAuthenticated ? setIsAuthenticated(false) : setShowLoginModal(true)}
        />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-8 pb-24 md:pb-8 bg-[#f8f9fa] custom-scrollbar">
          {view === 'shop' && (
            <div className="max-w-7xl mx-auto h-full">
              <div className="mb-10 text-center md:text-start">
                <h2 className="text-4xl font-black tracking-tighter mb-2">{t('products')}</h2>
                <p className="text-gray-400 font-medium">DEVAN BRAND Luxury Fashion Collection</p>
              </div>
              <ProductGrid products={products.filter(p => p.name[lang].toLowerCase().includes(searchQuery.toLowerCase()))} addToCart={addToCart} lang={lang} t={t} />
              {cart.length > 0 && (
                <button onClick={() => setView('pos')} className="fixed bottom-24 right-6 md:bottom-10 md:right-10 bg-black text-white px-8 py-5 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] z-50 flex items-center gap-4 hover:scale-105 active:scale-95 transition-all">
                  <ShoppingBag size={24} className="animate-pulse" />
                  <div className="flex flex-col items-start leading-none">
                    <span className="text-[10px] uppercase font-black opacity-60 mb-1">{t('cart')}</span>
                    <span className="font-bold">{cart.length} {t('items')}</span>
                  </div>
                </button>
              )}
            </div>
          )}
          {view === 'pos' && <CheckoutView cart={cart} total={cartTotal} onComplete={handleCheckout} t={t} lang={lang} onCancel={() => setView('shop')} />}
          {view === 'orders' && isAuthenticated && <OrderHistory orders={orders} t={t} lang={lang} onPrint={printInvoice} onDownload={downloadPDF} onWhatsApp={sendWhatsApp} onViewInvoice={setViewingInvoice} />}
          {view === 'admin' && isAuthenticated && <AdminDashboard products={products} orders={orders} analytics={analytics} onUpdateProduct={(upd) => setProducts(prev => { const exists = prev.find(p => p.id === upd.id); return exists ? prev.map(p => p.id === upd.id ? upd : p) : [...prev, upd]; })} onDeleteProduct={(id) => setProducts(prev => prev.filter(p => p.id !== id))} t={t} lang={lang} />}
          {view === 'checkout' && currentOrder && (
            <div className="max-w-2xl mx-auto bg-white rounded-[3rem] p-8 md:p-12 shadow-2xl text-center border border-gray-100 mb-10">
              <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8"><CheckCircle className="text-green-500 w-14 h-14" /></div>
              <h2 className="text-3xl font-black mb-2 tracking-tight">{t('order_success')}</h2>
              <p className="text-gray-400 font-bold mb-8 uppercase tracking-widest text-xs">Order ID: {currentOrder.id}</p>
              <div className="bg-gray-50 rounded-[2rem] p-6 mb-8 text-start space-y-4">
                <p className="text-sm font-bold text-gray-700">{t('whatsapp_instruction')}</p>
                <div className="flex items-center gap-3 bg-white p-4 rounded-xl border border-gray-100">
                  <div className="bg-green-100 p-2 rounded-lg text-green-600"><MessageCircle size={20} /></div>
                  <span className="font-black text-lg">0750 727 6624</span>
                </div>
              </div>
              <div className="space-y-4">
                <button onClick={() => sendWhatsApp(currentOrder)} className="w-full bg-green-500 text-white py-6 rounded-2xl font-black text-xl hover:bg-green-600 transition shadow-[0_20px_40px_rgba(34,197,94,0.3)] flex items-center justify-center gap-3"><MessageCircle size={24} /> {t('send_whatsapp')}</button>
                <button onClick={() => setView('shop')} className="w-full border-2 border-gray-100 text-gray-400 py-4 rounded-2xl font-bold">{t('home')}</button>
              </div>
            </div>
          )}
        </main>
      </div>

      {viewingInvoice && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm no-print">
          <div className="bg-white w-full max-w-sm rounded-[3rem] shadow-2xl p-8 relative">
             <button onClick={() => setViewingInvoice(null)} className="absolute top-4 right-4 p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition"><X size={20} /></button>
             <div className="mb-6 pb-4 border-b">
               <h3 className="text-xl font-black">{t('invoice')}</h3>
               <p className="text-xs text-gray-400 font-bold uppercase">{viewingInvoice.id}</p>
             </div>
             <div className="bg-gray-50 p-4 rounded-2xl border mb-6 max-h-[60vh] overflow-y-auto flex justify-center custom-scrollbar">
                <InvoicePrint order={viewingInvoice} lang={lang} t={t} />
             </div>
             <div className="grid grid-cols-2 gap-3">
                <button onClick={() => printInvoice(viewingInvoice!)} className="flex items-center justify-center gap-2 bg-black text-white py-4 rounded-xl font-bold hover:bg-gray-800 transition"><Printer size={18} /> {t('print_invoice')}</button>
                <button onClick={() => downloadPDF(viewingInvoice!)} className="flex items-center justify-center gap-2 bg-blue-600 text-white py-4 rounded-xl font-bold"><Download size={18} /> PDF</button>
             </div>
          </div>
        </div>
      )}

      {showLoginModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl">
          <div className="bg-white w-full max-w-sm rounded-[3rem] p-12 relative">
            <button onClick={() => setShowLoginModal(false)} className="absolute top-8 right-8 p-3 hover:bg-gray-100 rounded-full text-gray-400"><X size={24} /></button>
            <div className="text-center mb-12">
              <div className="w-20 h-20 bg-black rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-2xl rotate-12"><Lock className="text-white" size={32} /></div>
              <h3 className="text-3xl font-black tracking-tighter">{t('admin_panel')}</h3>
            </div>
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Username</label>
                <input type="text" required value={loginForm.username} onChange={e => setLoginForm({...loginForm, username: e.target.value})} className="w-full px-6 py-5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-black font-bold"/>
              </div>
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Password</label>
                <input type="password" required value={loginForm.password} onChange={e => setLoginForm({...loginForm, password: e.target.value})} className="w-full px-6 py-5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-black font-bold"/>
              </div>
              {loginError && <p className="text-red-500 text-sm font-black text-center">{loginError}</p>}
              <button type="submit" className="w-full bg-black text-white py-5 rounded-2xl font-black text-xl active:scale-95 transition">SIGN IN</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
