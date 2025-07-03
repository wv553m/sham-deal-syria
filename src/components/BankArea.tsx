import { GameCardData } from "./GameCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface BankAreaProps {
  cards: GameCardData[];
  onCardDrop?: (cardId: string) => void;
  className?: string;
}

const BankArea = ({ cards, onCardDrop, className }: BankAreaProps) => {
  const totalValue = cards.reduce((sum, card) => sum + (card.value || 0), 0);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const cardId = e.dataTransfer.getData('text/plain');
    onCardDrop?.(cardId);
  };

  return (
    <Card 
      className={cn(
        "bg-gradient-sunset border-golden-sand min-h-32 transition-all",
        "hover:shadow-card-hover",
        className
      )}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-center text-lg">
          🏦 Bank • البنك
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center">
          <div className="text-2xl font-bold text-golden-sand">
            {totalValue}K
          </div>
          <div className="text-sm text-muted-foreground">
            {cards.length} cards deposited
          </div>
        </div>
        
        {cards.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1 justify-center">
            {cards.slice(-3).map((card, index) => (
              <div 
                key={card.id} 
                className="w-8 h-12 bg-golden-sand/20 rounded border border-golden-sand/30 flex items-center justify-center text-xs"
                style={{ transform: `rotate(${(index - 1) * 5}deg)` }}
              >
                {card.icon}
              </div>
            ))}
            {cards.length > 3 && (
              <div className="text-xs text-muted-foreground">
                +{cards.length - 3} more
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BankArea;