/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Heart, 
  Gift, 
  Music, 
  Pause, 
  Play, 
  Volume2, 
  VolumeX, 
  ChevronLeft, 
  ChevronRight,
  Loader2,
  Calendar,
  Clock
} from 'lucide-react';

// --- Constants & Config ---
const BIRTH_DATE = '1984-08-07';
const MUSIC_URL = 'https://www.image2url.com/r2/default/files/1776946787137-8319428b-57c5-4cde-a217-d018a79e55a4.mp3';

const PHOTOS = [
  'https://www.image2url.com/r2/default/images/1776958725863-de708834-90b5-4d18-8ed3-3ea502d7f08d.jpg',
  'https://www.image2url.com/r2/default/images/1776958814563-df9286c0-e576-4c06-81e3-b8255b6cb8c1.jpg',
  'https://www.image2url.com/r2/default/images/1776958914812-f02f8e14-a9bf-494f-bc72-693ce45518de.jpg',
  'https://www.image2url.com/r2/default/images/1776958651725-68f72ef8-b56c-4dec-a694-3124d29efcd8.jpg',
  'https://www.image2url.com/r2/default/images/1776959403858-7b14086c-db62-4403-98b4-33a9310642c0.jpg'
];

interface FloatingHeart {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  duration: number;
}

// --- Components ---

const BackgroundDecor = () => (
  <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-neutral-950">
    <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-red-900/10 rounded-full blur-[120px]" />
    <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-white/5 rounded-full blur-[100px]" />
    
    <div className="absolute top-1/4 right-1/3 opacity-20 text-3xl select-none">🥰</div>
    <div className="absolute bottom-1/3 left-1/4 opacity-10 text-4xl select-none">❤️</div>
    <div className="absolute top-2/3 left-1/2 opacity-20 text-2xl text-red-600 select-none">❤︎</div>
  </div>
);

const HeartBackground = () => {
  const [hearts, setHearts] = useState<FloatingHeart[]>([]);

  useEffect(() => {
    const newHearts = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 20 + 10,
      color: ['#ff0000', '#ffffff', '#333333'][Math.floor(Math.random() * 3)],
      duration: Math.random() * 10 + 15
    }));
    setHearts(newHearts);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-10">
      {hearts.map((h) => (
        <motion.div
          key={h.id}
          initial={{ y: '110%', x: `${h.x}%`, opacity: 0 }}
          animate={{ 
            y: '-10%', 
            opacity: [0, 0.3, 0.3, 0],
            rotate: [0, 180, 360]
          }}
          transition={{ 
            duration: h.duration, 
            repeat: Infinity, 
            ease: "linear",
            delay: Math.random() * 5
          }}
          className="absolute"
          style={{ width: h.size, height: h.size, color: h.color }}
        >
          <Heart fill="currentColor" size={h.size} />
        </motion.div>
      ))}
    </div>
  );
};

export default function App() {
  const [page, setPage] = useState<1 | 2 | 3>(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Audio Logic
  useEffect(() => {
    audioRef.current = new Audio(MUSIC_URL);
    audioRef.current.loop = true;
    
    return () => {
      audioRef.current?.pause();
      audioRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.log("Audio play failed:", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
      audioRef.current.volume = volume;
    }
  }, [isMuted, volume]);

  const togglePlay = () => setIsPlaying(!isPlaying);
  const toggleMute = () => setIsMuted(!isMuted);

  return (
    <div className="min-h-screen bg-neutral-950 text-white font-sans overflow-x-hidden selection:bg-red-600/30">
      <BackgroundDecor />
      <HeartBackground />
      
      <AnimatePresence mode="wait">
        {page === 1 && (
          <Page1 
            onOpen={() => {
              setIsPlaying(true);
              setPage(2);
            }} 
          />
        )}
        {page === 2 && (
          <Page2 
            onComplete={() => setPage(3)} 
          />
        )}
        {page === 3 && (
          <Page3 
            isPlaying={isPlaying}
            togglePlay={togglePlay}
          />
        )}
      </AnimatePresence>

      {/* Editorial Floating Music Control */}
      {page !== 1 && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed bottom-8 right-12 z-50 flex items-center gap-6 bg-black/40 backdrop-blur-md border border-white/10 px-6 py-3 rounded-full shadow-2xl"
        >
          <div className="flex items-center gap-4">
            <div className="flex gap-1 items-end h-4">
              <motion.div animate={isPlaying ? { height: [8, 14, 8] } : { height: 12 }} transition={{ duration: 0.5, repeat: Infinity }} className="w-[2px] bg-red-600" />
              <motion.div animate={isPlaying ? { height: [12, 4, 12] } : { height: 6 }} transition={{ duration: 0.7, repeat: Infinity }} className="w-[2px] bg-red-600" />
              <motion.div animate={isPlaying ? { height: [4, 10, 4] } : { height: 8 }} transition={{ duration: 0.4, repeat: Infinity }} className="w-[2px] bg-red-600" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold uppercase tracking-[0.1em]">Now Playing</span>
              <span className="text-[9px] text-neutral-500 uppercase tracking-widest font-mono">Soulful Birthday Mix</span>
            </div>
          </div>
          
          <div className="h-4 w-[1px] bg-white/20" />
          
          <div className="flex items-center gap-4">
            <button onClick={togglePlay} className="text-white hover:text-red-500 transition-colors">
              {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
            </button>
            <button onClick={toggleMute} className="text-neutral-500 hover:text-white transition-colors">
              {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>
            <input 
              type="range" 
              min="0" 
              max="1" 
              step="0.1" 
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-16 accent-red-600 h-1 bg-white/10 rounded-full appearance-none cursor-pointer hidden sm:block"
            />
          </div>
        </motion.div>
      )}

      {/* Editorial Footer Details */}
      {page === 3 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          className="fixed bottom-8 left-12 z-50 flex gap-8 pointer-events-none"
        >
          <div className="text-[9px] uppercase tracking-[0.4em] font-bold">Since 07.08.1984</div>
          <div className="text-[9px] uppercase tracking-[0.4em] font-bold hidden sm:block">Classy & Mature • Vol. 42</div>
        </motion.div>
      )}
    </div>
  );
}

// --- Page 1 ---
function Page1({ onOpen }: { onOpen: () => void }) {
  const [isOpening, setIsOpening] = useState(false);

  const handleOpen = () => {
    setIsOpening(true);
    setTimeout(onOpen, 1500);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.1 }}
      className="relative z-20 flex flex-col items-center justify-center min-h-screen px-6 text-center"
    >
      <motion.nav 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="absolute top-12 left-0 right-0 px-12 flex justify-between items-center"
      >
        <span className="text-[10px] tracking-[0.3em] uppercase text-neutral-500 font-bold">A Special Edition</span>
        <span className="text-[10px] tracking-[0.3em] uppercase text-neutral-500 font-bold">Vol. 42</span>
      </motion.nav>

      <motion.h1 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-5xl md:text-8xl font-serif leading-[0.9] mb-16 italic"
      >
        Untuk Ayang <br/>
        <span className="text-red-600 not-italic">Azhar</span> <br/>
        Tercinta ❤️
      </motion.h1>

      <motion.div 
        animate={isOpening ? { 
          scale: [1, 1.2, 0, 2], 
          rotate: [0, 15, -15, 0], 
          opacity: [1, 1, 1, 0] 
        } : { 
          y: [0, -10, 0] 
        }}
        transition={isOpening ? { duration: 1.5, ease: "easeInOut" } : { duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="relative mb-20 cursor-pointer"
        onClick={handleOpen}
      >
        <div className="absolute -inset-12 bg-red-600/10 blur-[100px] rounded-full scale-110 animate-pulse" />
        <div className="relative border-2 border-red-600 p-10 rounded-sm shadow-[0_0_50px_rgba(220,38,38,0.2)] hover:shadow-[0_0_80px_rgba(220,38,38,0.4)] transition-all">
          <Gift size={80} strokeWidth={1} className="text-white" />
        </div>
      </motion.div>

      <button
        onClick={handleOpen}
        disabled={isOpening}
        className="text-[11px] tracking-[0.4em] uppercase font-bold border-b border-red-600 pb-2 hover:text-red-500 transition-colors disabled:opacity-30"
      >
        {isOpening ? 'Opening Edition...' : 'Open Your Gift — 01'}
      </button>
    </motion.div>
  );
}

// --- Page 2 ---
function Page2({ onComplete }: { onComplete: () => void }) {
  const [score, setScore] = useState(0);
  const [isFinishing, setIsFinishing] = useState(false);
  const [targets, setTargets] = useState<{id: number, x: number, y: number, emoji: string}[]>([]);

  useEffect(() => {
    if (score < 10) {
      const interval = setInterval(() => {
        setTargets(prev => [
          ...prev, 
          { 
            id: Date.now(), 
            x: 10 + Math.random() * 80, 
            y: 10 + Math.random() * 80,
            emoji: '❤️'
          }
        ].slice(-4));
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setIsFinishing(true);
      setTimeout(onComplete, 2500);
    }
  }, [score, onComplete]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative z-20 flex flex-col items-center justify-center min-h-screen px-6"
    >
      <nav className="absolute top-12 left-0 right-0 px-12 flex justify-between items-center">
        <span className="text-[10px] tracking-[0.3em] uppercase text-red-500 font-bold">Step 01. Complete</span>
        <span className="text-[10px] tracking-[0.3em] uppercase text-white border-b border-red-600 pb-1 font-bold">02. Hearts Collection</span>
        <span className="text-[10px] tracking-[0.3em] uppercase text-neutral-600 font-bold">03. Hub</span>
      </nav>

      {!isFinishing ? (
        <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
           <div>
              <h2 className="text-neutral-500 text-[10px] uppercase tracking-[0.4em] mb-4 font-bold">Interactive Experience</h2>
              <h1 className="text-6xl font-serif leading-tight mb-8">
                Collect <span className="italic text-red-600">10 Hearts</span> for <br/> Ayang Azhar
              </h1>
              <p className="text-neutral-400 text-sm leading-relaxed uppercase tracking-wider">
                A simple gesture of love to unlock the premium celebration hub curated just for you.
              </p>
              
              <div className="mt-12 flex items-center gap-6">
                 <span className="text-4xl font-serif italic text-red-600">{score.toString().padStart(2, '0')}</span>
                 <div className="h-[2px] w-32 bg-white/10 rounded-full overflow-hidden">
                    <motion.div animate={{ width: `${(score/10)*100}%` }} className="h-full bg-red-600" />
                 </div>
                 <span className="text-sm font-mono text-neutral-500">Vol.10</span>
              </div>
           </div>

           <div className="relative aspect-square border border-white/5 bg-white/2 rounded-full backdrop-blur-sm overflow-hidden flex items-center justify-center group">
              <AnimatePresence>
                {targets.map(t => (
                  <motion.button
                    key={t.id}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1.2, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    whileTap={{ scale: 0.8 }}
                    onClick={() => setScore(s => Math.min(s + 1, 10))}
                    className="absolute text-5xl cursor-pointer hover:drop-shadow-[0_0_20px_#dc2626] transition-all"
                    style={{ left: `${t.x}%`, top: `${t.y}%` }}
                  >
                    {t.emoji}
                  </motion.button>
                ))}
              </AnimatePresence>
              <div className="text-[10px] uppercase font-bold tracking-[0.5em] text-white/10 rotate-90 select-none">Editorial Love Game</div>
           </div>
        </div>
      ) : (
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center">
           <Loader2 className="w-10 h-10 text-red-600 animate-spin mb-8" />
           <p className="text-lg font-serif italic tracking-wide text-neutral-400">Curating your special edition...</p>
        </motion.div>
      )}
    </motion.div>
  );
}

// --- Page 3 ---
function Page3({ isPlaying, togglePlay }: { isPlaying: boolean, togglePlay: () => void }) {
  const [photoIndex, setPhotoIndex] = useState(0);
  const [ucapan, setUcapan] = useState(
    "Ayang Azhar, dari lahir 07-08-1984 sampai hari ini, kamu udah jalan sejauh itu. Semua yang kamu lewatin bukan cuma waktu, tapi perjalanan hidup yang panjang. Sekarang 42 tahun, tetap lanjut, tetap kuat, tetap jadi versi terbaik dari diri kamu sendiri ❤️"
  );

  const stats = useMemo(() => {
    const birth = new Date(BIRTH_DATE);
    const now = new Date();
    const diffDays = Math.ceil(Math.abs(now.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24));
    let age = now.getFullYear() - birth.getFullYear();
    if (now.getMonth() < birth.getMonth() || (now.getMonth() === birth.getMonth() && now.getDate() < birth.getDate())) age--;
    return { age, diffDays };
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative z-20 min-h-screen p-12 max-w-[1440px] mx-auto flex flex-col"
    >
      <nav className="flex justify-between items-center mb-16 px-4">
        <div className="flex items-center gap-4">
          <span className="text-[10px] tracking-[0.3em] uppercase text-neutral-500 font-bold">Est. 1984 — Volume 42</span>
        </div>
        <div className="hidden lg:flex gap-8 text-[11px] tracking-widest uppercase font-semibold">
          <span className="text-red-500/50">01. Gift Open</span>
          <span className="text-red-500/50">02. Hearts Collected</span>
          <span className="text-white border-b border-red-600 pb-1">03. Celebration Hub</span>
        </div>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
        
        {/* Editorial Layout: Left Title & Photos */}
        <div className="lg:col-span-7 space-y-12">
           <div>
              <h1 className="text-6xl md:text-8xl font-serif leading-[0.85] mb-8 italic">
                Untuk Ayang <br/>
                <span className="text-red-600 not-italic">Azhar</span> <br/>
                Tercinta <span className="text-4xl align-middle not-italic">❤️</span>
              </h1>
              <p className="max-w-md text-neutral-500 text-sm leading-relaxed tracking-wide uppercase font-medium">
                A celebration of your 42-year journey. Every day spent with you is a gift that keeps on giving.
              </p>
           </div>

           {/* Editorial Photo Stack/Slider */}
           <div className="flex gap-4 items-end overflow-x-auto pb-4 scrollbar-hide">
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="w-48 h-64 shrink-0 bg-neutral-900 border border-white/10 rounded-sm overflow-hidden relative grayscale hover:grayscale-0 transition-all cursor-pointer"
                onClick={() => setPhotoIndex((photoIndex - 1 + PHOTOS.length) % PHOTOS.length)}
              >
                <img src={PHOTOS[(photoIndex - 1 + PHOTOS.length) % PHOTOS.length]} className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent" />
                <span className="absolute bottom-3 left-3 text-[9px] uppercase tracking-tighter font-bold bg-black/60 px-1 py-0.5">Prev</span>
              </motion.div>

              <div className="w-80 h-[480px] shrink-0 bg-neutral-800 border-2 border-red-600 rounded-sm overflow-hidden relative shadow-2xl shadow-red-900/20 group">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={photoIndex}
                    src={PHOTOS[photoIndex]}
                    className="absolute inset-0 w-full h-full object-cover"
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.5 }}
                  />
                </AnimatePresence>
                <div className="absolute top-4 right-4 bg-red-600 text-[10px] px-2 py-1 uppercase font-bold tracking-widest">Today • Edition</div>
                <div className="absolute inset-x-0 bottom-0 p-4 flex justify-between bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                   <button onClick={() => setPhotoIndex(p => (p - 1 + PHOTOS.length) % PHOTOS.length)} className="text-white"><ChevronLeft size={20}/></button>
                   <button onClick={() => setPhotoIndex(p => (p + 1) % PHOTOS.length)} className="text-white"><ChevronRight size={20}/></button>
                </div>
              </div>

              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="w-32 h-48 shrink-0 bg-neutral-900 border border-white/10 rounded-sm overflow-hidden relative grayscale hover:grayscale-0 transition-all cursor-pointer"
                onClick={() => setPhotoIndex((photoIndex + 1) % PHOTOS.length)}
              >
                 <img src={PHOTOS[(photoIndex + 1) % PHOTOS.length]} className="absolute inset-0 w-full h-full object-cover" />
                 <span className="absolute bottom-3 left-3 text-[9px] uppercase tracking-tighter font-bold bg-black/60 px-1 py-0.5">Next</span>
              </motion.div>
           </div>
        </div>

        {/* Editorial Layout: Right Message & Stats */}
        <div className="lg:col-span-5 space-y-12">
            
           {/* Editorial Message Box */}
           <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-10 rounded-2xl relative">
              <span className="absolute -top-6 -left-6 text-9xl text-red-600 font-serif opacity-20">“</span>
              <div className="relative z-10">
                <textarea 
                  value={ucapan}
                  onChange={(e) => setUcapan(e.target.value)}
                  className="w-full bg-transparent border-none focus:ring-0 text-xl font-serif text-neutral-100 italic leading-relaxed min-h-[250px] scrollbar-hide resize-none p-0"
                />
                <div className="mt-8 flex items-center gap-2">
                  <div className="h-[1px] w-12 bg-red-600"></div>
                  <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-neutral-400 italic">With All My Love</span>
                </div>
              </div>
           </div>

           {/* Editorial Stats */}
           <div className="grid grid-cols-2 gap-6">
              <div className="bg-white/2 border border-white/5 p-8 rounded-2xl backdrop-blur-sm">
                 <p className="text-[10px] text-neutral-500 uppercase tracking-[0.3em] mb-3 font-bold">Current Age</p>
                 <p className="text-5xl font-serif text-white leading-none">
                    {stats.age} <span className="text-xs uppercase tracking-widest text-neutral-600 align-top ml-2">Yrs</span>
                 </p>
              </div>
              <div className="bg-white/2 border border-white/5 p-8 rounded-2xl backdrop-blur-sm">
                 <p className="text-[10px] text-neutral-500 uppercase tracking-[0.3em] mb-3 font-bold">Total Days</p>
                 <p className="text-5xl font-serif text-red-500 leading-none">
                    {stats.diffDays.toLocaleString()} <span className="text-xs uppercase tracking-widest text-neutral-600 align-top ml-2">Days</span>
                 </p>
              </div>
           </div>

           {/* Mini About Section */}
           <div className="pt-8 border-t border-white/5">
              <div className="flex justify-between text-[10px] uppercase tracking-[0.2em] font-bold text-neutral-600">
                <span>Born. 07.08.1984</span>
                <span>Mature & Classy Edition</span>
              </div>
           </div>
        </div>
      </div>
    </motion.div>
  );
}
