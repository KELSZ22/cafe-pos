import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { usePosStore } from '#/store/pos-store'
import { useThemeStore } from '#/store/theme-store'
import { Store, Receipt, Percent, User, ImageIcon, Save, RotateCcw, Moon, Sun, Palette } from 'lucide-react'
import { toast } from 'sonner'
import { defaultSettings } from '#/data/pos-data'
import { cn } from '#/lib/utils'

export const Route = createFileRoute('/settings')({ component: SettingsPage })

function SettingsPage() {
  const settings = usePosStore((s) => s.settings)
  const updateSettings = usePosStore((s) => s.updateSettings)
  const { theme, setTheme } = useThemeStore()

  const [form, setForm] = useState({ ...settings })
  const [hasChanges, setHasChanges] = useState(false)

  const handleChange = (field: string, value: string | number) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    setHasChanges(true)
  }

  const handleSave = () => {
    updateSettings(form)
    setHasChanges(false)
    toast.success('Settings saved successfully!')
  }

  const handleReset = () => {
    setForm({ ...defaultSettings })
    updateSettings({ ...defaultSettings })
    setHasChanges(false)
    toast.success('Settings reset to defaults')
  }

  return (
    <div className="flex h-full flex-col overflow-hidden bg-cafe-bg">
      <div className="shrink-0 border-b border-cafe-border bg-cafe-card px-4 py-3 sm:px-6 sm:py-4">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h1 className="text-base font-bold text-cafe-text sm:text-lg">Settings</h1>
            <p className="text-xs text-cafe-text-muted">Configure your POS system</p>
          </div>
          <div className="flex gap-1.5 sm:gap-2">
            <button
              onClick={handleReset}
              className="pos-btn flex items-center gap-1.5 rounded-xl border border-cafe-border bg-cafe-card px-2.5 py-2 text-xs font-semibold text-cafe-text-muted transition hover:bg-cafe-gray hover:text-cafe-text sm:gap-2 sm:px-4 sm:py-2.5 sm:text-sm"
            >
              <RotateCcw className="h-4 w-4" />
              <span className="hidden sm:inline">Reset</span>
            </button>
            <button
              onClick={handleSave}
              disabled={!hasChanges}
              className="pos-btn flex items-center gap-1.5 rounded-xl bg-cafe-brown px-2.5 py-2 text-xs font-semibold text-white shadow-md shadow-cafe-brown/20 transition hover:bg-cafe-brown-dark disabled:opacity-40 sm:gap-2 sm:px-4 sm:py-2.5 sm:text-sm"
            >
              <Save className="h-4 w-4" />
              <span className="hidden sm:inline">Save Changes</span>
              <span className="sm:hidden">Save</span>
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 pb-24 sm:p-6 sm:pb-6 pos-scrollbar">
        <div className="mx-auto max-w-2xl space-y-5">
          <SettingsSection
            icon={<Store className="h-5 w-5" />}
            title="Store Information"
            description="Basic store details displayed on receipts and the POS"
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <SettingsField label="Store Name">
                <input
                  value={form.storeName}
                  onChange={(e) => handleChange('storeName', e.target.value)}
                  className="settings-input"
                />
              </SettingsField>
              <SettingsField label="Subtitle">
                <input
                  value={form.storeSubtitle}
                  onChange={(e) => handleChange('storeSubtitle', e.target.value)}
                  className="settings-input"
                />
              </SettingsField>
            </div>
            <SettingsField label="Currency Symbol">
              <input
                value={form.currency}
                onChange={(e) => handleChange('currency', e.target.value)}
                className="settings-input"
                maxLength={3}
              />
            </SettingsField>
          </SettingsSection>

          <SettingsSection
            icon={<User className="h-5 w-5" />}
            title="Cashier"
            description="Default cashier name for orders"
          >
            <SettingsField label="Cashier Name">
              <input
                value={form.cashierName}
                onChange={(e) => handleChange('cashierName', e.target.value)}
                className="settings-input"
              />
            </SettingsField>
          </SettingsSection>

          <SettingsSection
            icon={<Percent className="h-5 w-5" />}
            title="Tax Configuration"
            description="Tax rate applied to all orders"
          >
            <SettingsField label="Tax Rate (%)">
              <div className="relative">
                <input
                  type="number"
                  value={form.taxRate}
                  onChange={(e) => handleChange('taxRate', parseFloat(e.target.value) || 0)}
                  className="settings-input pr-10"
                  min={0}
                  max={100}
                  step={0.5}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-cafe-text-muted">
                  %
                </span>
              </div>
            </SettingsField>
          </SettingsSection>

          <SettingsSection
            icon={<Receipt className="h-5 w-5" />}
            title="Receipt"
            description="Customize receipt footer message"
          >
            <SettingsField label="Receipt Footer">
              <textarea
                value={form.receiptFooter}
                onChange={(e) => handleChange('receiptFooter', e.target.value)}
                rows={3}
                className="settings-input h-auto! py-2.5"
              />
            </SettingsField>
          </SettingsSection>

          <SettingsSection
            icon={<ImageIcon className="h-5 w-5" />}
            title="Branding"
            description="Store logo displayed on receipts"
          >
            <SettingsField label="Logo URL">
              <input
                value={form.logoUrl}
                onChange={(e) => handleChange('logoUrl', e.target.value)}
                placeholder="https://..."
                className="settings-input"
              />
            </SettingsField>
            {form.logoUrl && (
              <div className="mt-3 flex justify-center">
                <div className="overflow-hidden rounded-xl border border-cafe-border bg-cafe-gray-soft p-4">
                  <img
                    src={form.logoUrl}
                    alt="Store logo preview"
                    className="h-20 w-20 rounded-lg object-contain"
                    onError={(e) => {
                      ;(e.target as HTMLImageElement).style.display = 'none'
                    }}
                  />
                </div>
              </div>
            )}
          </SettingsSection>

          <SettingsSection
            icon={<Palette className="h-5 w-5" />}
            title="Appearance"
            description="Theme and display preferences"
          >
            <div>
              <label className="mb-2 block text-xs font-semibold text-cafe-text-muted">Theme</label>
              <div className="flex gap-3">
                {(['light', 'dark'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTheme(t)}
                    className={cn(
                      'flex flex-1 items-center justify-center gap-2.5 rounded-xl border-2 px-4 py-3 text-sm font-semibold transition-all',
                      theme === t
                        ? 'border-cafe-brown bg-cafe-cream text-cafe-brown-dark'
                        : 'border-cafe-border text-cafe-text-muted hover:border-cafe-brown-light',
                    )}
                  >
                    {t === 'light' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                    {t === 'light' ? 'Light' : 'Dark'}
                  </button>
                ))}
              </div>
            </div>
          </SettingsSection>

          <div className="pos-card overflow-hidden">
            <div className="border-b border-cafe-border bg-cafe-cream/50 px-5 py-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-cafe-text-muted">
                Receipt Preview
              </h3>
            </div>
            <div className="p-5">
              <div className="mx-auto max-w-[280px] rounded-xl border border-dashed border-cafe-border bg-cafe-gray-soft p-5 font-mono text-xs">
                <div className="mb-3 text-center">
                  <p className="text-sm font-bold">{form.storeName}</p>
                  <p className="text-cafe-text-muted">{form.storeSubtitle}</p>
                </div>
                <div className="mb-2 border-b border-dashed border-cafe-border pb-2">
                  <div className="flex justify-between">
                    <span>Order #1234</span>
                    <span>{new Date().toLocaleDateString()}</span>
                  </div>
                  <p>Cashier: {form.cashierName}</p>
                </div>
                <div className="mb-2 space-y-1 border-b border-dashed border-cafe-border pb-2">
                  <div className="flex justify-between">
                    <span>Americano (L) x2</span>
                    <span>{form.currency}300</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Ensaymada x1</span>
                    <span>{form.currency}85</span>
                  </div>
                </div>
                <div className="mb-2 space-y-0.5 border-b border-dashed border-cafe-border pb-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{form.currency}385</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax ({form.taxRate}%)</span>
                    <span>
                      {form.currency}
                      {Math.round(385 * (form.taxRate / 100)).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>
                      {form.currency}
                      {(385 + Math.round(385 * (form.taxRate / 100))).toLocaleString()}
                    </span>
                  </div>
                </div>
                <p className="mt-2 text-center text-cafe-text-muted">{form.receiptFooter}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .settings-input {
          width: 100%;
          height: 2.75rem;
          border-radius: 0.75rem;
          border: 1px solid var(--cafe-border);
          background: var(--cafe-card);
          padding: 0 0.75rem;
          font-size: 0.875rem;
          color: var(--cafe-text);
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .settings-input:focus {
          outline: none;
          border-color: var(--cafe-brown-light);
          box-shadow: 0 0 0 3px rgba(196, 168, 130, 0.15);
        }
        .settings-input::placeholder {
          color: var(--cafe-text-light);
        }
        textarea.settings-input {
          resize: vertical;
          min-height: 4rem;
        }
      `}</style>
    </div>
  )
}

function SettingsSection({
  icon,
  title,
  description,
  children,
}: {
  icon: React.ReactNode
  title: string
  description: string
  children: React.ReactNode
}) {
  return (
    <div className="pos-card overflow-hidden">
      <div className="flex items-center gap-3 border-b border-cafe-border px-5 py-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cafe-cream text-cafe-brown">
          {icon}
        </div>
        <div>
          <h3 className="text-sm font-bold text-cafe-text">{title}</h3>
          <p className="text-xs text-cafe-text-muted">{description}</p>
        </div>
      </div>
      <div className="space-y-4 p-5">{children}</div>
    </div>
  )
}

function SettingsField({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold text-cafe-text-muted">{label}</label>
      {children}
    </div>
  )
}
