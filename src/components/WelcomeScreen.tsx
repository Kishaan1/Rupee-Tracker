import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ArrowRight, ShieldCheck, Zap, Database } from 'lucide-react';

interface WelcomeScreenProps {
  onComplete: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [statusIndex, setStatusIndex] = useState(0);

  const statuses = [
    'Initializing local offline ledger...',
    'Loading Room SQLite persistence...',
    'Enabling instant Enter-to-save...',
    'Ready for tracking',
  ];

  // Floating amounts animation samples
  const floatingAmounts = [
    { text: '+₹50', x: -110, y: -90, delay: 0.3 },
    { text: '+₹250', x: 120, y: -70, delay: 0.6 },
    { text: '+₹500', x: -130, y: 70, delay: 0.9 },
    { text: '+₹1,500', x: 110, y: 80, delay: 1.2 },
  ];

  useEffect(() => {
    // Progress bar animation from 0 to 100 over ~3.2 seconds
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 1.25;
      });
    }, 40);

    // Status message transitions
    const t1 = setTimeout(() => setStatusIndex(1), 800);
    const t2 = setTimeout(() => setStatusIndex(2), 1700);
    const t3 = setTimeout(() => setStatusIndex(3), 2600);

    // Auto complete after ~3.5 seconds
    const completionTimer = setTimeout(() => {
      onComplete();
    }, 3500);

    return () => {
      clearInterval(interval);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(completionTimer);
    };
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 z-50 flex flex-col justify-between items-center bg-[#090a0f] text-zinc-100 p-6 sm:p-10 select-none overflow-hidden"
    >
      {/* Background radial ambient glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[540px] h-[540px] bg-emerald-500/10 rounded-full blur-[120px]" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[300px] h-[300px] bg-emerald-600/10 rounded-full blur-[80px]" />
        {/* Subtle grid lines */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30" />
      </div>

      {/* Top Bar: Wordmark & Quick Skip */}
      <div className="w-full max-w-md flex items-center justify-between relative z-10">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] uppercase font-mono tracking-[0.25em] text-zinc-400 font-semibold">
            OFFLINE LEDGER
          </span>
        </div>

        <button
          onClick={onComplete}
          className="group flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
        >
          <span>Skip</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* Center: Main Visual Presentation */}
      <div className="w-full max-w-md flex flex-col items-center justify-center text-center relative z-10 py-6 my-auto">
        {/* Animated Central Emblem with Floating ₹ Amounts */}
        <div className="relative w-44 h-44 sm:w-52 sm:h-52 flex items-center justify-center mb-6">
          {/* Subtle spinning dashed ambient orbit */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-0 rounded-full border border-dashed border-emerald-500/20"
          />

          {/* Pulsing glow ring */}
          <motion.div
            animate={{ scale: [1, 1.08, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute inset-2 rounded-full bg-emerald-500/10 blur-md"
          />

          {/* Floating Rupee Amount Chips */}
          {floatingAmounts.map((badge, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.6, x: 0, y: 0 }}
              animate={{
                opacity: [0, 1, 0.9, 1],
                scale: [0.6, 1, 0.95, 1],
                x: badge.x,
                y: badge.y,
              }}
              transition={{
                delay: badge.delay,
                duration: 0.9,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="absolute z-20 px-2.5 py-1 rounded-lg bg-zinc-900/90 border border-emerald-500/30 text-emerald-400 font-mono text-xs font-semibold shadow-lg backdrop-blur-md tabular-nums"
            >
              {badge.text}
            </motion.div>
          ))}

          {/* Center Main ₹ Badge */}
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-b from-zinc-800 to-zinc-900 border border-emerald-500/40 shadow-2xl flex items-center justify-center text-emerald-400 font-bold text-4xl sm:text-5xl"
            style={{
              boxShadow: '0 0 35px rgba(16, 185, 129, 0.25)',
            }}
          >
            <motion.span
              animate={{ y: [-2, 2, -2] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            >
              ₹
            </motion.span>
          </motion.div>
        </div>

        {/* Prominent App Name */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="space-y-1 mb-3"
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-mono font-medium tracking-wider uppercase mb-1">
            <Sparkles className="w-3 h-3 text-emerald-400" />
            Fintech Grade Tracking
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-[0.18em] text-white uppercase font-sans">
            RUPEE TRACKER
          </h1>
        </motion.div>

        {/* Welcome message & Tagline */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="space-y-1.5 max-w-xs sm:max-w-sm mb-6"
        >
          <h2 className="text-lg font-semibold text-zinc-200">
            Welcome to Rupee Tracker
          </h2>
          <p className="text-sm text-zinc-400 italic">
            Every rupee matters. Track it effortlessly.
          </p>
        </motion.div>

        {/* 3 Pillars: Simple · Fast · Offline */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="flex items-center justify-center gap-3 sm:gap-4 text-xs font-medium text-zinc-300 py-2 px-4 rounded-xl bg-white/[0.03] border border-white/5"
        >
          <div className="flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-emerald-400" />
            <span>Simple</span>
          </div>
          <span className="text-zinc-600">·</span>
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Fast</span>
          </div>
          <span className="text-zinc-600">·</span>
          <div className="flex items-center gap-1.5">
            <Database className="w-3.5 h-3.5 text-emerald-400" />
            <span>Offline</span>
          </div>
        </motion.div>
      </div>

      {/* Bottom Area: Progress Bar, Status, and Tap-to-Enter */}
      <div className="w-full max-w-md relative z-10 space-y-3">
        {/* Status Text Transition */}
        <div className="h-5 flex items-center justify-between text-xs text-zinc-400">
          <AnimatePresence mode="wait">
            <motion.span
              key={statusIndex}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
              className="font-mono text-[11px] text-zinc-300"
            >
              {statuses[statusIndex]}
            </motion.span>
          </AnimatePresence>

          <span className="font-mono text-[11px] text-emerald-400 font-semibold tabular-nums">
            {Math.min(100, Math.round(progress))}%
          </span>
        </div>

        {/* Smooth Emerald Progress Bar */}
        <div className="w-full h-1.5 rounded-full bg-zinc-800 overflow-hidden relative">
          <motion.div
            className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full"
            style={{ width: `${progress}%` }}
            transition={{ ease: 'linear' }}
          />
        </div>

        {/* Tap to enter hint */}
        <button
          onClick={onComplete}
          className="w-full py-2 text-center text-[11px] text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
        >
          Tap anywhere to continue
        </button>
      </div>
    </motion.div>
  );
};
