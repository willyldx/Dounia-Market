<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-200"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-150"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="modelValue" class="fixed inset-0 z-50 lg:hidden">
        <div class="absolute inset-0 bg-brand/60" @click="close"></div>
        <aside class="absolute inset-y-0 right-0 flex w-[min(86vw,360px)] flex-col bg-card shadow-xl" aria-label="Navigation mobile">
          <div class="flex h-16 items-center justify-between border-b border-border px-5">
            <span class="text-base font-bold text-foreground">Dounia Market Tchad</span>
            <button
              type="button"
              aria-label="Fermer le menu"
              class="flex h-10 w-10 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
              @click="close"
            >
              <X class="h-5 w-5" :stroke-width="1.75" />
            </button>
          </div>

          <nav class="flex-1 overflow-y-auto px-3 py-4">
            <NuxtLink to="/catalogue" class="mobile-link" @click="close">
              <ShoppingBag class="h-5 w-5" :stroke-width="1.75" />
              Catalogue
            </NuxtLink>
            <NuxtLink to="/suivi" class="mobile-link" @click="close">
              <PackageCheck class="h-5 w-5" :stroke-width="1.75" />
              Suivre une commande
            </NuxtLink>
            <NuxtLink to="/favoris" class="mobile-link" @click="close">
              <Heart class="h-5 w-5" :stroke-width="1.75" />
              Favoris
            </NuxtLink>
            <NuxtLink to="/compte" class="mobile-link" @click="close">
              <User class="h-5 w-5" :stroke-width="1.75" />
              Mon compte
            </NuxtLink>

            <div class="mx-2 my-4 border-t border-border"></div>
            <NuxtLink to="/comment-ca-marche" class="mobile-text-link" @click="close">Comment ça marche</NuxtLink>
            <NuxtLink to="/faq" class="mobile-text-link" @click="close">Questions fréquentes</NuxtLink>
            <NuxtLink to="/contact" class="mobile-text-link" @click="close">Contact</NuxtLink>
          </nav>

          <div class="border-t border-border p-5">
            <ClientOnly>
              <CurrencySelector class="mb-4" />
            </ClientOnly>
            <NuxtLink
              v-if="!authStore.isAuthenticated"
              to="/auth/login"
              class="flex h-11 items-center justify-center rounded-md bg-[#c9872b] px-5 text-sm font-semibold text-white"
              @click="close"
            >
              Se connecter
            </NuxtLink>
            <button
              v-else
              type="button"
              class="flex h-11 w-full items-center justify-center rounded-md border border-border px-5 text-sm font-semibold text-foreground hover:bg-muted"
              @click="handleLogout"
            >
              Se déconnecter
            </button>
          </div>
        </aside>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { Heart, PackageCheck, ShoppingBag, User, X } from 'lucide-vue-next'
import { useAuthStore } from '~/stores/auth'

defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const authStore = useAuthStore()

function close() {
  emit('update:modelValue', false)
}

async function handleLogout() {
  close()
  await authStore.logout()
}
</script>

<style scoped>
.mobile-link {
  @apply flex h-12 items-center gap-3 rounded-md px-3 text-sm font-medium text-foreground transition-colors hover:bg-muted;
}

.mobile-link svg {
  @apply text-muted-foreground;
}

.mobile-text-link {
  @apply block rounded-md px-3 py-3 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground;
}
</style>
