
import React from 'react';
import { Plus, ShoppingBag } from 'lucide-react';
import { Product, Language } from '../types';

interface ProductGridProps {
  products: Product[];
  addToCart: (product: Product) => void;
  lang: Language;
  t: (key: string) => string;
}

const ProductGrid: React.FC<ProductGridProps> = ({ products, addToCart, lang, t }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <div 
          key={product.id} 
          onClick={() => product.stock > 0 && addToCart(product)}
          className={`group bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 flex flex-col cursor-pointer ${product.stock === 0 ? 'opacity-60 grayscale' : ''}`}
        >
          <div className="relative aspect-[4/5] overflow-hidden bg-gray-50">
            <img 
              src={product.image} 
              alt={product.name[lang]} 
              className="w-full h-full object-cover group-hover:scale-110 transition duration-700 ease-out"
            />
            
            {/* Overlay button visible on hover */}
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
               <div className="bg-white text-black px-6 py-3 rounded-full font-bold shadow-2xl flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <Plus size={20} />
                  {t('add_to_cart')}
               </div>
            </div>

            <div className="absolute top-4 left-4">
              {product.stock === 0 ? (
                <span className="bg-red-500 text-white text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-lg">
                  {t('out_of_stock')}
                </span>
              ) : product.stock <= 5 ? (
                <span className="bg-orange-500 text-white text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-lg">
                  {t('low_stock')}
                </span>
              ) : null}
            </div>
          </div>
          
          <div className="p-6 text-center">
            <h3 className="font-black text-xl text-gray-900 tracking-tight group-hover:text-black transition">
              {product.name[lang]}
            </h3>
            {/* Price kept but secondary as requested (primarily Name/Image) */}
            <p className="text-gray-400 font-bold mt-1">
              {product.price.toLocaleString()} IQD
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductGrid;
