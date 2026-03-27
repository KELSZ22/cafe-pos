import { Link, useMatches } from '@tanstack/react-router'
import {
  LayoutDashboard,
  Store,
  Users,
  BarChart3,
  Settings,
  ChevronLeft,
  Package,
  ScrollText,
} from 'lucide-react'
import { cn } from '#/lib/utils'

type NavItem = { to: string; label: string; icon: React.ElementType }

const navSections: { label: string; items: NavItem[] }[] = [
  {
    label: 'Overview',
    items: [{ to: '/admin', label: 'Dashboard', icon: LayoutDashboard }],
  },
  {
    label: 'Management',
    items: [
      { to: '/admin/stores', label: 'Stores', icon: Store },
      { to: '/admin/products', label: 'Products', icon: Package },
      { to: '/admin/staff', label: 'Staff', icon: Users },
    ],
  },
  {
    label: 'Insights',
    items: [
      { to: '/admin/reports', label: 'Reports', icon: BarChart3 },
    ],
  },
  {
    label: 'System',
    items: [
      { to: '/admin/activity', label: 'Activity Log', icon: ScrollText },
      { to: '/admin/settings', label: 'Settings', icon: Settings },
    ],
  },
]

export default function AdminSideNav() {
  const matches = useMatches()
  const currentPath = matches[matches.length - 1]?.pathname ?? '/admin'

  const isActive = (to: string) =>
    to === '/admin' ? currentPath === '/admin' : currentPath.startsWith(to)

  return (
    <>
      {/* Desktop sidebar */}
      <nav className="hidden h-full w-56 shrink-0 flex-col bg-slate-900 dark:bg-slate-950 lg:flex">
        <div className="flex h-14 items-center gap-2 border-b border-slate-800 px-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
            <Store className="h-4 w-4" />
          </div>
          <div>
            <p className="text-sm font-bold text-white">CMS</p>
            <p className="text-[10px] text-slate-500"></p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-4 admin-scrollbar">
          {navSections.map((section) => (
            <div key={section.label} className="mb-5">
              <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-wider text-slate-600">
                {section.label}
              </p>
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const active = isActive(item.to)
                  return (
                    <Link
                      key={item.to}
                      to={item.to as '/admin'}
                      className={cn(
                        'group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium no-underline transition-all',
                        active
                          ? 'bg-indigo-600/20 text-indigo-400'
                          : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200',
                      )}
                    >
                      <item.icon
                        className={cn(
                          'h-4 w-4 shrink-0 transition-colors',
                          active
                            ? 'text-indigo-400'
                            : 'text-slate-500 group-hover:text-slate-300',
                        )}
                      />
                      {item.label}
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-slate-800 p-3">
          <Link
            to="/"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-500 no-underline transition-colors hover:bg-slate-800 hover:text-slate-300"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to POS
          </Link>
        </div>
      </nav>

      {/* Mobile bottom bar */}
      <div className="fixed inset-x-0 bottom-3 z-40 flex justify-center px-3 pb-[env(safe-area-inset-bottom)] lg:hidden">
        <nav className="flex w-full max-w-lg items-center justify-evenly rounded-2xl border border-slate-200 bg-white/95 px-1 py-1.5 shadow-lg backdrop-blur dark:border-slate-700 dark:bg-slate-900/95">
          {navSections
            .flatMap((s) => s.items)
            .map((item) => {
              const active = isActive(item.to)
              return (
                <Link
                  key={item.to}
                  to={item.to as '/admin'}
                  className={cn(
                    'flex flex-1 flex-col items-center gap-0.5 rounded-xl py-1.5 text-center text-[10px] font-semibold no-underline transition-colors',
                    active
                      ? 'text-indigo-600 dark:text-indigo-400'
                      : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300',
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
