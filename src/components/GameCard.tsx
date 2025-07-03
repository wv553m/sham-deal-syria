import { cn } from "@/lib/utils";

export interface GameCardData {
  id: string;
  type: 'property' | 'action' | 'money';
  title: string;
  titleArabic?: string;
  description?: string;
  value?: number;
  color?: string;
  icon?: string;
  image?: string;
  setSize?: number; // for property cards
  isWild?: boolean; // for wild cards
}

interface GameCardProps {
  card: GameCardData;
  isSelected?: boolean;
  isFlipped?: boolean;
  onClick?: () => void;
  className?: string;
}

const GameCard = ({ card, isSelected, isFlipped, onClick, className }: GameCardProps) => {
  const getCardStyles = () => {
    if (card.type === 'property') {
      if (card.isWild) {
        return {
          background: 'bg-gradient-to-br from-purple-500 to-pink-500',
          border: 'border-purple-400',
          text: 'text-white'
        };
      }
      
      switch (card.color) {
        case 'red':
          return {
            background: 'bg-gradient-to-br from-red-500 to-red-600',
            border: 'border-red-400',
            text: 'text-white'
          };
        case 'blue':
          return {
            background: 'bg-gradient-to-br from-blue-500 to-blue-600',
            border: 'border-blue-400',
            text: 'text-white'
          };
        case 'green':
          return {
            background: 'bg-gradient-to-br from-green-500 to-green-600',
            border: 'border-green-400',
            text: 'text-white'
          };
        case 'yellow':
          return {
            background: 'bg-gradient-to-br from-yellow-500 to-yellow-600',
            border: 'border-yellow-400',
            text: 'text-white'
          };
        default:
          return {
            background: 'bg-gradient-syrian',
            border: 'border-terracotta',
            text: 'text-primary-foreground'
          };
      }
    }
    
    switch (card.type) {
      case 'action':
        return {
          background: 'bg-gradient-damascus',
          border: 'border-damascus-blue',
          text: 'text-white'
        };
      case 'money':
        return {
          background: 'bg-gradient-sunset',
          border: 'border-golden-sand',
          text: 'text-foreground'
        };
      default:
        return {
          background: 'bg-gradient-card',
          border: 'border-border',
          text: 'text-foreground'
        };
    }
  };

  const styles = getCardStyles();

  return (
    <div
      className={cn(
        "relative w-36 h-56 rounded-lg border-2 cursor-pointer transition-all duration-300",
        "hover:animate-card-hover hover:shadow-card-hover",
        "transform-gpu perspective-1000 overflow-hidden",
        styles.background,
        styles.border,
        isSelected && "ring-4 ring-accent ring-opacity-50 scale-105",
        isFlipped && "animate-card-flip",
        className
      )}
      onClick={onClick}
    >
      {/* Card Front */}
      <div className={cn(
        "absolute inset-2 flex flex-col h-[calc(100%-16px)]",
        styles.text,
        isFlipped && "opacity-0"
      )}>
        {/* Header */}
        <div className="text-center mb-2 flex-shrink-0">
          <div className="text-[10px] font-bold leading-tight truncate px-1">{card.title}</div>
          {card.titleArabic && (
            <div className="text-[8px] opacity-80 font-medium leading-tight truncate px-1" dir="rtl">
              {card.titleArabic}
            </div>
          )}
        </div>

        {/* Icon/Image */}
        <div className="flex-1 flex items-center justify-center min-h-8">
          {card.icon && (
            <div className="text-xl">{card.icon}</div>
          )}
        </div>

        {/* Value/Description */}
        <div className="text-center flex-shrink-0 space-y-1 overflow-hidden">
          {card.value !== undefined && (
            <div className="text-sm font-bold">
              {card.type === 'money' ? `${card.value}K` : card.value}
            </div>
          )}
          {card.description && (
            <div className="text-[7px] opacity-80 leading-tight line-clamp-2 px-1">
              {card.description}
            </div>
          )}
          {card.setSize && (
            <div className="text-[7px] opacity-60 truncate">
              Set: {card.setSize}
            </div>
          )}
        </div>

        {/* Type indicator */}
        <div className="absolute -top-1 -right-1">
          <div className={cn(
            "w-2 h-2 rounded-full",
            card.type === 'property' && "bg-terracotta",
            card.type === 'action' && "bg-damascus-blue", 
            card.type === 'money' && "bg-golden-sand"
          )} />
        </div>
      </div>

      {/* Card Back */}
      {isFlipped && (
        <div className="absolute inset-0 bg-gradient-syrian rounded-lg p-3 flex items-center justify-center opacity-100">
          <div className="text-4xl">🏛️</div>
        </div>
      )}
    </div>
  );
};

export default GameCard;