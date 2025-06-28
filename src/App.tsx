import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Cloud, 
  TrendingUp, 
  Clipboard, 
  Heart, 
  ShoppingCart, 
  Truck, 
  Phone, 
  MapPin, 
  Calendar, 
  DollarSign, 
  Thermometer, 
  Droplets, 
  Sun, 
  CloudRain,
  Leaf,
  Settings,
  User,
  Home,
  BarChart3,
  MessageSquare,
  Bell,
  Search,
  Plus,
  Camera,
  Upload,
  Download,
  Wifi,
  Globe,
  Sparkles,
  Zap,
  Star,
  Bot,
  Mic,
  Send,
  X
} from 'lucide-react';

import './i18n';
import { initDB, storeData, getAllData } from './utils/storage';
import { getNetworkStatus, isSlowConnection, addNetworkListeners } from './utils/network';
import { syncData, startAutoSync, queueForSync } from './utils/sync';
import OfflineIndicator from './components/OfflineIndicator';
import PaymentModal from './components/PaymentModal';
import LazyImage from './components/LazyImage';

const AgriMasterApp = () => {
  const { t, i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [user, setUser] = useState({ name: 'John Farmer', location: 'Nairobi, Kenya' });
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isSyncing, setIsSyncing] = useState(false);
  const [slowConnection, setSlowConnection] = useState(false);
  const [paymentModal, setPaymentModal] = useState<{isOpen: boolean; amount: number; description: string} | null>(null);
  const [showAIChat, setShowAIChat] = useState(false);
  const [aiMessages, setAiMessages] = useState([
    { id: 1, type: 'ai', message: 'Hello! I\'m your AgriMaster AI assistant. How can I help you today?', timestamp: Date.now() }
  ]);
  const [aiInput, setAiInput] = useState('');
  const [isAiTyping, setIsAiTyping] = useState(false);
  
  const [crops, setCrops] = useState([
    { id: 1, name: 'Maize', area: 5, plantDate: '2024-03-15', status: 'Growing', health: 85, synced: true, lastModified: Date.now() },
    { id: 2, name: 'Beans', area: 2, plantDate: '2024-04-01', status: 'Flowering', health: 92, synced: true, lastModified: Date.now() },
    { id: 3, name: 'Tomatoes', area: 1.5, plantDate: '2024-04-20', status: 'Harvesting', health: 78, synced: true, lastModified: Date.now() }
  ]);
  
  const [livestock, setLivestock] = useState([
    { id: 1, type: 'Cattle', count: 15, lastCheckup: '2024-06-20', health: 'Good', synced: true, lastModified: Date.now() },
    { id: 2, type: 'Chickens', count: 50, lastCheckup: '2024-06-25', health: 'Excellent', synced: true, lastModified: Date.now() },
    { id: 3, type: 'Goats', count: 8, lastCheckup: '2024-06-18', health: 'Fair', synced: true, lastModified: Date.now() }
  ]);
  
  const [weather, setWeather] = useState({
    temperature: 24,
    humidity: 68,
    rainfall: 'Light rain expected',
    forecast: 'Partly cloudy with occasional showers'
  });

  const [balance, setBalance] = useState(15750);
  const [transactions, setTransactions] = useState([
    { id: 1, type: 'credit', amount: 12000, description: 'Tomato sales', date: '2024-06-25', method: 'M-Pesa' },
    { id: 2, type: 'debit', amount: 8000, description: 'Fertilizer purchase', date: '2024-06-22', method: 'M-Pesa' },
    { id: 3, type: 'credit', amount: 5500, description: 'Maize sales', date: '2024-06-20', method: 'EcoCash' }
  ]);

  const marketPrices = [
    { crop: 'Maize', price: 45, unit: 'per 90kg bag', trend: 'up', change: '+5%' },
    { crop: 'Beans', price: 120, unit: 'per 90kg bag', trend: 'up', change: '+8%' },
    { crop: 'Tomatoes', price: 80, unit: 'per crate', trend: 'down', change: '-3%' },
    { crop: 'Onions', price: 60, unit: 'per 50kg bag', trend: 'up', change: '+12%' }
  ];

  const farmActivities = [
    { date: '2024-06-28', activity: 'Applied fertilizer to maize field', cost: 15000 },
    { date: '2024-06-25', activity: 'Harvested tomatoes - 150kg', income: 12000 },
    { date: '2024-06-22', activity: 'Veterinary checkup for cattle', cost: 8000 },
    { date: '2024-06-20', activity: 'Purchased chicken feed', cost: 5500 }
  ];

  // Particle background component
  const ParticleBackground = () => (
    <div className="particles">
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="particle"
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 20}s`,
            animationDuration: `${15 + Math.random() * 10}s`
          }}
        />
      ))}
    </div>
  );

  // Initialize app
  useEffect(() => {
    const initializeApp = async () => {
      await initDB();
      startAutoSync();
      
      // Load data from local storage
      try {
        const storedCrops = await getAllData('crops');
        const storedLivestock = await getAllData('livestock');
        
        if (storedCrops.length > 0) setCrops(storedCrops);
        if (storedLivestock.length > 0) setLivestock(storedLivestock);
      } catch (error) {
        console.error('Failed to load stored data:', error);
      }
      
      // Check network status
      setSlowConnection(isSlowConnection());
    };

    initializeApp();
  }, []);

  // Network listeners
  useEffect(() => {
    const cleanup = addNetworkListeners(
      () => {
        setIsOnline(true);
        handleSync();
      },
      () => setIsOnline(false)
    );

    return cleanup;
  }, []);

  const handleSync = async () => {
    if (!isOnline) return;
    
    setIsSyncing(true);
    try {
      await syncData();
    } finally {
      setIsSyncing(false);
    }
  };

  const handlePayment = (amount: number, description: string) => {
    setPaymentModal({ isOpen: true, amount, description });
  };

  const handlePaymentSuccess = async (paymentData: any) => {
    const newTransaction = {
      id: Date.now(),
      type: 'debit' as const,
      amount: paymentData.amount,
      description: paymentData.description || 'Payment',
      date: new Date().toISOString().split('T')[0],
      method: paymentData.method
    };
    
    setTransactions(prev => [newTransaction, ...prev]);
    setBalance(prev => prev - paymentData.amount);
    setPaymentModal(null);
    
    // Queue for sync if offline
    if (!isOnline) {
      await queueForSync('CREATE_TRANSACTION', newTransaction);
    }
  };

  const addCrop = async (cropData: any) => {
    const newCrop = {
      ...cropData,
      id: Date.now(),
      lastModified: Date.now(),
      synced: false
    };
    
    setCrops(prev => [...prev, newCrop]);
    await storeData('crops', newCrop);
    
    if (!isOnline) {
      await queueForSync('CREATE_CROP', newCrop);
    }
  };

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const sendAiMessage = async () => {
    if (!aiInput.trim()) return;
    
    const userMessage = {
      id: Date.now(),
      type: 'user',
      message: aiInput,
      timestamp: Date.now()
    };
    
    setAiMessages(prev => [...prev, userMessage]);
    setAiInput('');
    setIsAiTyping(true);
    
    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "Based on your crop data, I recommend applying fertilizer to your maize field within the next week for optimal growth.",
        "The weather forecast shows rain in 2 days. This would be perfect for planting your bean seeds!",
        "Your tomato health score is 78%. Consider checking for pests and ensuring adequate watering.",
        "Market prices for beans are up 8% this week. It might be a good time to sell if you have mature crops.",
        "I notice your cattle haven't had a checkup in 8 days. Would you like me to help you schedule a veterinary visit?",
        "Your farm's profit margin this month is excellent! The beans are performing particularly well.",
        "Based on current weather patterns, I suggest harvesting your tomatoes before the expected heavy rains this weekend."
      ];
      
      const aiResponse = {
        id: Date.now() + 1,
        type: 'ai',
        message: responses[Math.floor(Math.random() * responses.length)],
        timestamp: Date.now()
      };
      
      setAiMessages(prev => [...prev, aiResponse]);
      setIsAiTyping(false);
    }, 2000);
  };

  const AIAssistant = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50">
      <div className="glass-card rounded-t-3xl w-full max-w-md h-[80vh] flex flex-col">
        {/* AI Chat Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/20">
          <div className="flex items-center space-x-3">
            <div className="p-3 glass-button rounded-full glow-blue">
              <Bot className="h-6 w-6 text-blue-400" />
            </div>
            <div>
              <h3 className="font-semibold text-white">AI Assistant</h3>
              <div className="text-xs text-gray-300">Always here to help</div>
            </div>
          </div>
          <button 
            onClick={() => setShowAIChat(false)}
            className="glass-button p-2 rounded-full hover-lift text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {aiMessages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] p-3 rounded-2xl ${
                msg.type === 'user' 
                  ? 'glass-card text-white' 
                  : 'glass-button text-white'
              }`}>
                <div className="text-sm">{msg.message}</div>
                <div className="text-xs opacity-70 mt-1">
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))}
          
          {isAiTyping && (
            <div className="flex justify-start">
              <div className="glass-button p-3 rounded-2xl">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Chat Input */}
        <div className="p-4 border-t border-white/20">
          <div className="flex space-x-3">
            <input
              type="text"
              value={aiInput}
              onChange={(e) => setAiInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendAiMessage()}
              placeholder="Ask me anything about farming..."
              className="flex-1 p-3 glass-button rounded-xl text-white placeholder-gray-400"
            />
            <button 
              onClick={sendAiMessage}
              className="glass-button p-3 rounded-xl hover-lift glow-blue text-white"
            >
              <Send className="h-5 w-5" />
            </button>
            <button className="glass-button p-3 rounded-xl hover-lift text-white">
              <Mic className="h-5 w-5" />
            </button>
          </div>
          
          {/* Quick Actions */}
          <div className="flex space-x-2 mt-3">
            <button 
              onClick={() => setAiInput('What should I plant next?')}
              className="glass-button px-3 py-1 rounded-full text-xs hover-lift text-white"
            >
              Planting advice
            </button>
            <button 
              onClick={() => setAiInput('Check my crop health')}
              className="glass-button px-3 py-1 rounded-full text-xs hover-lift text-white"
            >
              Health check
            </button>
            <button 
              onClick={() => setAiInput('Market analysis')}
              className="glass-button px-3 py-1 rounded-full text-xs hover-lift text-white"
            >
              Market tips
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const ContactsTab = () => (
    <div className="p-4 space-y-6">
      <h2 className="text-2xl font-bold text-white flex items-center">
        <Phone className="h-6 w-6 mr-2" />
        {t('contacts')}
      </h2>
      
      <div className="space-y-4">
        <div className="glass-card rounded-2xl p-6 hover-lift">
          <h3 className="font-semibold mb-4 text-green-400">Agricultural Extension</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-white">County Extension Officer</span>
              <div className="p-2 glass-button rounded-full glow-green">
                <Phone className="h-4 w-4 text-green-400" />
              </div>
            </div>
            <div className="text-sm text-gray-300">+254 712 345 678</div>
            <button className="w-full glass-button py-3 rounded-xl hover-lift ripple text-white">
              Call Now
            </button>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6 hover-lift">
          <h3 className="font-semibold mb-4 text-blue-400">Veterinary Services</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-white">24/7 Vet Helpline</span>
              <div className="p-2 glass-button rounded-full glow-blue">
                <Phone className="h-4 w-4 text-blue-400" />
              </div>
            </div>
            <div className="text-sm text-gray-300">+254 700 123 456</div>
            <button className="w-full glass-button py-3 rounded-xl hover-lift ripple text-white">
              Emergency Call
            </button>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6 hover-lift">
          <h3 className="font-semibold mb-4 text-orange-400">Market Information</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-white">Market Info Service</span>
              <div className="p-2 glass-button rounded-full glow-orange">
                <MessageSquare className="h-4 w-4 text-orange-400" />
              </div>
            </div>
            <div className="text-sm text-gray-300">SMS: 40404</div>
            <button className="w-full glass-button py-3 rounded-xl hover-lift ripple text-white">
              Get Updates
            </button>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6 hover-lift">
          <h3 className="font-semibold mb-4 text-purple-400">Financial Services</h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-white">AgriLoan Microfinance</span>
                <div className="p-2 glass-button rounded-full">
                  <Phone className="h-4 w-4 text-purple-400" />
                </div>
              </div>
              <div className="text-sm text-gray-300">+254 722 888 999</div>
            </div>
            <div>
              <div className="flex items-center justify-between">
                <span className="text-white">Crop Insurance</span>
                <div className="p-2 glass-button rounded-full">
                  <Phone className="h-4 w-4 text-purple-400" />
                </div>
              </div>
              <div className="text-sm text-gray-300">+254 733 111 222</div>
            </div>
            <button className="w-full glass-button py-3 rounded-xl hover-lift ripple text-white">
              Apply for Loan
            </button>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6 hover-lift">
          <h3 className="font-semibold mb-4 text-red-400">Emergency Contacts</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-white">Police</span>
              <div className="text-red-400 font-bold">999</div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white">Fire Department</span>
              <div className="text-red-400 font-bold">999</div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white">Medical Emergency</span>
              <div className="text-red-400 font-bold">999</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const DashboardTab = () => (
    <div className="p-4 space-y-6">
      {/* Weather Card with Glassmorphism */}
      <div className="glass-card rounded-2xl p-6 text-white relative overflow-hidden hover-lift card-hover">
        <div className="absolute inset-0 gradient-bg opacity-80"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-lg">{t('todaysWeather')}</h3>
            <div className="p-2 glass-button rounded-full">
              <CloudRain className="h-6 w-6" />
            </div>
          </div>
          <div className="flex items-center space-x-6 mb-4">
            <div className="text-4xl font-bold float">{weather.temperature}°C</div>
            <div className="text-sm opacity-90">
              <div className="flex items-center mb-1">
                <Droplets className="h-4 w-4 mr-2" />
                {t('humidity')}: {weather.humidity}%
              </div>
              <div>{weather.rainfall}</div>
            </div>
          </div>
          <div className="text-sm opacity-90 font-medium">{weather.forecast}</div>
        </div>
      </div>

      {/* Balance Card */}
      <div className="glass-card rounded-2xl p-6 text-white relative overflow-hidden hover-lift card-hover">
        <div className="absolute inset-0 gradient-green opacity-90"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-lg">{t('balance')}</h3>
            <div className="p-2 glass-button rounded-full glow-green">
              <DollarSign className="h-6 w-6" />
            </div>
          </div>
          <div className="text-4xl font-bold mb-4 float-delayed">KSH {balance.toLocaleString()}</div>
          <div className="flex space-x-3">
            <button 
              onClick={() => handlePayment(1000, 'Top up account')}
              className="flex-1 glass-button py-3 rounded-xl text-sm font-medium hover-lift ripple"
            >
              <Zap className="h-4 w-4 inline mr-2" />
              {t('topUp')}
            </button>
            <button 
              onClick={() => handlePayment(500, 'Send money')}
              className="flex-1 glass-button py-3 rounded-xl text-sm font-medium hover-lift ripple"
            >
              <Star className="h-4 w-4 inline mr-2" />
              {t('sendMoney')}
            </button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="glass-card rounded-2xl p-4 hover-lift card-hover">
          <div className="flex items-center">
            <div className="p-3 glass-button rounded-full glow-green mr-4">
              <Leaf className="h-8 w-8 text-green-400" />
            </div>
            <div>
              <div className="text-3xl font-bold text-white">{crops.length}</div>
              <div className="text-sm text-gray-300">{t('activeCrops')}</div>
            </div>
          </div>
        </div>
        <div className="glass-card rounded-2xl p-4 hover-lift card-hover">
          <div className="flex items-center">
            <div className="p-3 glass-button rounded-full glow-orange mr-4">
              <Heart className="h-8 w-8 text-orange-400" />
            </div>
            <div>
              <div className="text-3xl font-bold text-white">{livestock.reduce((sum, item) => sum + item.count, 0)}</div>
              <div className="text-sm text-gray-300">{t('livestock')}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="glass-card rounded-2xl p-6 hover-lift">
        <h3 className="font-semibold mb-4 flex items-center text-white">
          <div className="p-2 glass-button rounded-full mr-3">
            <Calendar className="h-5 w-5" />
          </div>
          {t('recentActivities')}
        </h3>
        <div className="space-y-3">
          {farmActivities.slice(0, 3).map((activity, index) => (
            <div key={index} className="glass-button rounded-xl p-4 hover-lift transition-all duration-300">
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-sm font-medium text-white">{activity.activity}</div>
                  <div className="text-xs text-gray-300">{activity.date}</div>
                </div>
                <div className={`text-sm font-bold ${activity.income ? 'text-green-400' : 'text-red-400'}`}>
                  {activity.income ? `+KSH ${activity.income}` : `-KSH ${activity.cost}`}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-3 gap-3">
        <button 
          onClick={() => setActiveTab('crops')}
          className="glass-button p-4 rounded-2xl text-center hover-lift ripple text-white"
        >
          <div className="p-3 glass rounded-full mx-auto mb-2 w-fit">
            <Leaf className="h-6 w-6" />
          </div>
          <div className="text-xs font-medium">{t('crops')}</div>
        </button>
        <button 
          onClick={() => setActiveTab('market')}
          className="glass-button p-4 rounded-2xl text-center hover-lift ripple text-white"
        >
          <div className="p-3 glass rounded-full mx-auto mb-2 w-fit">
            <TrendingUp className="h-6 w-6" />
          </div>
          <div className="text-xs font-medium">{t('market')}</div>
        </button>
        <button 
          onClick={() => setActiveTab('livestock')}
          className="glass-button p-4 rounded-2xl text-center hover-lift ripple text-white"
        >
          <div className="p-3 glass rounded-full mx-auto mb-2 w-fit">
            <Heart className="h-6 w-6" />
          </div>
          <div className="text-xs font-medium">{t('animals')}</div>
        </button>
      </div>
    </div>
  );

  const PaymentsTab = () => (
    <div className="p-4 space-y-6">
      <h2 className="text-2xl font-bold text-white flex items-center">
        <Sparkles className="h-6 w-6 mr-2" />
        {t('makePayment')}
      </h2>
      
      {/* Balance Display */}
      <div className="glass-card rounded-2xl p-6 text-white relative overflow-hidden hover-lift">
        <div className="absolute inset-0 gradient-green opacity-90"></div>
        <div className="relative z-10">
          <div className="text-sm opacity-90 mb-2">Available Balance</div>
          <div className="text-4xl font-bold float">KSH {balance.toLocaleString()}</div>
        </div>
      </div>

      {/* Quick Payment Options */}
      <div className="grid grid-cols-2 gap-4">
        <button 
          onClick={() => handlePayment(5000, 'Buy fertilizer')}
          className="glass-card p-6 rounded-2xl hover-lift ripple text-white"
        >
          <div className="p-3 glass-button rounded-full mx-auto mb-3 w-fit glow-blue">
            <ShoppingCart className="h-6 w-6" />
          </div>
          <div className="text-sm font-medium">Buy Inputs</div>
        </button>
        <button 
          onClick={() => handlePayment(2000, 'Pay transport')}
          className="glass-card p-6 rounded-2xl hover-lift ripple text-white"
        >
          <div className="p-3 glass-button rounded-full mx-auto mb-3 w-fit glow-orange">
            <Truck className="h-6 w-6" />
          </div>
          <div className="text-sm font-medium">Pay Transport</div>
        </button>
      </div>

      {/* Recent Transactions */}
      <div className="glass-card rounded-2xl p-6 hover-lift">
        <h3 className="font-semibold mb-4 text-white">{t('paymentHistory')}</h3>
        <div className="space-y-3">
          {transactions.slice(0, 5).map((transaction) => (
            <div key={transaction.id} className="glass-button rounded-xl p-4 hover-lift">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-sm text-white">{transaction.description}</div>
                  <div className="text-xs text-gray-300">{transaction.date} • {transaction.method}</div>
                </div>
                <div className={`font-bold ${transaction.type === 'credit' ? 'text-green-400' : 'text-red-400'}`}>
                  {transaction.type === 'credit' ? '+' : '-'}KSH {transaction.amount}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Services */}
      <div className="glass-card rounded-2xl p-6 hover-lift">
        <h3 className="font-semibold mb-4 text-white">Payment Services</h3>
        <div className="grid grid-cols-2 gap-3">
          <button 
            onClick={() => handlePayment(1000, 'Airtime purchase')}
            className="glass-button p-4 rounded-xl hover-lift ripple text-white"
          >
            <Phone className="h-6 w-6 mx-auto mb-2 text-blue-400" />
            <div className="text-xs">Buy Airtime</div>
          </button>
          <button 
            onClick={() => handlePayment(3000, 'Loan repayment')}
            className="glass-button p-4 rounded-xl hover-lift ripple text-white"
          >
            <DollarSign className="h-6 w-6 mx-auto mb-2 text-green-400" />
            <div className="text-xs">Pay Loan</div>
          </button>
        </div>
      </div>
    </div>
  );

  const SettingsTab = () => (
    <div className="p-4 space-y-6">
      <h2 className="text-2xl font-bold text-white flex items-center">
        <Settings className="h-6 w-6 mr-2" />
        {t('settings')}
      </h2>
      
      {/* Test Suite Section */}
      <div className="glass-card rounded-2xl p-6 hover-lift">
        <h3 className="font-semibold mb-4 flex items-center text-white">
          <div className="p-2 glass-button rounded-full mr-3">
            <Zap className="h-5 w-5" />
          </div>
          App Testing & Diagnostics
        </h3>
        <div className="space-y-3">
          <button 
            onClick={() => {
              import('./components/TestRunner').then(({ default: TestRunner }) => {
                // Create and show test runner modal
                const modal = document.createElement('div');
                modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
                modal.innerHTML = '<div id="test-runner-container"></div>';
                document.body.appendChild(modal);
                
                // Close modal on click outside
                modal.addEventListener('click', (e) => {
                  if (e.target === modal) {
                    document.body.removeChild(modal);
                  }
                });
              });
            }}
            className="w-full glass-button py-3 rounded-xl hover-lift ripple text-white"
          >
            <Zap className="h-4 w-4 inline mr-2" />
            Run Comprehensive Tests
          </button>
          <div className="text-sm text-gray-300">
            Test navigation, offline functionality, payments, AI assistant, and more
          </div>
        </div>
      </div>

      {/* Language Settings */}
      <div className="glass-card rounded-2xl p-6 hover-lift">
        <h3 className="font-semibold mb-4 flex items-center text-white">
          <div className="p-2 glass-button rounded-full mr-3">
            <Globe className="h-5 w-5" />
          </div>
          Language / Lugha / Mutauro / Ulimi
        </h3>
        <div className="space-y-3">
          {[
            { code: 'en', name: 'English', nativeName: 'English' },
            { code: 'sw', name: 'Kiswahili', nativeName: 'Kiswahili' },
            { code: 'sn', name: 'Shona', nativeName: 'ChiShona' },
            { code: 'nd', name: 'Ndebele', nativeName: 'IsiNdebele' }
          ].map((language) => (
            <button
              key={language.code}
              onClick={() => changeLanguage(language.code)}
              className={`w-full p-4 rounded-xl text-left transition-all duration-300 hover-lift ${
                i18n.language === language.code 
                  ? 'glass-card glow-green' 
                  : 'glass-button'
              }`}
            >
              <div className="font-medium text-white">{language.nativeName}</div>
              <div className="text-sm text-gray-300">{language.name}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Network Status */}
      <div className="glass-card rounded-2xl p-6 hover-lift">
        <h3 className="font-semibold mb-4 flex items-center text-white">
          <div className="p-2 glass-button rounded-full mr-3">
            <Wifi className="h-5 w-5" />
          </div>
          Network Status
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-white">Connection Status</span>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              isOnline ? 'status-online' : 'status-offline'
            }`}>
              {isOnline ? 'Online' : t('offline')}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-white">Data Sync</span>
            <button
              onClick={handleSync}
              disabled={!isOnline || isSyncing}
              className="glass-button px-4 py-2 rounded-xl text-xs hover-lift disabled:opacity-50 text-white"
            >
              {isSyncing ? t('syncing') : 'Sync Now'}
            </button>
          </div>
        </div>
      </div>

      {/* Profile Information */}
      <div className="glass-card rounded-2xl p-6 hover-lift">
        <h3 className="font-semibold mb-4 text-white">Profile Information</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
            <input 
              type="text" 
              value={user.name}
              onChange={(e) => setUser({...user, name: e.target.value})}
              className="w-full p-3 glass-button rounded-xl text-white placeholder-gray-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Location</label>
            <input 
              type="text" 
              value={user.location}
              onChange={(e) => setUser({...user, location: e.target.value})}
              className="w-full p-3 glass-button rounded-xl text-white placeholder-gray-400"
            />
          </div>
        </div>
      </div>

      {/* Data Management */}
      <div className="glass-card rounded-2xl p-6 hover-lift">
        <h3 className="font-semibold mb-4 text-white">Data & Backup</h3>
        <div className="space-y-3">
          <button className="w-full glass-button py-3 rounded-xl hover-lift ripple text-white">
            <Download className="h-4 w-4 inline mr-2" />
            Export Data
          </button>
          <button className="w-full glass-button py-3 rounded-xl hover-lift ripple text-white">
            <Upload className="h-4 w-4 inline mr-2" />
            Import Data
          </button>
        </div>
      </div>
    </div>
  );

  // Simplified versions of other tabs for demo
  const WeatherTab = () => (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6 text-white">{t('weatherForecast')}</h2>
      <div className="glass-card rounded-2xl p-6 text-white hover-lift">
        <div className="absolute inset-0 gradient-bg opacity-80 rounded-2xl"></div>
        <div className="relative z-10">
          <div className="text-4xl font-bold float">{weather.temperature}°C</div>
          <div className="mt-2">{weather.forecast}</div>
        </div>
      </div>
    </div>
  );

  const MarketTab = () => (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6 text-white">{t('marketPrices')}</h2>
      <div className="space-y-4">
        {marketPrices.map((item, index) => (
          <div key={index} className="glass-card rounded-2xl p-6 hover-lift">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-white text-lg">{item.crop}</div>
                <div className="text-sm text-gray-300">{item.unit}</div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-white">KSH {item.price}</div>
                <div className={`text-sm ${item.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                  {item.change}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const CropsTab = () => (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6 text-white">{t('cropManagement')}</h2>
      <div className="space-y-4">
        {crops.map((crop) => (
          <div key={crop.id} className="glass-card rounded-2xl p-6 hover-lift">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-white text-lg">{crop.name}</h3>
              <div className={`w-3 h-3 rounded-full ${crop.synced ? 'status-online' : 'status-offline'}`}></div>
            </div>
            <div className="text-sm text-gray-300 mb-3">{crop.area} acres • {crop.status}</div>
            <div>
              <div className="text-sm text-white mb-2">{t('healthScore')}: {crop.health}%</div>
              <div className="w-full glass rounded-full h-3">
                <div 
                  className="h-3 rounded-full bg-gradient-to-r from-green-400 to-green-600 transition-all duration-500"
                  style={{ width: `${crop.health}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const LivestockTab = () => (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6 text-white">Livestock Management</h2>
      <div className="space-y-4">
        {livestock.map((animal) => (
          <div key={animal.id} className="glass-card rounded-2xl p-6 hover-lift">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-white text-lg">{animal.type}</h3>
                <div className="text-sm text-gray-300">Count: {animal.count}</div>
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                animal.health === 'Excellent' ? 'status-online' :
                animal.health === 'Good' ? 'status-syncing' :
                'bg-yellow-500'
              }`}>
                {animal.health}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderActiveTab = () => {
    switch(activeTab) {
      case 'dashboard': return <DashboardTab />;
      case 'weather': return <WeatherTab />;
      case 'market': return <MarketTab />;
      case 'crops': return <CropsTab />;
      case 'livestock': return <LivestockTab />;
      case 'payments': return <PaymentsTab />;
      case 'contacts': return <ContactsTab />;
      case 'settings': return <SettingsTab />;
      default: return <DashboardTab />;
    }
  };

  return (
    <div className="max-w-md mx-auto min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 gradient-bg"></div>
      <ParticleBackground />
      
      {/* Header */}
      <div className="relative z-10 glass-card m-4 rounded-2xl p-4 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold flex items-center">
              <Sparkles className="h-6 w-6 mr-2 text-yellow-400" />
              AgriMaster
            </h1>
            <div className="text-sm opacity-90">{user.name} • {user.location}</div>
          </div>
          <div className="flex space-x-3">
            <button className="glass-button p-2 rounded-full hover-lift">
              <Bell className="h-5 w-5" />
            </button>
            <button className="glass-button p-2 rounded-full hover-lift">
              <Search className="h-5 w-5" />
            </button>
            <button 
              onClick={() => setShowAIChat(true)}
              className="glass-button p-2 rounded-full hover-lift glow-blue"
            >
              <Bot className="h-5 w-5 text-blue-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Offline Indicator */}
      <OfflineIndicator
        isOnline={isOnline}
        isSyncing={isSyncing}
        isSlowConnection={slowConnection}
        onSync={handleSync}
      />

      {/* Main Content */}
      <div className="relative z-10 pb-32">
        {renderActiveTab()}
      </div>

      {/* Payment Modal */}
      {paymentModal && (
        <PaymentModal
          isOpen={paymentModal.isOpen}
          onClose={() => setPaymentModal(null)}
          amount={paymentModal.amount}
          description={paymentModal.description}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}

      {/* AI Assistant */}
      {showAIChat && <AIAssistant />}

      {/* Bottom Navigation */}
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 w-full max-w-md px-4 z-20">
        <div className="glass-card rounded-2xl p-2">
          <div className="grid grid-cols-4 gap-1">
            {[
              { id: 'dashboard', icon: Home, label: t('home') },
              { id: 'weather', icon: Cloud, label: t('weather') },
              { id: 'market', icon: TrendingUp, label: t('market') },
              { id: 'crops', icon: Leaf, label: t('crops') }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center py-3 px-2 rounded-xl transition-all duration-300 hover-lift ${
                  activeTab === tab.id ? 'glass-button glow-green' : 'glass-button'
                }`}
              >
                <tab.icon className={`h-5 w-5 mb-1 ${activeTab === tab.id ? 'text-green-400' : 'text-white'}`} />
                <span className={`text-xs ${activeTab === tab.id ? 'text-green-400' : 'text-white'}`}>{tab.label}</span>
              </button>
            ))}
          </div>
          <div className="grid grid-cols-4 gap-1 mt-1 pt-2 border-t border-white/20">
            {[
              { id: 'livestock', icon: Heart, label: t('animals') },
              { id: 'payments', icon: DollarSign, label: 'Payments' },
              { id: 'contacts', icon: Phone, label: t('contacts') },
              { id: 'settings', icon: Settings, label: t('settings') }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center py-3 px-2 rounded-xl transition-all duration-300 hover-lift ${
                  activeTab === tab.id ? 'glass-button glow-green' : 'glass-button'
                }`}
              >
                <tab.icon className={`h-5 w-5 mb-1 ${activeTab === tab.id ? 'text-green-400' : 'text-white'}`} />
                <span className={`text-xs ${activeTab === tab.id ? 'text-green-400' : 'text-white'}`}>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgriMasterApp;