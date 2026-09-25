'use client'

import { useEffect, useState } from 'react'
import {
  Wallet,
  Building2,
  Smartphone,
  PlusCircle,
  CheckCircle2,
  Trash2,
  CreditCard,
  TrendingUp,
  Clock,
} from 'lucide-react'
import { useAuth } from '@/stores/auth'
import { merchantApi, MerchantPayoutMethodPayload } from '@/lib/merchant'
import {
  PageHeader,
  StatCard,
  StatusBadge,
  LoadingRows,
  EmptyState,
  formatCurrency,
  formatDate,
} from '@/components/merchant/merchant-kit'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

export default function MerchantFinancesPage() {
  const token = useAuth((s) => s.token)
  const [loading, setLoading] = useState(true)
  const [balances, setBalances] = useState<Record<string, number>>({})
  const [payoutMethods, setPayoutMethods] = useState<any[]>([])
  const [payoutBatches, setPayoutBatches] = useState<any[]>([])

  // Modal / Form state for adding payout method
  const [showAddMethod, setShowAddMethod] = useState(false)
  const [submittingMethod, setSubmittingMethod] = useState(false)
  const [methodType, setMethodType] = useState<MerchantPayoutMethodPayload['type']>('bank_account_sepa')
  const [currency, setCurrency] = useState('EUR')
  const [country, setCountry] = useState('FR')
  const [accountHolder, setAccountHolder] = useState('')
  const [accountIdentifier, setAccountIdentifier] = useState('')
  const [bankName, setBankName] = useState('')
  const [operator, setOperator] = useState<'airtel' | 'moov'>('airtel')

  const fetchData = async () => {
    if (!token) return
    setLoading(true)
    try {
      const [earningsRes, methodsRes, batchesRes] = await Promise.allSettled([
        merchantApi.earnings(token),
        merchantApi.payoutMethods(token),
        merchantApi.payoutBatches(token),
      ])

      if (earningsRes.status === 'fulfilled') {
        const b =
          earningsRes.value?.balances_by_currency ||
          earningsRes.value?.aggregates?.totals_by_currency ||
          {}
        setBalances(b)
      }
      if (methodsRes.status === 'fulfilled') {
        const m = methodsRes.value?.data || []
        setPayoutMethods(Array.isArray(m) ? m : [])
      }
      if (batchesRes.status === 'fulfilled') {
        const b = batchesRes.value?.data || []
        setPayoutBatches(Array.isArray(b) ? b : [])
      }
    } catch {
      toast.error('Erreur lors du chargement des informations financières.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [token])

  const handleTypeChange = (newType: MerchantPayoutMethodPayload['type']) => {
    setMethodType(newType)
    if (newType === 'bank_account_sepa') {
      setCurrency('EUR')
      setCountry('FR')
    } else if (newType === 'bank_account_north_america') {
      setCurrency('CAD')
      setCountry('CA')
    } else if (newType === 'mobile_money' || newType === 'bank_account_chadian') {
      setCurrency('XAF')
      setCountry('TD')
    } else {
      setCurrency('USD')
      setCountry('FR')
    }
  }

  const handleAddPayoutMethod = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token) return

    if (!accountHolder.trim() || !accountIdentifier.trim()) {
      toast.error('Veuillez remplir le titulaire et le numéro de compte / IBAN.')
      return
    }

    setSubmittingMethod(true)
    try {
      await merchantApi.payoutMethodCreate(token, {
        type: methodType,
        currency,
        country,
        account_holder_name: accountHolder.trim(),
        account_identifier: accountIdentifier.trim(),
        bank_name: bankName.trim() || null,
        operator: methodType === 'mobile_money' ? operator : null,
        is_default: payoutMethods.length === 0,
      })

      toast.success('Méthode de versement enregistrée avec succès.')
      setShowAddMethod(false)
      setAccountHolder('')
      setAccountIdentifier('')
      setBankName('')
      fetchData()
    } catch (err: any) {
      toast.error(err.message || "Erreur lors de l'enregistrement.")
    } finally {
      setSubmittingMethod(false)
    }
  }

  const handleDeleteMethod = async (id: number) => {
    if (!token || !confirm('Supprimer cette méthode de versement ?')) return
    try {
      await merchantApi.payoutMethodDelete(token, id)
      setPayoutMethods((prev) => prev.filter((m) => m.id !== id))
      toast.success('Méthode de versement supprimée.')
    } catch {
      toast.error('Impossible de supprimer la méthode de versement.')
    }
  }

  const handleSetDefault = async (id: number) => {
    if (!token) return
    try {
      await merchantApi.payoutMethodSetDefault(token, id)
      setPayoutMethods((prev) =>
        prev.map((m) => ({ ...m, is_default: m.id === id })),
      )
      toast.success('Méthode définie par défaut.')
    } catch {
      toast.error('Impossible de modifier la méthode par défaut.')
    }
  }

  const balanceCurrencies = Object.keys(balances)

  return (
    <div className="space-y-8">
      <PageHeader
        title="Finances & Versements (Payouts)"
        subtitle="Suivez vos revenus en temps réel, gérez vos comptes bancaires et planifiez vos règlements."
        action={
          <Button
            size="sm"
            onClick={() => setShowAddMethod(!showAddMethod)}
            className="gap-2"
          >
            <PlusCircle className="h-4 w-4" />
            Ajouter un compte de versement
          </Button>
        }
      />

      {loading ? (
        <LoadingRows count={4} />
      ) : (
        <>
          {/* Cartes de solde par devise */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {balanceCurrencies.length === 0 ? (
              <StatCard
                label="Solde disponible"
                value="0 FCFA"
                hint="Aucun solde en attente pour le moment"
                icon={<TrendingUp className="h-5 w-5" />}
              />
            ) : (
              balanceCurrencies.map((curr) => (
                <StatCard
                  key={curr}
                  label={`Solde disponible (${curr})`}
                  value={formatCurrency(balances[curr], curr)}
                  hint="Disponible pour demande de transfert"
                  icon={<Wallet className="h-5 w-5" />}
                />
              ))
            )}
          </div>

          {/* Formulaire d'ajout de coordonnées financières */}
          {showAddMethod && (
            <div className="rounded-xl border border-primary/20 bg-card p-6 shadow-soft space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-display font-bold text-base text-foreground flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-primary" />
                  Nouveau compte de règlement
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAddMethod(false)}
                  className="text-xs"
                >
                  Fermer
                </Button>
              </div>

              <form onSubmit={handleAddPayoutMethod} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5 sm:col-span-2">
                    <Label>Type de méthode de versement</Label>
                    <select
                      value={methodType}
                      onChange={(e) =>
                        handleTypeChange(e.target.value as MerchantPayoutMethodPayload['type'])
                      }
                      className="w-full h-10 rounded-md border border-border bg-background px-3 text-sm focus:border-primary focus:outline-none"
                    >
                      <option value="bank_account_sepa">Compte bancaire européen (IBAN / SEPA - EUR)</option>
                      <option value="bank_account_north_america">Compte bancaire Amérique du Nord (Canada / USA - CAD / USD)</option>
                      <option value="mobile_money">Mobile Money Tchad (Airtel / Moov - XAF)</option>
                      <option value="bank_account_chadian">Compte bancaire tchadien (Banque locale - XAF)</option>
                      <option value="bank_account_international">Virement bancaire international (SWIFT)</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <Label>Titulaire du compte *</Label>
                    <Input
                      placeholder="Ex : Spencer O. ou Nom de l'entreprise"
                      value={accountHolder}
                      onChange={(e) => setAccountHolder(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label>
                      {methodType === 'mobile_money'
                        ? 'Numéro de téléphone Airtel / Moov *'
                        : 'IBAN ou Numéro de compte *'}
                    </Label>
                    <Input
                      placeholder={
                        methodType === 'mobile_money'
                          ? 'Ex : +235 66 00 00 00'
                          : 'Ex : FR76 3000 ...'
                      }
                      value={accountIdentifier}
                      onChange={(e) => setAccountIdentifier(e.target.value)}
                      required
                    />
                  </div>

                  {methodType === 'mobile_money' ? (
                    <div className="space-y-1.5">
                      <Label>Opérateur Mobile Money</Label>
                      <select
                        value={operator}
                        onChange={(e) => setOperator(e.target.value as 'airtel' | 'moov')}
                        className="w-full h-10 rounded-md border border-border bg-background px-3 text-sm focus:border-primary focus:outline-none"
                      >
                        <option value="airtel">Airtel Money Tchad</option>
                        <option value="moov">Moov Money Tchad</option>
                      </select>
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      <Label>Nom de la banque (Optionnel)</Label>
                      <Input
                        placeholder="Ex : BNP Paribas, Desjardins, Orabank..."
                        value={bankName}
                        onChange={(e) => setBankName(e.target.value)}
                      />
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <Label>Devise de réception</Label>
                    <Input value={currency} disabled className="bg-secondary/40 font-mono text-xs" />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowAddMethod(false)}
                  >
                    Annuler
                  </Button>
                  <Button type="submit" disabled={submittingMethod}>
                    {submittingMethod ? 'Enregistrement...' : 'Enregistrer'}
                  </Button>
                </div>
              </form>
            </div>
          )}

          {/* Liste des comptes de versement configurés */}
          <div className="rounded-xl border border-border bg-card shadow-soft overflow-hidden">
            <div className="p-5 border-b border-border">
              <h2 className="font-display text-base font-bold text-foreground">
                Mes comptes de versement enregistrés
              </h2>
              <p className="text-xs text-muted-foreground">
                Vos versements y sont directement crédités lors des campagnes de paiement.
              </p>
            </div>

            {payoutMethods.length === 0 ? (
              <div className="p-8">
                <EmptyState
                  title="Aucun compte bancaire ou mobile money"
                  message="Ajoutez votre RIB ou votre numéro Mobile Money pour recevoir vos paiements."
                  action={
                    <Button size="sm" onClick={() => setShowAddMethod(true)}>
                      Ajouter un compte
                    </Button>
                  }
                />
              </div>
            ) : (
              <div className="divide-y divide-border">
                {payoutMethods.map((m) => {
                  let Icon = Building2
                  if (m.type === 'mobile_money') Icon = Smartphone
                  if (m.type === 'bank_account_sepa') Icon = CreditCard

                  return (
                    <div
                      key={m.id}
                      className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-secondary/15 transition-colors"
                    >
                      <div className="flex items-start gap-3.5">
                        <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                          <Icon className="h-5 w-5" strokeWidth={1.75} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm text-foreground">
                              {m.account_holder_name}
                            </span>
                            {m.is_default && (
                              <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
                                Par défaut
                              </span>
                            )}
                          </div>
                          <p className="text-xs font-mono text-muted-foreground mt-0.5">
                            {m.account_identifier}
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {m.bank_name || m.operator?.toUpperCase() || m.type} • Devise :{' '}
                            <span className="font-semibold text-foreground">{m.currency}</span>
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center">
                        {!m.is_default && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleSetDefault(m.id)}
                            className="text-xs h-8"
                          >
                            Définir par défaut
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteMethod(m.id)}
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          title="Supprimer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Historique des campagnes de versement */}
          <div className="rounded-xl border border-border bg-card shadow-soft overflow-hidden">
            <div className="p-5 border-b border-border">
              <h2 className="font-display text-base font-bold text-foreground">
                Historique des reversements
              </h2>
              <p className="text-xs text-muted-foreground">
                Historique des virements effectués vers vos comptes bancaires ou numéros Mobile Money.
              </p>
            </div>

            {payoutBatches.length === 0 ? (
              <div className="p-8">
                <EmptyState
                  title="Aucun versement effectué pour le moment"
                  message="Vos futurs lots de versement apparaîtront ici avec les références bancaires."
                />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-secondary/40 text-xs font-semibold uppercase tracking-wider text-muted-foreground border-b border-border">
                    <tr>
                      <th className="px-5 py-3">Réf. Lot</th>
                      <th className="px-5 py-3">Date</th>
                      <th className="px-5 py-3">Montant</th>
                      <th className="px-5 py-3">Statut</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {payoutBatches.map((b) => (
                      <tr key={b.id} className="hover:bg-secondary/20 transition-colors">
                        <td className="px-5 py-3.5 font-medium text-foreground">
                          {b.batch_reference || `#BATCH-${b.id}`}
                        </td>
                        <td className="px-5 py-3.5 text-xs text-muted-foreground">
                          {formatDate(b.created_at)}
                        </td>
                        <td className="px-5 py-3.5 font-semibold text-foreground">
                          {formatCurrency(b.total_amount || b.net_amount, b.currency || 'EUR')}
                        </td>
                        <td className="px-5 py-3.5">
                          <StatusBadge status={b.status || 'paid'} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
