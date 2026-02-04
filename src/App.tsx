import { useState } from 'react';
import { GameConfig, GameFormat, ScoringMode } from './types/game';
import { useGameState } from './hooks/useGameState';
import { getScoreAnnouncement, getServerName, shouldSwitchSides } from './utils/scoringLogic';
import './index.css';

function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const [config, setConfig] = useState<GameConfig>({
    format: 'doubles',
    scoringMode: 'side-out',
    targetScore: 11,
    winByTwo: true,
    playerNames: ['Player 1', 'Player 2', 'Player 3', 'Player 4'],
  });

  const { state, scorePoint, undoLastPoint, resetGame } = useGameState(config);

  const handleStartGame = () => {
    setGameStarted(true);
  };

  const handleReset = () => {
    resetGame();
    setGameStarted(false);
  };

  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-gray-900 p-4 flex items-center justify-center">
        <div className="w-full max-w-md bg-gray-800 rounded-2xl p-6 space-y-6">
          <h1 className="text-3xl font-bold text-center text-emerald-400">
            🏓 Pickleball
          </h1>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Game Format
              </label>
              <select
                value={config.format}
                onChange={(e) => setConfig({ ...config, format: e.target.value as GameFormat })}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white"
              >
                <option value="doubles">Doubles (2v2)</option>
                <option value="singles">Singles (1v1)</option>
                <option value="team">Team Event (4 players)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Scoring Mode
              </label>
              <select
                value={config.scoringMode}
                onChange={(e) => setConfig({ ...config, scoringMode: e.target.value as ScoringMode })}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white"
              >
                <option value="side-out">Side-Out (Traditional)</option>
                <option value="rally">Rally Scoring</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Target Score
                </label>
                <select
                  value={config.targetScore}
                  onChange={(e) => setConfig({ ...config, targetScore: parseInt(e.target.value) })}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white"
                >
                  <option value={11}>11</option>
                  <option value={15}>15</option>
                  <option value={21}>21</option>
                </select>
              </div>
              <div className="flex items-center">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.winByTwo}
                    onChange={(e) => setConfig({ ...config, winByTwo: e.target.checked })}
                    className="w-5 h-5 rounded border-gray-600 text-emerald-500"
                  />
                  <span className="text-sm text-gray-300">Win by 2</span>
                </label>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">
                Player Names
              </label>
              {config.playerNames.slice(0, config.format === 'singles' ? 2 : 4).map((name, index) => (
                <input
                  key={index}
                  type="text"
                  value={name}
                  onChange={(e) => {
                    const newNames = [...config.playerNames];
                    newNames[index] = e.target.value;
                    setConfig({ ...config, playerNames: newNames });
                  }}
                  placeholder={`Player ${index + 1}`}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-500"
                />
              ))}
            </div>
          </div>

          <button
            onClick={handleStartGame}
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-4 rounded-xl text-lg transition-colors"
          >
            Start Game
          </button>
        </div>
      </div>
    );
  }

  const scoreDisplay = getScoreAnnouncement(
    state.scoreA,
    state.scoreB,
    state.servingTeam,
    state.serverPosition,
    state.format
  );

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      {/* Header */}
      <header className="bg-gray-800 p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-emerald-400">🏓 Scorekeeper</h1>
        <div className="flex gap-2">
          {state.history.length > 0 && (
            <button
              onClick={undoLastPoint}
              className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded-lg text-sm font-medium"
            >
              Undo
            </button>
          )}
          <button
            onClick={handleReset}
            className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded-lg text-sm font-medium"
          >
            Reset
          </button>
        </div>
      </header>

      {/* Winner Banner */}
      {state.gameWinner && (
        <div className="bg-emerald-500 text-white p-4 text-center">
          <p className="text-2xl font-bold">
            🎉 Team {state.gameWinner} Wins!
          </p>
        </div>
      )}

      {/* Main Score Display */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-lg">
          {/* Server Indicator */}
          <div className="text-center mb-4">
            <p className="text-lg text-gray-400">
              Serving: <span className="text-white font-semibold">{getServerName(state)}</span>
              <span className="text-sm text-gray-500 ml-2">
                ({state.serverPosition === 'right' ? 'Right' : 'Left'})
              </span>
            </p>
          </div>

          {/* Score */}
          <div className="text-center mb-8">
            <p className="text-8xl font-bold text-white tracking-wider">
              {scoreDisplay}
            </p>
          </div>

          {/* Score Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => scorePoint('A')}
              disabled={!!state.gameWinner}
              className="score-button bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 text-white py-8 rounded-2xl text-2xl font-bold"
            >
              Team A
              <span className="block text-sm font-normal mt-1">
                {state.players.filter(p => p.team === 'A').map(p => p.name).join(' & ')}
              </span>
              <span className="block text-4xl mt-2">{state.scoreA}</span>
            </button>
            <button
              onClick={() => scorePoint('B')}
              disabled={!!state.gameWinner}
              className="score-button bg-red-600 hover:bg-red-700 disabled:bg-gray-700 text-white py-8 rounded-2xl text-2xl font-bold"
            >
              Team B
              <span className="block text-sm font-normal mt-1">
                {state.players.filter(p => p.team === 'B').map(p => p.name).join(' & ')}
              </span>
              <span className="block text-4xl mt-2">{state.scoreB}</span>
            </button>
          </div>

          {/* Side Switch Warning */}
          {shouldSwitchSides(state.scoreA, state.scoreB) && !state.sideSwitched && (
            <div className="mt-4 bg-yellow-500 text-black p-3 rounded-lg text-center font-semibold">
              ⚠️ Switch sides!
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 p-4 text-center text-sm text-gray-400">
        {state.scoringMode === 'side-out' ? 'Side-Out Scoring' : 'Rally Scoring'} • Game to {state.targetScore}
      </footer>
    </div>
  );
}

export default App;