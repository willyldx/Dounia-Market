<template>
  <div class="min-h-screen flex items-center justify-center relative bg-muted/30">
    <!-- Centered Minimalist Card -->
    <div class="w-full max-w-md relative z-10 px-4 sm:px-0">
      
      <!-- Back to Home -->
      <NuxtLink to="/" class="mb-8 mx-auto flex w-fit items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft class="w-4 h-4" /> Retour à l'accueil
      </NuxtLink>

      <div class="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        
        <!-- Logo -->
        <div class="pt-10 pb-2 flex justify-center">
          <img src="/logo.png" alt="Dounia Market" class="h-8 sm:h-10 w-auto" />
        </div>

        <div class="px-8 sm:px-10 pb-10 pt-4 space-y-8">
          
          <!-- Step 1: Email -->
          <Transition
            enter-active-class="transition-all duration-500 ease-out"
            enter-from-class="opacity-0 translate-x-8"
            enter-to-class="opacity-100 translate-x-0"
            leave-active-class="transition-all duration-300 ease-in absolute w-full inset-0"
            leave-from-class="opacity-100 translate-x-0"
            leave-to-class="opacity-0 -translate-x-8"
          >
            <div v-if="step === 'email'" class="w-full">
              <div class="text-center mb-8">
                <h1 class="text-2xl font-bold text-foreground mb-2 tracking-tight">Bienvenue</h1>
                <p class="text-muted-foreground text-sm">Entrez votre email pour recevoir votre code d'accès sécurisé.</p>
              </div>

              <form @submit.prevent="handleSendOtp" class="space-y-4">
                <div class="space-y-1.5">
                  <label class="text-sm font-medium leading-none text-foreground">Adresse email</label>
                  <input
                    v-model="email"
                    type="email"
                    required
                    autofocus
                    placeholder="vous@exemple.com"
                    class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring transition-colors"
                  />
                </div>

                <!-- Error -->
                <Transition
                  enter-active-class="transition-all duration-300 ease-out"
                  enter-from-class="opacity-0 -translate-y-2"
                  enter-to-class="opacity-100 translate-y-0"
                >
                  <div v-if="authStore.error" class="p-3 bg-destructive/10 border border-destructive/20 rounded-md text-sm text-destructive flex items-start gap-2">
                    <AlertCircle class="w-4 h-4 mt-0.5 shrink-0" />
                    <span class="leading-relaxed">{{ authStore.error }}</span>
                  </div>
                </Transition>

                <button
                  type="submit"
                  :disabled="!email || authStore.isLoading"
                  class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full mt-2"
                >
                  <Loader2 v-if="authStore.isLoading" class="w-4 h-4 mr-2 animate-spin" />
                  <ArrowRight v-else class="w-4 h-4 mr-2" />
                  {{ authStore.isLoading ? 'Envoi...' : 'Continuer' }}
                </button>
              </form>
            </div>
          </Transition>

          <!-- Step 2: Name (for new users only) -->
          <Transition
            enter-active-class="transition-all duration-500 ease-out"
            enter-from-class="opacity-0 translate-x-8"
            enter-to-class="opacity-100 translate-x-0"
            leave-active-class="transition-all duration-300 ease-in absolute w-full inset-0"
            leave-from-class="opacity-100 translate-x-0"
            leave-to-class="opacity-0 -translate-x-8"
          >
            <div v-if="step === 'name'" class="w-full">
              <button @click="step = 'email'" class="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground mb-6 transition-colors">
                <ArrowLeft class="w-4 h-4" />
                Changer d'email
              </button>

              <div class="text-center mb-8">
                <h1 class="text-2xl font-bold text-foreground mb-2 tracking-tight">Faisons connaissance</h1>
                <p class="text-muted-foreground text-sm">Dites-nous comment vous appeler.</p>
              </div>

              <form @submit.prevent="handleNameSubmit" class="space-y-4">
                <div class="grid grid-cols-2 gap-3">
                  <div class="space-y-1.5">
                    <label class="text-sm font-medium leading-none text-foreground">Prénom</label>
                    <input 
                      v-model="firstName" 
                      type="text" 
                      required 
                      autofocus
                      placeholder="Prénom" 
                      class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring transition-colors"
                    />
                  </div>
                  <div class="space-y-1.5">
                    <label class="text-sm font-medium leading-none text-foreground">Nom</label>
                    <input 
                      v-model="lastName" 
                      type="text" 
                      required 
                      placeholder="Nom" 
                      class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring transition-colors"
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  :disabled="!firstName || !lastName" 
                  class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full mt-2"
                >
                  Suivant <ArrowRight class="w-4 h-4 ml-2" />
                </button>
              </form>
            </div>
          </Transition>

          <!-- Step 3: OTP Code -->
          <Transition
            enter-active-class="transition-all duration-500 ease-out"
            enter-from-class="opacity-0 translate-x-8"
            enter-to-class="opacity-100 translate-x-0"
            leave-active-class="transition-all duration-300 ease-in absolute w-full inset-0"
            leave-from-class="opacity-100 translate-x-0"
            leave-to-class="opacity-0 -translate-x-8"
          >
            <div v-if="step === 'otp'" class="w-full">
              <button @click="step = isNewUser ? 'name' : 'email'" class="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground mb-6 transition-colors">
                <ArrowLeft class="w-4 h-4" />
                Retour
              </button>

              <div class="flex flex-col items-center text-center">
                <div class="w-12 h-12 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center border border-border">
                  <ShieldCheck class="w-6 h-6 text-foreground" />
                </div>

                <h1 class="text-2xl font-bold text-foreground mb-2 tracking-tight">Code de sécurité</h1>
                <p class="text-muted-foreground text-sm mb-6 max-w-xs">
                  Envoyé à <strong class="text-foreground font-semibold">{{ email }}</strong>
                </p>
              </div>

              <form @submit.prevent="handleVerifyOtp" class="space-y-6">
                <!-- Premium OTP Input boxes -->
                <div class="flex justify-center gap-2 sm:gap-3">
                  <input
                    v-for="(_, i) in 6"
                    :key="i"
                    :ref="el => otpRefs[i] = el as HTMLInputElement"
                    type="text"
                    inputmode="numeric"
                    maxlength="1"
                    class="w-10 h-12 sm:w-12 sm:h-12 text-center text-xl font-bold rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring transition-all text-foreground"
                    @input="onOtpInput(i, $event)"
                    @keydown="onOtpKeydown(i, $event)"
                    @paste="onOtpPaste($event)"
                  />
                </div>

                <!-- Error -->
                <Transition
                  enter-active-class="transition-all duration-300 ease-out"
                  enter-from-class="opacity-0 -translate-y-2"
                  enter-to-class="opacity-100 translate-y-0"
                >
                  <div v-if="authStore.error" class="p-3 bg-destructive/10 border border-destructive/20 rounded-md text-sm text-destructive flex items-start justify-center text-center gap-2">
                    <AlertCircle class="w-4 h-4 mt-0.5 shrink-0" />
                    <span class="leading-relaxed">{{ authStore.error }}</span>
                  </div>
                </Transition>

                <button
                  type="submit"
                  :disabled="otpCode.length < 6 || authStore.isLoading"
                  class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full mt-2"
                >
                  <Loader2 v-if="authStore.isLoading" class="w-4 h-4 mr-2 animate-spin" />
                  <LogIn v-else class="w-4 h-4 mr-2" />
                  {{ authStore.isLoading ? 'Vérification...' : 'Accéder à mon espace' }}
                </button>

                <!-- Resend -->
                <div class="text-center">
                  <button
                    v-if="resendCooldown <= 0"
                    @click="handleSendOtp"
                    type="button"
                    class="text-xs text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4"
                  >
                    Je n'ai pas reçu le code
                  </button>
                  <p v-else class="text-xs text-muted-foreground">
                    Renvoyer un code dans <span class="text-foreground font-semibold">{{ resendCooldown }}s</span>
                  </p>
                </div>
              </form>
            </div>
          </Transition>

        </div>
      </div>
      
      <!-- Footer Text -->
      <div class="text-center mt-6">
        <p class="text-xs text-muted-foreground">
          En continuant, vous acceptez nos
          <NuxtLink to="/conditions" class="text-foreground hover:underline transition-colors">CGV</NuxtLink>.
        </p>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import {
  Package, Mail, ArrowRight, ArrowLeft, Loader2, AlertCircle,
  ShieldCheck, LogIn
} from 'lucide-vue-next'

definePageMeta({ layout: false, middleware: ['guest'] })

useSeoMeta({
  title: 'Connexion - Dounia Market',
  description: 'Connectez-vous à votre espace Dounia Market sécurisé et sans mot de passe.',
})

const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()

// State
const step = ref<'email' | 'name' | 'otp'>('email')
const email = ref('')
const firstName = ref('')
const lastName = ref('')
const isNewUser = ref(false)
const otpDigits = ref<string[]>(['', '', '', '', '', ''])
const otpRefs = ref<HTMLInputElement[]>([])
const resendCooldown = ref(0)
let cooldownInterval: ReturnType<typeof setInterval> | null = null

const otpCode = computed(() => otpDigits.value.join(''))

// Redirect if already logged in
onMounted(async () => {
  await authStore.checkSession()
  if (authStore.isAuthenticated) {
    const redirect = (route.query.redirect as string) || authStore.getRedirectPath()
    navigateTo(redirect)
  }
})

// OTP input logic
function onOtpInput(index: number, event: Event) {
  const input = event.target as HTMLInputElement
  const value = input.value.replace(/\D/g, '')
  otpDigits.value[index] = value ? value[0] : ''
  input.value = otpDigits.value[index]

  if (value && index < 5) {
    otpRefs.value[index + 1]?.focus()
  }
}

function onOtpKeydown(index: number, event: KeyboardEvent) {
  if (event.key === 'Backspace' && !otpDigits.value[index] && index > 0) {
    otpRefs.value[index - 1]?.focus()
  }
}

function onOtpPaste(event: ClipboardEvent) {
  event.preventDefault()
  const pasted = event.clipboardData?.getData('text')?.replace(/\D/g, '') || ''
  for (let i = 0; i < 6; i++) {
    otpDigits.value[i] = pasted[i] || ''
    if (otpRefs.value[i]) otpRefs.value[i].value = otpDigits.value[i]
  }
  const focusIdx = Math.min(pasted.length, 5)
  otpRefs.value[focusIdx]?.focus()
}

function startResendCooldown() {
  resendCooldown.value = 60
  if (cooldownInterval) clearInterval(cooldownInterval)
  cooldownInterval = setInterval(() => {
    resendCooldown.value--
    if (resendCooldown.value <= 0 && cooldownInterval) clearInterval(cooldownInterval)
  }, 1000)
}

// Handlers
async function handleSendOtp() {
  authStore.clearError()
  const result = await authStore.sendOtp(email.value, firstName.value || undefined, lastName.value || undefined)

  if (result.success) {
    isNewUser.value = !!result.isNewUser
    if (result.isNewUser && !firstName.value) {
      step.value = 'name'
    } else {
      step.value = 'otp'
      startResendCooldown()
      nextTick(() => otpRefs.value[0]?.focus())
    }
  }
}

function handleNameSubmit() {
  handleSendOtpAfterName()
}

async function handleSendOtpAfterName() {
  authStore.clearError()
  const result = await authStore.sendOtp(email.value, firstName.value, lastName.value)
  if (result.success) {
    step.value = 'otp'
    startResendCooldown()
    nextTick(() => otpRefs.value[0]?.focus())
  }
}

async function handleVerifyOtp() {
  authStore.clearError()
  const result = await authStore.verifyOtp(email.value, otpCode.value, firstName.value, lastName.value)

  if (result.success) {
    const redirect = (route.query.redirect as string) || authStore.getRedirectPath()
    navigateTo(redirect)
  } else {
    // Clear OTP fields on error
    otpDigits.value = ['', '', '', '', '', '']
    otpRefs.value.forEach(ref => { if (ref) ref.value = '' })
    nextTick(() => otpRefs.value[0]?.focus())
  }
}

onUnmounted(() => {
  if (cooldownInterval) clearInterval(cooldownInterval)
})
</script>

<style scoped>
.custom-shadow {
  box-shadow: 0 10px 30px -10px rgba(15, 23, 42, 0.3);
}
.custom-shadow:hover {
  box-shadow: 0 20px 40px -10px rgba(15, 23, 42, 0.4);
}
/* Focus rings for iOS */
input, button {
  -webkit-tap-highlight-color: transparent;
}
</style>
