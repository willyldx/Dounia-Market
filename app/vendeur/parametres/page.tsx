'use client'

import { useEffect, useRef, useState } from 'react'
import {
  ShieldCheck,
  Building2,
  FileText,
  Upload,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Clock,
  Save,
} from 'lucide-react'
import { useAuth } from '@/stores/auth'
import { merchantApi } from '@/lib/merchant'
import {
  PageHeader,
  StatusBadge,
  LoadingRows,
  EmptyState,
  formatDate,
} from '@/components/merchant/merchant-kit'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

export default function MerchantSettingsPage() {
  const token = useAuth((s) => s.token)
  const [loading, setLoading] = useState(true)
  const [submittingProfile, setSubmittingProfile] = useState(false)
  const [uploadingDoc, setUploadingDoc] = useState(false)

  const [profile, setProfile] = useState<any>(null)
  const [documents, setDocuments] = useState<any[]>([])

  // Profile form state
  const [businessName, setBusinessName] = useState('')
  const [businessNumber, setBusinessNumber] = useState('')
  const [businessAddress, setBusinessAddress] = useState('')
  const [countryResidence, setCountryResidence] = useState('FR')
  const [operatingCountry, setOperatingCountry] = useState('TD')
  const [contactEmail, setContactEmail] = useState('')
  const [contactPhone, setContactPhone] = useState('')

  // Document upload state
  const [selectedDocType, setSelectedDocType] = useState('identity_proof')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const fetchData = async () => {
    if (!token) return
    setLoading(true)
    try {
      const [profRes, docsRes] = await Promise.allSettled([
        merchantApi.profile(token),
        merchantApi.documents(token),
      ])

      if (profRes.status === 'fulfilled') {
        const p = profRes.value?.data || null
        setProfile(p)
        if (p) {
          setBusinessName(p.business_name || '')
          setBusinessNumber(p.business_registration_number || '')
          setBusinessAddress(p.business_address || '')
          setCountryResidence(p.country_of_residence || 'FR')
          setOperatingCountry(p.operating_country || 'TD')
          setContactEmail(p.contact_email || '')
          setContactPhone(p.contact_phone || '')
        }
      }

      if (docsRes.status === 'fulfilled') {
        const d = docsRes.value?.data || []
        setDocuments(Array.isArray(d) ? d : [])
      }
    } catch {
      toast.error('Erreur lors du chargement des paramètres vendeur.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [token])

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token) return

    setSubmittingProfile(true)
    try {
      await merchantApi.updateProfile(token, {
        business_name: businessName.trim(),
        business_registration_number: businessNumber.trim() || null,
        business_address: businessAddress.trim(),
        country_of_residence: countryResidence,
        operating_country: operatingCountry,
        contact_email: contactEmail.trim(),
        contact_phone: contactPhone.trim(),
      })
      toast.success('Profil vendeur actualisé avec succès.')
      fetchData()
    } catch (err: any) {
      toast.error(err.message || 'Impossible de mettre à jour le profil.')
    } finally {
      setSubmittingProfile(false)
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !token) return

    setUploadingDoc(true)
    try {
      await merchantApi.documentUpload(token, file, selectedDocType)
      toast.success('Document transmis pour vérification.')
      if (fileInputRef.current) fileInputRef.current.value = ''
      fetchData()
    } catch (err: any) {
      toast.error(err.message || "Échec du téléversement du document.")
    } finally {
      setUploadingDoc(false)
    }
  }

  const handleDeleteDocument = async (id: number) => {
    if (!token || !confirm('Supprimer ce document ?')) return
    try {
      await merchantApi.documentDelete(token, id)
      setDocuments((prev) => prev.filter((d) => d.id !== id))
      toast.success('Document supprimé.')
    } catch {
      toast.error('Impossible de supprimer le document.')
    }
  }

  const verificationStatus = profile?.verification_status || 'pending'

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <PageHeader
        title="Paramètres de la Boutique & KYC"
        subtitle="Renseignez vos informations légales et transmettez vos pièces d'identité pour certification."
      />

      {loading ? (
        <LoadingRows count={5} />
      ) : (
        <>
          {/* Statut KYC de conformité */}
          <div className="rounded-xl border border-border bg-card p-6 shadow-soft flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <ShieldCheck className="h-5 w-5" strokeWidth={1.75} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-display font-bold text-base text-foreground">
                    Statut de vérification du compte
                  </h2>
                  <StatusBadge status={verificationStatus} />
                </div>
                <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                  {verificationStatus === 'approved' || verificationStatus === 'verified'
                    ? 'Votre compte vendeur est vérifié et certifié. Vous pouvez vendre et demander vos versements sans restriction.'
                    : 'Votre dossier est en cours de validation par notre équipe conformité. Vos produits peuvent être préparés.'}
                </p>
              </div>
            </div>
          </div>

          {/* Formulaire des informations légales */}
          <form onSubmit={handleUpdateProfile} className="rounded-xl border border-border bg-card p-6 shadow-soft space-y-6">
            <h3 className="font-display font-bold text-base text-foreground flex items-center gap-2">
              <Building2 className="h-4 w-4 text-primary" />
              Informations commerciales & Coordonnées
            </h3>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="bname">Nom de l'entreprise ou marque commerciale *</Label>
                <Input
                  id="bname"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="bnum">Numéro SIREN / NIF / Enregistrement</Label>
                <Input
                  id="bnum"
                  placeholder="Ex : 912 345 678 00012"
                  value={businessNumber}
                  onChange={(e) => setBusinessNumber(e.target.value)}
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="baddr">Adresse du siège social / Local de stockage *</Label>
                <Input
                  id="baddr"
                  value={businessAddress}
                  onChange={(e) => setBusinessAddress(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="cres">Pays d'établissement du vendeur</Label>
                <select
                  id="cres"
                  value={countryResidence}
                  onChange={(e) => setCountryResidence(e.target.value)}
                  className="w-full h-10 rounded-md border border-border bg-background px-3 text-sm focus:border-primary focus:outline-none"
                >
                  <option value="FR">France (Europe)</option>
                  <option value="BE">Belgique (Europe)</option>
                  <option value="CA">Canada (Amérique du Nord)</option>
                  <option value="US">États-Unis (Amérique du Nord)</option>
                  <option value="TD">Tchad (Local N'Djamena)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="opc">Pays principal d'opération</Label>
                <select
                  id="opc"
                  value={operatingCountry}
                  onChange={(e) => setOperatingCountry(e.target.value)}
                  className="w-full h-10 rounded-md border border-border bg-background px-3 text-sm focus:border-primary focus:outline-none"
                >
                  <option value="TD">Tchad (N'Djamena & Régions)</option>
                  <option value="FR">France</option>
                  <option value="CA">Canada</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="cemail">Email de contact marchand *</Label>
                <Input
                  id="cemail"
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="cphone">Téléphone / WhatsApp commercial *</Label>
                <Input
                  id="cphone"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button type="submit" disabled={submittingProfile} className="gap-2">
                <Save className="h-4 w-4" />
                {submittingProfile ? 'Enregistrement...' : 'Mettre à jour mes informations'}
              </Button>
            </div>
          </form>

          {/* Section Pièces Justificatives KYC */}
          <div className="rounded-xl border border-border bg-card p-6 shadow-soft space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-display font-bold text-base text-foreground flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary" />
                  Pièces justificatives & Documents légaux
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Téléversez votre pièce d'identité officielle et le justificatif de votre activité.
                </p>
              </div>
            </div>

            {/* Upload form */}
            <div className="p-4 rounded-lg bg-secondary/30 border border-border flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="w-full sm:w-64">
                <select
                  value={selectedDocType}
                  onChange={(e) => setSelectedDocType(e.target.value)}
                  className="w-full h-9 rounded-md border border-border bg-background px-3 text-xs focus:border-primary focus:outline-none"
                >
                  <option value="identity_proof">Pièce d'identité (Passeport / CNI)</option>
                  <option value="business_registration">Extrait Kbis / Registre de commerce</option>
                  <option value="tax_certificate">Attestation fiscale / Numéro TVA</option>
                  <option value="bank_statement">Relevé d'identité bancaire (RIB)</option>
                </select>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={handleFileUpload}
                disabled={uploadingDoc}
                className="hidden"
                id="doc-upload"
              />
              <Button
                asChild
                size="sm"
                variant="outline"
                disabled={uploadingDoc}
                className="cursor-pointer gap-2 text-xs shrink-0"
              >
                <label htmlFor="doc-upload">
                  <Upload className="h-3.5 w-3.5" />
                  {uploadingDoc ? 'Téléversement...' : 'Sélectionner un fichier (PDF, JPG)'}
                </label>
              </Button>
            </div>

            {/* List of uploaded documents */}
            {documents.length === 0 ? (
              <EmptyState
                title="Aucun document téléversé"
                message="Ajoutez votre pièce d'identité pour finaliser la vérification de votre compte."
              />
            ) : (
              <div className="divide-y divide-border">
                {documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="py-3 flex items-center justify-between gap-4 text-sm"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium text-foreground text-xs">
                          {doc.document_type || 'Document justificatif'}
                        </p>
                        <p className="text-[11px] text-muted-foreground">
                          Ajouté le {formatDate(doc.created_at)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <StatusBadge status={doc.verification_status || 'pending'} />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteDocument(doc.id)}
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
