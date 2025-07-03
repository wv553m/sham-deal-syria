import { GameCardData } from "@/components/GameCard";

// Property sets: Red (4 cards), Blue (3 cards), Green (2 cards), Yellow (3 cards)
export const propertyCards: GameCardData[] = [
  // Red Set (4 cards needed)
  {
    id: 'old-damascus',
    type: 'property',
    title: 'Old Damascus',
    titleArabic: 'دمشق القديمة',
    description: 'Heart of Syria',
    value: 4,
    icon: '🏛️',
    color: 'red',
    setSize: 4
  },
  {
    id: 'bosra-amphitheater',
    type: 'property',
    title: 'Bosra Theater',
    titleArabic: 'مسرح بصرى',
    description: 'Roman marvel',
    value: 2,
    icon: '🎭',
    color: 'red',
    setSize: 4
  },
  {
    id: 'al-azm-palace',
    type: 'property',
    title: 'Al-Azm Palace',
    titleArabic: 'قصر العظم',
    description: 'Ottoman beauty',
    value: 3,
    icon: '🏮',
    color: 'red',
    setSize: 4
  },
  {
    id: 'damascus-citadel',
    type: 'property',
    title: 'Damascus Citadel',
    titleArabic: 'قلعة دمشق',
    description: 'Ancient fortress',
    value: 3,
    icon: '🏰',
    color: 'red',
    setSize: 4
  },
  
  // Blue Set (3 cards needed)
  {
    id: 'aleppo-citadel',
    type: 'property', 
    title: 'Aleppo Citadel',
    titleArabic: 'قلعة حلب',
    description: 'Northern fortress',
    value: 3,
    icon: '🏰',
    color: 'blue',
    setSize: 3
  },
  {
    id: 'umayyad-mosque',
    type: 'property',
    title: 'Umayyad Mosque',
    titleArabic: 'الجامع الأموي',
    description: 'Sacred gem',
    value: 4,
    icon: '🕌',
    color: 'blue',
    setSize: 3
  },
  {
    id: 'mari-ruins',
    type: 'property',
    title: 'Mari Ruins',
    titleArabic: 'أطلال ماري',
    description: 'Ancient kingdom',
    value: 2,
    icon: '🏺',
    color: 'blue',
    setSize: 3
  },
  
  // Green Set (2 cards needed)
  {
    id: 'krak-des-chevaliers',
    type: 'property',
    title: 'Krak des Chevaliers',
    titleArabic: 'قلعة الحصن',
    description: 'Crusader castle',
    value: 3,
    icon: '⚔️',
    color: 'green',
    setSize: 2
  },
  {
    id: 'straight-street',
    type: 'property',
    title: 'Straight Street',
    titleArabic: 'الشارع المستقيم',
    description: 'Biblical road',
    value: 2,
    icon: '🛤️',
    color: 'green',
    setSize: 2
  },
  
  // Yellow Set (3 cards needed)
  {
    id: 'palmyra',
    type: 'property',
    title: 'Palmyra',
    titleArabic: 'تدمر',
    description: 'Desert queen',
    value: 4,
    icon: '🏺',
    color: 'yellow',
    setSize: 3
  },
  {
    id: 'dead-cities',
    type: 'property',
    title: 'Dead Cities',
    titleArabic: 'المدن الميتة',
    description: 'Byzantine ruins',
    value: 3,
    icon: '🏛️',
    color: 'yellow',
    setSize: 3
  },
  {
    id: 'saladin-castle',
    type: 'property',
    title: 'Saladin Castle',
    titleArabic: 'قلعة صلاح الدين',
    description: 'Fortress of honor',
    value: 2,
    icon: '🏰',
    color: 'yellow',
    setSize: 3
  }
];

// Wild cards that can be used for any property set
export const wildCards: GameCardData[] = [
  {
    id: 'wild-damascus-falcon-1',
    type: 'property',
    title: 'Damascus Falcon',
    titleArabic: 'الشاهين الدمشقي',
    description: 'Can be any property',
    value: 0,
    icon: '🦅',
    color: 'wild',
    isWild: true
  },
  {
    id: 'wild-damascus-falcon-2',
    type: 'property',
    title: 'Damascus Falcon',
    titleArabic: 'الشاهين الدمشقي',
    description: 'Can be any property',
    value: 0,
    icon: '🦅',
    color: 'wild',
    isWild: true
  },
  {
    id: 'wild-damascus-falcon-3',
    type: 'property',
    title: 'Damascus Falcon',
    titleArabic: 'الشاهين الدمشقي',
    description: 'Can be any property',
    value: 0,
    icon: '🦅',
    color: 'wild',
    isWild: true
  }
];

export const actionCards: GameCardData[] = [
  {
    id: 'yalla-habibi',
    type: 'action',
    title: 'Yalla Habibi!',
    titleArabic: 'يلا حبيبي',
    description: 'Extra turn!',
    icon: '🏃‍♂️',
    value: 1
  },
  {
    id: 'ta3feesh',
    type: 'action',
    title: 'Ta3feesh',
    titleArabic: 'تعفيش',
    description: 'Steal a property',
    icon: '🎯',
    value: 3
  },
  {
    id: 'tea-time',
    type: 'action',
    title: 'Tea Time',
    titleArabic: 'وقت الشاي',
    description: 'Draw 3 cards',
    icon: '🍵',
    value: 1
  },
  {
    id: 'haflat-zawaj',
    type: 'action',
    title: 'Wedding Party',
    titleArabic: 'حفلة زواج',
    description: 'Opponent pays 5K',
    icon: '💒',
    value: 4
  },
  {
    id: 'souk-shopping',
    type: 'action',
    title: 'Souk Shopping',
    titleArabic: 'تسوق في السوق',
    description: 'Trade cards with opponent',
    icon: '🛍️',
    value: 2
  },
  // Rent cards - each covers two color sets
  {
    id: 'rent-red-yellow',
    type: 'action',
    title: 'Rent Collection',
    titleArabic: 'جمع الإيجار',
    description: 'Collect rent from Red/Yellow sets',
    icon: '💸',
    value: 1,
    rentColors: ['red', 'yellow']
  },
  {
    id: 'rent-blue-green',
    type: 'action',
    title: 'Rent Collection',
    titleArabic: 'جمع الإيجار',
    description: 'Collect rent from Blue/Green sets',
    icon: '💸',
    value: 1,
    rentColors: ['blue', 'green']
  },
  {
    id: 'rent-wild',
    type: 'action',
    title: 'Wild Rent',
    titleArabic: 'إيجار شامل',
    description: 'Collect rent from any color',
    icon: '🌟',
    value: 1,
    rentColors: ['red', 'blue', 'green', 'yellow']
  }
];

export const moneyCards: GameCardData[] = [
  {
    id: 'money-1',
    type: 'money',
    title: 'Syrian Pound',
    titleArabic: 'ليرة سورية',
    value: 1,
    icon: '💰',
  },
  {
    id: 'money-2',
    type: 'money',
    title: 'Syrian Pound',
    titleArabic: 'ليرة سورية',
    value: 2,
    icon: '💰',
  },
  {
    id: 'money-3',
    type: 'money',
    title: 'Syrian Pound',
    titleArabic: 'ليرة سورية',
    value: 3,
    icon: '💰',
  },
  {
    id: 'money-4',
    type: 'money',
    title: 'Syrian Pound',
    titleArabic: 'ليرة سورية',
    value: 4,
    icon: '💰',
  },
  {
    id: 'money-5',
    type: 'money',
    title: 'Syrian Pound',
    titleArabic: 'ليرة سورية',
    value: 5,
    icon: '💰',
  },
  {
    id: 'gold-souk',
    type: 'money',
    title: 'Gold Souk',
    titleArabic: 'سوق الذهب',
    value: 10,
    icon: '🏆',
  }
];

export const allCards: GameCardData[] = [
  ...propertyCards,
  ...wildCards,
  ...actionCards,
  ...moneyCards
];