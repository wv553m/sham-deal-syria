import { GameCardData } from "@/components/GameCard";

export const propertyCards: GameCardData[] = [
  {
    id: 'old-damascus',
    type: 'property',
    title: 'Old Damascus',
    titleArabic: 'دمشق القديمة',
    description: 'The ancient heart of Syria',
    value: 4,
    icon: '🏛️',
    color: 'terracotta'
  },
  {
    id: 'aleppo-citadel',
    type: 'property', 
    title: 'Aleppo Citadel',
    titleArabic: 'قلعة حلب',
    description: 'Medieval fortress of the north',
    value: 3,
    icon: '🏰',
    color: 'damascus-blue'
  },
  {
    id: 'krak-des-chevaliers',
    type: 'property',
    title: 'Krak des Chevaliers',
    titleArabic: 'قلعة الحصن',
    description: 'Crusader castle masterpiece',
    value: 3,
    icon: '⚔️',
    color: 'olive-green'
  },
  {
    id: 'palmyra',
    type: 'property',
    title: 'Palmyra',
    titleArabic: 'تدمر',
    description: 'Desert queen of antiquity',
    value: 4,
    icon: '🏺',
    color: 'golden-sand'
  },
  {
    id: 'bosra-amphitheater',
    type: 'property',
    title: 'Bosra Theater',
    titleArabic: 'مسرح بصرى',
    description: 'Roman theater marvel',
    value: 2,
    icon: '🎭',
    color: 'terracotta'
  },
  {
    id: 'umayyad-mosque',
    type: 'property',
    title: 'Umayyad Mosque',
    titleArabic: 'الجامع الأموي',
    description: 'Sacred architectural gem',
    value: 4,
    icon: '🕌',
    color: 'damascus-blue'
  },
  {
    id: 'straight-street',
    type: 'property',
    title: 'Straight Street',
    titleArabic: 'الشارع المستقيم',
    description: 'Biblical Damascus road',
    value: 2,
    icon: '🛤️',
    color: 'olive-green'
  },
  {
    id: 'al-azm-palace',
    type: 'property',
    title: 'Al-Azm Palace',
    titleArabic: 'قصر العظم',
    description: 'Ottoman architectural beauty',
    value: 3,
    icon: '🏮',
    color: 'golden-sand'
  }
];

export const actionCards: GameCardData[] = [
  {
    id: 'yalla-habibi',
    type: 'action',
    title: 'Yalla Habibi!',
    titleArabic: 'يلا حبيبي',
    description: 'Take another turn, my friend!',
    icon: '🏃‍♂️',
  },
  {
    id: 'shawarma-break',
    type: 'action',
    title: 'Shawarma Break',
    titleArabic: 'استراحة شاورما',
    description: 'Everyone skips next turn to eat',
    icon: '🌯',
  },
  {
    id: 'damascus-rose',
    type: 'action',
    title: 'Damascus Rose',
    titleArabic: 'وردة دمشق',
    description: 'Steal a property with charm',
    icon: '🌹',
  },
  {
    id: 'abu-hassan-taxi',
    type: 'action',
    title: 'Abu Hassan\'s Taxi',
    titleArabic: 'تاكسي أبو حسن',
    description: 'Move any card to your hand',
    icon: '🚕',
  },
  {
    id: 'maqluba-surprise',
    type: 'action',
    title: 'Maqluba Surprise',
    titleArabic: 'مفاجأة مقلوبة',
    description: 'Flip the game upside down!',
    icon: '🍲',
  },
  {
    id: 'tea-time',
    type: 'action',
    title: 'Tea Time',
    titleArabic: 'وقت الشاي',
    description: 'Draw 3 cards while sipping',
    icon: '🍵',
  },
  {
    id: 'haflat-zawaj',
    type: 'action',
    title: 'Wedding Party',
    titleArabic: 'حفلة زواج',
    description: 'Everyone gives you money!',
    icon: '💒',
  },
  {
    id: 'traffic-jam',
    type: 'action',
    title: 'Damascus Traffic',
    titleArabic: 'زحمة دمشق',
    description: 'No one can play for 1 round',
    icon: '🚦',
  },
  {
    id: 'hajjeh-um-mahmoud',
    type: 'action',
    title: 'Hajjeh Um Mahmoud',
    titleArabic: 'الحاجة أم محمود',
    description: 'The neighborhood mom helps you',
    icon: '👵',
  },
  {
    id: 'souk-al-hamidiyeh',
    type: 'action',
    title: 'Souk Shopping',
    titleArabic: 'تسوق في السوق',
    description: 'Trade cards with anyone',
    icon: '🛍️',
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
  ...actionCards,
  ...moneyCards
];