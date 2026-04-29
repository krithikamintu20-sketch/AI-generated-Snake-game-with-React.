import { useState } from 'react';
import { motion } from 'motion/react';
import { Trophy, Music, Gamepad2, Github } from 'lucide-react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';

export default function App() {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  const handleScoreChange = (newScore: number) => {
    setScore(newScore);
    if (newScore > highScore) {
      setHighScore(newScore);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-cyan-500/30 overflow-x-hidden">
      {/* Background Glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-500/10 blur-[120px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-fuchsia-500/10 blur-[120px] rounded-full animate-pulse delay-1000"></div>
      </div>

      <nav className="relative z-50 border-b border-white/5 bg-black/50 backdrop-blur-md px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-fuchsia-500 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(34,211,238,0.3)]">
              <Gamepad2 className="w-6 h-6 text-black" />
            </div>
            <div>
              <h1 className="text-xl font-black italic tracking-tighter leading-none">NEON</h1>
              <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-white/40">Arcade & Beats</span>
            </div>
          </div>
          
          <div className="flex items-center gap-8">
            <div className="hidden md:flex items-center gap-6 text-xs font-mono uppercase tracking-widest text-white/50">
              <span className="cursor-pointer hover:text-cyan-400 transition-colors">Games</span>
              <span className="cursor-pointer hover:text-fuchsia-400 transition-colors">Playlist</span>
              <span className="cursor-pointer hover:text-white transition-colors">Profile</span>
            </div>
            <button className="p-2 hover:bg-white/5 rounded-full transition-colors">
              <Github className="w-5 h-5 text-white/50" />
            </button>
          </div>
        </div>
      </nav>

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-12 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Stats & Music */}
          <div className="lg:col-span-4 space-y-8 order-2 lg:order-1">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-sm"
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-cyan-500/20 rounded-2xl">
                  <Trophy className="w-6 h-6 text-cyan-400" />
                </div>
                <div>
                  <h2 className="text-xs font-mono uppercase tracking-widest text-white/40">Leaderboard</h2>
                  <p className="text-lg font-bold">Personal Best</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <span className="text-4xl font-black italic text-cyan-400">{score}</span>
                  <span className="text-xs font-mono text-white/30 mb-2 uppercase">Current Score</span>
                </div>
                <div className="h-px bg-white/5"></div>
                <div className="flex justify-between items-end">
                  <span className="text-4xl font-black italic text-fuchsia-400">{highScore}</span>
                  <span className="text-xs font-mono text-white/30 mb-2 uppercase">High Score</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <MusicPlayer />
            </motion.div>
          </div>

          {/* Center Column: Game Area */}
          <div className="lg:col-span-8 space-y-8 order-1 lg:order-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center"
            >
              <div className="w-full text-center lg:text-left mb-8">
                <motion.h2 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }}
                  className="text-6xl md:text-8xl font-black italic tracking-tighter mb-4 text-white uppercase"
                >
                  SNAKE <span className="text-transparent border-b-4 border-fuchsia-500" style={{ WebkitTextStroke: '1px white' }}>RUN</span>
                </motion.h2>
                <p className="text-white/40 max-w-xl mx-auto lg:mx-0 font-medium leading-relaxed">
                  Navigate the neon grid, collect pulses, and beat the rhythm. 
                  Use <span className="text-cyan-400 font-mono">ARROWS</span> to move and <span className="text-fuchsia-400 font-mono">SPACE</span> to pause.
                </p>
              </div>

              <SnakeGame onScoreChange={handleScoreChange} />
              
              <div className="mt-8 flex gap-4 overflow-x-auto pb-4 w-full justify-center lg:justify-start lg:ml-4">
                {['Arcade Mode', 'Neon Dreams', 'Cyber Speed', 'Synth Legend'].map((tag, i) => (
                  <span key={i} className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-[10px] font-mono uppercase tracking-[0.2em] whitespace-nowrap text-white/60 hover:text-white hover:border-white/30 cursor-crosshair transition-all">
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>

        </div>
      </main>

      <footer className="relative z-50 border-t border-white/5 mt-20 py-12 bg-black/50">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:row items-center justify-between gap-8">
          <div className="text-center md:text-left">
            <div className="flex items-center gap-2 justify-center md:justify-start mb-2">
               <Music className="w-4 h-4 text-cyan-400" />
               <span className="text-xs font-mono uppercase tracking-widest text-white/60">Neon Pulse v1.0.4</span>
            </div>
            <p className="text-[10px] font-mono text-white/20 uppercase tracking-[0.4em]">Designed for the Synthwave Aesthetic</p>
          </div>
          <p className="text-[10px] font-mono text-white/20 uppercase tracking-widest">© 2026 AI Arcade Corporation</p>
        </div>
      </footer>
    </div>
  );
}
