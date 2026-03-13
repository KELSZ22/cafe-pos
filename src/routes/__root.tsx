import { useEffect } from 'react'
import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRoute,
  useMatches,
  useNavigate,
} from '@tanstack/react-router'
import TopBar from '../components/pos/TopBar'
import SideNav from '../components/pos/SideNav'
import { Toaster } from '../components/ui/sonner'
import { usePosStore } from '../store/pos-store'
import { useThemeStore } from '../store/theme-store'

import appCss from '../styles.css?url'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
      },
      { title: 'Daily Grind' },
    ],
    links: [{ rel: 'stylesheet', href: appCss }],
  }),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if(localStorage.getItem('kubo-cafe-theme')==='dark')document.documentElement.classList.add('dark')}catch(e){}`,
          }}
        />
      </head>
      <body className="font-sans antialiased">
        <RootLayout />
        <Toaster position="top-right" richColors />
        <Scripts />
        {children}
      </body>
    </html>
  )
}

function RootLayout() {
  const isAuthenticated = usePosStore((s) => s.isAuthenticated)
  const theme = useThemeStore((s) => s.theme)
  const matches = useMatches()
  const navigate = useNavigate()
  const currentPath = matches[matches.length - 1]?.pathname ?? '/'
  const isLoginPage = currentPath === '/login'

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  useEffect(() => {
    if (!isAuthenticated && !isLoginPage) {
      navigate({ to: '/login' })
    }
  }, [isAuthenticated, isLoginPage, navigate])

  if (isLoginPage || !isAuthenticated) {
    return <Outlet />
  }

  return (
    <div className="flex h-dvh flex-col overflow-hidden">
      <TopBar />
      <div className="flex flex-1 overflow-hidden">
        <SideNav />
        <main className="flex-1 overflow-hidden pb-14 lg:pb-0">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
