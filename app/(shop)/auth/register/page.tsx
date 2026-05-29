'use client'

import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Loader2, Mail, Sprout } from 'lucide-react'
import { toast } from 'sonner'
import { useAuth } from '@/stores/auth'
import { redirectPathForRole } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

function RegisterInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect')

  const sendOtp = useAuth((s) => s.sendOtp)
  const verifyOtp = useAuth((s) => s.verifyOtp)

  const [step, setStep] = useState<'info' | 'code'>('info')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSendOtp(e: React.FormEvent) {
    e.preventDefault()
    if (!firstName.trim() || !email.trim()) return
    setLoading(true)
    setError(null)
    const res = await sendOtp(email.trim(), firstName.trim(), lastName.trim() || undefined)
    setLoading(false)
    if (res.success) {
      setStep('code')
      toast.success('Code envoyé', { description: `Vérifiez votre boîte mail (${email.trim()}).` })
    } else {
      setError(res.error || "Impossible d'envoyer le code.")
    }
  }

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault()
    if (!code.trim()) return
    setLoading(true)
    setError(null)
    const res = await verifyOtp(
      email.trim(),
      code.trim(),
      firstName.trim(),
      lastName.trim() || undefined,
      phone.trim() || undefined,
    )
    setLoading(false)
    if (res.success) {
      toast.success('Compte créé')
      router.push(redirect || redirectPathForRole(res.role || 'client'))
    } else {
      setError(res.error || 'Code invalide.')
    }
  }

  return (
    <div className="container-page flex min-h-[70vh] items-center justify-center py-12">
      <div className="w-full max-w-md">
        <div className="mb-6 flex flex-col items-center text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Sprout className="h-6 w-6" strokeWidth={2} />
          </span>
          <h1 className="mt-4 font-display text-2xl font-bold tracking-tight">Créer un compte</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Aucun mot de passe requis, nous vous envoyons un code par e-mail.
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
          {step === 'info' ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="firstName">Prénom</Label>
                  <Input
                    id="firstName"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    autoComplete="given-name"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="lastName">Nom</Label>
                  <Input
                    id="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Optionnel"
                    autoComplete="family-name"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email">Adresse e-mail</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="vous@exemple.com"
                  autoComplete="email"
                />
              </div>
              {error && <p className="text-sm font-medium text-destructive">{error}</p>}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.75} />
                    Envoi
                  </>
                ) : (
                  <>
                    <Mail className="h-4 w-4" strokeWidth={1.75} />
                    Recevoir un code
                  </>
                )}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerify} className="space-y-4">
              <button
                type="button"
                onClick={() => {
                  setStep('info')
                  setError(null)
                }}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4" strokeWidth={1.75} />
                Modifier mes informations
              </button>
              <div className="space-y-1.5">
                <Label htmlFor="code">Code de vérification</Label>
                <Input
                  id="code"
                  inputMode="numeric"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Code à 6 chiffres"
                  autoComplete="one-time-code"
                />
                <p className="text-xs text-muted-foreground">Envoyé à {email}.</p>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="phone">Téléphone</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Optionnel"
                  autoComplete="tel"
                />
              </div>
              {error && <p className="text-sm font-medium text-destructive">{error}</p>}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.75} />
                    Vérification
                  </>
                ) : (
                  'Créer mon compte'
                )}
              </Button>
            </form>
          )}
        </div>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Déjà inscrit ?{' '}
          <Link href="/auth/login" className="font-semibold text-primary hover:underline">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  )
}

export default function RegisterPage() {
  return (
    <Suspense fallback={null}>
      <RegisterInner />
    </Suspense>
  )
}
