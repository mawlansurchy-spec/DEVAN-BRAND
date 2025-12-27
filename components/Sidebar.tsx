
import React from 'react';
import { ShoppingBag, LayoutGrid, History, ShieldCheck, Lock, LogOut } from 'lucide-react';
import { View } from '../types';

interface SidebarProps {
  view: View;
  setView: (view: View) => void;
  t: (key: string) => string;
  isRtl: boolean;
  isAuthenticated: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ view, setView, t, isRtl, isAuthenticated }) => {
  const menuItems = [
    { id: 'shop', icon: <ShoppingBag size={24} />, label: t('shop_name'), restricted: false },
    { id: 'pos', icon: <LayoutGrid size={24} />, label: t('pos'), restricted: true },
    { id: 'orders', icon: <History size={24} />, label: t('invoice'), restricted: true },
    { id: 'admin', icon: <ShieldCheck size={24} />, label: t('admin_panel'), restricted: true },
  ];

  const visibleItems = menuItems.filter(item => !item.restricted || isAuthenticated);

  return (
    <aside className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t md:relative md:w-80 md:border-t-0 md:border-r md:h-screen p-4 md:p-8 flex flex-col justify-between shadow-[0_-10px_40px_rgba(0,0,0,0.05)] md:shadow-none">
      <div>
        <div className="hidden md:flex items-center gap-4 mb-16">
          <div className="w-14 h-14 bg-black rounded-3xl flex items-center justify-center shadow-xl rotate-3">
            <span className="text-white font-black text-2xl">D</span>
          </div>
          <div className="flex flex-col">
            <h1 className="font-black text-2xl tracking-tighter leading-none">DEVAN</h1>
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mt-1">BRAND</span>
          </div>
        </div>

        <nav className="flex md:flex-col justify-around md:justify-start gap-3">
          {visibleItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setView(item.id as View)}
              className={`flex flex-col md:flex-row items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 ${
                view === item.id 
                  ? 'bg-black text-white shadow-[0_15px_30px_rgba(0,0,0,0.2)] scale-105' 
                  : 'text-gray-400 hover:text-black hover:bg-gray-50'
              }`}
            >
              <div className={`${view === item.id ? 'text-white' : 'text-gray-300'}`}>
                {item.icon}
              </div>
              <span className="text-[10px] md:text-base font-bold whitespace-nowrap tracking-tight">{item.label}</span>
            </button>
          ))}
          
          {!isAuthenticated && (
             <button
               onClick={() => setView('admin')}
               className="hidden md:flex flex-col md:flex-row items-center gap-4 px-6 py-4 rounded-2xl transition-all text-gray-200 hover:text-gray-400 hover:bg-gray-50 group mt-4 border border-dashed border-gray-100"
             >
               <Lock size={20} className="group-hover:rotate-12 transition-transform" />
               <span className="text-sm font-bold opacity-40">Admin Dashboard</span>
             </button>
          )}
        </nav>
      </div>

      <div className="hidden md:block">
        <div className="p-6 bg-gray-50 rounded-[2rem] border border-gray-100">
           <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Support 24/7</p>
           <p className="text-sm font-bold text-gray-900 leading-tight">Need assistance? <br/>Call: 0750 000 00 00</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
