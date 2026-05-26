<template>
  <div class="relative" ref="dropdownRef">
    <button
      @click="isOpen = !isOpen"
      class="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-black/5 dark:hover:bg-white/10"
      :class="{ 'bg-black/5 dark:bg-white/10': isOpen }"
      :aria-expanded="isOpen"
      aria-haspopup="listbox"
    >
      <span class="text-base leading-none">{{ activeCurrency.flag }}</span>
      <span class="text-[var(--color-text-secondary)]">{{ activeCurrency.code }}</span>
      <ChevronDown
        class="h-3.5 w-3.5 text-[var(--color-text-muted)] transition-transform duration-200"
        :class="{ 'rotate-180': isOpen }"
        :stroke-width="1.75"
      />
    </button>

    <!-- Dropdown -->
    <Transition
      enter-active-class="transition duration-150 ease-out"
      enter-from-class="opacity-0 scale-95 -translate-y-1"
      enter-to-class="opacity-100 scale-100 translate-y-0"
      leave-active-class="transition duration-100 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div
        v-if="isOpen"
        class="absolute right-0 top-full mt-1.5 w-52 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden z-50"
        role="listbox"
      >
        <div class="p-1.5">
          <button
            v-for="currency in currencies"
            :key="currency.code"
            @click="selectCurrency(currency.code)"
            class="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150 hover:bg-amber-50 dark:hover:bg-amber-900/20"
            :class="{
              'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400': currency.code === activeCurrency.code,
              'text-[var(--color-text-secondary)]': currency.code !== activeCurrency.code,
            }"
            role="option"
            :aria-selected="currency.code === activeCurrency.code"
          >
            <span class="text-lg leading-none">{{ currency.flag }}</span>
            <div class="flex-1 text-left">
              <span class="font-medium">{{ currency.code }}</span>
              <span class="text-xs text-[var(--color-text-muted)] ml-1">{{ currency.name }}</span>
            </div>
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ChevronDown } from 'lucide-vue-next'

const { currencies, activeCurrency, setCurrency } = useCurrency()
const isOpen = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)

function selectCurrency(code: string) {
  setCurrency(code as any)
  isOpen.value = false
}

// Close on click outside
function handleClickOutside(e: MouseEvent) {
  if (dropdownRef.value && !dropdownRef.value.contains(e.target as Node)) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
