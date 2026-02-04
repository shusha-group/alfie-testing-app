import type { GameState, GameConfig, Team, ServePosition } from '../types/game';

export const createInitialState = (config: GameConfig): GameState => {
  const players = config.playerNames.map((name, index) => ({
    id: `player-${index}`,
    name: name || `Player ${index + 1}`,
    team: index < 2 ? 'A' : 'B' as Team,
  }));

  return {
    format: config.format,
    scoringMode: config.scoringMode,
    targetScore: config.targetScore,
    winByTwo: config.winByTwo,
    scoreA: 0,
    scoreB: 0,
    servingTeam: 'A',
    serverPosition: 'right',
    firstServer: 'A',
    gameWinner: null,
    sideSwitched: false,
    players,
    history: [],
  };
};

export const shouldSwitchSides = (scoreA: number, scoreB: number): boolean => {
  const total = scoreA + scoreB;
  return total === 6 || total === 8 || total === 11;
};

export const getNextServer = (
  currentState: GameState,
  scoringTeam: Team
): { servingTeam: Team; serverPosition: ServePosition } => {
  if (currentState.scoringMode === 'rally') {
    // In rally scoring, the team that won the point serves
    return {
      servingTeam: scoringTeam,
      serverPosition: (scoringTeam === 'A' ? currentState.scoreA : currentState.scoreB) % 2 === 0 ? 'right' : 'left',
    };
  }

  // Side-out scoring logic
  if (scoringTeam === currentState.servingTeam) {
    // Same team scores, switch server position
    return {
      servingTeam: currentState.servingTeam,
      serverPosition: currentState.serverPosition === 'right' ? 'left' : 'right',
    };
  } else {
    // Side out - other team gets serve, starts on right
    return {
      servingTeam: scoringTeam,
      serverPosition: 'right',
    };
  }
};

export const checkWinner = (
  scoreA: number,
  scoreB: number,
  targetScore: number,
  winByTwo: boolean
): Team | null => {
  if (winByTwo) {
    if (scoreA >= targetScore && scoreA - scoreB >= 2) return 'A';
    if (scoreB >= targetScore && scoreB - scoreA >= 2) return 'B';
  } else {
    if (scoreA >= targetScore) return 'A';
    if (scoreB >= targetScore) return 'B';
  }
  return null;
};

export const getScoreAnnouncement = (
  scoreA: number,
  scoreB: number,
  servingTeam: Team,
  serverPosition: ServePosition,
  format: 'doubles' | 'singles' | 'team'
): string => {
  const serverNum = serverPosition === 'right' ? 1 : 2;
  
  if (format === 'singles') {
    return `${scoreA}-${scoreB}`;
  }
  
  return `${scoreA}-${scoreB}-${serverNum}`;
};

export const getServerName = (state: GameState): string => {
  const serverPlayer = state.players.find(
    p => p.team === state.servingTeam && 
    (state.format === 'singles' || state.players.filter(pl => pl.team === state.servingTeam).indexOf(p) === (state.serverPosition === 'right' ? 0 : 1))
  );
  return serverPlayer?.name || `Team ${state.servingTeam}`;
};