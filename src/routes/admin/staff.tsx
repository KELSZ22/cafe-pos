import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useAdminStore } from '#/store/admin-store'
import { cn } from '#/lib/utils'
import { toast } from 'sonner'
import { Users, Search, Filter } from 'lucide-react'

export const Route = createFileRoute('/admin/staff')({ component: StaffPage })

function StaffPage() {
  const getAllStaff = useAdminStore((s) => s.getAllStaff)
  const toggleStaffDuty = useAdminStore((s) => s.toggleStaffDuty)
  const stores = useAdminStore((s) => s.stores)

  const [searchQuery, setSearchQuery] = useState('')
  const [storeFilter, setStoreFilter] = useState('all')
  const [dutyFilter, setDutyFilter] = useState<'all' | 'on' | 'off'>('all')

  const allStaff = getAllStaff()

  const filteredStaff = allStaff.filter((member) => {
    if (searchQuery && !member.name.toLowerCase().includes(searchQuery.toLowerCase()) && !member.role.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }
    if (storeFilter !== 'all' && member.storeId !== storeFilter) return false
    if (dutyFilter === 'on' && !member.isOnDuty) return false
    if (dutyFilter === 'off' && member.isOnDuty) return false
    return true
  })

  const onDutyCount = allStaff.filter((s) => s.isOnDuty).length
  const totalCount = allStaff.length

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="shrink-0 border-b border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-900 sm:px-6">
        <h1 className="text-base font-bold text-slate-900 dark:text-slate-100 sm:text-lg">Staff Management</h1>
        <p className="text-xs text-slate-500">{onDutyCount} of {totalCount} staff currently on duty</p>
      </div>

      <div className="flex-1 overflow-y-auto p-3 sm:p-6 admin-scrollbar">
        {/* Filters */}
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search staff..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-700 placeholder:text-slate-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:focus:ring-indigo-900"
            />
          </div>
          <select
            value={storeFilter}
            onChange={(e) => setStoreFilter(e.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
          >
            <option value="all">All Stores</option>
            {stores.map((store) => (
              <option key={store.id} value={store.id}>{store.name}</option>
            ))}
          </select>
          <div className="flex rounded-lg border border-slate-200 dark:border-slate-700">
            {(['all', 'on', 'off'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setDutyFilter(f)}
                className={cn(
                  'px-3 py-1.5 text-xs font-medium transition-colors first:rounded-l-lg last:rounded-r-lg',
                  dutyFilter === f
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-slate-500 hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800',
                )}
              >
                {f === 'all' ? 'All' : f === 'on' ? 'On Duty' : 'Off Duty'}
              </button>
            ))}
          </div>
        </div>

        {/* Staff Table */}
        <div className="admin-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/50">
                  <th className="px-4 py-3 text-xs font-bold text-slate-500">Staff Member</th>
                  <th className="px-4 py-3 text-xs font-bold text-slate-500">Role</th>
                  <th className="px-4 py-3 text-xs font-bold text-slate-500">Store</th>
                  <th className="px-4 py-3 text-xs font-bold text-slate-500">Status</th>
                  <th className="px-4 py-3 text-xs font-bold text-slate-500">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredStaff.map((member) => (
                  <tr key={`${member.storeId}-${member.id}`} className="border-b border-slate-100 last:border-0 dark:border-slate-800">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          'flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold text-white',
                          member.isOnDuty ? 'bg-indigo-500' : 'bg-slate-300 dark:bg-slate-600',
                        )}>
                          {member.name.charAt(0)}
                        </div>
                        <span className="font-medium text-slate-900 dark:text-slate-100">{member.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-500">{member.role}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full" style={{ backgroundColor: member.storeColor }} />
                        <span className="text-xs text-slate-600 dark:text-slate-400">{member.storeName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn(
                        'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold',
                        member.isOnDuty
                          ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400'
                          : 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500',
                      )}>
                        <span className={cn('h-1.5 w-1.5 rounded-full', member.isOnDuty ? 'bg-emerald-500' : 'bg-slate-300')} />
                        {member.isOnDuty ? 'On Duty' : 'Off Duty'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => {
                          toggleStaffDuty(member.storeId, member.id)
                          toast.success(`${member.name} is now ${member.isOnDuty ? 'off duty' : 'on duty'}`)
                        }}
                        className={cn(
                          'rounded-lg px-3 py-1 text-xs font-semibold transition-colors',
                          member.isOnDuty
                            ? 'bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-950/30 dark:text-red-400 dark:hover:bg-red-950/50'
                            : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100 dark:bg-emerald-950/30 dark:text-emerald-400 dark:hover:bg-emerald-950/50',
                        )}
                      >
                        {member.isOnDuty ? 'Clock Out' : 'Clock In'}
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredStaff.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-sm text-slate-400">
                      No staff members match your filters
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Per-store summary */}
        <div className="mt-6">
          <h2 className="mb-3 text-sm font-bold text-slate-900 dark:text-slate-100">Staff by Store</h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {stores.map((store) => {
              const storeStaff = store.staff
              const onDuty = storeStaff.filter((s) => s.isOnDuty).length
              return (
                <div key={store.id} className="admin-card p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: store.color }} />
                    <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">{store.name}</h3>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-xs text-slate-500">{onDuty} of {storeStaff.length} on duty</span>
                    <div className="flex -space-x-1.5">
                      {storeStaff.map((m) => (
                        <span
                          key={m.id}
                          className={cn(
                            'flex h-6 w-6 items-center justify-center rounded-full border-2 border-white text-[10px] font-bold text-white dark:border-slate-900',
                            m.isOnDuty ? 'bg-indigo-500' : 'bg-slate-300 dark:bg-slate-600',
                          )}
                          title={m.name}
                        >
                          {m.name.charAt(0)}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
