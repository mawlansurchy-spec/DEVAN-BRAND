
import React from 'react';
import { Search, Globe, User, ShoppingBag, Lock, Unlock } from 'lucide-react';
import { Language } from '../types';

interface HeaderProps {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  cartCount?: number;
  onCartClick?: () => void;
  isAuthenticated: boolean;
  onLoginClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  lang, 
  setLang, 
  t, 
  searchQuery, 
  setSearchQuery, 
  cartCount = 0, 
  onCartClick,
  isAuthenticated,
  onLoginClick
}) => {
  const langs: { id: Language; label: string }[] = [
    { id: 'ku', label: 'کوردی' },
    { id: 'ar', label: 'العربية' },
    { id: 'en', label: 'English' },
  ];

  return (
    <header className="bg-white border-b px-4 md:px-8 py-4 flex flex-col md:flex-row gap-4 items-center justify-between sticky top-0 z-40">
      <div className="relative w-full md:w-96">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input
          type="text"
          placeholder={t('search')}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-gray-100 border-transparent focus:bg-white focus:border-black focus:ring-0 rounded-xl transition"
        />
      </div>

      <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
        <div className="flex bg-gray-100 p-1 rounded-xl">
          {langs.map((l) => (
            <button
              key={l.id}
              onClick={() => setLang(l.id)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                lang === l.id ? 'bg-white shadow-sm text-black' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>
        
        <div className="flex items-center gap-4">
          {cartCount > 0 && (
            <button 
              onClick={onCartClick}
              className="relative p-2 bg-gray-100 rounded-xl hover:bg-black hover:text-white transition group"
            >
              <ShoppingBag size={20} />
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white group-hover:scale-110 transition">
                {cartCount}
              </span>
            </button>
          )}

          <div className="flex items-center gap-3 border-l pl-4 ml-2">
            <button 
              onClick={onLoginClick}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition overflow-hidden group ${isAuthenticated ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-400'}`}
            >
              {isAuthenticated ? <Unlock size={20} /> : <User size={20} />}
            </button>
            <div className="hidden md:block">
              <p className="text-xs font-bold text-gray-900 leading-none">
                {isAuthenticated ? 'Devan Admin' : 'Blak User'}
              </p>
              <p className="text-[10px] text-gray-400 uppercase tracking-tighter">
                {isAuthenticated ? 'Management' : 'Shop View'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
