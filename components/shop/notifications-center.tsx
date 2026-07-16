'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Bell, BellOff, CheckCheck, Package, RotateCcw } from 'lucide-react'
import { motion } from 'motion/react'
import { useAuth } from '@/stores/auth'
import { useNotifications, selectUnreadCount } from '@/stores/notifications'
import { formatOrderDate } from '@/lib/orders'
import type { AppNotification } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

/**
 * Header bell + panel listing order/return status notifications.
 * Renders nothing for guests; resets the store on logout.
 */
export function NotificationsCenter() {
  const authStatus = useAuth((s) => s.status)
  const token = useAuth((s) => s.token)

  const items = useNotifications((s) => s.items)
  const readIds = useNotifications((s) => s.readIds)
  const status = useNotifications((s) => s.status)
  const refresh = useNotifications((s) => s.refresh)
  const markRead = useNotifications((s) => s.markRead)
  const markAllRead = useNotifications((s) => s.markAllRead)
  const reset = useNotifications((s) => s.reset)
  const unread = useNotifications(selectUnreadCount)

  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (authStatus === 'authenticated' && token) refresh(token)
    else if (authStatus === 'guest') reset()
  }, [authStatus, token, refresh, reset])

  if (authStatus !== 'authenticated' || !token) return null

  return (
    <Popover
      open={open}
      onOpenChange={(o) => {
        setOpen(o)
        if (o) refresh(token)
      }}
    >
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative text-muted-foreground"
          aria-label={unread > 0 ? `Notifications, ${unread} non lue${unread > 1 ? 's' : ''}` : 'Notifications'}
        >
          <Bell className="h-5 w-5" strokeWidth={1.75} />
          {unread > 0 && (
            <motion.span
              key={unread}
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 500, damping: 18 }}
              className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-accent-foreground"
            >
              {unread}
            </motion.span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" sideOffset={8} className="w-[min(92vw,380px)] rounded-2xl p-0">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <h2 className="font-display text-sm font-semibold">Notifications</h2>
          {unread > 0 && (
            <Button variant="ghost" size="sm" className="h-8 gap-1.5 text-xs" onClick={markAllRead}>
              <CheckCheck className="h-3.5 w-3.5" strokeWidth={1.75} />
              Tout marquer comme lu
            </Button>
          )}
        </div>

        <div className="max-h-[min(60vh,420px)] overflow-y-auto" aria-live="polite">
          {status === 'loading' && items.length === 0 ? (
            <div className="space-y-3 p-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex gap-3">
                  <Skeleton className="h-9 w-9 shrink-0 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-3.5 w-2/5" />
                    <Skeleton className="h-3 w-4/5" />
                  </div>
                </div>
              ))}
            </div>
          ) : status === 'error' && items.length === 0 ? (
            <div className="flex flex-col items-center px-6 py-10 text-center">
              <p className="text-sm text-muted-foreground">
                Impossible de charger vos notifications.
              </p>
              <Button variant="outline" size="sm" className="mt-4" onClick={() => refresh(token, true)}>
                Réessayer
              </Button>
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center px-6 py-10 text-center">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-secondary/60 text-muted-foreground">
                <BellOff className="h-5 w-5" strokeWidth={1.5} />
              </div>
              <p className="mt-3 text-sm font-medium">Aucune notification</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Vous serez informé ici de l'avancement de vos commandes.
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {items.map((n) => (
                <NotificationRow
                  key={n.id}
                  notification={n}
                  unread={!readIds.includes(n.id)}
                  onOpen={() => {
                    markRead(n.id)
                    setOpen(false)
                  }}
                />
              ))}
            </ul>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}

function NotificationRow({
  notification,
  unread,
  onOpen,
}: {
  notification: AppNotification
  unread: boolean
  onOpen: () => void
}) {
  const Icon = notification.type === 'return_status' ? RotateCcw : Package
  const date = formatOrderDate(notification.createdAt)
  return (
    <li>
      <Link
        href={notification.href}
        onClick={onOpen}
        className={cn(
          'flex gap-3 px-4 py-3 transition-colors hover:bg-secondary/50',
          unread && 'bg-secondary/30',
        )}
      >
        <span
          className={cn(
            'mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full',
            unread ? 'bg-primary/10 text-primary' : 'bg-secondary/60 text-muted-foreground',
          )}
        >
          <Icon className="h-4 w-4" strokeWidth={1.75} />
        </span>
        <div className="min-w-0 flex-1">
          <p className={cn('text-sm', unread ? 'font-semibold' : 'font-medium')}>
            {notification.title}
            {unread && <span className="sr-only"> (non lue)</span>}
          </p>
          <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{notification.body}</p>
          {date && <p className="mt-1 text-[11px] text-muted-foreground/80">{date}</p>}
        </div>
        {unread && <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-accent" aria-hidden />}
      </Link>
    </li>
  )
}
