import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const GameRules = () => {
  return (
    <Card className="max-w-4xl mx-auto bg-gradient-card border-border shadow-elegant">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold bg-gradient-syrian bg-clip-text text-transparent">
          Syrian Deal Card Game
        </CardTitle>
        <CardDescription className="text-lg">
          سوريا ديل • A fun family game for ages 10+
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="objective">
            <AccordionTrigger className="text-xl font-semibold text-terracotta">
              🎯 Game Objective • هدف اللعبة
            </AccordionTrigger>
            <AccordionContent>
              <p className="text-base leading-relaxed">
                Be the first player to collect 3 complete property sets of different colors from Syrian landmarks! 
                Each property set consists of matching colored Syrian locations.
              </p>
              <p className="text-sm text-muted-foreground mt-2" dir="rtl">
                كن أول لاعب يجمع 3 مجموعات ممتلكات كاملة من ألوان مختلفة من المعالم السورية!
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="setup">
            <AccordionTrigger className="text-xl font-semibold text-damascus-blue">
              ⚙️ Game Setup • إعداد اللعبة
            </AccordionTrigger>
            <AccordionContent>
              <ul className="space-y-2 text-base">
                <li>• Shuffle all cards and deal 5 cards to each player</li>
                <li>• Place remaining cards face-down as the draw pile</li>
                <li>• Each player can have a maximum of 7 cards in hand</li>
                <li>• The youngest player goes first (or whoever says "Yalla!" first)</li>
              </ul>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="cards">
            <AccordionTrigger className="text-xl font-semibold text-olive-green">
              🃏 Card Types • أنواع البطاقات
            </AccordionTrigger>
            <AccordionContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 bg-gradient-syrian/20 rounded-lg">
                  <h4 className="font-bold text-terracotta mb-2">🏛️ Property Cards</h4>
                  <p className="text-sm">Syrian landmarks you collect to win. Group by color to complete sets!</p>
                </div>
                <div className="p-4 bg-gradient-damascus/20 rounded-lg">
                  <h4 className="font-bold text-damascus-blue mb-2">⚡ Action Cards</h4>
                  <p className="text-sm">Special moves with Syrian humor - from shawarma breaks to traffic jams!</p>
                </div>
                <div className="p-4 bg-gradient-sunset/20 rounded-lg">
                  <h4 className="font-bold text-golden-sand mb-2">💰 Money Cards</h4>
                  <p className="text-sm">Syrian pounds to pay for actions and rent on properties.</p>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="turn">
            <AccordionTrigger className="text-xl font-semibold text-golden-sand">
              🔄 Your Turn • دورك
            </AccordionTrigger>
            <AccordionContent>
              <ol className="space-y-3 text-base">
                <li><strong>1. Draw 2 cards</strong> from the pile</li>
                <li><strong>2. Play up to 3 cards:</strong>
                  <ul className="ml-4 mt-1 space-y-1 text-sm">
                    <li>• Put properties in front of you</li>
                    <li>• Use action cards for special effects</li>
                    <li>• Keep money cards for later</li>
                  </ul>
                </li>
                <li><strong>3. Discard excess cards</strong> if you have more than 7</li>
              </ol>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="properties">
            <AccordionTrigger className="text-xl font-semibold text-terracotta">
              🏘️ Property Sets • مجموعات الممتلكات
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3">
                <p className="text-base">Complete property sets by collecting all cards of the same color:</p>
                <div className="grid md:grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-terracotta rounded"></div>
                    <span><strong>Terracotta:</strong> Old Damascus, Bosra Theater</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-damascus-blue rounded"></div>
                    <span><strong>Damascus Blue:</strong> Aleppo Citadel, Umayyad Mosque</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-olive-green rounded"></div>
                    <span><strong>Olive Green:</strong> Krak des Chevaliers, Straight Street</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-golden-sand rounded"></div>
                    <span><strong>Golden Sand:</strong> Palmyra, Al-Azm Palace</span>
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="winning">
            <AccordionTrigger className="text-xl font-semibold text-accent">
              🏆 Winning • الفوز
            </AccordionTrigger>
            <AccordionContent>
              <div className="text-base space-y-2">
                <p><strong>First player to collect 3 complete property sets wins!</strong></p>
                <p className="text-muted-foreground">
                  Yell "Mabrouk!" (مبروك - Congratulations!) when you win and do a victory dabke dance! 💃
                </p>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className="mt-8 p-4 bg-gradient-syrian/10 rounded-lg text-center">
          <p className="text-sm text-muted-foreground">
            <strong>Syrian Wisdom:</strong> "الصبر مفتاح الفرج" - Patience is the key to relief. 
            Sometimes the best strategy is to wait for the right moment! 🌹
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default GameRules;