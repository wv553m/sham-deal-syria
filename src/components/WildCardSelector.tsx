import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface WildCardSelectorProps {
  onSelectColor: (color: string) => void;
  onCancel: () => void;
}

const WildCardSelector = ({ onSelectColor, onCancel }: WildCardSelectorProps) => {
  const colors = [
    { name: 'Red Set', nameArabic: 'المجموعة الحمراء', value: 'red', bgColor: 'bg-red-500' },
    { name: 'Blue Set', nameArabic: 'المجموعة الزرقاء', value: 'blue', bgColor: 'bg-blue-500' },
    { name: 'Green Set', nameArabic: 'المجموعة الخضراء', value: 'green', bgColor: 'bg-green-500' },
    { name: 'Yellow Set', nameArabic: 'المجموعة الصفراء', value: 'yellow', bgColor: 'bg-yellow-500' }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="max-w-md w-full mx-4">
        <CardHeader>
          <CardTitle className="text-center">
            🦅 Choose Color for Syrian Falcon
          </CardTitle>
          <p className="text-center text-sm text-muted-foreground" dir="rtl">
            اختر لون المجموعة للشاهين السوري
          </p>
        </CardHeader>
        <CardContent className="space-y-3">
          {colors.map((color) => (
            <Button
              key={color.value}
              onClick={() => onSelectColor(color.value)}
              className={`w-full ${color.bgColor} hover:opacity-80 text-white`}
              size="lg"
            >
              <div className="text-center">
                <div>{color.name}</div>
                <div className="text-sm opacity-90" dir="rtl">{color.nameArabic}</div>
              </div>
            </Button>
          ))}
          <Button 
            variant="outline" 
            onClick={onCancel}
            className="w-full mt-4"
          >
            Cancel • إلغاء
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default WildCardSelector;