import { Outlet, createFileRoute } from '@tanstack/react-router'
import AdminTopBar from '#/components/admin/AdminTopBar'
import AdminSideNav from '#/components/admin/AdminSideNav'

export const Route = createFileRoute('/admin')({ component: AdminLayout })

function AdminLayout() {
  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-slate-50 dark:bg-slate-950">
      <AdminTopBar />
      <div className="flex flex-1 overflow-hidden">
        <AdminSideNav />
        <main className="flex-1 overflow-hidden pb-16 lg:pb-0">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
