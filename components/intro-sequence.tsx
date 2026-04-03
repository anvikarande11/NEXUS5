'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface ParticleProps {
  id: number
  x: number
  y: number
}

interface Particle extends ParticleProps {
  angle: number
  speed: number
}

const Particle: React.FC<{ particle: Particle }> = ({ particle }) => {
  return (
    <motion.div
      initial={{ x: particle.x, y: particle.y, opacity: 1, scale: 1 }}
      animate={{
        x: particle.x + Math.cos(particle.angle) * particle.speed * 100,
        y: particle.y + Math.sin(particle.angle) * particle.speed * 100,
        opacity: 0,
        scale: 0,
      }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="absolute w-1 h-1 bg-white rounded-full pointer-events-none"
      style={{
        left: 0,
        top: 0,
      }}
    />
  )
}

interface ExpandingRingProps {
  delay: number
}

const ExpandingRing: React.FC<ExpandingRingProps> = ({ delay }) => {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 1 }}
      animate={{ scale: 4, opacity: 0 }}
      transition={{ duration: 0.8, delay, ease: 'easeOut' }}
      className="absolute w-16 h-16 border-2 border-white rounded-full pointer-events-none"
      style={{
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
      }}
    />
  )
}

interface LetterBurstProps {
  letter: string
  index: number
  totalLetters: number
  onComplete?: () => void
}

const LetterBurst: React.FC<LetterBurstProps> = ({ letter, index, totalLetters, onComplete }) => {
  const [particles, setParticles] = useState<Particle[]>([])
  const burstTriggeredRef = useRef(false)

  useEffect(() => {
    const delay = index * 0.15
    const timeoutId = setTimeout(() => {
      if (!burstTriggeredRef.current) {
        burstTriggeredRef.current = true
        // Generate particles in a circular pattern
        const particleCount = 12
        const newParticles: Particle[] = []
        for (let i = 0; i < particleCount; i++) {
          const angle = (i / particleCount) * Math.PI * 2
          newParticles.push({
            id: i,
            x: 0,
            y: 0,
            angle,
            speed: 0.8 + Math.random() * 0.4,
          })
        }
        setParticles(newParticles)

        if (index === totalLetters - 1) {
          setTimeout(onComplete, 800)
        }
      }
    }, delay * 1000)

    return () => clearTimeout(timeoutId)
  }, [index, totalLetters, onComplete])

  const letterDelay = index * 0.15

  return (
    <div className="relative inline-block">
      <motion.div
        initial={{
          opacity: 0,
          scale: 0,
          y: 20,
        }}
        animate={{
          opacity: 1,
          scale: 1,
          y: 0,
        }}
        transition={{
          delay: letterDelay,
          duration: 0.5,
          type: 'spring',
          stiffness: 200,
          damping: 12,
        }}
        className="relative"
      >
        {/* Letter */}
        <div className="text-9xl font-serif font-bold text-white drop-shadow-lg">
          {letter}
        </div>

        {/* Jiggle effect after burst */}
        <motion.div
          initial={{ x: 0, y: 0 }}
          animate={{ x: 0, y: 0 }}
          transition={{
            delay: letterDelay + 0.4,
            duration: 0.4,
          }}
          className="absolute inset-0"
        >
          <motion.div
            animate={{
              x: [0, -3, 3, -2, 2, -1, 1, 0],
              y: [0, 2, -2, 1, -1, 1, -1, 0],
            }}
            transition={{
              delay: letterDelay + 0.45,
              duration: 0.3,
              times: [0, 0.15, 0.3, 0.45, 0.6, 0.75, 0.9, 1],
              type: 'easeInOut',
            }}
            className="w-full h-full"
          />
        </motion.div>

        {/* Particles */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {particles.map((particle) => (
            <Particle key={particle.id} particle={particle} />
          ))}
        </div>

        {/* Expanding rings */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <ExpandingRing delay={letterDelay + 0.1} />
          <ExpandingRing delay={letterDelay + 0.2} />
        </div>
      </motion.div>

      {/* Glow effect */}
      <motion.div
        initial={{
          opacity: 0,
          filter: 'blur(20px)',
        }}
        animate={{
          opacity: [0, 0.8, 0],
          filter: 'blur(20px)',
        }}
        transition={{
          delay: letterDelay,
          duration: 1,
        }}
        className="absolute inset-0 bg-white -z-10"
      />
    </div>
  )
}

interface MorphingShapeProps {
  delay: number
}

const MorphingShape: React.FC<MorphingShapeProps> = ({ delay }) => {
  const shapes = ['circle', 'blob1', 'blob2']
  const colors = ['#A0D3E8', '#7EBBD0', '#C0E6F0']

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        delay,
        duration: 1,
        ease: 'easeOut',
      }}
      className="absolute"
      style={{
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
      }}
    >
      <motion.svg
        width="200"
        height="200"
        viewBox="0 0 200 200"
        className="filter drop-shadow-lg"
        animate={{
          scale: [1, 1.1, 1],
        }}
        transition={{
          delay: delay + 0.5,
          duration: 3,
          repeat: Infinity,
          repeatType: 'reverse',
        }}
      >
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={colors[0]} />
            <stop offset="50%" stopColor={colors[1]} />
            <stop offset="100%" stopColor={colors[2]} />
          </linearGradient>
        </defs>
        <motion.circle
          cx="100"
          cy="100"
          r="80"
          fill="url(#grad)"
          animate={{
            r: [80, 90, 80],
            cx: [100, 95, 105, 100],
            cy: [100, 105, 95, 100],
          }}
          transition={{
            delay: delay + 0.5,
            duration: 4,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
        />
      </motion.svg>
    </motion.div>
  )
}

interface IntroSequenceProps {
  onComplete: () => void
}

export const IntroSequence: React.FC<IntroSequenceProps> = ({ onComplete }) => {
  const [showLetters, setShowLetters] = useState(false)
  const [showMorphing, setShowMorphing] = useState(true)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  // Handle mouse movement for spotlight effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
  }

  // Trigger letter animation after shapes morph
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setShowLetters(true)
    }, 1500)
    return () => clearTimeout(timeoutId)
  }, [])

  const title = 'NEXUS UNI'

  const handleLetterComplete = () => {
    setTimeout(() => {
      // Snap letters together and fade to dashboard
      setShowMorphing(false)
      setTimeout(onComplete, 600)
    }, 500)
  }

  return (
    <AnimatePresence>
      <motion.div
        onMouseMove={handleMouseMove}
        className="fixed inset-0 flex items-center justify-center overflow-hidden"
        style={{
          background: '#E3F2FD',
        }}
      >
        {/* Animated Spotlight */}
        <motion.div
          className="absolute pointer-events-none"
          style={{
            width: '400px',
            height: '400px',
            background: 'radial-gradient(circle, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 70%)',
            left: mousePosition.x - 200,
            top: mousePosition.y - 200,
            filter: 'blur(40px)',
            transition: 'all 0.1s ease-out',
          }}
        />

        {/* Abstract Morphing Shapes */}
        {showMorphing && (
          <>
            <MorphingShape delay={0} />
            <MorphingShape delay={0.3} />
            <MorphingShape delay={0.6} />
          </>
        )}

        {/* Kinetic Typography */}
        {showLetters && (
          <motion.div
            className="relative z-10 flex justify-center items-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {title.split('').map((letter, index) => (
              <LetterBurst
                key={index}
                letter={letter}
                index={index}
                totalLetters={title.length}
                onComplete={index === title.length - 1 ? handleLetterComplete : undefined}
              />
            ))}
          </motion.div>
        )}

        {/* Final Logo Text - Hidden until completion */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={
            !showMorphing && !showLetters
              ? { opacity: 1, scale: 1 }
              : { opacity: 0, scale: 0.8 }
          }
          transition={{ duration: 0.4 }}
        >
          <div className="text-7xl font-serif font-bold text-white drop-shadow-2xl">
            NEXUS UNI
          </div>
        </motion.div>

        {/* Fade to Dashboard */}
        <motion.div
          className="absolute inset-0 bg-black pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            delay: 2.5,
            duration: 0.6,
            ease: 'easeInOut',
          }}
        />
      </motion.div>
    </AnimatePresence>
  )
}
