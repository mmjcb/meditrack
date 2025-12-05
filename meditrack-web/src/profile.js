import React, { useState } from 'react';
import { ShoppingCart, User, Search, Menu, X, ChevronRight, Package, Clock, Bell, Settings, HelpCircle, LogOut, FileText, Info } from 'lucide-react';

// Mock Data
const PRODUCTS = [
  {
    id: 1,
    name: "BIOFLU",
    genericName: "PHENYLEPHRINE HCl CHLORPHENAMINE MALEATE PARACETAMOL",
    price: 8.75,
    image: "https://rxglobal.com/sites/default/files/styles/product_image_og/public/product-images/Bioflu%20Tablet%20500%20mg_0.png?itok=3jOqHqX_", // Placeholder or use a generic pill image if this fails
    quantity: 5,
    date: "2023-10-25"
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState('Checkout History');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Navigation Items
  const navItems = [
    { name: 'Account Information', icon: User },
    { name: 'Checkout History', icon: Clock },
    { name: 'Reserve', icon: Package },
    { name: 'Notifications', icon: Bell },
    { name: 'Settings', icon: Settings },
    { name: 'Help', icon: HelpCircle },
    { name: 'FAQs', icon: FileText },
    { name: 'Logout', icon: LogOut, className: 'mt-4' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'Checkout History':
        return (
          <div className="space-y-4">
            {PRODUCTS.map((product) => (
              <div key={product.id} className="flex flex-col sm:flex-row items-center bg-white border border-gray-100 p-4 rounded-lg shadow-sm">
                {/* Product Image */}
                <div className="w-24 h-24 flex-shrink-0 bg-blue-50 rounded-md flex items-center justify-center overflow-hidden mr-0 sm:mr-6 mb-4 sm:mb-0">
                   {/* Fallback visual if image fails */}
                   <div className="text-center p-2">
                      <div className="bg-[#005792] text-white text-[10px] font-bold p-1 rounded">BIOFLU</div>
                      <div className="text-[8px] text-gray-500 mt-1">Tablet</div>
                   </div>
                </div>
                
                {/* Details */}
                <div className="flex-grow text-center sm:text-left">
                  <h3 className="font-bold text-gray-800 text-lg">{product.name}</h3>
                  <p className="text-gray-500 text-xs mt-1">₱ {product.price.toFixed(2)} x {product.quantity}</p>
                  <button className="mt-3 px-6 py-1.5 border border-cyan-500 text-cyan-600 text-xs font-semibold rounded-full hover:bg-cyan-50 transition-colors">
                    Details
                  </button>
                </div>

                {/* Total */}
                <div className="mt-4 sm:mt-0 text-right min-w-[100px]">
                  <p className="text-xs text-gray-400 mb-1">Total</p>
                  <p className="text-xl font-bold text-cyan-500">₱ {(product.price * product.quantity).toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        );
      
      case 'Reserve':
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
             {PRODUCTS.map((product) => (
              <div key={product.id} className="bg-white border border-gray-100 p-4 rounded-lg shadow-sm flex flex-col items-center text-center">
                 <div className="w-full aspect-video bg-blue-50 rounded-md mb-4 flex items-center justify-center overflow-hidden relative">
                    {/* Visual styling to mimic the medicine packet */}
                     <div className="w-3/4 h-3/4 bg-gradient-to-br from-blue-600 to-blue-800 rounded shadow-md flex flex-col items-center justify-center p-2 text-white">
                        <span className="font-bold text-sm tracking-wider">BIOFLU</span>
                        <span className="text-[6px] text-center opacity-80 mt-1 leading-tight">{product.genericName}</span>
                     </div>
                     <div className="absolute bottom-2 right-2 bg-cyan-400 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                       ₱ {product.price.toFixed(2)}
                     </div>
                 </div>

                 <h3 className="font-bold text-gray-800 self-start">{product.name}</h3>
                 
                 <div className="w-full mt-4 flex gap-2">
                    <button className="flex-1 py-2 border border-cyan-500 text-cyan-500 text-xs font-bold rounded hover:bg-red-50 hover:text-red-500 hover:border-red-500 transition-colors">
                      Remove
                    </button>
                    <button className="flex-1 py-2 bg-cyan-500 text-white text-xs font-bold rounded shadow-md hover:bg-cyan-600 transition-colors">
                      Add to Cart
                    </button>
                 </div>
              </div>
             ))}
          </div>
        );

      default:
        return (
          <div className="text-center py-20 text-gray-400">
            <Info className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Content for {activeTab} is currently under development.</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      
      {/* Header */}
      <header className="bg-white py-4 px-4 sm:px-8 border-b border-gray-200">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="bg-cyan-500 p-1.5 rounded-lg">
              <div className="text-white font-bold text-xl leading-none">M</div>
            </div>
            <span className="text-xl sm:text-2xl font-bold text-cyan-600 tracking-tight">MediTrack+</span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-gray-600">
            <a href="#" className="hover:text-cyan-600 transition-colors">Home</a>
            <a href="#" className="hover:text-cyan-600 transition-colors">Search</a>
            <a href="#" className="hover:text-cyan-600 transition-colors">Contact</a>
          </nav>

          {/* Icons */}
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-gray-100 rounded-full text-gray-600">
              <ShoppingCart size={20} />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full text-gray-600 border border-gray-300">
              <User size={20} />
            </button>
            <button 
              className="md:hidden p-2 hover:bg-gray-100 rounded-full text-gray-600"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
        
        {/* Mobile Nav Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 border-t pt-4">
             <div className="flex flex-col gap-3 text-center font-medium text-gray-600">
                <a href="#" className="hover:text-cyan-600">Home</a>
                <a href="#" className="hover:text-cyan-600">Search</a>
                <a href="#" className="hover:text-cyan-600">Contact</a>
             </div>
          </div>
        )}
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        
        {/* Banner */}
        <div className="bg-[#00BCD4] text-white p-4 sm:p-5 rounded-2xl shadow-sm mb-8">
          <h1 className="text-xl font-bold tracking-wide">My Cart</h1> 
          {/* Note: Kept 'My Cart' to match prototype text, though functionally this looks like a Profile page */}
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          
          {/* Sidebar */}
          <div className="w-full md:w-1/4">
            <div className="bg-white rounded-2xl shadow-sm p-6">
              
              {/* Profile Header */}
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex-shrink-0"></div>
                <div>
                  <h2 className="font-bold text-lg text-gray-800">username</h2>
                </div>
              </div>
              
              <hr className="border-gray-100 mb-4" />

              {/* Navigation Links */}
              <nav className="flex flex-col gap-1">
                {navItems.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => setActiveTab(item.name)}
                    className={`text-left px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 flex items-center justify-between group
                      ${activeTab === item.name 
                        ? 'text-cyan-500 bg-transparent' 
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                  >
                    <span className={item.name === 'Logout' ? 'mt-4' : ''}>{item.name}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="w-full md:w-3/4">
            <div className="bg-white rounded-2xl shadow-sm p-6 min-h-[500px]">
              <div className="mb-6">
                <h2 className="text-lg font-bold text-gray-800">{activeTab}</h2>
                <hr className="border-gray-200 mt-4" />
              </div>
              
              <div className="animate-fade-in">
                {renderContent()}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
