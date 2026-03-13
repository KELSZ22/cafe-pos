import { Link, useMatches } from '@tanstack/react-router'
import { LayoutGrid, UtensilsCrossed, ClipboardList, BarChart3, Settings } from 'lucide-react'
import { cn } from '#/lib/utils'

const navItems = [
  { to: '/' as const, label: 'POS', icon: LayoutGrid },
  { to: '/menu' as const, label: 'Menu', icon: UtensilsCrossed },
  { to: '/orders' as const, label: 'Orders', icon: ClipboardList },
  { to: '/reports' as const, label: 'Reports', icon: BarChart3 },
  { to: '/settings' as const, label: 'Settings', icon: Settings },
]

export default function SideNav() {
  const matches = useMatches()
  const currentPath = matches[matches.length - 1]?.pathname ?? '/'

  return (
    <>
      {/* Desktop: vertical sidebar */}
      <nav className="hidden h-full w-[76px] shrink-0 flex-col items-center border-r border-cafe-border bg-cafe-warm-white py-4 lg:flex">
        <div className="flex flex-1 flex-col gap-1">
          {navItems.map((item) => {
            const isActive = currentPath === item.to
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  'group flex flex-col items-center gap-1 rounded-xl px-3 py-2.5 text-center no-underline transition-all',
                  isActive
                    ? 'bg-cafe-brown text-white shadow-md shadow-cafe-brown/20'
                    : 'text-cafe-text-muted hover:bg-cafe-cream hover:text-cafe-brown-dark',
                )}
              >
                <item.icon
                  className={cn(
                    'h-5 w-5 transition-colors',
                    isActive ? 'text-white' : 'text-cafe-text-light group-hover:text-cafe-brown',
                  )}
                />
                <span className="text-[10px] font-semibold leading-tight">{item.label}</span>
              </Link>
            )
          })}
        </div>
      </nav>

      {/* Tablet / Mobile: floating, rounded bottom navigation bar */}
      <div className="fixed inset-x-0 bottom-3 z-40 flex justify-center px-3 pb-[env(safe-area-inset-bottom)] lg:hidden">
        <nav className="flex w-full max-w-md items-center justify-evenly rounded-3xl border border-cafe-border bg-cafe-warm-white/95 px-2 py-1.5 shadow-[0_10px_30px_rgba(0,0,0,0.08)] backdrop-blur">
          {navItems.map((item) => {
            const isActive = currentPath === item.to
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  'flex flex-1 flex-col items-center gap-0.5 rounded-2xl py-1.5 text-center text-[11px] font-semibold no-underline transition-colors',
                  isActive ? 'text-cafe-brown' : 'text-cafe-text-light hover:text-cafe-brown-dark',
                )}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>
      </div>
    </>
  )
}
