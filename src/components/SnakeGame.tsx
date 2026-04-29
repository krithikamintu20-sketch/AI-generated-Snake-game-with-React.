import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, RefreshCw, Play, Pause } from 'lucide-react';

interface Point {
  x: number;
  y: number;
}

interface SnakeGameProps {
  onScoreChange: (score: number) => void;
}

const GRID_SIZE = 20;
const INITIAL_SNAKE: Point[] = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION = { x: 0, y: -1 };

export default function SnakeGame({ onScoreChange }: SnakeGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPaused, setIsPaused] = useState(true);
  
  const lastUpdateRef = useRef<number>(0);
  const directionRef = useRef<Point>(INITIAL_DIRECTION);

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      const hitSnake = currentSnake.some(s => s.x === newFood.x && s.y === newFood.y);
      if (!hitSnake) break;
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    directionRef.current = INITIAL_DIRECTION;
    const newFood = generateFood(INITIAL_SNAKE);
    setFood(newFood);
    setGameOver(false);
    setScore(0);
    onScoreChange(0);
    setIsPaused(false);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          if (directionRef.current.y === 0) directionRef.current = { x: 0, y: -1 };
          break;
        case 'ArrowDown':
          if (directionRef.current.y === 0) directionRef.current = { x: 0, y: 1 };
          break;
        case 'ArrowLeft':
          if (directionRef.current.x === 0) directionRef.current = { x: -1, y: 0 };
          break;
        case 'ArrowRight':
          if (directionRef.current.x === 0) directionRef.current = { x: 1, y: 0 };
          break;
        case ' ':
          if (gameOver) resetGame();
          else setIsPaused(prev => !prev);
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameOver]);

  useEffect(() => {
    if (gameOver || isPaused) return;

    const gameLoop = (timestamp: number) => {
      if (!lastUpdateRef.current) lastUpdateRef.current = timestamp;
      const progress = timestamp - lastUpdateRef.current;

      const speed = Math.max(100, 200 - score * 5); // Speed up as score increases

      if (progress > speed) {
        lastUpdateRef.current = timestamp;
        
        setSnake((prevSnake) => {
          const head = prevSnake[0];
          const newHead = {
            x: (head.x + directionRef.current.x + GRID_SIZE) % GRID_SIZE,
            y: (head.y + directionRef.current.y + GRID_SIZE) % GRID_SIZE,
          };

          // Check collision with self
          if (prevSnake.some((s) => s.x === newHead.x && s.y === newHead.y)) {
            setGameOver(true);
            return prevSnake;
          }

          const newSnake = [newHead, ...prevSnake];

          // Check food collision
          if (newHead.x === food.x && newHead.y === food.y) {
            setScore((s) => {
              const newScore = s + 10;
              onScoreChange(newScore);
              return newScore;
            });
            setFood(generateFood(newSnake));
          } else {
            newSnake.pop();
          }

          return newSnake;
        });
      }
      requestAnimationFrame(gameLoop);
    };

    const animationFrame = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animationFrame);
  }, [gameOver, isPaused, food, generateFood, onScoreChange, score]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = canvas.width / GRID_SIZE;

    // Clear canvas
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw snake
    snake.forEach((segment, index) => {
      const alpha = 1 - (index / snake.length) * 0.6;
      ctx.fillStyle = index === 0 ? '#00f2ff' : `rgba(0, 242, 255, ${alpha})`;
      ctx.shadowBlur = index === 0 ? 15 : 5;
      ctx.shadowColor = '#00f2ff';
      
      // Draw rounded segments
      ctx.beginPath();
      ctx.roundRect(segment.x * size + 1, segment.y * size + 1, size - 2, size - 2, 4);
      ctx.fill();
    });

    // Draw food
    ctx.fillStyle = '#ff007f';
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#ff007f';
    ctx.beginPath();
    ctx.arc(food.x * size + size / 2, food.y * size + size / 2, size / 3, 0, Math.PI * 2);
    ctx.fill();

    // Draw grid lines (subtle)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 0.5;
    ctx.shadowBlur = 0;
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * size, 0);
      ctx.lineTo(i * size, canvas.height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * size);
      ctx.lineTo(canvas.width, i * size);
      ctx.stroke();
    }
  }, [snake, food]);

  return (
    <div className="relative group">
      <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-fuchsia-500 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
      <div className="relative bg-black rounded-lg overflow-hidden border border-white/10 shadow-2xl">
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          className="max-w-full aspect-square bg-[#0a0a0a]"
        />
        
        <AnimatePresence>
          {(isPaused || gameOver) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center text-white"
            >
              {gameOver ? (
                <div className="text-center">
                  <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-4 animate-bounce" />
                  <h2 className="text-4xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-fuchsia-400 bg-clip-text text-transparent">
                    GAME OVER
                  </h2>
                  <p className="text-xl mb-6 font-mono text-cyan-200">Score: {score}</p>
                  <button
                    onClick={resetGame}
                    className="px-8 py-3 bg-white text-black font-bold rounded-full hover:bg-cyan-400 transition-colors flex items-center gap-2 mx-auto shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                  >
                    <RefreshCw className="w-5 h-5" />
                    RETRY
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  <h2 className="text-4xl font-bold mb-6 italic tracking-tighter text-fuchsia-400">PAUSED</h2>
                  <button
                    onClick={() => setIsPaused(false)}
                    className="w-20 h-20 bg-white/10 border border-white/20 rounded-full flex items-center justify-center hover:bg-white/20 transition-all group"
                  >
                    <Play className="w-10 h-10 fill-white group-hover:scale-110 transition-transform" />
                  </button>
                  <p className="mt-4 text-xs font-mono uppercase tracking-[0.2em] opacity-50">Press Space to Resume</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
