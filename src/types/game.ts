export type GameFormat = 'doubles' | 'singles' | 'team';
export type ScoringMode = 'side-out' | 'rally';
export type Team = 'A' | 'B';
export type ServePosition = 'right' | 'left';

export interface Player {
  id: string;
  name: string;
  team: Team;
}

export interface GameState {
  format: GameFormat;
  scoringMode: ScoringMode;
  targetScore: number;
  winByTwo: boolean;
  
  // Scores
  scoreA: number;
  scoreB: number;
  
  // Server tracking
  servingTeam: Team;
  serverPosition: ServePosition;
  firstServer: Team;
  
  // Game progress
  gameWinner: Team | null;
  sideSwitched: boolean;
  
  // Players
  players: Player[];
  
  // History for undo
  history: GameStateSnapshot[];
}

export interface GameStateSnapshot {
  scoreA: number;
  scoreB: number;
  servingTeam: Team;
  serverPosition: ServePosition;
}

export interface GameConfig {
  format: GameFormat;
  scoringMode: ScoringMode;
  targetScore: number;
  winByTwo: boolean;
  playerNames: string[];
}