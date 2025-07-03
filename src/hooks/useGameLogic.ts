import { useState, useCallback } from "react";
import { GameState, Player, BotAction } from "@/types/game";
import { GameCardData } from "@/components/GameCard";
import { allCards } from "@/data/gameCards";
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
  money: 0,
  isBot: true
});

const createHumanPlayer = (): Player => ({
  id: 'human',
  name: 'You',
  nameArabic: 'أنت',
  hand: [],
  properties: [],
  money: 0,
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

  const playCard = useCallback((playerId: string, cardId: string) => {
    setGameState(prev => {
      const newState = { ...prev };
      const playerIndex = newState.players.findIndex(p => p.id === playerId);
      
      if (playerIndex === -1 || newState.turnActions <= 0) return prev;
      
      const player = newState.players[playerIndex];
      const cardIndex = player.hand.findIndex(c => c.id === cardId);
      
      if (cardIndex === -1) return prev;
      
      const card = player.hand[cardIndex];
      player.hand.splice(cardIndex, 1);
      
      // Handle different card types
      if (card.type === 'property') {
        player.properties.push(card);
      } else if (card.type === 'money') {
        player.money += card.value || 0;
      } else if (card.type === 'action') {
        // Handle action card effects
        handleActionCard(card, newState, playerIndex);
      }
      
      newState.discardPile.push(card);
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
        // Everyone gives you money
        if (opponent.money >= 2) {
          opponent.money -= 2;
          player.money += 2;
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
      
      // If it's bot's turn, draw cards for bot
      if (newState.players[newState.currentPlayerIndex].isBot) {
        const botPlayer = newState.players[newState.currentPlayerIndex];
        const drawnCards = newState.deck.slice(0, 2);
        botPlayer.hand.push(...drawnCards);
        newState.deck = newState.deck.slice(2);
      }
      
      return newState;
    });
  }, []);

  const getCompletedSets = (properties: GameCardData[]): number => {
    const colorGroups: { [key: string]: number } = {};
    
    properties.forEach(prop => {
      if (prop.color) {
        colorGroups[prop.color] = (colorGroups[prop.color] || 0) + 1;
      }
    });
    
    return Object.values(colorGroups).filter(count => count >= 2).length;
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

  const executeBotTurn = useCallback(async () => {
    const botPlayer = gameState.players.find(p => p.isBot);
    const humanPlayer = gameState.players.find(p => !p.isBot);
    
    if (!botPlayer || !humanPlayer || gameState.currentPlayerIndex !== 1) return;
    
    let actionsRemaining = gameState.turnActions;
    
    while (actionsRemaining > 0) {
      const action = getBotAction(botPlayer, humanPlayer);
      
      if (action.type === 'end_turn') break;
      
      if (action.cardId) {
        playCard(botPlayer.id, action.cardId);
        const card = botPlayer.hand.find(c => c.id === action.cardId);
        
        setTimeout(() => {
          toast({
            title: `Abu Fadi played: ${card?.title}`,
            description: card?.titleArabic || "البوت لعب بطاقة",
          });
        }, 1000);
      }
      
      actionsRemaining--;
      await new Promise(resolve => setTimeout(resolve, 1500)); // Delay for realism
    }
    
    setTimeout(() => {
      endTurn();
    }, 2000);
  }, [gameState, getBotAction, playCard, endTurn, toast]);

  return {
    gameState,
    initializeGame,
    drawCards,
    playCard,
    endTurn,
    executeBotTurn,
    getCompletedSets
  };
};