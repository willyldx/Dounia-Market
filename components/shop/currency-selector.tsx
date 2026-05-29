'use client'

import { useCart } from '@/stores/cart'
import { CURRENCIES } from '@/lib/currency'
import type { CurrencyCode } from '@/lib/types'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export function CurrencySelector({ className }: { className?: string }) {
  const currency = useCart((s) => s.currency)
  const setCurrency = useCart((s) => s.setCurrency)

  return (
    <Select value={currency} onValueChange={(v) => setCurrency(v as CurrencyCode)}>
      <SelectTrigger
        className={className}
        size="sm"
        aria-label="Changer de devise"
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {CURRENCIES.map((c) => (
          <SelectItem key={c.code} value={c.code}>
            {c.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
