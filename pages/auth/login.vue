<template>
  <div class="min-h-screen flex items-center justify-center relative overflow-hidden bg-brand">
    <!-- Cinematic Full-screen Photo Background -->
    <div class="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat transition-transform duration-[10s] hover:scale-105" style="background-image: url('/auth-bg.png');"></div>
    
    <!-- Luxury Overlay (Very subtle) to keep the image extremely visible -->
    <div class="absolute inset-0 bg-black/30 backdrop-blur-[1px]"></div>

    <!-- Centered Glassmorphism Card -->
    <div class="w-full max-w-md relative z-10 px-4 sm:px-0">
      
      <!-- Back to Home -->
      <NuxtLink to="/" class="mb-8 mx-auto flex w-fit items-center gap-2 text-sm font-medium text-white/70 hover:text-white transition-colors backdrop-blur-md bg-white/10 px-4 py-2 rounded-full border border-white/10">
        <ArrowLeft class="w-4 h-4" /> Retour à l'accueil
      </NuxtLink>

      <div class="bg-brand/80 backdrop-blur-[40px] rounded-[2rem] border border-white/10 shadow-[0_20px_80px_-15px_rgba(0,0,0,0.8)] overflow-hidden">
        
        <!-- Logo -->
        <div class="pt-10 pb-2 flex justify-center">
          <img src="/logo.png" alt="Dounia Market" class="h-10 sm:h-12 w-auto brightness-0 invert" />
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
                <h1 class="text-2xl font-extrabold text-white mb-2 tracking-tight">Bienvenue</h1>
                <p class="text-white/70 text-sm font-medium">Entrez votre email pour recevoir votre code d'accès sécurisé.</p>
              </div>

              <form @submit.prevent="handleSendOtp" class="space-y-5">
                <div class="space-y-1.5">
                  <label class="block text-xs uppercase tracking-wider font-semibold text-white/70 ml-1">Adresse email</label>
                  <div class="relative group">
                    <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail class="w-5 h-5 text-white/50 group-focus-within:text-white transition-colors" />
                    </div>
                    <input
                      v-model="email"
                      type="email"
                      required
                      autofocus
                      placeholder="vous@exemple.com"
                      class="block w-full pl-11 pr-4 py-3.5 bg-white/10 border border-white/20 focus:bg-white/20 focus:border-accent rounded-xl outline-none transition-all placeholder:text-white/40 text-white font-medium shadow-sm"
                    />
                  </div>
                </div>

                <!-- Error -->
                <Transition
                  enter-active-class="transition-all duration-300 ease-out"
                  enter-from-class="opacity-0 -translate-y-2"
                  enter-to-class="opacity-100 translate-y-0"
                >
                  <div v-if="authStore.error" class="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-sm text-red-400 flex items-start gap-3">
                    <AlertCircle class="w-5 h-5 mt-0.5 shrink-0" />
                    <span class="leading-relaxed">{{ authStore.error }}</span>
                  </div>
                </Transition>

                <button
                  type="submit"
                  :disabled="!email || authStore.isLoading"
                  class="w-full relative group overflow-hidden rounded-xl p-[2px] disabled:opacity-60 transition-all shadow-[0_4px_20px_rgba(245,158,11,0.2)] mt-4 border border-accent/50"
                >
                  <span class="absolute inset-0 bg-gradient-to-r from-accent via-yellow-400 to-accent group-hover:scale-105 transition-transform duration-500"></span>
                  <div class="relative flex items-center justify-center gap-2 px-6 py-3.5 bg-brand/50 rounded-[10px] text-white font-bold transition-colors group-hover:bg-transparent">
                    <Loader2 v-if="authStore.isLoading" class="w-5 h-5 animate-spin" />
                    <ArrowRight v-else class="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    {{ authStore.isLoading ? 'Envoi...' : 'Continuer' }}
                  </div>
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
              <button @click="step = 'email'" class="flex items-center gap-2 text-sm font-medium text-white/70 hover:text-white mb-6 transition-colors group">
                <div class="w-8 h-8 rounded-full bg-white/5 group-hover:bg-white/10 flex items-center justify-center transition-colors border border-white/5">
                  <ArrowLeft class="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                </div>
                Changer d'email
              </button>

              <div class="text-center mb-8">
                <h1 class="text-2xl font-extrabold text-white mb-2 tracking-tight">Faisons connaissance</h1>
                <p class="text-white/70 text-sm font-medium">Dites-nous comment vous appeler.</p>
              </div>

              <form @submit.prevent="handleNameSubmit" class="space-y-5">
                <div class="grid grid-cols-2 gap-3">
                  <div class="space-y-1.5">
                    <label class="block text-xs uppercase tracking-wider font-semibold text-white/70 ml-1">Prénom</label>
                    <input 
                      v-model="firstName" 
                      type="text" 
                      required 
                      autofocus
                      placeholder="Prénom" 
                      class="block w-full px-4 py-3.5 bg-white/10 border border-white/20 focus:bg-white/20 focus:border-accent rounded-xl outline-none transition-all placeholder:text-white/40 text-white font-medium shadow-sm"
                    />
                  </div>
                  <div class="space-y-1.5">
                    <label class="block text-xs uppercase tracking-wider font-semibold text-white/70 ml-1">Nom</label>
                    <input 
                      v-model="lastName" 
                      type="text" 
                      required 
                      placeholder="Nom" 
                      class="block w-full px-4 py-3.5 bg-white/10 border border-white/20 focus:bg-white/20 focus:border-accent rounded-xl outline-none transition-all placeholder:text-white/40 text-white font-medium shadow-sm"
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  :disabled="!firstName || !lastName" 
                  class="w-full relative group overflow-hidden rounded-xl p-[2px] disabled:opacity-60 transition-all shadow-[0_4px_20px_rgba(245,158,11,0.2)] mt-4 border border-accent/50"
                >
                  <span class="absolute inset-0 bg-gradient-to-r from-accent via-yellow-400 to-accent group-hover:scale-105 transition-transform duration-500"></span>
                  <div class="relative flex items-center justify-center gap-2 px-6 py-3.5 bg-brand/50 rounded-[10px] text-white font-bold transition-colors group-hover:bg-transparent">
                    <ArrowRight class="w-5 h-5 group-hover:translate-x-1 transition-transform" /> Suivant
                  </div>
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
              <button @click="step = isNewUser ? 'name' : 'email'" class="flex items-center gap-2 text-sm font-medium text-white/70 hover:text-white mb-6 transition-colors group">
                <div class="w-8 h-8 rounded-full bg-white/5 group-hover:bg-white/10 flex items-center justify-center transition-colors border border-white/5">
                  <ArrowLeft class="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                </div>
                Retour
              </button>

              <div class="flex flex-col items-center text-center">
                <div class="w-16 h-16 mx-auto mb-4 rounded-2xl bg-accent/10 flex items-center justify-center border border-accent/20 shadow-[0_0_30px_rgba(245,158,11,0.2)]">
                  <ShieldCheck class="w-8 h-8 text-accent" />
                </div>

                <h1 class="text-2xl font-extrabold text-white mb-2 tracking-tight">Code de sécurité</h1>
                <p class="text-white/70 text-sm font-medium mb-6 max-w-xs">
                  Envoyé à <strong class="text-white font-bold">{{ email }}</strong>
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
                    class="w-10 h-14 sm:w-12 sm:h-14 text-center text-2xl font-extrabold rounded-xl bg-white/10 border border-white/20 focus:bg-white/20 focus:border-accent focus:shadow-[0_0_0_3px_rgba(245,158,11,0.3)] outline-none transition-all text-white"
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
                  <div v-if="authStore.error" class="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-sm text-red-400 flex items-start justify-center text-center gap-3">
                    <AlertCircle class="w-5 h-5 mt-0.5 shrink-0" />
                    <span class="leading-relaxed">{{ authStore.error }}</span>
                  </div>
                </Transition>

                <button
                  type="submit"
                  :disabled="otpCode.length < 6 || authStore.isLoading"
                  class="w-full relative group overflow-hidden rounded-xl p-[2px] disabled:opacity-60 transition-all shadow-[0_4px_20px_rgba(245,158,11,0.2)] mt-2 border border-accent/50"
                >
                  <span class="absolute inset-0 bg-gradient-to-r from-accent via-yellow-400 to-accent group-hover:scale-105 transition-transform duration-500"></span>
                  <div class="relative flex items-center justify-center gap-2 px-6 py-3.5 bg-brand/50 rounded-[10px] text-white font-bold transition-colors group-hover:bg-transparent">
                    <Loader2 v-if="authStore.isLoading" class="w-5 h-5 animate-spin" />
                    <LogIn v-else class="w-5 h-5" />
                    {{ authStore.isLoading ? 'Vérification...' : 'Accéder à mon espace' }}
                  </div>
                </button>

                <!-- Resend -->
                <div class="text-center">
                  <button
                    v-if="resendCooldown <= 0"
                    @click="handleSendOtp"
                    type="button"
                    class="text-xs text-accent hover:text-white font-bold transition-colors underline underline-offset-4"
                  >
                    Je n'ai pas reçu le code
                  </button>
                  <p v-else class="text-xs font-medium text-white/50 bg-white/5 border border-white/5 inline-block px-3 py-1.5 rounded-full">
                    Renvoyer un code dans <span class="text-white font-bold">{{ resendCooldown }}s</span>
                  </p>
                </div>
              </form>
            </div>
          </Transition>

        </div>
      </div>
      
      <!-- Footer Text -->
      <div class="text-center mt-6">
        <p class="text-xs text-white/60 font-medium">
          En continuant, vous acceptez nos
          <NuxtLink to="/conditions" class="text-white hover:underline transition-colors">CGV</NuxtLink>.
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
