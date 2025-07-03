import { useState, useCallback } from "react";
import { GameState, Player, BotAction } from "@/types/game";
import { GameCardData } from "@/components/GameCard";
import { allCards, wildCards } from "@/data/gameCards";
import { useToast } from "@/hooks/use-toast";

const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const createBot = (): Player => ({
  id: 'bot',
  name: 'Abu Fadi',
  nameArabic: 'أبو فادي',
  hand: [],
  properties: [],
  bank: [],
  isBot: true
});

const createHumanPlayer = (): Player => ({
  id: 'human',
  name: 'You',
  nameArabic: 'أنت',
  hand: [],
  properties: [],
  bank: [],
  isBot: false
});

export const useGameLogic = () => {
  const { toast } = useToast();
  
  const [gameState, setGameState] = useState<GameState>({
    players: [],
    currentPlayerIndex: 0,
    deck: [],
    discardPile: [],
    gamePhase: 'setup',
    turnActions: 3
  });

  const initializeGame = useCallback(() => {
    const shuffledDeck = shuffleArray([...allCards, ...allCards]); // Double deck for longer games
    const human = createHumanPlayer();
    const bot = createBot();
    
    // Deal 5 cards to each player
    human.hand = shuffledDeck.slice(0, 5);
    bot.hand = shuffledDeck.slice(5, 10);
    
    const remainingDeck = shuffledDeck.slice(10);
    
    setGameState({
      players: [human, bot],
      currentPlayerIndex: 0,
      deck: remainingDeck,
      discardPile: [],
      gamePhase: 'playing',
      turnActions: 3
    });

    toast({
      title: "يلا نبدأ! Let's Start!",
      description: "Game started against Abu Fadi! Good luck! 🌹"
    });
  }, [toast]);

  const drawCards = useCallback((playerId: string, count: number = 2) => {
    setGameState(prev => {
      const newState = { ...prev };
      const playerIndex = newState.players.findIndex(p => p.id === playerId);
      
      if (playerIndex === -1 || newState.deck.length < count) return prev;
      
      const drawnCards = newState.deck.slice(0, count);
      newState.players[playerIndex].hand.push(...drawnCards);
      newState.deck = newState.deck.slice(count);
      
      return newState;
    });
  }, []);

  const playCard = useCallback((playerId: string, cardId: string, selectedColor?: string) => {
    setGameState(prev => {
      const newState = { ...prev };
      const playerIndex = newState.players.findIndex(p => p.id === playerId);
      
      if (playerIndex === -1 || newState.turnActions <= 0) return prev;
      
      const player = newState.players[playerIndex];
      const cardIndex = player.hand.findIndex(c => c.id === cardId);
      
      if (cardIndex === -1) return prev;
      
      const card = player.hand[cardIndex];
      
      // Handle wild cards - need color selection
      if (card.isWild && card.type === 'property' && !selectedColor) {
        // Set pending wild card state
        newState.pendingWildCard = {
          cardId: card.id,
          playerId: playerId
        };
        return newState;
      }
      
      player.hand.splice(cardIndex, 1);
      
      // Handle different card types
      if (card.type === 'property') {
        // For wild cards, assign the selected color
        const propertyCard = { ...card };
        if (card.isWild && selectedColor) {
          propertyCard.color = selectedColor;
          propertyCard.assignedColor = selectedColor; // Keep track of original assignment
        }
        
        player.properties.push(propertyCard);
        
        console.log(`Property added: ${propertyCard.title}, Color: ${propertyCard.color}, Set size: ${propertyCard.setSize}`);
      } else if (card.type === 'action') {
        // Handle action card effects
        handleActionCard(card, newState, playerIndex);
      }
      
      newState.discardPile.push(card);
      newState.turnActions--;
      newState.pendingWildCard = undefined; // Clear pending state
      
      console.log(`Turn actions remaining: ${newState.turnActions}`);
      
      return newState;
    });
  }, []);

  const selectWildCardColor = useCallback((color: string) => {
    if (!gameState.pendingWildCard) return;
    
    const { cardId, playerId } = gameState.pendingWildCard;
    playCard(playerId, cardId, color);
  }, [gameState.pendingWildCard, playCard]);

  const cancelWildCard = useCallback(() => {
    setGameState(prev => ({ ...prev, pendingWildCard: undefined }));
  }, []);

  const bankCard = useCallback((playerId: string, cardId: string) => {
    setGameState(prev => {
      const newState = { ...prev };
      const playerIndex = newState.players.findIndex(p => p.id === playerId);
      
      if (playerIndex === -1 || newState.turnActions <= 0) return prev;
      
      const player = newState.players[playerIndex];
      const cardIndex = player.hand.findIndex(c => c.id === cardId);
      
      if (cardIndex === -1) return prev;
      
      const card = player.hand[cardIndex];
      player.hand.splice(cardIndex, 1);
      player.bank.push(card);
      
      newState.turnActions--;
      
      return newState;
    });
  }, []);

  const handleActionCard = (card: GameCardData, gameState: GameState, playerIndex: number) => {
    const player = gameState.players[playerIndex];
    const opponent = gameState.players[1 - playerIndex];
    
    switch (card.id) {
      case 'yalla-habibi':
        gameState.turnActions += 2; // Extra actions
        break;
      case 'tea-time':
        // Draw 3 cards
        const drawnCards = gameState.deck.slice(0, 3);
        player.hand.push(...drawnCards);
        gameState.deck = gameState.deck.slice(3);
        break;
      case 'damascus-rose':
        // Steal a property
        if (opponent.properties.length > 0) {
          const stolenProperty = opponent.properties.pop()!;
          player.properties.push(stolenProperty);
        }
        break;
      case 'haflat-zawaj':
        // Everyone gives you money from their bank
        if (opponent.bank.length > 0) {
          const stolenCard = opponent.bank.pop()!;
          player.bank.push(stolenCard);
        }
        break;
    }
  };

  const endTurn = useCallback(() => {
    setGameState(prev => {
      const newState = { ...prev };
      
      // Check win condition
      const currentPlayer = newState.players[newState.currentPlayerIndex];
      const propertySets = getCompletedSets(currentPlayer.properties);
      
      if (propertySets >= 3) {
        newState.gamePhase = 'ended';
        newState.winner = currentPlayer;
        return newState;
      }
      
      // Switch to next player
      newState.currentPlayerIndex = (newState.currentPlayerIndex + 1) % newState.players.length;
      newState.turnActions = 3;
      
      // Auto-draw 2 cards at start of turn
      const nextPlayer = newState.players[newState.currentPlayerIndex];
      if (newState.deck.length >= 2) {
        const drawnCards = newState.deck.slice(0, 2);
        nextPlayer.hand.push(...drawnCards);
        newState.deck = newState.deck.slice(2);
      }
      
      return newState;
    });
  }, []);

  const getCompletedSets = (properties: GameCardData[]): number => {
    const colorGroups: { [key: string]: GameCardData[] } = {};
    
    // Group properties by color (exclude wild cards from grouping)
    properties.forEach(prop => {
      if (prop.color && !prop.isWild) {
        if (!colorGroups[prop.color]) {
          colorGroups[prop.color] = [];
        }
        colorGroups[prop.color].push(prop);
      }
    });
    
    // Count wild cards
    const wildCount = properties.filter(p => p.isWild).length;
    
    // Check completed sets
    let completedSets = 0;
    let wildCardsUsed = 0;
    
    Object.values(colorGroups).forEach(group => {
      const setSize = group[0]?.setSize || 2;
      const cardsNeeded = setSize - group.length;
      
      if (cardsNeeded <= 0) {
        // Set is complete without wild cards
        completedSets++;
      } else if (cardsNeeded <= (wildCount - wildCardsUsed)) {
        // Set can be completed with wild cards
        completedSets++;
        wildCardsUsed += cardsNeeded;
      }
    });
    
    return completedSets;
  };

  const getBotAction = useCallback((botPlayer: Player, opponent: Player): BotAction => {
    // Simple AI logic
    const properties = botPlayer.hand.filter(c => c.type === 'property');
    const actions = botPlayer.hand.filter(c => c.type === 'action');
    const money = botPlayer.hand.filter(c => c.type === 'money');
    
    // Priority: Play properties first, then actions, then money
    if (properties.length > 0) {
      return { type: 'play_property', cardId: properties[0].id };
    }
    
    if (actions.length > 0) {
      return { type: 'play_action', cardId: actions[0].id };
    }
    
    if (money.length > 0) {
      return { type: 'play_money', cardId: money[0].id };
    }
    
    return { type: 'end_turn' };
  }, []);

  const executeBotTurn = useCallback(() => {
    // Check if it's bot's turn and has actions left
    if (gameState.currentPlayerIndex !== 1) return;
    
    const botPlayer = gameState.players.find(p => p.isBot);
    const humanPlayer = gameState.players.find(p => !p.isBot);
    
    if (!botPlayer || !humanPlayer || gameState.turnActions <= 0) {
      console.log("Bot ending turn - no actions left or no player found");
      endTurn();
      return;
    }
    
    const action = getBotAction(botPlayer, humanPlayer);
    
    if (action.type === 'end_turn' || !action.cardId) {
      console.log("Bot ending turn - no valid action");
      endTurn();
      return;
    }
    
    // Execute one action
    const card = botPlayer.hand.find(c => c.id === action.cardId);
    if (card) {
      console.log(`Bot playing card: ${card.title}, Actions before: ${gameState.turnActions}`);
      playCard(botPlayer.id, action.cardId);
      
      toast({
        title: `Abu Fadi played: ${card.title}`,
        description: card.titleArabic || "البوت لعب بطاقة",
      });
      
      // Check if bot should end turn after this action
      setTimeout(() => {
        console.log(`Actions after bot play: ${gameState.turnActions - 1}`);
        if (gameState.turnActions <= 1) { // Will be 0 after this action
          console.log("Bot ending turn - actions will be 0");
          setTimeout(() => endTurn(), 500);
        }
      }, 100);
    } else {
      console.log("Bot ending turn - card not found");
      endTurn();
    }
  }, [gameState, getBotAction, playCard, endTurn, toast]);

  return {
    gameState,
    initializeGame,
    drawCards,
    playCard,
    bankCard,
    endTurn,
    executeBotTurn,
    getCompletedSets,
    selectWildCardColor,
    cancelWildCard
  };
};