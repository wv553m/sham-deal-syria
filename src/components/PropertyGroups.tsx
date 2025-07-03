import GameCard, { GameCardData } from "./GameCard";
import { Badge } from "@/components/ui/badge";

interface PropertyGroupsProps {
  properties: GameCardData[];
}

const PropertyGroups = ({ properties }: PropertyGroupsProps) => {
  // Group properties by color
  const groupedProperties = properties.reduce((groups, card) => {
    const color = card.isWild ? 'wild' : (card.color || 'unknown');
    if (!groups[color]) {
      groups[color] = [];
    }
    groups[color].push(card);
    return groups;
  }, {} as { [key: string]: GameCardData[] });

  const getGroupStatus = (group: GameCardData[], color: string) => {
    if (color === 'wild') return null;
    
    const setSize = group[0]?.setSize || 2;
    const isComplete = group.length >= setSize;
    
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