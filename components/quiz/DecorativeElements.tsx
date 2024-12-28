"use client";

import { motion } from "framer-motion";
import { Brain, Clock, Trophy, Target, RefreshCw, Code, Lightbulb } from "lucide-react";

const decorativeElements = [
  { color: "violet", delay: 0, size: 400 },
  { color: "indigo", delay: 0.2, size: 300 },
  { color: "purple", delay: 0.4, size: 350 },
  { color: "blue", delay: 0.6, size: 250 },
  { color: "violet", delay: 0.8, size: 200 },
  { color: "indigo", delay: 1, size: 280 },
];

export function DecorativeElements() {
  return (
    <>
      <div className="fixed inset-0 -z-10">
        {decorativeElements.map((el, i) => (
          <motion.div
            key={i}
            className={`absolute bg-${el.color}-500/5 dark:bg-${el.color}-500/3 
              rounded-full filter blur-3xl animate-blob`}
            style={{
              width: `${el.size}px`,
              height: `${el.size}px`,
              top: `${20 + (i * 15)}%`,
              left: i % 2 === 0 ? `-${5 + (i * 2)}%` : `${80 + (i * 2)}%`,
              animationDelay: `${el.delay}s`,
            }}
            animate={{
              x: [0, 30, -30, 0],
              y: [0, -30, 30, 0],
              scale: [1, 1.1, 0.9, 1],
            }}
            transition={{
              duration: 15 + i * 2,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
        <div className="absolute inset-0 bg-grid-zinc-200/50 dark:bg-grid-zinc-800/50 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
      </div>

      <div className="fixed left-10 inset-y-0 hidden lg:flex flex-col justify-around items-center">
        <FloatingIcon icon={Code} size={24} />
        <FloatingIcon icon={Brain} size={20} delay={0.2} />
        <FloatingIcon icon={Target} size={16} delay={0.4} />
      </div>

      <div className="fixed right-10 inset-y-0 hidden lg:flex flex-col justify-around items-center">
        <FloatingIcon icon={Trophy} size={20} delay={0.1} />
        <FloatingIcon icon={Clock} size={24} delay={0.3} />
        <FloatingIcon icon={Lightbulb} size={16} delay={0.5} />
      </div>
    </>
  );
}

function FloatingIcon({ 
  icon: Icon, 
  size, 
  delay = 0 
}: { 
  icon: any; 
  size: number; 
  delay?: number;
}) {
  return (
    <motion.div
      animate={{ y: [0, -10, 0], rotate: [0, -5, 5, 0] }}
      transition={{ duration: 5, repeat: Infinity, delay }}
      className="text-violet-500/20 dark:text-violet-400/20"
    >
      <Icon className={`w-${size} h-${size}`} />
    </motion.div>
  );
} 