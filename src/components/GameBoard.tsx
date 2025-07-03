import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GameCard, { GameCardData } from "./GameCard";
import GameRules from "./GameRules";
import { allCards, propertyCards, actionCards, moneyCards } from "@/data/gameCards";
import { useToast } from "@/hooks/use-toast";

const GameBoard = () => {
  const [selectedCards, setSelectedCards] = useState<string[]>([]);
  const [playerHand, setPlayerHand] = useState<GameCardData[]>([]);
  const [playerProperties, setPlayerProperties] = useState<GameCardData[]>([]);
  const [gameStarted, setGameStarted] = useState(false);
  const { toast } = useToast();

  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const startNewGame = () => {
    const shuffledCards = shuffleArray(allCards);
    const initialHand = shuffledCards.slice(0, 5);
    setPlayerHand(initialHand);
    setPlayerProperties([]);
    setSelectedCards([]);
    setGameStarted(true);
    
    toast({
      title: "يلا! Let's play!",
      description: "New game started. Good luck, habibi! 🌹",
    });
  };

  const handleCardClick = (cardId: string) => {
    if (selectedCards.includes(cardId)) {
      setSelectedCards(selectedCards.filter(id => id !== cardId));
    } else {
      setSelectedCards([...selectedCards, cardId]);
    }
  };

  const playSelectedCards = () => {
    const cardsToPlay = playerHand.filter(card => selectedCards.includes(card.id));
    const propertiesToAdd = cardsToPlay.filter(card => card.type === 'property');
    const actionsToPlay = cardsToPlay.filter(card => card.type === 'action');
    
    // Add properties to player's property area
    setPlayerProperties([...playerProperties, ...propertiesToAdd]);
    
    // Remove played cards from hand
    setPlayerHand(playerHand.filter(card => !selectedCards.includes(card.id)));
    setSelectedCards([]);

    // Show action effects
    actionsToPlay.forEach(action => {
      toast({
        title: `${action.title} ${action.titleArabic || ''}`,
        description: action.description || "Action played!",
      });
    });

    if (cardsToPlay.length > 0) {
      toast({
        title: "Cards played!",
        description: `Played ${cardsToPlay.length} card(s). Yalla!`,
      });
    }
  };

  const getPropertySets = () => {
    const sets = {
      terracotta: playerProperties.filter(p => p.color === 'terracotta'),
      'damascus-blue': playerProperties.filter(p => p.color === 'damascus-blue'),
      'olive-green': playerProperties.filter(p => p.color === 'olive-green'),
      'golden-sand': playerProperties.filter(p => p.color === 'golden-sand'),
    };
    return sets;
  };

  const completedSets = Object.values(getPropertySets()).filter(set => set.length >= 2).length;

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-syrian bg-clip-text text-transparent mb-2">
            Syrian Deal
          </h1>
          <p className="text-xl text-muted-foreground" dir="rtl">
            لعبة البطاقات السورية • سوريا ديل
          </p>
        </header>

        <Tabs defaultValue="game" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="game" className="text-lg">🎮 Game</TabsTrigger>
            <TabsTrigger value="cards" className="text-lg">🃏 Cards</TabsTrigger>
            <TabsTrigger value="rules" className="text-lg">📖 Rules</TabsTrigger>
          </TabsList>

          <TabsContent value="game" className="space-y-6">
            {!gameStarted ? (
              <Card className="text-center p-8 bg-gradient-card border-border shadow-elegant">
                <CardHeader>
                  <CardTitle className="text-3xl text-terracotta">Welcome to Syrian Deal!</CardTitle>
                  <p className="text-lg text-muted-foreground">أهلاً وسهلاً في لعبة سوريا ديل</p>
                </CardHeader>
                <CardContent>
                  <Button 
                    onClick={startNewGame}
                    size="lg"
                    className="bg-gradient-syrian text-primary-foreground hover:shadow-card-hover transition-all"
                  >
                    🚀 Start New Game • ابدأ لعبة جديدة
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {/* Game Status */}
                <Card className="bg-gradient-card border-border">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Game Status • حالة اللعبة</span>
                      <span className="text-lg">🏆 Sets: {completedSets}/3</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-4 items-center">
                      <Button 
                        onClick={playSelectedCards}
                        disabled={selectedCards.length === 0}
                        className="bg-gradient-damascus text-white"
                      >
                        Play Selected ({selectedCards.length})
                      </Button>
                      <Button 
                        onClick={startNewGame}
                        variant="outline"
                        className="border-terracotta text-terracotta hover:bg-terracotta hover:text-white"
                      >
                        New Game
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Player Properties */}
                <Card className="bg-gradient-card border-border">
                  <CardHeader>
                    <CardTitle>Your Properties • ممتلكاتك</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {playerProperties.length === 0 ? (
                      <p className="text-muted-foreground text-center py-4">
                        No properties yet. Play some property cards! 🏛️
                      </p>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
                        {playerProperties.map((card) => (
                          <GameCard key={card.id} card={card} />
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Player Hand */}
                <Card className="bg-gradient-card border-border">
                  <CardHeader>
                    <CardTitle>Your Hand • يدك ({playerHand.length}/7)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-4">
                      {playerHand.map((card) => (
                        <GameCard
                          key={card.id}
                          card={card}
                          isSelected={selectedCards.includes(card.id)}
                          onClick={() => handleCardClick(card.id)}
                        />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          <TabsContent value="cards" className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="bg-gradient-card border-border">
                <CardHeader>
                  <CardTitle className="text-terracotta">🏛️ Property Cards</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    {propertyCards.map((card) => (
                      <GameCard key={card.id} card={card} />
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-card border-border">
                <CardHeader>
                  <CardTitle className="text-damascus-blue">⚡ Action Cards</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    {actionCards.slice(0, 8).map((card) => (
                      <GameCard key={card.id} card={card} />
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-card border-border">
                <CardHeader>
                  <CardTitle className="text-golden-sand">💰 Money Cards</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    {moneyCards.map((card) => (
                      <GameCard key={card.id} card={card} />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="rules">
            <GameRules />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default GameBoard;