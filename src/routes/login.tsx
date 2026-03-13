import { useState, useEffect, useCallback } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { usePosStore } from '#/store/pos-store'
import { useThemeStore } from '#/store/theme-store'
import { Coffee, Delete, Moon, Sun } from 'lucide-react'
import { cn } from '#/lib/utils'

export const Route = createFileRoute('/login')({ component: LoginPage })

function LoginPage() {
  const login = usePosStore((s) => s.login)
  const isAuthenticated = usePosStore((s) => s.isAuthenticated)
  const navigate = useNavigate()
  const { theme, toggleTheme } = useThemeStore()

  const [pin, setPin] = useState('')
  const [error, setError] = useState(false)
  const [shaking, setShaking] = useState(false)
  const [success, setSuccess] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    if (isAuthenticated) navigate({ to: '/' })
  }, [isAuthenticated, navigate])

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const handleDigit = useCallback(
    (digit: string) => {
      if (pin.length >= 4 || success) return
      const next = pin + digit
      setPin(next)
      setError(false)

      if (next.length === 4) {
        const ok = login(next)
        if (ok) {
          setSuccess(true)
          setTimeout(() => navigate({ to: '/' }), 600)
        } else {
          setError(true)
          setShaking(true)
          setTimeout(() => {
            setShaking(false)
            setPin('')
          }, 500)
        }
      }
    },
    [pin, success, login, navigate],
  )

  const handleDelete = useCallback(() => {
    setPin((p) => p.slice(0, -1))
    setError(false)
  }, [])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key >= '0' && e.key <= '9') handleDigit(e.key)
      else if (e.key === 'Backspace') handleDelete()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [handleDigit, handleDelete])

  const formattedTime = currentTime.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  })

  const formattedDate = currentTime.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <div className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-cafe-bg">
      {/* Decorative background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-cafe-brown/5 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-cafe-accent/5 blur-3xl" />
        <div className="absolute left-1/2 top-1/4 h-64 w-64 -translate-x-1/2 rounded-full bg-cafe-cream/60 blur-3xl" />
      </div>

      {/* Theme toggle */}
      <button
        onClick={toggleTheme}
        className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-2xl border border-cafe-border bg-cafe-card text-cafe-text-muted shadow-sm transition hover:bg-cafe-cream hover:text-cafe-text"
      >
        {theme === 'dark' ? (
          <Sun className="h-4.5 w-4.5" />
        ) : (
          <Moon className="h-4.5 w-4.5" />
        )}
      </button>

      <div className="relative z-10 flex w-full max-w-sm flex-col items-center px-6">
        {/* Logo & branding */}
        <div
          className={cn(
            'mb-8 flex flex-col items-center transition-all duration-500',
            success && 'scale-110 opacity-0',
          )}
        >
          <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-cafe-brown shadow-xl shadow-cafe-brown/20">
            <Coffee className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-cafe-text">
            Daily Grind
          </h1>
          <p className="mt-1 text-sm font-medium text-cafe-text-muted">
            Handcrafted Filipino Coffee
          </p>
          <div className="mt-4 text-center">
            <p className="text-2xl font-bold tabular-nums text-cafe-text">
              {formattedTime}
            </p>
            <p className="text-xs text-cafe-text-muted">{formattedDate}</p>
          </div>
        </div>

        {/* PIN card */}
        <div
          className={cn(
            'w-full rounded-3xl border border-cafe-border bg-cafe-card p-6 shadow-xl shadow-cafe-shadow-lg transition-all duration-500',
            success && 'scale-95 opacity-0',
          )}
        >
          <p className="mb-5 text-center text-sm font-semibold text-cafe-text-muted">
            Enter your PIN to clock in
          </p>

          {/* PIN dots */}
          <div
            className={cn(
              'mb-6 flex justify-center gap-4',
              shaking && 'animate-shake',
            )}
          >
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className={cn(
                  'flex h-4 w-4 items-center justify-center rounded-full border-2 transition-all duration-200',
                  i < pin.length
                    ? error
                      ? 'scale-110 border-red-400 bg-red-400'
                      : 'scale-110 border-cafe-brown bg-cafe-brown'
                    : 'border-cafe-border',
                )}
              />
            ))}
          </div>

          {error && (
            <p className="mb-4 text-center text-xs font-medium text-red-500 animate-fade-in">
              Incorrect PIN. Please try again.
            </p>
          )}

          {/* Numpad */}
          <div className="grid grid-cols-3 gap-2.5">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'del'].map(
              (key) => {
                if (key === '') return <div key="empty" />
                if (key === 'del') {
                  return (
                    <button
                      key="del"
                      onClick={handleDelete}
                      className="flex h-14 items-center justify-center rounded-2xl text-cafe-text-muted transition-all hover:bg-cafe-cream active:scale-95"
                    >
                      <Delete className="h-5 w-5" />
                    </button>
                  )
                }
                return (
                  <button
                    key={key}
                    onClick={() => handleDigit(key)}
                    className="flex h-14 items-center justify-center rounded-2xl border border-cafe-border bg-cafe-card text-lg font-bold text-cafe-text transition-all hover:border-cafe-brown-light hover:bg-cafe-cream active:scale-95 active:bg-cafe-cream-dark"
                  >
                    {key}
                  </button>
                )
              },
            )}
          </div>
        </div>

        {/* Staff hint */}
        <div className="mt-6 text-center">
          <p className="text-[11px] text-cafe-text-light">
            Staff PINs: 1234 (Michael) &bull; 0000 (Mark) &bull; 5678 (Jenny)
          </p>
        </div>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
          20%, 40%, 60%, 80% { transform: translateX(4px); }
        }
        .animate-shake {
          animation: shake 400ms ease-in-out;
        }
      `}</style>
    </div>
  )
}
