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
    switch (card.type) {
      case 'property':
        return {
          background: 'bg-gradient-syrian',
          border: 'border-terracotta',
          text: 'text-primary-foreground'
        };
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
        "relative w-32 h-48 rounded-lg border-2 cursor-pointer transition-all duration-300",
        "hover:animate-card-hover hover:shadow-card-hover",
        "transform-gpu perspective-1000",
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
        "absolute inset-0 p-3 flex flex-col justify-between rounded-lg",
        styles.text,
        isFlipped && "opacity-0"
      )}>
        {/* Header */}
        <div className="text-center">
          <div className="text-xs font-bold mb-1">{card.title}</div>
          {card.titleArabic && (
            <div className="text-xs opacity-80 font-medium" dir="rtl">
              {card.titleArabic}
            </div>
          )}
        </div>

        {/* Icon/Image */}
        <div className="flex-1 flex items-center justify-center">
          {card.icon && (
            <div className="text-3xl">{card.icon}</div>
          )}
        </div>

        {/* Value/Description */}
        <div className="text-center">
          {card.value && (
            <div className="text-lg font-bold">
              {card.type === 'money' ? `${card.value}K` : card.value}
            </div>
          )}
          {card.description && (
            <div className="text-xs opacity-80 line-clamp-2">
              {card.description}
            </div>
          )}
        </div>

        {/* Type indicator */}
        <div className="absolute top-1 right-1">
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