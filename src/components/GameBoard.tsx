import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import GameCard, { GameCardData } from "./GameCard";
import GameRules from "./GameRules";
import { allCards, propertyCards, actionCards, moneyCards } from "@/data/gameCards";
import { useGameLogic } from "@/hooks/useGameLogic";
import { Player } from "@/types/game";

const GameBoard = () => {
  const [selectedCards, setSelectedCards] = useState<string[]>([]);
  const { 
    gameState, 
    initializeGame, 
    drawCards, 
    playCard, 
    endTurn, 
    executeBotTurn,
    getCompletedSets 
  } = useGameLogic();

  const currentPlayer = gameState.players[gameState.currentPlayerIndex];
  const humanPlayer = gameState.players.find(p => !p.isBot);
  const botPlayer = gameState.players.find(p => p.isBot);
  const isHumanTurn = currentPlayer && !currentPlayer.isBot;

  // Handle bot turns
  useEffect(() => {
    if (gameState.gamePhase === 'playing' && currentPlayer?.isBot && gameState.turnActions > 0) {
      const timer = setTimeout(() => {
        executeBotTurn();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [gameState.currentPlayerIndex, gameState.gamePhase, currentPlayer, executeBotTurn, gameState.turnActions]);

  const handleCardClick = (cardId: string) => {
    if (!isHumanTurn || gameState.turnActions <= 0) return;
    
    if (selectedCards.includes(cardId)) {
      setSelectedCards(selectedCards.filter(id => id !== cardId));
    } else {
      setSelectedCards([...selectedCards, cardId]);
    }
  };

  const handlePlaySelectedCards = () => {
    if (!humanPlayer || !isHumanTurn) return;
    
    selectedCards.forEach(cardId => {
      playCard(humanPlayer.id, cardId);
    });
    setSelectedCards([]);
  };

  const handleDrawCards = () => {
    if (!humanPlayer || !isHumanTurn) return;
    drawCards(humanPlayer.id, 2);
  };

  const handleEndTurn = () => {
    endTurn();
    setSelectedCards([]);
  };

  const renderPlayerArea = (player: Player, isCurrentPlayer: boolean) => {
    const completedSets = getCompletedSets(player.properties);
    
    return (
      <Card className={`bg-gradient-card border-border ${isCurrentPlayer ? 'ring-2 ring-accent' : ''}`}>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div>
              <span className="text-lg">{player.name}</span>
              {player.nameArabic && (
                <span className="text-sm text-muted-foreground ml-2" dir="rtl">
                  {player.nameArabic}
                </span>
              )}
              {player.isBot && <Badge variant="secondary" className="ml-2">🤖 Bot</Badge>}
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Money: {player.money}K</div>
              <div className="text-sm text-muted-foreground">Sets: {completedSets}/3</div>
              <div className="text-sm text-muted-foreground">Cards: {player.hand.length}</div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Properties */}
          {player.properties.length > 0 && (
            <div className="mb-4">
              <h4 className="font-semibold mb-2">Properties • الممتلكات:</h4>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                {player.properties.map((card) => (
                  <GameCard key={card.id} card={card} className="w-20 h-28" />
                ))}
              </div>
            </div>
          )}
          
          {/* Hand (only show for human player or face-down for bot) */}
          {!player.isBot ? (
            <div>
              <h4 className="font-semibold mb-2">Your Hand • يدك:</h4>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-2">
                {player.hand.map((card) => (
                  <GameCard
                    key={card.id}
                    card={card}
                    isSelected={selectedCards.includes(card.id)}
                    onClick={() => handleCardClick(card.id)}
                    className="w-20 h-28"
                  />
                ))}
              </div>
            </div>
          ) : (
            <div>
              <h4 className="font-semibold mb-2">Bot Hand • يد البوت:</h4>
              <div className="grid grid-cols-7 gap-2">
                {Array.from({ length: player.hand.length }).map((_, index) => (
                  <div key={index} className="w-20 h-28 bg-gradient-syrian rounded-lg flex items-center justify-center">
                    <span className="text-2xl">🏛️</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  if (gameState.gamePhase === 'setup') {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-4xl mx-auto">
          <header className="text-center mb-8">
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-syrian bg-clip-text text-transparent mb-2">
              Syrian Deal
            </h1>
            <p className="text-xl text-muted-foreground" dir="rtl">
              لعبة البطاقات السورية • سوريا ديل
            </p>
          </header>

          <Card className="text-center p-8 bg-gradient-card border-border shadow-elegant">
            <CardHeader>
              <CardTitle className="text-3xl text-terracotta">Welcome to Syrian Deal!</CardTitle>
              <p className="text-lg text-muted-foreground">أهلاً وسهلاً في لعبة سوريا ديل</p>
              <p className="text-base text-muted-foreground mt-2">
                Play against Abu Fadi, the smartest bot in Damascus! 🤖
              </p>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={initializeGame}
                size="lg"
                className="bg-gradient-syrian text-primary-foreground hover:shadow-card-hover transition-all"
              >
                🚀 Start Game vs Bot • ابدأ اللعب ضد البوت
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (gameState.gamePhase === 'ended') {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-4xl mx-auto">
          <Card className="text-center p-8 bg-gradient-card border-border shadow-elegant">
            <CardHeader>
              <CardTitle className="text-4xl text-accent">
                {gameState.winner?.isBot ? 'Abu Fadi Wins! 🤖' : 'Mabrouk! You Win! 🎉'}
              </CardTitle>
              <p className="text-xl text-muted-foreground" dir="rtl">
                {gameState.winner?.isBot ? 'أبو فادي فاز!' : 'مبروك! أنت فزت!'}
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-lg">
                {gameState.winner?.name} collected 3 property sets and won the game!
              </p>
              <Button 
                onClick={initializeGame}
                size="lg"
                className="bg-gradient-syrian text-primary-foreground hover:shadow-card-hover transition-all"
              >
                🔄 Play Again • العب مرة أخرى
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-6">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-syrian bg-clip-text text-transparent mb-2">
            Syrian Deal
          </h1>
        </header>

        <Tabs defaultValue="game" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="game" className="text-lg">🎮 Game</TabsTrigger>
            <TabsTrigger value="cards" className="text-lg">🃏 Cards</TabsTrigger>
            <TabsTrigger value="rules" className="text-lg">📖 Rules</TabsTrigger>
          </TabsList>

          <TabsContent value="game" className="space-y-4">
            {/* Game Controls */}
            <Card className="bg-gradient-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>
                    Turn: {currentPlayer?.name} • دور: {currentPlayer?.nameArabic}
                    {!isHumanTurn && <Badge variant="secondary" className="ml-2">Bot Thinking...</Badge>}
                  </span>
                  <span className="text-lg">Actions Left: {gameState.turnActions}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4 items-center flex-wrap">
                  {isHumanTurn && (
                    <>
                      <Button 
                        onClick={handleDrawCards}
                        disabled={gameState.deck.length < 2}
                        className="bg-gradient-damascus text-white"
                      >
                        📥 Draw 2 Cards
                      </Button>
                      <Button 
                        onClick={handlePlaySelectedCards}
                        disabled={selectedCards.length === 0 || gameState.turnActions <= 0}
                        className="bg-gradient-syrian text-primary-foreground"
                      >
                        ▶️ Play Selected ({selectedCards.length})
                      </Button>
                      <Button 
                        onClick={handleEndTurn}
                        variant="outline"
                        className="border-terracotta text-terracotta hover:bg-terracotta hover:text-white"
                      >
                        ⏭️ End Turn
                      </Button>
                    </>
                  )}
                  <div className="text-sm text-muted-foreground">
                    Deck: {gameState.deck.length} cards
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Bot Player Area */}
            {botPlayer && renderPlayerArea(botPlayer, currentPlayer?.isBot || false)}
            
            {/* Human Player Area */}
            {humanPlayer && renderPlayerArea(humanPlayer, isHumanTurn)}
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