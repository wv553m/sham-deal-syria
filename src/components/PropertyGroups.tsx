import GameCard, { GameCardData } from "./GameCard";
import { Badge } from "@/components/ui/badge";

interface PropertyGroupsProps {
  properties: GameCardData[];
}

const PropertyGroups = ({ properties }: PropertyGroupsProps) => {
  // Group properties by color, using assignedColor for wild cards
  const groupedProperties = properties.reduce((groups, card) => {
    // For wild cards that have been assigned a color, use assignedColor
    // Otherwise, use the card's original color or 'wild' for unassigned wild cards
    let color: string;
    
    if (card.isWild && card.assignedColor) {
      color = card.assignedColor;
    } else if (card.isWild) {
      color = 'wild';
    } else {
      color = card.color || 'unknown';
    }
    
    if (!groups[color]) {
      groups[color] = [];
    }
    groups[color].push(card);
    return groups;
  }, {} as { [key: string]: GameCardData[] });

  const getGroupStatus = (group: GameCardData[], color: string) => {
    if (color === 'wild') return null;
    
    // Get setSize from first non-wild card, or use color-based defaults
    const colorDefaults = { red: 4, blue: 3, green: 2, yellow: 3 };
    const setSize = group.find(c => !c.isWild)?.setSize || colorDefaults[color as keyof typeof colorDefaults] || 2;
    
    const isComplete = group.length >= setSize;
    
    console.log(`Group ${color}: ${group.length}/${setSize} cards, Complete: ${isComplete}`);
    
    return {
      current: group.length,
      needed: setSize,
      isComplete
    };
  };

  const getColorDisplayName = (color: string) => {
    switch (color) {
      case 'red': return 'Red Set • المجموعة الحمراء';
      case 'blue': return 'Blue Set • المجموعة الزرقاء';
      case 'green': return 'Green Set • المجموعة الخضراء';
      case 'yellow': return 'Yellow Set • المجموعة الصفراء';
      case 'wild': return 'Wild Cards • البطاقات الشاملة';
      default: return 'Unknown Set';
    }
  };

  return (
    <div className="space-y-4">
      {Object.entries(groupedProperties).map(([color, group]) => {
        const status = getGroupStatus(group, color);
        
        return (
          <div key={color} className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-sm">
                {getColorDisplayName(color)}
              </h4>
              {status && (
                <Badge 
                  variant={status.isComplete ? "default" : "secondary"}
                  className={status.isComplete ? "bg-green-500 text-white" : ""}
                >
                  {status.current}/{status.needed}
                  {status.isComplete && " ✓"}
                </Badge>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3">
              {group.map((card) => (
                <GameCard key={card.id} card={card} className="w-32 h-48" />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PropertyGroups;