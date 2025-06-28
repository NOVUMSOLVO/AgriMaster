import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Language resources
const resources = {
  en: {
    translation: {
      // Navigation
      home: 'Home',
      weather: 'Weather',
      market: 'Market',
      crops: 'Crops',
      animals: 'Animals',
      marketplace: 'Marketplace',
      logistics: 'Logistics',
      contacts: 'Contacts',
      records: 'Records',
      settings: 'Settings',
      
      // Dashboard
      dashboard: 'Dashboard',
      todaysWeather: "Today's Weather",
      activeCrops: 'Active Crops',
      livestock: 'Livestock',
      recentActivities: 'Recent Activities',
      quickActions: 'Quick Actions',
      
      // Weather
      weatherForecast: 'Weather Forecast',
      temperature: 'Temperature',
      humidity: 'Humidity',
      forecast: '7-Day Forecast',
      weatherAlerts: 'Weather Alerts',
      
      // Market
      marketPrices: 'Market Prices',
      marketTips: 'Market Tips',
      contactBuyers: 'Contact Buyers',
      updatedToday: 'Updated: Today 2:30 PM',
      
      // Crops
      cropManagement: 'Crop Management',
      healthScore: 'Health Score',
      photoLog: 'Photo Log',
      record: 'Record',
      todaysTasks: "Today's Tasks",
      
      // Payments
      makePayment: 'Make Payment',
      paymentHistory: 'Payment History',
      balance: 'Balance',
      topUp: 'Top Up',
      sendMoney: 'Send Money',
      payBills: 'Pay Bills',
      
      // Common
      save: 'Save',
      cancel: 'Cancel',
      edit: 'Edit',
      delete: 'Delete',
      add: 'Add',
      update: 'Update',
      loading: 'Loading...',
      offline: 'Offline',
      syncing: 'Syncing...',
      syncComplete: 'Sync Complete',
      connectionSlow: 'Slow Connection'
    }
  },
  sw: {
    translation: {
      // Navigation
      home: 'Nyumbani',
      weather: 'Hali ya Hewa',
      market: 'Soko',
      crops: 'Mazao',
      animals: 'Mifugo',
      marketplace: 'Soko kuu',
      logistics: 'Usafirishaji',
      contacts: 'Mawasiliano',
      records: 'Kumbukumbu',
      settings: 'Mipangilio',
      
      // Dashboard
      dashboard: 'Dashibodi',
      todaysWeather: 'Hali ya Hewa ya Leo',
      activeCrops: 'Mazao Yanayolimwa',
      livestock: 'Mifugo',
      recentActivities: 'Shughuli za Hivi Karibuni',
      quickActions: 'Vitendo vya Haraka',
      
      // Weather
      weatherForecast: 'Utabiri wa Hali ya Hewa',
      temperature: 'Joto',
      humidity: 'Unyevu',
      forecast: 'Utabiri wa Siku 7',
      weatherAlerts: 'Tahadhari za Hali ya Hewa',
      
      // Market
      marketPrices: 'Bei za Sokoni',
      marketTips: 'Vidokezo vya Soko',
      contactBuyers: 'Wasiliana na Wanunuzi',
      updatedToday: 'Imesasishwa: Leo 2:30 PM',
      
      // Crops
      cropManagement: 'Usimamizi wa Mazao',
      healthScore: 'Alama za Afya',
      photoLog: 'Kumbukumbu za Picha',
      record: 'Rekodi',
      todaysTasks: 'Kazi za Leo',
      
      // Payments
      makePayment: 'Fanya Malipo',
      paymentHistory: 'Historia ya Malipo',
      balance: 'Salio',
      topUp: 'Jaza',
      sendMoney: 'Tuma Pesa',
      payBills: 'Lipa Bill',
      
      // Common
      save: 'Hifadhi',
      cancel: 'Ghairi',
      edit: 'Hariri',
      delete: 'Futa',
      add: 'Ongeza',
      update: 'Sasisha',
      loading: 'Inapakia...',
      offline: 'Nje ya Mtandao',
      syncing: 'Inasawazisha...',
      syncComplete: 'Usawazishaji Umekamilika',
      connectionSlow: 'Muunganisho Polepole'
    }
  },
  sn: {
    translation: {
      // Navigation (Shona)
      home: 'Musha',
      weather: 'Mamiriro eKunze',
      market: 'Musika',
      crops: 'Zvirimwa',
      animals: 'Zvipfuyo',
      marketplace: 'Musika Mukuru',
      logistics: 'Kutakura',
      contacts: 'Kukurukurirana',
      records: 'Zvinyorwa',
      settings: 'Zvimisikidzo',
      
      // Dashboard
      dashboard: 'Dashibhodi',
      todaysWeather: 'Mamiriro eKunze Nhasi',
      activeCrops: 'Zvirimwa Zviri Kumera',
      livestock: 'Zvipfuyo',
      recentActivities: 'Zvakaita Munguva Pfupi',
      quickActions: 'Zviito Zvekukurumidza',
      
      // Weather
      weatherForecast: 'Fungidziro yeMamiriro eKunze',
      temperature: 'Kupisa',
      humidity: 'Hunyoro',
      forecast: 'Fungidziro yeMazuva Manomwe',
      weatherAlerts: 'Yambiro dzeMamiriro eKunze',
      
      // Market
      marketPrices: 'Mitengo yeMusika',
      marketTips: 'Mazano eMusika',
      contactBuyers: 'Taura neVatenga',
      updatedToday: 'Zvakagadziriswa: Nhasi 2:30 PM',
      
      // Crops
      cropManagement: 'Kutarisira Zvirimwa',
      healthScore: 'Zvibodzwa zveHutano',
      photoLog: 'Zvinyorwa zveMifananidzo',
      record: 'Nyora',
      todaysTasks: 'Mabasa aNhasi',
      
      // Common
      save: 'Chengetedza',
      cancel: 'Dzosa',
      edit: 'Gadziridza',
      delete: 'Bvisa',
      add: 'Wedzera',
      update: 'Gadziridza',
      loading: 'Zviri kutakura...',
      offline: 'Pasina Network',
      syncing: 'Zviri kuwirirana...',
      syncComplete: 'Kuwirirana Kwapera',
      connectionSlow: 'Network Inononoka'
    }
  },
  nd: {
    translation: {
      // Navigation (Ndebele)
      home: 'Ekhaya',
      weather: 'Isimo Sezulu',
      market: 'Imarikidi',
      crops: 'Izilimo',
      animals: 'Izifuyo',
      marketplace: 'Imarikidi Elikhulu',
      logistics: 'Ukuthwala',
      contacts: 'Ukuxhumana',
      records: 'Amarekhodi',
      settings: 'Izisetthingsi',
      
      // Dashboard
      dashboard: 'Ideshibhodi',
      todaysWeather: 'Isimo Sezulu Namhlanje',
      activeCrops: 'Izilimo Ezikhulayo',
      livestock: 'Izifuyo',
      recentActivities: 'Okwenziwe Muva nje',
      quickActions: 'Izenzo Ezisheshayo',
      
      // Weather
      weatherForecast: 'Isibikezelo Sesimo Sezulu',
      temperature: 'Ukutshisa',
      humidity: 'Ubomvu',
      forecast: 'Isibikezelo Sensuku Eziyisikhombisa',
      weatherAlerts: 'Izexwayiso Zesimo Sezulu',
      
      // Market
      marketPrices: 'Amanani Emarikidi',
      marketTips: 'Amacebiso Emarikidi',
      contactBuyers: 'Thumana labaThengi',
      updatedToday: 'Kubuyekeziwe: Namhlanje 2:30 PM',
      
      // Crops
      cropManagement: 'Ukunakekela Izilimo',
      healthScore: 'Amanqamu Empilo',
      photoLog: 'Amarekhodi Ezithombe',
      record: 'Rekhoda',
      todaysTasks: 'Imisebenzi Yanamhlanje',
      
      // Common
      save: 'Gcina',
      cancel: 'Khansela',
      edit: 'Hlela',
      delete: 'Susa',
      add: 'Engeza',
      update: 'Buyekeza',
      loading: 'Kulayisha...',
      offline: 'Akukho Network',
      syncing: 'Kuyafanana...',
      syncComplete: 'Ukufanana Kuphelile',
      connectionSlow: 'Uxhumaniso Oluphansi'
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // default language
    fallbackLng: 'en',
    
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage']
    },
    
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;