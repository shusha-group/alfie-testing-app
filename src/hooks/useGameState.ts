import { useState, useCallback } from 'react';
import type { GameState, GameConfig, Team } from '../types/game';
import {
  createInitialState,
  shouldSwitchSides,
  getNextServer,
  checkWinner,
} from '../utils/scoringLogic';

export const useGameState = (config: GameConfig) => {
  const [state, setState] = useState<GameState>(() => createInitialState(config));

  const saveSnapshot = useCallback((currentState: GameState) => {
    return {
      scoreA: currentState.scoreA,
      scoreB: currentState.scoreB,
      servingTeam: currentState.servingTeam,
      serverPosition: currentState.serverPosition,
    };
  }, []);

  const scorePoint = useCallback((team: Team) => {
    setState((prev) => {
      if (prev.gameWinner) return prev;

      const newSnapshot = saveSnapshot(prev);
      const newHistory = [...prev.history, newSnapshot];

      let newScoreA = prev.scoreA;
      let newScoreB = prev.scoreB;

      if (prev.scoringMode === 'side-out') {
        // Side-out: only serving team scores
        if (team === prev.servingTeam) {
          if (team === 'A') newScoreA++;
          else newScoreB++;
        }
      } else {
        // Rally: scoring team always gets point
        if (team === 'A') newScoreA++;
        else newScoreB++;
      }

      const nextServer = getNextServer(
        { ...prev, scoreA: newScoreA, scoreB: newScoreB },
        team
      );

      const winner = checkWinner(
        newScoreA,
        newScoreB,
        prev.targetScore,
        prev.winByTwo
      );

      const sideSwitch = shouldSwitchSides(newScoreA, newScoreB);

      return {
        ...prev,
        scoreA: newScoreA,
        scoreB: newScoreB,
        servingTeam: nextServer.servingTeam,
        serverPosition: nextServer.serverPosition,
        gameWinner: winner,
        sideSwitched: prev.sideSwitched || sideSwitch,
        history: newHistory,
      };
    });
  }, [saveSnapshot]);

  const undoLastPoint = useCallback(() => {
    setState((prev) => {
      if (prev.history.length === 0) return prev;
      
      const lastState = prev.history[prev.history.length - 1];
      const newHistory = prev.history.slice(0, -1);

      return {
        ...prev,
        scoreA: lastState.scoreA,
        scoreB: lastState.scoreB,
        servingTeam: lastState.servingTeam,
        serverPosition: lastState.serverPosition,
        gameWinner: null,
        history: newHistory,
      };
    });
  }, []);

  const resetGame = useCallback(() => {
    setState(createInitialState(config));
  }, [config]);

  return {
    state,
    scorePoint,
    undoLastPoint,
    resetGame,
  };
};