<template>
  <div>
    <!-- Header with Gateway Status -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
      <div>
        <h1 class="text-2xl font-bold text-[var(--color-text)]">Paiements Mobile Money</h1>
        <p class="text-[var(--color-text-muted)]">Historique des SMS de paiement reçus par le relais Android</p>
      </div>

      <div class="flex items-center gap-3 px-4 py-2 rounded-xl bg-white border border-[var(--color-border)] shadow-sm">
        <div 
          class="w-3 h-3 rounded-full animate-pulse"
          :class="gatewayStatus.is_online ? 'bg-green-500' : 'bg-red-500'"
        ></div>
        <span class="text-sm font-medium" :class="gatewayStatus.is_online ? 'text-green-700' : 'text-red-700'">
          Relais : {{ gatewayStatus.is_online ? 'En ligne' : 'Hors-ligne' }}
        </span>
        <span class="text-xs text-[var(--color-text-muted)] border-l pl-3">
          Dernier signal : {{ formatLastSeen(gatewayStatus.last_seen) }}
        </span>
      </div>
    </div>

    <!-- Quick Stats -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
      <div class="bg-white p-6 rounded-2xl border border-[var(--color-border)] shadow-sm">
        <p class="text-sm text-[var(--color-text-muted)] mb-1">Total SMS reçus</p>
        <p class="text-2xl font-bold text-[var(--color-text)]">{{ logsData.total || 0 }}</p>
      </div>
      <div class="bg-green-50 p-6 rounded-2xl border border-green-100 shadow-sm">
        <p class="text-sm text-green-600 mb-1">Paiements validés</p>
        <p class="text-2xl font-bold text-green-700">{{ processedCount }}</p>
      </div>
      <div class="bg-amber-50 p-6 rounded-2xl border border-amber-100 shadow-sm">
        <p class="text-sm text-amber-600 mb-1">En attente / Échecs</p>
        <p class="text-2xl font-bold text-amber-700">{{ (logsData.total || 0) - processedCount }}</p>
      </div>
    </div>

    <!-- Logs Table -->
    <div class="bg-white rounded-2xl border border-[var(--color-border)] shadow-sm overflow-hidden">
      <div class="p-6 border-b border-[var(--color-border)] flex items-center justify-between">
        <h2 class="font-semibold text-[var(--color-text)]">Historique des transactions</h2>
        <button @click="fetchLogs" class="p-2 hover:bg-gray-100 rounded-lg transition-colors" :disabled="loading">
          <RefreshCwIcon class="w-5 h-5 text-[var(--color-text-muted)]" :class="{ 'animate-spin': loading }" />
        </button>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-gray-50 text-[var(--color-text-muted)] text-xs font-semibold uppercase tracking-wider">
              <th class="px-6 py-4">Opérateur</th>
              <th class="px-6 py-4">Expéditeur</th>
              <th class="px-6 py-4">Montant</th>
              <th class="px-6 py-4">Statut</th>
              <th class="px-6 py-4">Commande</th>
              <th class="px-6 py-4">Date</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="log in logsData.data" :key="log.id" class="hover:bg-gray-50/50 transition-colors">
              <td class="px-6 py-4">
                <span 
                  class="px-2 py-1 rounded-md text-xs font-bold uppercase"
                  :class="log.operator === 'Airtel' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'"
                >
                  {{ log.operator || 'Inconnu' }}
                </span>
              </td>
              <td class="px-6 py-4 font-mono text-sm">{{ log.sender_phone || '---' }}</td>
              <td class="px-6 py-4 font-bold text-[var(--color-text)]">
                {{ log.amount ? `${log.amount} FCFA` : '---' }}
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center gap-2">
                  <div 
                    class="w-2 h-2 rounded-full"
                    :class="{
                      'bg-green-500': log.status === 'processed',
                      'bg-amber-500': log.status === 'ignored',
                      'bg-red-500': log.status === 'failed',
                      'bg-gray-400': log.status === 'pending'
                    }"
                  ></div>
                  <span class="text-sm capitalize">{{ formatStatus(log.status) }}</span>
                </div>
                <p v-if="log.error_reason" class="text-[10px] text-red-500 mt-1 max-w-[150px] leading-tight">
                  {{ log.error_reason }}
                </p>
              </td>
              <td class="px-6 py-4">
                <NuxtLink 
                  v-if="log.order_id" 
                  :to="`/admin/commandes/${log.order_id}`"
                  class="text-amber-600 hover:underline text-sm font-medium"
                >
                  #{{ log.order_id }}
                </NuxtLink>
                <span v-else class="text-xs text-[var(--color-text-muted)]">---</span>
              </td>
              <td class="px-6 py-4 text-xs text-[var(--color-text-muted)]">
                {{ formatDate(log.created_at) }}
              </td>
            </tr>
            <tr v-if="!loading && (!logsData.data || logsData.data.length === 0)">
              <td colspan="6" class="px-6 py-12 text-center text-[var(--color-text-muted)]">
                Aucun log Mobile Money pour le moment.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination Simple -->
      <div v-if="logsData.last_page > 1" class="p-4 border-t border-[var(--color-border)] flex justify-center gap-2">
        <button 
          v-for="p in logsData.last_page" 
          :key="p"
          @click="currentPage = p"
          class="w-8 h-8 rounded-lg text-sm font-medium transition-colors"
          :class="currentPage === p ? 'bg-amber-500 text-white' : 'hover:bg-gray-100'"
        >
          {{ p }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RefreshCw as RefreshCwIcon, Smartphone } from 'lucide-vue-next'

definePageMeta({
  layout: 'admin',
  middleware: ['admin'],
})

useSeoMeta({
  title: 'Logs Mobile Money - Admin Dounia Market',
})

const { adminMobileMoneyLogs } = useBackendApi()

const loading = ref(false)
const currentPage = ref(1)
const logsData = ref({ data: [], total: 0, last_page: 1 })
const gatewayStatus = ref({ is_online: false, last_seen: null })

const processedCount = computed(() => {
  return logsData.value.data?.filter(l => l.status === 'processed').length || 0
})

async function fetchLogs() {
  loading.value = true
  try {
    const response = await adminMobileMoneyLogs({ page: currentPage.value })
    logsData.value = response.logs
    gatewayStatus.value = response.gateway_status
  } catch (error) {
    console.error('Erreur lors du chargement des logs:', error)
  } finally {
    loading.value = false
  }
}

// Watchers
watch(currentPage, () => {
  fetchLogs()
})

onMounted(() => {
  fetchLogs()
  // Refresh auto toutes les 2 minutes
  const interval = setInterval(fetchLogs, 120000)
  onUnmounted(() => clearInterval(interval))
})

// Helpers
function formatDate(dateStr: string) {
  if (!dateStr) return '---'
  return new Date(dateStr).toLocaleString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

function formatLastSeen(dateStr: string | null) {
  if (!dateStr) return 'Jamais'
  const date = new Date(dateStr)
  const diff = Math.floor((new Date().getTime() - date.getTime()) / 60000)
  if (diff < 1) return 'À l\'instant'
  if (diff < 60) return `Il y a ${diff} min`
  return date.toLocaleString('fr-FR', { hour: '2-digit', minute: '2-digit' })
}

function formatStatus(status: string) {
  const map: Record<string, string> = {
    processed: 'Payé',
    ignored: 'Ignoré',
    failed: 'Erreur',
    pending: 'Attente'
  }
  return map[status] || status
}
</script>
