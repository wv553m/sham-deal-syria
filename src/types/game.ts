import { GameCardData } from "@/components/GameCard";

export interface Player {
  id: string;
  name: string;
  nameArabic?: string;
  hand: GameCardData[];
  properties: GameCardData[];
  bank: GameCardData[]; // cards deposited as money
  isBot: boolean;
}

export interface GameState {
  players: Player[];
  currentPlayerIndex: number;
  deck: GameCardData[];
  discardPile: GameCardData[];
  gamePhase: 'setup' | 'playing' | 'ended';
  winner?: Player;
  turnActions: number; // remaining actions for current turn (max 3)
}

export interface BotAction {
  type: 'play_property' | 'play_action' | 'play_money' | 'end_turn';
  cardId?: string;
  targetPlayerId?: string;
}