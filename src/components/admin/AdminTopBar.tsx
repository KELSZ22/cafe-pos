import { useState, useEffect } from 'react'
import { Link } from '@tanstack/react-router'
import { useAdminStore } from '#/store/admin-store'
import { usePosStore } from '#/store/pos-store'
import { useThemeStore } from '#/store/theme-store'
import {
  Moon,
  Sun,
  User,
  LogOut,
  ChevronLeft,
} from 'lucide-react'

export default function AdminTopBar() {
  const settings = useAdminStore((s) => s.settings)
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

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4 dark:border-slate-800 dark:bg-slate-900 sm:px-6">
      <div className="flex items-center gap-3">
        <Link
          to="/"
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-400 no-underline transition-colors hover:bg-slate-50 hover:text-slate-600 dark:border-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-300 lg:hidden"
        >
          <ChevronLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-sm font-bold text-slate-900 dark:text-slate-100 sm:text-base">
            {settings.name}
          </h1>
          <p className="hidden text-xs text-slate-500 dark:text-slate-400 sm:block">
            {settings.location}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <span className="hidden text-xs font-medium text-slate-500 dark:text-slate-400 sm:block">
          {formattedTime}
        </span>

        <button
          onClick={toggleTheme}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-400 transition-colors hover:bg-slate-50 hover:text-slate-600 dark:border-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-300"
        >
          {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>

        <div className="flex items-center gap-1.5 rounded-lg bg-slate-100 px-2 py-1.5 dark:bg-slate-800 sm:gap-2 sm:px-3">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-indigo-100 dark:bg-indigo-900/40 sm:h-7 sm:w-7">
            <User className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400 sm:h-4 sm:w-4" />
          </div>
          <div className="hidden sm:block">
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">
              {currentUser?.name ?? 'Admin'}
            </p>
            <p className="text-[10px] text-slate-400">{currentUser?.role ?? 'Manager'}</p>
          </div>
        </div>

        <button
          onClick={logout}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-400 transition-colors hover:border-red-300 hover:bg-red-50 hover:text-red-500 dark:border-slate-700 dark:hover:border-red-800 dark:hover:bg-red-950/30 dark:hover:text-red-400"
          title="Sign out"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </header>
  )
}
