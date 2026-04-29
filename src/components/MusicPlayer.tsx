import { useState, useRef, useEffect, ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Music, ListMusic } from 'lucide-react';
import { Track } from '../types';

const TRACKS: Track[] = [
  {
    id: '1',
    title: 'Neon Velocity',
    artist: 'AI Horizon',
    url: 'https://cdn.pixabay.com/audio/2022/03/15/audio_783cd5999d.mp3', // Synthwave track
    cover: 'https://picsum.photos/seed/neon1/400/400',
    color: '#00f2ff'
  },
  {
    id: '2',
    title: 'Synth Pulse',
    artist: 'Neural Beat',
    url: 'https://cdn.pixabay.com/audio/2021/11/24/audio_8303f6f962.mp3', // High energy techno
    cover: 'https://picsum.photos/seed/synth2/400/400',
    color: '#ff007f'
  },
  {
    id: '3',
    title: 'Cyber Drift',
    artist: 'Digital Ghost',
    url: 'https://cdn.pixabay.com/audio/2022/01/21/audio_24907973d4.mp3', // Chill electronic
    cover: 'https://picsum.photos/seed/cyber3/400/400',
    color: '#bc13fe'
  }
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [showPlaylist, setShowPlaylist] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play().catch(e => console.error("Playback failed", e));
    } else {
      audioRef.current?.pause();
    }
  }, [isPlaying, currentTrackIndex]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const p = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(p || 0);
    }
  };

  const handleEnded = () => {
    handleSkipForward();
  };

  const handleSkipForward = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
  };

  const handleSkipBack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
  };

  const handleSeek = (e: ChangeEvent<HTMLInputElement>) => {
    const time = (parseFloat(e.target.value) / 100) * (audioRef.current?.duration || 0);
    if (audioRef.current) audioRef.current.currentTime = time;
  };

  return (
    <div className="w-full max-w-md bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl relative overflow-hidden group">
      {/* Decorative Glow */}
      <div 
        className="absolute -top-24 -left-24 w-48 h-48 rounded-full opacity-20 blur-3xl transition-colors duration-1000"
        style={{ backgroundColor: currentTrack.color }}
      ></div>

      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
      />

      <div className="relative z-10">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2 text-white/50 text-xs font-mono uppercase tracking-widest">
            <Music className="w-4 h-4" />
            Playing Now
          </div>
          <button 
            onClick={() => setShowPlaylist(!showPlaylist)}
            className={`transition-colors ${showPlaylist ? 'text-cyan-400' : 'text-white/50 hover:text-white'}`}
          >
            <ListMusic className="w-5 h-5" />
          </button>
        </div>

        <AnimatePresence mode="wait">
          {!showPlaylist ? (
            <motion.div
              key="player"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col items-center"
            >
              <div className="relative w-48 h-48 mb-8 group/cover">
                <div 
                  className="absolute inset-0 rounded-2xl blur-lg opacity-40 transition-colors duration-1000"
                  style={{ backgroundColor: currentTrack.color }}
                ></div>
                <img
                  src={currentTrack.cover}
                  alt={currentTrack.title}
                  className="w-full h-full object-cover rounded-2xl relative z-10 border border-white/20"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover/cover:opacity-100 transition-opacity">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30">
                    <Music className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-white mb-1 tracking-tight">{currentTrack.title}</h3>
                <p className="text-white/40 font-medium uppercase text-xs tracking-[0.2em]">{currentTrack.artist}</p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="playlist"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="h-[280px] mb-8 overflow-y-auto pr-2 custom-scrollbar"
            >
              {TRACKS.map((track, idx) => (
                <button
                  key={track.id}
                  onClick={() => {
                    setCurrentTrackIndex(idx);
                    setShowPlaylist(false);
                    setIsPlaying(true);
                  }}
                  className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all mb-2 ${
                    idx === currentTrackIndex ? 'bg-white/10 border border-white/20' : 'hover:bg-white/5'
                  }`}
                >
                  <img src={track.cover} className="w-12 h-12 rounded-lg object-cover" referrerPolicy="no-referrer" />
                  <div className="flex-1 text-left">
                    <div className={`font-semibold text-sm ${idx === currentTrackIndex ? 'text-white' : 'text-white/70'}`}>
                      {track.title}
                    </div>
                    <div className="text-white/30 text-[10px] uppercase tracking-wider">{track.artist}</div>
                  </div>
                  {idx === currentTrackIndex && isPlaying && (
                    <div className="flex gap-0.5 items-end h-3">
                      {[0.6, 1, 0.4].map((h, i) => (
                        <motion.div
                          key={i}
                          animate={{ height: ['40%', '100%', '40%'] }}
                          transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
                          className="w-0.5 bg-cyan-400"
                        />
                      ))}
                    </div>
                  )}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-6">
          <div className="space-y-1">
            <input
              type="range"
              min="0"
              max="100"
              value={progress}
              onChange={handleSeek}
              className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-white hover:accent-cyan-400 transition-all"
              style={{
                background: `linear-gradient(to right, ${currentTrack.color} ${progress}%, rgba(255,255,255,0.1) ${progress}%)`
              }}
            />
            <div className="flex justify-between text-[10px] font-mono text-white/30 uppercase tracking-widest pt-1">
              <span>{Math.floor((audioRef.current?.currentTime || 0) / 60)}:{(Math.floor((audioRef.current?.currentTime || 0) % 60)).toString().padStart(2, '0')}</span>
              <span>{Math.floor((audioRef.current?.duration || 0) / 60)}:{(Math.floor((audioRef.current?.duration || 0) % 60)).toString().padStart(2, '0')}</span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-8">
            <button onClick={handleSkipBack} className="text-white/60 hover:text-white transition-colors">
              <SkipBack className="w-6 h-6 fill-current" />
            </button>
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-black hover:scale-105 transition-transform shadow-[0_0_20px_rgba(255,255,255,0.4)]"
            >
              {isPlaying ? (
                <Pause className="w-8 h-8 fill-current" />
              ) : (
                <Play className="w-8 h-8 fill-current ml-1" />
              )}
            </button>
            <button onClick={handleSkipForward} className="text-white/60 hover:text-white transition-colors">
              <SkipForward className="w-6 h-6 fill-current" />
            </button>
          </div>

          <div className="flex items-center gap-4 px-8">
            <Volume2 className="w-4 h-4 text-white/30" />
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-white/50"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
