import React, { useState } from 'react';
import { 
  ShoppingCart, User, Search, Menu, X, ChevronRight, Package, Clock, 
  Bell, Settings, HelpCircle, LogOut, FileText, Info, Mail, Phone, 
  MapPin, Shield, ChevronDown, CheckCircle, AlertCircle, Trash2 
} from 'lucide-react';

// --- MOCK DATA ---
const PRODUCTS = [
  {
    id: 1,
    name: "BIOFLU",
    genericName: "PHENYLEPHRINE HCl CHLORPHENAMINE MALEATE PARACETAMOL",
    price: 8.75,
    quantity: 5,
    date: "2023-10-25"
  }
];

const FAQS = [
  { question: "How do I track my order?", answer: "Go to 'Checkout History' to view the status of your recent purchases." },
  { question: "What is the return policy?", answer: "Returns are accepted within 7 days of purchase with a valid receipt." },
  { question: "Can I change my delivery address?", answer: "Yes, you can update your address in the 'Account Information' tab before an order is shipped." }
];

const INITIAL_NOTIFICATIONS = [
  { id: 1, title: "Order Shipped", message: "Your order #12345 is on its way!", type: "success", time: "2 hours ago" },
  { id: 2, title: "Price Drop Alert", message: "Bioflu is now 10% off for a limited time.", type: "info", time: "1 day ago" },
  { id: 3, title: "Payment Method Expiring", message: "Your card ending in 4242 expires soon.", type: "warning", time: "3 days ago" },
];

export default function App() {
  const [activeTab, setActiveTab] = useState('Checkout History');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // State for specific tabs
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [openFaqIndex, setOpenFaqIndex] = useState(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    username: "username",
    email: "user@example.com",
    phone: "+63 912 345 6789",
    address: "123 Mabini St, Cebu City, Philippines"
  });
  const [settings, setSettings] = useState({
    emailAlerts: true,
    smsAlerts: false,
    twoFactor: true,
    promoEmails: false
  });

  // Handlers
  const handleDismissNotification = (id) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const toggleSetting = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleProfileSave = (e) => {
    e.preventDefault();
    setIsEditingProfile(false);
    // In a real app, API call here
  };

  // --- CONTENT RENDERERS ---

  const renderAccountInfo = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-gray-700 font-medium">Personal Details</h3>
        <button 
          onClick={() => setIsEditingProfile(!isEditingProfile)}
          className={`text-xs px-4 py-2 rounded-full font-semibold transition-colors ${isEditingProfile ? 'bg-red-50 text-red-500' : 'bg-cyan-50 text-cyan-600'}`}
        >
          {isEditingProfile ? 'Cancel' : 'Edit Profile'}
        </button>
      </div>

      <form onSubmit={handleProfileSave} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Username</label>
          <div className="relative">
            <User className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
            <input 
              type="text" 
              disabled={!isEditingProfile}
              value={profileData.username}
              onChange={(e) => setProfileData({...profileData, username: e.target.value})}
              className={`w-full pl-10 pr-4 py-2.5 rounded-lg border ${isEditingProfile ? 'border-cyan-300 bg-white focus:ring-2 focus:ring-cyan-100' : 'border-gray-200 bg-gray-50 text-gray-500'}`}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
            <input 
              type="email" 
              disabled={!isEditingProfile}
              value={profileData.email}
              onChange={(e) => setProfileData({...profileData, email: e.target.value})}
              className={`w-full pl-10 pr-4 py-2.5 rounded-lg border ${isEditingProfile ? 'border-cyan-300 bg-white focus:ring-2 focus:ring-cyan-100' : 'border-gray-200 bg-gray-50 text-gray-500'}`}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Phone Number</label>
          <div className="relative">
            <Phone className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
            <input 
              type="text" 
              disabled={!isEditingProfile}
              value={profileData.phone}
              onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
              className={`w-full pl-10 pr-4 py-2.5 rounded-lg border ${isEditingProfile ? 'border-cyan-300 bg-white focus:ring-2 focus:ring-cyan-100' : 'border-gray-200 bg-gray-50 text-gray-500'}`}
            />
          </div>
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Delivery Address</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
            <input 
              type="text" 
              disabled={!isEditingProfile}
              value={profileData.address}
              onChange={(e) => setProfileData({...profileData, address: e.target.value})}
              className={`w-full pl-10 pr-4 py-2.5 rounded-lg border ${isEditingProfile ? 'border-cyan-300 bg-white focus:ring-2 focus:ring-cyan-100' : 'border-gray-200 bg-gray-50 text-gray-500'}`}
            />
          </div>
        </div>

        {isEditingProfile && (
          <div className="md:col-span-2 flex justify-end mt-4">
            <button type="submit" className="bg-cyan-500 hover:bg-cyan-600 text-white px-8 py-2.5 rounded-lg font-bold shadow-sm transition-all">
              Save Changes
            </button>
          </div>
        )}
      </form>
    </div>
  );

  const renderNotifications = () => (
    <div className="space-y-4">
      {notifications.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <Bell className="w-12 h-12 mx-auto mb-3 opacity-20" />
          <p>You're all caught up! No new notifications.</p>
        </div>
      ) : (
        notifications.map((notif) => (
          <div key={notif.id} className="flex items-start gap-4 p-4 border border-gray-100 rounded-xl hover:shadow-md transition-shadow bg-white group">
            <div className={`mt-1 p-2 rounded-full flex-shrink-0 
              ${notif.type === 'success' ? 'bg-green-100 text-green-600' : 
                notif.type === 'warning' ? 'bg-yellow-100 text-yellow-600' : 
                'bg-blue-100 text-blue-600'}`}>
              {notif.type === 'success' ? <CheckCircle size={16} /> : 
               notif.type === 'warning' ? <AlertCircle size={16} /> : 
               <Info size={16} />}
            </div>
            <div className="flex-grow">
              <div className="flex justify-between items-start">
                <h4 className="font-bold text-gray-800 text-sm">{notif.title}</h4>
                <span className="text-[10px] text-gray-400 font-medium">{notif.time}</span>
              </div>
              <p className="text-gray-500 text-sm mt-1 leading-relaxed">{notif.message}</p>
            </div>
            <button 
              onClick={() => handleDismissNotification(notif.id)}
              className="text-gray-300 hover:text-red-400 p-1 transition-colors opacity-0 group-hover:opacity-100"
              title="Dismiss"
            >
              <X size={16} />
            </button>
          </div>
        ))
      )}
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Bell size={16} /> Notification Preferences
        </h3>
        <div className="space-y-4 bg-gray-50 p-4 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-700">Email Notifications</p>
              <p className="text-xs text-gray-500">Receive order updates via email</p>
            </div>
            <button 
              onClick={() => toggleSetting('emailAlerts')}
              className={`w-11 h-6 flex items-center rounded-full p-1 duration-300 ease-in-out ${settings.emailAlerts ? 'bg-cyan-500' : 'bg-gray-300'}`}
            >
              <div className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ease-in-out ${settings.emailAlerts ? 'translate-x-5' : ''}`}></div>
            </button>
          </div>
          <hr className="border-gray-200" />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-700">SMS Alerts</p>
              <p className="text-xs text-gray-500">Receive updates on your mobile</p>
            </div>
            <button 
              onClick={() => toggleSetting('smsAlerts')}
              className={`w-11 h-6 flex items-center rounded-full p-1 duration-300 ease-in-out ${settings.smsAlerts ? 'bg-cyan-500' : 'bg-gray-300'}`}
            >
              <div className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ease-in-out ${settings.smsAlerts ? 'translate-x-5' : ''}`}></div>
            </button>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Shield size={16} /> Security
        </h3>
        <div className="space-y-4 bg-gray-50 p-4 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-700">Two-Factor Authentication</p>
              <p className="text-xs text-gray-500">Add an extra layer of security</p>
            </div>
            <button 
              onClick={() => toggleSetting('twoFactor')}
              className={`w-11 h-6 flex items-center rounded-full p-1 duration-300 ease-in-out ${settings.twoFactor ? 'bg-cyan-500' : 'bg-gray-300'}`}
            >
              <div className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ease-in-out ${settings.twoFactor ? 'translate-x-5' : ''}`}></div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderFAQs = () => (
    <div className="space-y-3">
      {FAQS.map((faq, index) => (
        <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
          <button 
            onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
            className="w-full flex justify-between items-center p-4 bg-white hover:bg-gray-50 text-left transition-colors"
          >
            <span className="font-medium text-gray-700 text-sm">{faq.question}</span>
            <ChevronDown size={16} className={`text-gray-400 transform transition-transform ${openFaqIndex === index ? 'rotate-180' : ''}`} />
          </button>
          {openFaqIndex === index && (
            <div className="p-4 bg-gray-50 text-sm text-gray-600 border-t border-gray-100 leading-relaxed">
              {faq.answer}
            </div>
          )}
        </div>
      ))}
    </div>
  );

  const renderHelp = () => (
    <div className="grid md:grid-cols-2 gap-8">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-bold text-gray-800 mb-2">How can we help?</h3>
          <p className="text-gray-500 text-sm">Send us a message and we'll get back to you within 24 hours.</p>
        </div>
        
        <form className="space-y-4">
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase">Subject</label>
            <select className="w-full mt-1 p-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 focus:ring-2 focus:ring-cyan-100 outline-none">
              <option>Order Issue</option>
              <option>Product Inquiry</option>
              <option>Technical Support</option>
              <option>Other</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase">Message</label>
            <textarea 
              rows={4}
              className="w-full mt-1 p-3 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-cyan-100 outline-none resize-none"
              placeholder="Describe your issue here..."
            ></textarea>
          </div>
          <button className="bg-cyan-500 text-white font-bold py-2.5 px-6 rounded-lg hover:bg-cyan-600 transition-colors shadow-sm w-full md:w-auto">
            Send Message
          </button>
        </form>
      </div>

      <div className="bg-cyan-50 p-6 rounded-xl h-fit">
        <h4 className="font-bold text-cyan-800 mb-4">Contact Information</h4>
        <div className="space-y-4 text-sm">
          <div className="flex items-center gap-3 text-cyan-700">
            <Mail size={18} />
            <span>support@meditrack.com</span>
          </div>
          <div className="flex items-center gap-3 text-cyan-700">
            <Phone size={18} />
            <span>+63 (02) 8123 4567</span>
          </div>
          <div className="flex items-center gap-3 text-cyan-700">
            <MapPin size={18} />
            <span>Manila, Philippines</span>
          </div>
        </div>
      </div>
    </div>
  );

  // --- MAIN RENDERER ---
  const renderContent = () => {
    switch (activeTab) {
      case 'Account Information': return renderAccountInfo();
      case 'Checkout History':
        return (
          <div className="space-y-4">
            {PRODUCTS.map((product) => (
              <div key={product.id} className="flex flex-col sm:flex-row items-center bg-white border border-gray-100 p-4 rounded-lg shadow-sm">
                <div className="w-24 h-24 flex-shrink-0 bg-blue-50 rounded-md flex items-center justify-center overflow-hidden mr-0 sm:mr-6 mb-4 sm:mb-0">
                   <div className="text-center p-2">
                      <div className="bg-[#005792] text-white text-[10px] font-bold p-1 rounded">BIOFLU</div>
                      <div className="text-[8px] text-gray-500 mt-1">Tablet</div>
                   </div>
                </div>
                <div className="flex-grow text-center sm:text-left">
                  <h3 className="font-bold text-gray-800 text-lg">{product.name}</h3>
                  <p className="text-gray-500 text-xs mt-1">₱ {product.price.toFixed(2)} x {product.quantity}</p>
                  <button className="mt-3 px-6 py-1.5 border border-cyan-500 text-cyan-600 text-xs font-semibold rounded-full hover:bg-cyan-50 transition-colors">
                    Details
                  </button>
                </div>
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
                    <button className="flex-1 py-2 border border-cyan-500 text-cyan-500 text-xs font-bold rounded hover:bg-red-50 hover:text-red-500 hover:border-red-500 transition-colors">Remove</button>
                    <button className="flex-1 py-2 bg-cyan-500 text-white text-xs font-bold rounded shadow-md hover:bg-cyan-600 transition-colors">Add to Cart</button>
                 </div>
              </div>
             ))}
          </div>
        );
      case 'Notifications': return renderNotifications();
      case 'Settings': return renderSettings();
      case 'Help': return renderHelp();
      case 'FAQs': return renderFAQs();
      case 'Logout': 
        return (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <LogOut className="text-red-500" size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Are you sure?</h3>
            <p className="text-gray-500 mb-6">You will be returned to the login screen.</p>
            <div className="flex justify-center gap-4">
              <button onClick={() => setActiveTab('Checkout History')} className="px-6 py-2 rounded-lg border border-gray-300 font-medium hover:bg-gray-50">Cancel</button>
              <button className="px-6 py-2 rounded-lg bg-red-500 text-white font-medium hover:bg-red-600 shadow-md">Confirm Logout</button>
            </div>
          </div>
        );
      default: return null;
    }
  };

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

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      <header className="bg-white py-4 px-4 sm:px-8 border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-cyan-500 p-1.5 rounded-lg">
              <div className="text-white font-bold text-xl leading-none">M</div>
            </div>
            <span className="text-xl sm:text-2xl font-bold text-cyan-600 tracking-tight">MediTrack+</span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-gray-600">
            <a href="#" className="hover:text-cyan-600 transition-colors">Home</a>
            <a href="#" className="hover:text-cyan-600 transition-colors">Search</a>
            <a href="#" className="hover:text-cyan-600 transition-colors">Contact</a>
          </nav>
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-gray-100 rounded-full text-gray-600"><ShoppingCart size={20} /></button>
            <button className="p-2 hover:bg-gray-100 rounded-full text-gray-600 border border-gray-300"><User size={20} /></button>
            <button className="md:hidden p-2 hover:bg-gray-100 rounded-full text-gray-600" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
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
        <div className="bg-[#00BCD4] text-white p-4 sm:p-5 rounded-2xl shadow-sm mb-8 flex items-center justify-between">
          <h1 className="text-xl font-bold tracking-wide">My Cart / Profile</h1>
          <span className="text-xs bg-white/20 px-3 py-1 rounded-full">{activeTab}</span>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-1/4">
            <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-24">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex-shrink-0 flex items-center justify-center text-gray-400">
                  <User size={32} />
                </div>
                <div>
                  <h2 className="font-bold text-lg text-gray-800">{profileData.username}</h2>
                  <p className="text-xs text-gray-500 truncate w-24">{profileData.email}</p>
                </div>
              </div>
              <hr className="border-gray-100 mb-4" />
              <nav className="flex flex-col gap-1">
                {navItems.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => setActiveTab(item.name)}
                    className={`text-left px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 flex items-center gap-3 group
                      ${activeTab === item.name ? 'text-cyan-600 bg-cyan-50' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}
                      ${item.name === 'Logout' ? 'mt-4 text-red-500 hover:bg-red-50 hover:text-red-600' : ''}
                    `}
                  >
                    <item.icon size={18} className={activeTab === item.name ? 'text-cyan-500' : ''} />
                    <span>{item.name}</span>
                    {item.name === 'Notifications' && notifications.length > 0 && (
                      <span className="ml-auto w-2 h-2 bg-red-500 rounded-full"></span>
                    )}
                    {activeTab === item.name && <ChevronRight size={16} className="ml-auto text-cyan-400" />}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          <div className="w-full md:w-3/4">
            <div className="bg-white rounded-2xl shadow-sm p-6 min-h-[600px] transition-all duration-300">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-800">{activeTab}</h2>
                  <p className="text-xs text-gray-400 mt-1">Manage your {activeTab.toLowerCase()}</p>
                </div>
              </div>
              <hr className="border-gray-100 mb-6" />
              <div className="animate-fade-in">{renderContent()}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
