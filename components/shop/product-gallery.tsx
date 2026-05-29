'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ShoppingBag } from 'lucide-react'
import { cn } from '@/lib/utils'

export function ProductGallery({ images, title }: { images: string[]; title: string }) {
  const valid = images.filter(Boolean)
  const [active, setActive] = useState(0)

  if (valid.length === 0) {
    return (
      <div className="flex aspect-square w-full items-center justify-center rounded-2xl border border-border bg-secondary/40 text-muted-foreground">
        <ShoppingBag className="h-12 w-12" strokeWidth={1.25} />
      </div>
    )
  }

  const current = valid[Math.min(active, valid.length - 1)]

  return (
    <div className="space-y-4">
      <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-border bg-secondary/40">
        <Image
          src={current}
          alt={title}
          fill
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover"
          priority
        />
      </div>

      {valid.length > 1 && (
        <div className="grid grid-cols-5 gap-3">
          {valid.slice(0, 5).map((img, i) => (
            <button
              key={img + i}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Voir l'image ${i + 1}`}
              aria-pressed={i === active}
              className={cn(
                'relative aspect-square overflow-hidden rounded-xl border bg-secondary/40 transition-colors',
                i === active ? 'border-primary' : 'border-border hover:border-foreground/30',
              )}
            >
              <Image src={img} alt="" fill sizes="20vw" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
