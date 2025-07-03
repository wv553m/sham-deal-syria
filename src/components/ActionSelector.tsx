import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GameCardData } from "@/components/GameCard";

interface ActionSelectorProps {
  type: 'steal' | 'trade' | 'rent';
  availableCards?: GameCardData[];
  availableColors?: string[];
  onSelect: (selection: any) => void;
  onCancel: () => void;
}

const ActionSelector: React.FC<ActionSelectorProps> = ({
  type,
  availableCards = [],
  availableColors = [],
  onSelect,
  onCancel
}) => {
  const getColorName = (color: string) => {
    const colorNames = {
      red: 'أحمر',
      blue: 'أزرق', 
      green: 'أخضر',
      yellow: 'أصفر'
    };
    return colorNames[color as keyof typeof colorNames] || color;
  };

  const renderStealSelector = () => (
    <Card className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <div className="bg-background p-6 rounded-lg max-w-md w-full mx-4">
        <CardHeader>
          <CardTitle>اختر البطاقة للسرقة</CardTitle>
          <CardDescription>Choose a property to steal</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {availableCards.map((card) => (
            <Button
              key={card.id}
              variant="outline"
              className="w-full justify-start"
              onClick={() => onSelect(card.id)}
            >
              <span className="mr-2">{card.icon}</span>
              <div className="text-left">
                <div>{card.title}</div>
                <div className="text-sm text-muted-foreground">{card.titleArabic}</div>
              </div>
            </Button>
          ))}
          <Button variant="secondary" onClick={onCancel} className="w-full">
            إلغاء Cancel
          </Button>
        </CardContent>
      </div>
    </Card>
  );

  const renderTradeSelector = () => (
    <Card className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <div className="bg-background p-6 rounded-lg max-w-md w-full mx-4">
        <CardHeader>
          <CardTitle>تبادل البطاقات</CardTitle>
          <CardDescription>Trade cards with opponent</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-sm text-muted-foreground">
            Trading feature will be implemented soon
          </div>
          <Button variant="secondary" onClick={onCancel} className="w-full">
            إلغاء Cancel
          </Button>
        </CardContent>
      </div>
    </Card>
  );

  const renderRentSelector = () => (
    <Card className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <div className="bg-background p-6 rounded-lg max-w-md w-full mx-4">
        <CardHeader>
          <CardTitle>اختر لون الإيجار</CardTitle>
          <CardDescription>Choose rent color</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {availableColors.map((color) => (
            <Button
              key={color}
              variant="outline"
              className="w-full"
              onClick={() => onSelect(color)}
            >
              {getColorName(color)}
            </Button>
          ))}
          <Button variant="secondary" onClick={onCancel} className="w-full">
            إلغاء Cancel
          </Button>
        </CardContent>
      </div>
    </Card>
  );

  switch (type) {
    case 'steal':
      return renderStealSelector();
    case 'trade':
      return renderTradeSelector();
    case 'rent':
      return renderRentSelector();
    default:
      return null;
  }
};

export default ActionSelector;