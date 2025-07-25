import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import GameCard, { GameCardData } from "./GameCard";
import GameRules from "./GameRules";
import BankArea from "./BankArea";
import PropertyGroups from "./PropertyGroups";
import WildCardSelector from "./WildCardSelector";
import ActionSelector from "./ActionSelector";
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
    bankCard,
    endTurn, 
    executeBotTurn,
    getCompletedSets,
    selectWildCardColor,
    cancelWildCard,
    selectStealTarget,
    selectRentColor,
    cancelAction,
    changeWildCardColor,
    selectNewColor
  } = useGameLogic();

  const currentPlayer = gameState.players[gameState.currentPlayerIndex];
  const humanPlayer = gameState.players.find(p => !p.isBot);
  const botPlayer = gameState.players.find(p => p.isBot);
  const isHumanTurn = currentPlayer && !currentPlayer.isBot;

  // Handle bot turns with proper sequencing
  useEffect(() => {
    if (gameState.gamePhase === 'playing' && 
        currentPlayer?.isBot && 
        gameState.turnActions > 0 && 
        gameState.currentPlayerIndex === 1) {
      
      console.log(`Bot turn triggered, actions: ${gameState.turnActions}`);
      const timer = setTimeout(() => {
        executeBotTurn();
      }, 2000); // 2 second delay between each bot action
      return () => clearTimeout(timer);
    }
  }, [gameState.currentPlayerIndex, gameState.gamePhase, gameState.turnActions, executeBotTurn]);

  const handleCardDragStart = (e: React.DragEvent, cardId: string) => {
    e.dataTransfer.setData('text/plain', cardId);
  };

  const handlePlayCard = (cardId: string) => {
    if (!humanPlayer || !isHumanTurn || gameState.turnActions <= 0) return;
    playCard(humanPlayer.id, cardId);
  };

  const handleBankCard = (cardId: string) => {
    if (!humanPlayer || !isHumanTurn || gameState.turnActions <= 0) return;
    bankCard(humanPlayer.id, cardId);
  };

  const getBankValue = (player: Player) => {
    return player.bank.reduce((sum, card) => sum + (card.value || 0), 0);
  };

  const handleCancelWildCard = () => {
    // This will be handled through the useGameLogic hook
    console.log("Cancel wild card selection");
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
              <div className="text-sm text-muted-foreground">Bank: {getBankValue(player)}K</div>
              <div className="text-sm text-muted-foreground">Sets: {completedSets}/3</div>
              <div className="text-sm text-muted-foreground">Cards: {player.hand.length}</div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {/* Bank */}
            <BankArea 
              cards={player.bank} 
              onCardDrop={!player.isBot ? handleBankCard : undefined}
              className="h-fit"
            />
            
            {/* Properties */}
            <div>
              <h4 className="font-semibold mb-2">Properties • الممتلكات:</h4>
              {player.properties.length > 0 ? (
                <PropertyGroups 
                  properties={player.properties} 
                  onChangeWildCardColor={!player.isBot ? changeWildCardColor : undefined}
                  canChangeColors={!player.isBot && isCurrentPlayer && gameState.turnActions > 0}
                />
              ) : (
                <div className="text-sm text-muted-foreground text-center py-4">
                  No properties yet
                </div>
              )}
            </div>
          </div>
          
          {/* Hand (only show for human player or face-down for bot) */}
          <div className="mt-4">
            {!player.isBot ? (
              <div>
                <h4 className="font-semibold mb-2">Your Hand • يدك:</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {player.hand.map((card) => (
                    <div
                      key={card.id}
                      draggable
                      onDragStart={(e) => handleCardDragStart(e, card.id)}
                      onClick={() => handlePlayCard(card.id)}
                    >
                      <GameCard
                        card={card}
                        className="hover:scale-105 transition-transform"
                      />
                    </div>
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
          </div>
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
                  {isHumanTurn && gameState.turnActions === 0 && (
                    <Button 
                      onClick={endTurn}
                      className="bg-gradient-syrian text-primary-foreground"
                    >
                      ⏭️ End Turn
                    </Button>
                  )}
                  <div className="text-sm text-muted-foreground">
                    Deck: {gameState.deck.length} cards • 
                    Click cards to play as property/action • 
                    Drag to bank for money
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
        
      {/* Wild Card Color Selector */}
      {gameState.pendingWildCard && (
        <WildCardSelector
          onSelectColor={selectWildCardColor}
          onCancel={cancelWildCard}
        />
      )}

      {/* Action Selectors */}
      {gameState.pendingSteal && (
        <ActionSelector
          type="steal"
          availableCards={gameState.pendingSteal.targetCards}
          onSelect={selectStealTarget}
          onCancel={cancelAction}
        />
      )}

      {gameState.pendingTrade && (
        <ActionSelector
          type="trade"
          onSelect={() => {}} // TODO: Implement trade logic
          onCancel={cancelAction}
        />
      )}

      {gameState.pendingRent && (
        <ActionSelector
          type="rent"
          availableColors={gameState.pendingRent.availableColors}
          onSelect={selectRentColor}
          onCancel={cancelAction}
        />
      )}

      {gameState.pendingColorChange && (
        <ActionSelector
          type="color-change"
          currentColor={gameState.pendingColorChange.currentColor}
          onSelect={selectNewColor}
          onCancel={cancelAction}
        />
      )}
      </div>
    </div>
  );
};

export default GameBoard;