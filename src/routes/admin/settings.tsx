import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useAdminStore } from '#/store/admin-store'
import { cn } from '#/lib/utils'
import { toast } from 'sonner'
import {
  Save,
  Building2,
  Clock,
  Percent,
  MapPin,
  ScrollText,
} from 'lucide-react'

export const Route = createFileRoute('/admin/settings')({ component: SettingsPage })

function SettingsPage() {
  const settings = useAdminStore((s) => s.settings)
  const updateFoodCourtSettings = useAdminStore((s) => s.updateFoodCourtSettings)
  const auditLog = useAdminStore((s) => s.auditLog)

  const [form, setForm] = useState({ ...settings })
  const [hasChanges, setHasChanges] = useState(false)

  const handleChange = (field: keyof typeof form, value: string | number) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    setHasChanges(true)
  }

  const handleSave = () => {
    updateFoodCourtSettings(form)
    setHasChanges(false)
    toast.success('Food court settings saved')
  }

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="shrink-0 border-b border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-900 sm:px-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-base font-bold text-slate-900 dark:text-slate-100 sm:text-lg">Food Court Settings</h1>
            <p className="text-xs text-slate-500">Global configuration for the food court</p>
          </div>
          <button
            onClick={handleSave}
            disabled={!hasChanges}
            className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-indigo-700 disabled:opacity-40"
          >
            <Save className="h-4 w-4" />
            Save Changes
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 sm:p-6 admin-scrollbar">
        <div className="mx-auto max-w-2xl space-y-5">
          <Section icon={<Building2 className="h-5 w-5" />} title="General" desc="Food court name and branding">
            <Field label="Food Court Name">
              <input value={form.name} onChange={(e) => handleChange('name', e.target.value)} className="admin-input" />
            </Field>
            <Field label="Total Stalls">
              <input type="number" value={form.totalStalls} onChange={(e) => handleChange('totalStalls', parseInt(e.target.value) || 0)} className="admin-input" min={1} />
            </Field>
          </Section>

          <Section icon={<MapPin className="h-5 w-5" />} title="Location" desc="Physical address">
            <Field label="Address">
              <input value={form.location} onChange={(e) => handleChange('location', e.target.value)} className="admin-input" />
            </Field>
          </Section>

          <Section icon={<Clock className="h-5 w-5" />} title="Operating Hours" desc="When the food court is open">
            <Field label="Hours">
              <input value={form.operatingHours} onChange={(e) => handleChange('operatingHours', e.target.value)} className="admin-input" placeholder="e.g. 10:00 AM – 9:00 PM" />
            </Field>
          </Section>

          <Section icon={<Percent className="h-5 w-5" />} title="Defaults" desc="Default values applied to new stores">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Currency Symbol">
                <input value={form.currency} onChange={(e) => handleChange('currency', e.target.value)} className="admin-input" maxLength={3} />
              </Field>
              <Field label="Default Tax Rate (%)">
                <input type="number" value={form.defaultTaxRate} onChange={(e) => handleChange('defaultTaxRate', parseFloat(e.target.value) || 0)} className="admin-input" min={0} max={100} step={0.5} />
              </Field>
            </div>
          </Section>

          {/* Audit Log */}
          <div className="admin-card overflow-hidden">
            <div className="flex items-center gap-3 border-b border-slate-200 px-5 py-4 dark:border-slate-700">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-500 dark:bg-slate-800">
                <ScrollText className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Audit Log</h3>
                <p className="text-xs text-slate-500">Recent admin actions</p>
              </div>
            </div>
            <div className="max-h-80 overflow-y-auto admin-scrollbar">
              {auditLog.length === 0 ? (
                <p className="px-5 py-4 text-sm text-slate-400">No activity recorded</p>
              ) : (
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {auditLog.slice(0, 15).map((entry) => (
                    <div key={entry.id} className="flex items-start gap-3 px-5 py-3">
                      <div className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-indigo-400" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{entry.action}</p>
                        <p className="text-xs text-slate-500">{entry.details}</p>
                      </div>
                      <span className="shrink-0 text-[11px] text-slate-400">{formatTime(entry.timestamp)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .admin-input {
          width: 100%;
          height: 2.5rem;
          border-radius: 0.5rem;
          border: 1px solid #e2e8f0;
          background: #ffffff;
          padding: 0 0.75rem;
          font-size: 0.875rem;
          color: #1e293b;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .admin-input:focus {
          outline: none;
          border-color: #818cf8;
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.12);
        }
        .dark .admin-input {
          background: #1e293b;
          border-color: #334155;
          color: #f1f5f9;
        }
        .dark .admin-input:focus {
          border-color: #6366f1;
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
        }
      `}</style>
    </div>
  )
}

function Section({ icon, title, desc, children }: { icon: React.ReactNode; title: string; desc: string; children: React.ReactNode }) {
  return (
    <div className="admin-card overflow-hidden">
      <div className="flex items-center gap-3 border-b border-slate-200 px-5 py-4 dark:border-slate-700">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
          {icon}
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">{title}</h3>
          <p className="text-xs text-slate-500">{desc}</p>
        </div>
      </div>
      <div className="space-y-4 p-5">{children}</div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold text-slate-500">{label}</label>
      {children}
    </div>
  )
}

function formatTime(dateString: string): string {
  const diff = Date.now() - new Date(dateString).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1) return 'just now'
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}
