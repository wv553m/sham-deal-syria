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
        const actionResult = handleActionCard(card, newState, playerIndex);
        if (actionResult === 'pending') {
          return newState; // Don't proceed if action needs selection
        }
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

  const selectStealTarget = useCallback((targetCardId: string) => {
    if (!gameState.pendingSteal) return;
    
    setGameState(prev => {
      const newState = { ...prev };
      const playerIndex = newState.players.findIndex(p => p.id === gameState.pendingSteal!.playerId);
      const opponentIndex = 1 - playerIndex;
      
      if (playerIndex === -1) return prev;
      
      const player = newState.players[playerIndex];
      const opponent = newState.players[opponentIndex];
      
      const cardIndex = opponent.properties.findIndex(c => c.id === targetCardId);
      if (cardIndex !== -1) {
        const stolenCard = opponent.properties.splice(cardIndex, 1)[0];
        player.properties.push(stolenCard);
      }
      
      newState.pendingSteal = undefined;
      newState.turnActions--;
      
      return newState;
    });
  }, [gameState.pendingSteal]);

  const selectRentColor = useCallback((color: string) => {
    if (!gameState.pendingRent) return;
    
    setGameState(prev => {
      const newState = { ...prev };
      const playerIndex = newState.players.findIndex(p => p.id === gameState.pendingRent!.playerId);
      const opponentIndex = 1 - playerIndex;
      
      if (playerIndex === -1) return prev;
      
      const player = newState.players[playerIndex];
      const opponent = newState.players[opponentIndex];
      
      // Calculate rent based on properties of selected color
      const colorProperties = player.properties.filter(p => p.color === color || p.assignedColor === color);
      const rentAmount = calculateRent(colorProperties, color);
      
      // Collect rent from opponent
      collectRentFromPlayer(opponent, player, rentAmount);
      
      newState.pendingRent = undefined;
      newState.turnActions--;
      
      return newState;
    });
  }, [gameState.pendingRent]);

  const calculateRent = (properties: GameCardData[], color: string): number => {
    const colorData = { red: 4, blue: 3, green: 2, yellow: 3 };
    const setSize = colorData[color as keyof typeof colorData] || 2;
    const propertyCount = properties.length;
    
    // Rent increases with more properties in set
    const rentTable = {
      red: [1, 2, 3, 6],
      blue: [1, 2, 4],
      green: [1, 2],
      yellow: [1, 2, 4]
    };
    
    const rents = rentTable[color as keyof typeof rentTable] || [1, 2];
    return rents[Math.min(propertyCount - 1, rents.length - 1)] || 0;
  };

  const collectRentFromPlayer = (fromPlayer: Player, toPlayer: Player, amount: number) => {
    let collected = 0;
    const toRemove: { from: 'bank' | 'hand', index: number }[] = [];
    
    // Try to collect from bank first
    for (let i = 0; i < fromPlayer.bank.length && collected < amount; i++) {
      const card = fromPlayer.bank[i];
      if (collected + card.value <= amount) {
        toRemove.push({ from: 'bank', index: i });
        collected += card.value;
      }
    }
    
    // If not enough in bank, take from hand
    if (collected < amount) {
      for (let i = 0; i < fromPlayer.hand.length && collected < amount; i++) {
        const card = fromPlayer.hand[i];
        if (collected + card.value <= amount) {
          toRemove.push({ from: 'hand', index: i });
          collected += card.value;
        }
      }
    }
    
    // Remove cards from opponent and give to player
    toRemove.reverse().forEach(({ from, index }) => {
      if (from === 'bank') {
        const takenCard = fromPlayer.bank.splice(index, 1)[0];
        toPlayer.bank.push(takenCard);
      } else {
        const takenCard = fromPlayer.hand.splice(index, 1)[0];
        toPlayer.bank.push(takenCard);
      }
    });
  };

  const cancelAction = useCallback(() => {
    setGameState(prev => ({ 
      ...prev, 
      pendingSteal: undefined,
      pendingTrade: undefined,
      pendingRent: undefined
    }));
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

  const handleActionCard = (card: GameCardData, gameState: GameState, playerIndex: number): 'pending' | 'complete' => {
    const player = gameState.players[playerIndex];
    const opponent = gameState.players[1 - playerIndex];
    
    switch (card.id) {
      case 'yalla-habibi':
        gameState.turnActions += 2; // Extra actions
        return 'complete';
        
      case 'tea-time':
        // Draw 3 cards
        const drawnCards = gameState.deck.slice(0, 3);
        player.hand.push(...drawnCards);
        gameState.deck = gameState.deck.slice(3);
        return 'complete';
        
      case 'ta3feesh':
        // Steal a property - need to select which one
        if (opponent.properties.length > 0) {
          gameState.pendingSteal = {
            cardId: card.id,
            playerId: player.id,
            targetCards: opponent.properties
          };
          return 'pending';
        }
        return 'complete';
        
      case 'haflat-zawaj':
        // Opponent pays 5K from bank/hand
        const opponentValue = [...opponent.bank, ...opponent.hand];
        let collected = 0;
        const toRemove: { from: 'bank' | 'hand', index: number }[] = [];
        
        // Try to collect 5K from opponent
        for (let i = 0; i < opponent.bank.length && collected < 5; i++) {
          const card = opponent.bank[i];
          if (collected + card.value <= 5) {
            toRemove.push({ from: 'bank', index: i });
            collected += card.value;
          }
        }
        
        // If not enough in bank, take from hand
        if (collected < 5) {
          for (let i = 0; i < opponent.hand.length && collected < 5; i++) {
            const card = opponent.hand[i];
            if (collected + card.value <= 5) {
              toRemove.push({ from: 'hand', index: i });
              collected += card.value;
            }
          }
        }
        
        // Remove cards from opponent and give to player
        toRemove.reverse().forEach(({ from, index }) => {
          if (from === 'bank') {
            const takenCard = opponent.bank.splice(index, 1)[0];
            player.bank.push(takenCard);
          } else {
            const takenCard = opponent.hand.splice(index, 1)[0];
            player.bank.push(takenCard);
          }
        });
        return 'complete';
        
      case 'souk-shopping':
        // Trade cards - need to select cards
        gameState.pendingTrade = {
          cardId: card.id,
          playerId: player.id
        };
        return 'pending';
        
      case 'rent-red-yellow':
      case 'rent-blue-green':
      case 'rent-wild':
        // Rent collection - need to select color
        const rentCard = card as any;
        gameState.pendingRent = {
          cardId: card.id,
          playerId: player.id,
          availableColors: rentCard.rentColors || []
        };
        return 'pending';
        
      default:
        return 'complete';
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
    cancelWildCard,
    selectStealTarget,
    selectRentColor,
    cancelAction
  };
};