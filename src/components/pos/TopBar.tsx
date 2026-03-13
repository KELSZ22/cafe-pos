import { useState, useEffect } from 'react'
import { usePosStore } from '#/store/pos-store'
import { useThemeStore } from '#/store/theme-store'
import { Coffee, User, Moon, Sun, LogOut } from 'lucide-react'

export default function TopBar() {
  const settings = usePosStore((s) => s.settings)
  const currentUser = usePosStore((s) => s.currentUser)
  const logout = usePosStore((s) => s.logout)
  const { theme, toggleTheme } = useThemeStore()
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const formattedTime = time.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  })

  const formattedDate = time.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-cafe-border bg-cafe-warm-white px-3 sm:h-16 sm:px-6">
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-cafe-brown text-white sm:h-9 sm:w-9">
          <Coffee className="h-4 w-4 sm:h-5 sm:w-5" />
        </div>
        <div>
          <h1 className="text-sm font-bold leading-tight text-cafe-text sm:text-base">
            {settings.storeName}
          </h1>
          <p className="hidden text-xs font-medium text-cafe-text-muted sm:block">
            {settings.storeSubtitle}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <div className="text-right">
          <p className="text-xs font-semibold text-cafe-text sm:text-sm">{formattedTime}</p>
          <p className="hidden text-xs text-cafe-text-muted sm:block">{formattedDate}</p>
        </div>

        <button
          onClick={toggleTheme}
          className="flex h-8 w-8 items-center justify-center rounded-xl border border-cafe-border text-cafe-text-muted transition hover:bg-cafe-cream hover:text-cafe-text sm:h-9 sm:w-9"
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>

        <div className="flex items-center gap-1.5 rounded-xl bg-cafe-cream px-2 py-1.5 sm:gap-2 sm:px-3 sm:py-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-cafe-brown-light/30 sm:h-7 sm:w-7">
            <User className="h-3.5 w-3.5 text-cafe-brown sm:h-4 sm:w-4" />
          </div>
          <span className="hidden text-sm font-semibold text-cafe-brown-dark sm:inline">
            {currentUser?.name ?? settings.cashierName}
          </span>
        </div>

        <button
          onClick={logout}
          className="flex h-8 w-8 items-center justify-center rounded-xl border border-cafe-border text-cafe-text-muted transition hover:border-red-300 hover:bg-red-50 hover:text-red-500 sm:h-9 sm:w-9"
          title="Clock out"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </header>
  )
}
