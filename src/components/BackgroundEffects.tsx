import { useEffect, useState, useRef, useMemo, memo } from 'react'

type EffectType = 'none' | 'zen' | 'progress' | 'pulse' | 'rain' | 'fireflies' | 'particles'
type Phase = 'work' | 'shortBreak' | 'longBreak'

interface BackgroundEffectsProps {
  effect: EffectType
  phase: Phase
  theme: string
  progress: number
}

const Rain = memo(({ theme }: { theme: string }) => {
  const drops = useMemo(() => Array.from({ length: 20 }).map((_, i) => ({
    left: `${Math.random() * 100}%`,
    delay: `${Math.random() * 2}s`,
    duration: `${0.5 + Math.random() * 0.5}s`
  })), [])

  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
      {drops.map((drop, i) => (
        <div
          key={i}
          className="absolute top-[-20px] w-[1px] h-[20px] animate-rain"
          style={{
            left: drop.left,
            background: theme === 'oled' ? 'rgba(74, 222, 128, 0.5)' : theme === 'e-ink' ? 'rgba(0, 0, 0, 0.3)' : 'rgba(255, 255, 255, 0.3)',
            animationName: 'fall',
            animationDuration: drop.duration,
            animationTimingFunction: 'linear',
            animationIterationCount: 'infinite',
            animationDelay: drop.delay
          }}
        />
      ))}
      <style jsx>{`
          @keyframes fall {
            to { transform: translateY(100vh); }
          }
        `}</style>
    </div>
  )
})
Rain.displayName = 'Rain'

const Particles = memo(({ theme }: { theme: string }) => {
  const particles = useMemo(() => Array.from({ length: 40 }).map((_, i) => ({
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    delay: `${Math.random() * 5}s`,
    duration: `${10 + Math.random() * 10}s`,
    size: Math.random() * 6 + 2,
    tx: Math.random() * 100 - 50, // Random translation X
    ty: Math.random() * 100 - 50  // Random translation Y
  })), [])

  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
      {particles.map((p, i) => (
        <div
          key={i}
          className="absolute rounded-full opacity-30"
          style={{
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            background: theme === 'oled' ? 'rgba(74, 222, 128, 0.6)' : theme === 'e-ink' ? 'rgba(0, 0, 0, 0.4)' : 'rgba(255, 255, 255, 0.4)',
            animationName: i % 2 === 0 ? 'float1' : 'float2',
            animationDuration: p.duration,
            animationTimingFunction: 'ease-in-out',
            animationIterationCount: 'infinite',
            animationDirection: 'alternate',
            animationDelay: p.delay
          }}
        />
      ))}
      <style jsx>{`
          @keyframes float1 {
            0% { transform: translate(0, 0); }
            100% { transform: translate(60px, -60px); }
          }
          @keyframes float2 {
            0% { transform: translate(0, 0); }
            100% { transform: translate(-60px, 60px); }
          }
        `}</style>
    </div>
  )
})
Particles.displayName = 'Particles'

const Fireflies = memo(({ theme }: { theme: string }) => {
  const fireflies = useMemo(() => Array.from({ length: 30 }).map((_, i) => ({
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    animationDuration: `${15 + Math.random() * 15}s`,
    flickerDuration: `${3 + Math.random() * 3}s`,
    delay: `${Math.random() * 5}s`,
    size: Math.random() * 4 + 2,
    animType: Math.floor(Math.random() * 3) + 1 // 1, 2, or 3
  })), [])

  const color = theme === 'oled' ? 'rgba(163, 230, 53, 0.8)' : theme === 'e-ink' ? 'rgba(0, 0, 0, 0.6)' : 'rgba(250, 204, 21, 0.8)'
  const glow = theme === 'e-ink' ? 'none' : `0 0 ${theme === 'oled' ? '8px rgba(163, 230, 53, 0.6)' : '8px rgba(250, 204, 21, 0.6)'}`

  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
      {fireflies.map((f, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            left: f.left,
            top: f.top,
            animationName: `firefly-float-${f.animType}`,
            animationDuration: f.animationDuration,
            animationTimingFunction: 'ease-in-out',
            animationIterationCount: 'infinite',
            animationDelay: f.delay
          }}
        >
          <div
            className="rounded-full"
            style={{
              width: f.size,
              height: f.size,
              backgroundColor: color,
              boxShadow: glow,
              animationName: 'flicker',
              animationDuration: f.flickerDuration,
              animationTimingFunction: 'ease-in-out',
              animationIterationCount: 'infinite'
            }}
          />
        </div>
      ))}
      <style jsx>{`
          @keyframes firefly-float-1 {
            0% { transform: translate(0, 0); }
            20% { transform: translate(60px, -40px); }
            40% { transform: translate(30px, -90px); }
            60% { transform: translate(-50px, -50px); }
            80% { transform: translate(-30px, 30px); }
            100% { transform: translate(0, 0); }
          }
          @keyframes firefly-float-2 {
            0% { transform: translate(0, 0); }
            25% { transform: translate(-60px, 50px); }
            50% { transform: translate(-90px, 0px); }
            75% { transform: translate(-50px, -60px); }
            100% { transform: translate(0, 0); }
          }
          @keyframes firefly-float-3 {
            0% { transform: translate(0, 0); }
            33% { transform: translate(70px, 60px); }
            66% { transform: translate(40px, -70px); }
            100% { transform: translate(0, 0); }
          }
          @keyframes flicker {
            0%, 100% { opacity: 0.2; transform: scale(0.8); }
            50% { opacity: 1; transform: scale(1.2); }
          }
        `}</style>
    </div>
  )
})
Fireflies.displayName = 'Fireflies'

export default function BackgroundEffects({ effect, phase, theme, progress }: BackgroundEffectsProps) {
  const [styles, setStyles] = useState<React.CSSProperties>({})
  const containerRef = useRef<HTMLDivElement>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight
        })
      }
    }

    updateDimensions()
    window.addEventListener('resize', updateDimensions)

    return () => window.removeEventListener('resize', updateDimensions)
  }, [])

  useEffect(() => {
    if (effect === 'none') {
      setStyles({})
      return
    }

    const color = theme === 'oled' ? 'rgba(74, 222, 128, 0.1)' : theme === 'e-ink' ? 'rgba(0, 0, 0, 0.05)' : 'rgba(255, 255, 255, 0.05)'

    if (effect === 'zen') {
      if (phase === 'work') {
        setStyles({
          backgroundImage: `linear-gradient(${color} 1px, transparent 1px), linear-gradient(90deg, ${color} 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        })
      } else if (phase === 'shortBreak') {
        setStyles({
          backgroundImage: `repeating-linear-gradient(45deg, ${color} 0, ${color} 1px, transparent 0, transparent 50%)`,
          backgroundSize: '20px 20px'
        })
      } else {
        setStyles({
          backgroundImage: `radial-gradient(${color} 1px, transparent 1px)`,
          backgroundSize: '30px 30px'
        })
      }
    } else {
      setStyles({})
    }
  }, [effect, phase, theme])

  if (effect === 'progress') {
    const strokeWidth = 4
    // Calculate dimensions for the path (centered stroke)
    const w = dimensions.width - strokeWidth
    const h = dimensions.height - strokeWidth

    // Perimeter of the path
    const perimeter = 2 * (w + h)

    return (
      <div ref={containerRef} className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <svg className="w-full h-full">
          <rect
            x={strokeWidth / 2}
            y={strokeWidth / 2}
            width={w > 0 ? w : 0}
            height={h > 0 ? h : 0}
            fill="none"
            stroke="red"
            strokeWidth={strokeWidth}
            strokeDasharray={perimeter > 0 ? perimeter : 'none'}
            strokeDashoffset={perimeter * (1 - progress)}
            className="transition-all duration-1000 ease-linear"
          />
        </svg>
      </div>
    )
  }

  if (effect === 'pulse') {
    return (
      <div ref={containerRef} className="absolute inset-0 pointer-events-none z-0 overflow-hidden flex items-center justify-center">
        <div
          className="w-[60vw] h-[60vw] rounded-full opacity-20 animate-pulse"
          style={{
            background: `radial-gradient(circle, ${theme === 'oled' ? 'rgba(74, 222, 128, 0.3)' : theme === 'e-ink' ? 'rgba(0, 0, 0, 0.2)' : 'rgba(255, 255, 255, 0.1)'} 0%, transparent 70%)`,
            animationDuration: '4s'
          }}
        />
      </div>
    )
  }

  if (effect === 'rain') {
    return <Rain theme={theme} />
  }

  if (effect === 'fireflies') {
    return <Fireflies theme={theme} />
  }


  if (effect === 'particles') {
    return <Particles theme={theme} />
  }

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none transition-all duration-1000 z-0"
      style={styles}
    />
  )
}
