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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

function LoginInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect')

  const sendOtp = useAuth((s) => s.sendOtp)
  const verifyOtp = useAuth((s) => s.verifyOtp)
  const login = useAuth((s) => s.login)

  function go(role?: string) {
    const dest = redirect || (role ? redirectPathForRole(role) : '/compte')
    router.push(dest)
  }

  // Client OTP state
  const [step, setStep] = useState<'email' | 'code'>('email')
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [phone, setPhone] = useState('')
  const [otpLoading, setOtpLoading] = useState(false)
  const [otpError, setOtpError] = useState<string | null>(null)

  // Team password state
  const [teamEmail, setTeamEmail] = useState('')
  const [password, setPassword] = useState('')
  const [teamLoading, setTeamLoading] = useState(false)
  const [teamError, setTeamError] = useState<string | null>(null)

  async function handleSendOtp(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) return
    setOtpLoading(true)
    setOtpError(null)
    const res = await sendOtp(email.trim(), firstName.trim() || undefined, lastName.trim() || undefined)
    setOtpLoading(false)
    if (res.success) {
      setStep('code')
      toast.success('Code envoyé', { description: `Vérifiez votre boîte mail (${email.trim()}).` })
    } else {
      setOtpError(res.error || "Impossible d'envoyer le code.")
    }
  }

  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault()
    if (!code.trim()) return
    setOtpLoading(true)
    setOtpError(null)
    const res = await verifyOtp(
      email.trim(),
      code.trim(),
      firstName.trim() || undefined,
      lastName.trim() || undefined,
      phone.trim() || undefined,
    )
    setOtpLoading(false)
    if (res.success) {
      toast.success('Connexion réussie')
      go(res.role)
    } else {
      setOtpError(res.error || 'Code invalide.')
    }
  }

  async function handleTeamLogin(e: React.FormEvent) {
    e.preventDefault()
    if (!teamEmail.trim() || !password) return
    setTeamLoading(true)
    setTeamError(null)
    const res = await login(teamEmail.trim(), password)
    setTeamLoading(false)
    if (res.success) {
      toast.success('Connexion réussie')
      go(res.role)
    } else {
      setTeamError(res.error || 'Identifiants invalides.')
    }
  }

  return (
    <div className="container-page flex min-h-[70vh] items-center justify-center py-12">
      <div className="w-full max-w-md">
        <div className="mb-6 flex flex-col items-center text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Sprout className="h-6 w-6" strokeWidth={2} />
          </span>
          <h1 className="mt-4 font-display text-2xl font-bold tracking-tight">Connexion</h1>
          <p className="mt-1 text-sm text-muted-foreground">Accédez à votre compte Dounia Market.</p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
          <Tabs defaultValue="client">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="client">Client</TabsTrigger>
              <TabsTrigger value="team">Équipe</TabsTrigger>
            </TabsList>

            {/* Client - OTP */}
            <TabsContent value="client" className="mt-6">
              {step === 'email' ? (
                <form onSubmit={handleSendOtp} className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="firstName">Prénom</Label>
                      <Input
                        id="firstName"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="Optionnel"
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
                    <p className="text-xs text-muted-foreground">
                      Nouveau client ? Renseignez votre nom, votre compte sera créé automatiquement.
                    </p>
                  </div>
                  {otpError && <p className="text-sm font-medium text-destructive">{otpError}</p>}
                  <Button type="submit" className="w-full" disabled={otpLoading}>
                    {otpLoading ? (
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
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <button
                    type="button"
                    onClick={() => {
                      setStep('email')
                      setOtpError(null)
                    }}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
                  >
                    <ArrowLeft className="h-4 w-4" strokeWidth={1.75} />
                    Modifier l'e-mail
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
                  {otpError && <p className="text-sm font-medium text-destructive">{otpError}</p>}
                  <Button type="submit" className="w-full" disabled={otpLoading}>
                    {otpLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.75} />
                        Vérification
                      </>
                    ) : (
                      'Se connecter'
                    )}
                  </Button>
                </form>
              )}
            </TabsContent>

            {/* Team - password */}
            <TabsContent value="team" className="mt-6">
              <form onSubmit={handleTeamLogin} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="teamEmail">Adresse e-mail</Label>
                  <Input
                    id="teamEmail"
                    type="email"
                    required
                    value={teamEmail}
                    onChange={(e) => setTeamEmail(e.target.value)}
                    placeholder="vous@douniamarket.com"
                    autoComplete="email"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="password">Mot de passe</Label>
                  <Input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                  />
                </div>
                {teamError && <p className="text-sm font-medium text-destructive">{teamError}</p>}
                <Button type="submit" className="w-full" disabled={teamLoading}>
                  {teamLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.75} />
                      Connexion
                    </>
                  ) : (
                    'Se connecter'
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </div>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Pas encore de compte ?{' '}
          <Link href="/auth/register" className="font-semibold text-primary hover:underline">
            Créer un compte
          </Link>
        </p>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginInner />
    </Suspense>
  )
}
