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
    serverNumber: 2,
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
): { servingTeam: Team; serverPosition: ServePosition; serverNumber: 1 | 2 } => {
  if (currentState.scoringMode === 'rally') {
    // In rally scoring, the team that won the point serves
    const newPosition = (scoringTeam === 'A' ? currentState.scoreA : currentState.scoreB) % 2 === 0 ? 'right' : 'left';
    return {
      servingTeam: scoringTeam,
      serverPosition: newPosition,
      serverNumber: 1,
    };
  }

  // Side-out scoring logic
  if (scoringTeam === currentState.servingTeam) {
    // Same team scores, switch sides but keep same server
    return {
      servingTeam: currentState.servingTeam,
      serverPosition: currentState.serverPosition === 'right' ? 'left' : 'right',
      serverNumber: currentState.serverNumber,
    };
  } else {
    // Serving team lost the point
    if (currentState.serverNumber === 1) {
      // Server 1 loses, go to Server 2 (same team)
      return {
        servingTeam: currentState.servingTeam,
        serverPosition: 'right',
        serverNumber: 2,
      };
    } else {
      // Server 2 loses, side-out to other team (Server 1)
      return {
        servingTeam: scoringTeam,
        serverPosition: 'right',
        serverNumber: 1,
      };
    }
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
  _servingTeam: Team,
  serverNumber: 1 | 2,
  format: 'doubles' | 'singles' | 'team'
): string => {
  if (format === 'singles') {
    return `${scoreA}-${scoreB}`;
  }

  return `${scoreA}-${scoreB}-${serverNumber}`;
};

export const getServerName = (state: GameState): string => {
  // Find the player who is the current server (Server 1 or Server 2)
  const teamPlayers = state.players.filter(p => p.team === state.servingTeam);
  // Server 1 is index 0, Server 2 is index 1
  const serverPlayer = teamPlayers[state.serverNumber - 1];
  return serverPlayer?.name || `Team ${state.servingTeam}`;
};