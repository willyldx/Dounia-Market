'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { useAuth } from '@/stores/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'

type FormValues = {
  firstName: string
  lastName: string
  phone: string
}

export default function ProfilPage() {
  const user = useAuth((s) => s.user)
  const status = useAuth((s) => s.status)
  const updateProfile = useAuth((s) => s.updateProfile)
  const [saving, setSaving] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<FormValues>({
    defaultValues: { firstName: '', lastName: '', phone: '' },
  })

  useEffect(() => {
    if (user) {
      reset({ firstName: user.firstName, lastName: user.lastName, phone: user.phone })
    }
  }, [user, reset])

  async function onSubmit(values: FormValues) {
    setSaving(true)
    const res = await updateProfile({
      firstName: values.firstName.trim(),
      lastName: values.lastName.trim(),
      phone: values.phone.trim(),
    })
    setSaving(false)
    if (res.success) {
      toast.success('Profil mis à jour')
      reset(values)
    } else {
      toast.error(res.error || 'La mise à jour a échoué')
    }
  }

  const loading = status === 'idle' || status === 'loading' || !user

  return (
    <div className="container-page py-10 md:py-14">
      <div className="mx-auto max-w-2xl">
        <Link
          href="/compte"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" strokeWidth={1.75} />
          Mon compte
        </Link>
        <h1 className="mt-3 font-display text-3xl font-bold tracking-tight">Mon profil</h1>
        <p className="mt-2 text-sm text-muted-foreground">Mettez à jour vos informations personnelles.</p>

        {loading ? (
          <div className="mt-8 space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-16 rounded-xl" />
            ))}
          </div>
        ) : (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="mt-8 space-y-5 rounded-2xl border border-border bg-card p-6 shadow-soft"
          >
            <div className="space-y-1.5">
              <Label htmlFor="email">Adresse e-mail</Label>
              <Input id="email" value={user.email} readOnly disabled className="bg-muted/50" />
              <p className="text-xs text-muted-foreground">L'adresse e-mail ne peut pas être modifiée.</p>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="firstName">Prénom</Label>
                <Input
                  id="firstName"
                  {...register('firstName', { required: 'Le prénom est requis' })}
                  aria-invalid={!!errors.firstName}
                />
                {errors.firstName && (
                  <p className="text-sm font-medium text-destructive">{errors.firstName.message}</p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="lastName">Nom</Label>
                <Input id="lastName" {...register('lastName')} />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="phone">Téléphone</Label>
              <Input id="phone" type="tel" {...register('phone')} placeholder="Optionnel" />
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={saving || !isDirty}>
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.75} />
                    Enregistrement
                  </>
                ) : (
                  'Enregistrer'
                )}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
