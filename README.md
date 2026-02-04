# 🏓 Pickleball Scorekeeper

A mobile-first, offline-capable web app for keeping score in pickleball games. Built for recreational players who want to focus on the game, not the mental math.

## Features

### Game Formats
- ✅ **Doubles** (2v2) - Primary mode
- ✅ **Singles** (1v1)
- ✅ **Team Events** (4 players, rotating partners)

### Scoring Systems
- ✅ **Traditional Side-Out Scoring** (PRIMARY)
  - Only serving team scores
  - Game to 11, win by 2
  - Server rotation tracking
- ✅ **Rally Scoring** (Toggle option)
  - Point on every serve
  - Game to 11 or 15

### Smart Scorekeeping
- 🎯 **Server Tracking** - Always knows who serves next
- 📢 **Score Announcements** - "0-0-Second Server" format
- 🔄 **Side Switch Reminders** - Alerts at 6, 8, 11 points
- 👥 **Player Management** - Enter names or Quick Play mode
- ☀️ **Sunlight Readable** - High contrast, large typography

### Technical
- 📱 **Mobile-First** - Optimized for phone screens
- 🌐 **PWA** - Install to homescreen like native app
- 💾 **Offline Capable** - Works without internet
- ⚡ **Fast Setup** - Start a game in under 10 seconds

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS (mobile-optimized)
- **State**: React Context + LocalStorage
- **PWA**: Service Worker, Manifest
- **Deploy**: Vercel

## Development

### Prerequisites
- Node.js 20+
- npm or pnpm

### Setup
```bash
git clone https://github.com/shusha-group/alfie-testing-app.git
cd alfie-testing-app
npm install
npm run dev
```

### Build for Production
```bash
npm run build
```

## Project Structure

```
alfie-testing-app/
├── src/
│   ├── components/
│   │   ├── ScoreBoard.tsx
│   │   ├── GameSetup.tsx
│   │   ├── PlayerInput.tsx
│   │   └── ServerIndicator.tsx
│   ├── hooks/
│   │   ├── useGameState.ts
│   │   └── useScoring.ts
│   ├── types/
│   │   └── game.ts
│   ├── utils/
│   │   └── scoringLogic.ts
│   └── App.tsx
├── public/
│   └── manifest.json
└── index.html
```

## Linear Integration

This project is tracked in Linear:
- **Team**: SHU (Shusha)
- **Issues**: SHU-9 through SHU-15
- **Branch naming**: Follows Linear-generated branch names

## Roadmap

### MVP (Current)
- Basic scoring for doubles
- Side-out scoring
- Offline capability
- Mobile UI

### Future Versions
- User accounts & game history
- Statistics & analytics
- Tournament bracket support
- Multi-language support

## License

MIT - Built for the pickleball community 🏓

---

**Built with** ❤️ **using the Alfie development workflow**
- Linear for project management
- GitHub for version control
- React + TypeScript for code
- Vercel for deployment