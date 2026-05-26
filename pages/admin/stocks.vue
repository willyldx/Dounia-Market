<template>
  <div class="space-y-6">
    <header class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p class="mb-2 text-xs font-semibold uppercase text-amber-700">Catalogue</p>
        <h1 class="text-2xl font-semibold text-zinc-950 sm:text-3xl">Inventaire</h1>
        <p class="mt-1 text-sm text-zinc-500">Suivi des produits du catalogue et de leurs niveaux de stock.</p>
      </div>
      <div class="flex flex-wrap items-center gap-2">
        <UButton
          aria-label="Actualiser les stocks"
          title="Actualiser les stocks"
          @click="fetchProducts"
          color="gray"
          variant="outline"
          icon="i-lucide-refresh-cw"
          :loading="loading"
          class="h-10"
        />
        <UButton @click="showImportModal = true" color="gray" variant="outline" icon="i-lucide-upload-cloud" class="h-10 font-medium">
          Importer
        </UButton>
        <UButton @click="showCreateModal = true" color="black" icon="i-lucide-plus" class="h-10 font-medium">
          Nouveau produit
        </UButton>
      </div>
    </header>

    <div class="grid grid-cols-2 gap-3 lg:grid-cols-4">
      <div
        v-for="stat in inventoryStats"
        :key="stat.label"
        class="relative min-h-[104px] rounded-lg border border-zinc-200 bg-white p-4"
      >
        <p class="pr-10 text-xs font-medium text-zinc-500 sm:text-sm">{{ stat.label }}</p>
        <p class="mt-3 text-2xl font-semibold text-zinc-950">{{ stat.value }}</p>
        <div :class="['absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-lg', stat.bgColor]">
          <Icon :name="stat.icon" :class="['h-5 w-5', stat.iconColor]" />
        </div>
      </div>
    </div>

    <section class="overflow-hidden rounded-lg border border-zinc-200 bg-white">
      <div class="flex flex-col gap-3 border-b border-zinc-100 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <div>
          <h2 class="text-base font-semibold text-zinc-950">Produits</h2>
          <p class="mt-0.5 text-xs text-zinc-500">{{ filteredProducts.length }} produit(s) affiché(s)</p>
        </div>
        <div class="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
          <UInput
            v-model="search"
            placeholder="Nom ou référence"
            icon="i-lucide-search"
            class="w-full sm:w-64"
            size="md"
          >
            <template #trailing>
              <UButton v-show="search" color="gray" variant="link" icon="i-lucide-x" :padded="false" @click="search = ''" />
            </template>
          </UInput>
          <USelectMenu
            v-model="stockFilter"
            :options="stockFilterOptions"
            placeholder="Tous les statuts"
            class="w-full sm:w-44"
            size="md"
          />
        </div>
      </div>

      <div v-if="loading" class="flex min-h-[200px] items-center justify-center">
        <UIcon name="i-lucide-loader-2" class="h-7 w-7 animate-spin text-zinc-400" />
      </div>

      <div v-else-if="filteredProducts.length === 0" class="flex min-h-[220px] flex-col items-center justify-center p-8 text-center">
        <Icon name="lucide:package-open" class="mb-3 h-8 w-8 text-zinc-300" />
        <p class="text-sm font-medium text-zinc-800">Aucun produit trouvé</p>
        <p class="mt-1 max-w-sm text-xs text-zinc-500">Modifiez les filtres ou ajoutez votre premier produit.</p>
        <UButton @click="showCreateModal = true" color="black" icon="i-lucide-plus" class="mt-5">Nouveau produit</UButton>
      </div>

      <div v-else>
        <div class="hidden overflow-x-auto md:block">
          <table class="w-full text-left text-sm">
          <thead class="border-b border-zinc-100 bg-zinc-50 text-xs font-semibold text-zinc-500">
            <tr>
              <th scope="col" class="px-5 py-3">Produit</th>
              <th scope="col" class="px-5 py-3">Prix</th>
              <th scope="col" class="px-5 py-3">Quantité</th>
              <th scope="col" class="px-5 py-3">État</th>
              <th scope="col" class="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-zinc-100">
            <tr v-for="product in filteredProducts" :key="product.id" class="group hover:bg-zinc-50">
              <td class="px-5 py-3">
                <div class="flex items-center gap-3">
                  <div class="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-md border border-zinc-100 bg-zinc-50">
                    <img v-if="product.thumbnail" :src="product.thumbnail" :alt="product.title" class="h-full w-full object-cover" />
                    <Icon v-else name="lucide:image" class="h-5 w-5 text-zinc-300" />
                  </div>
                  <div class="min-w-0">
                    <p class="truncate font-medium text-zinc-950">{{ product.title }}</p>
                    <p class="mt-0.5 truncate font-mono text-xs text-zinc-500">{{ product.handle }}</p>
                  </div>
                </div>
              </td>
              <td class="whitespace-nowrap px-5 py-3 font-medium text-zinc-900">{{ formatPrice(product.price) }}</td>
              <td class="whitespace-nowrap px-5 py-3">
                <span class="font-mono text-sm font-semibold" :class="getStockColor(product)">
                  {{ product.stock_quantity ?? '∞' }}
                </span>
                <span class="ml-1 text-xs text-zinc-400">unités</span>
              </td>
              <td class="whitespace-nowrap px-5 py-3">
                <UBadge :color="getStatusBadge(product).color" variant="subtle" class="font-semibold px-2.5 py-1">
                  {{ getStatusBadge(product).label }}
                </UBadge>
              </td>
              <td class="whitespace-nowrap px-5 py-3 text-right">
                <div class="flex items-center justify-end gap-1">
                  <UButton
                    size="sm"
                    color="gray"
                    variant="ghost"
                    icon="i-lucide-edit-3"
                    title="Modifier le stock"
                    @click="openEditModal(product)"
                  />
                  <UButton
                    size="sm"
                    color="red"
                    variant="ghost"
                    icon="i-lucide-trash-2"
                    title="Supprimer"
                    @click="deleteProduct(product)"
                  />
                </div>
              </td>
            </tr>
          </tbody>
          </table>
        </div>

        <div class="divide-y divide-zinc-100 md:hidden">
          <div v-for="product in filteredProducts" :key="product.id" class="p-4">
            <div class="flex gap-3">
              <div class="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-md border border-zinc-100 bg-zinc-50">
                <img v-if="product.thumbnail" :src="product.thumbnail" :alt="product.title" class="h-full w-full object-cover" />
                <Icon v-else name="lucide:image" class="h-5 w-5 text-zinc-300" />
              </div>
              <div class="min-w-0 flex-1">
                <p class="truncate font-medium text-zinc-950">{{ product.title }}</p>
                <p class="mt-0.5 truncate font-mono text-xs text-zinc-500">{{ product.handle }}</p>
                <div class="mt-2 flex flex-wrap items-center gap-2">
                  <UBadge :color="getStatusBadge(product).color" variant="subtle">
                    {{ getStatusBadge(product).label }}
                  </UBadge>
                  <span class="text-sm font-medium text-zinc-800">{{ formatPrice(product.price) }}</span>
                  <span class="text-sm text-zinc-500">{{ product.stock_quantity ?? '∞' }} unités</span>
                </div>
              </div>
            </div>
            <div class="mt-3 flex justify-end gap-2">
              <UButton
                size="sm"
                color="gray"
                variant="outline"
                icon="i-lucide-edit-3"
                @click="openEditModal(product)"
              >
                Modifier
              </UButton>
              <UButton
                aria-label="Supprimer le produit"
                size="sm"
                color="red"
                variant="ghost"
                icon="i-lucide-trash-2"
                @click="deleteProduct(product)"
              />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Edit Stock Modal -->
    <UModal v-model="showEditModal">
      <div class="p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-1">Modifier le stock</h3>
        <p class="text-sm text-gray-500 mb-6">{{ editingProduct?.title }}</p>

        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Quantité en stock</label>
            <UInput v-model.number="editForm.stockQuantity" type="number" min="0" placeholder="0" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Disponibilité</label>
            <USelectMenu
              v-model="editForm.inStock"
              :options="[
                { label: 'En stock', value: true },
                { label: 'Rupture de stock', value: false }
              ]"
              value-attribute="value"
              option-attribute="label"
            />
          </div>
        </div>

        <div class="flex justify-end gap-3 mt-6">
          <UButton color="gray" variant="outline" @click="showEditModal = false">Annuler</UButton>
          <UButton color="primary" :loading="saving" @click="saveStock">Enregistrer</UButton>
        </div>
      </div>
    </UModal>

    <!-- Create Product Modal -->
    <UModal v-model="showCreateModal">
      <div class="p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-1">Ajouter un produit</h3>
        <p class="text-sm text-gray-500 mb-6">Remplissez les informations du nouveau produit</p>

        <div class="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Nom du produit *</label>
            <UInput v-model="createForm.title" placeholder="Ex: Sac de riz 25kg" />
          </div>

          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Prix (€) *</label>
              <UInput v-model.number="createForm.price" type="number" min="0" step="0.01" placeholder="0.00" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Stock initial *</label>
              <UInput v-model.number="createForm.stock_quantity" type="number" min="0" placeholder="0" />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Sous-titre (Optionnel)</label>
            <UInput v-model="createForm.subtitle" placeholder="Courte description d'accroche" />
          </div>

          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Catégorie *</label>
              <UInput v-model="createForm.category" placeholder="Ex: Alimentaire" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Slug catégorie *</label>
              <UInput v-model="createForm.category_handle" placeholder="Ex: alimentaire" />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Image du produit *</label>
            <div class="flex flex-col gap-2">
              <UInput type="file" accept="image/*" :loading="uploadingImage" @change="onImageSelected" />
              <img v-if="createForm.thumbnail" :src="createForm.thumbnail" class="h-20 w-20 object-cover rounded-md border border-gray-200" alt="Aperçu" />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Description détaillée *</label>
            <UTextarea v-model="createForm.description" :rows="3" placeholder="Description complète du produit..." />
          </div>
        </div>

        <div class="flex justify-end gap-3 mt-6">
          <UButton color="gray" variant="outline" @click="showCreateModal = false">Annuler</UButton>
          <UButton color="primary" :loading="creating" :disabled="!createForm.title || !createForm.price || !createForm.category || !createForm.category_handle || !createForm.thumbnail || !createForm.description" @click="createProduct">Créer le produit</UButton>
        </div>
      </div>
    </UModal>

    <!-- Import CSV Modal -->
    <UModal v-model="showImportModal">
      <div class="p-6">
        <div class="flex items-center gap-3 mb-2">
          <div class="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
             <Icon name="lucide:file-spreadsheet" class="w-5 h-5 text-blue-500" />
          </div>
          <h3 class="text-lg font-semibold text-gray-900">Importation Massif (CSV)</h3>
        </div>
        <p class="text-sm text-gray-500 mb-6">Mettez à jour votre inventaire ou ajoutez de nouveaux produits en un seul clic à l'aide d'un fichier CSV (Excel).</p>

        <div class="bg-gray-50 p-4 rounded-lg border border-gray-100 mb-6">
          <p class="text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wider">Colonnes obligatoires :</p>
          <div class="flex flex-wrap gap-2 text-xs font-mono">
            <UBadge color="gray" variant="solid">title</UBadge>
            <UBadge color="gray" variant="solid">price</UBadge>
            <UBadge color="gray" variant="solid">stock</UBadge>
            <UBadge color="gray" variant="solid">category</UBadge>
          </div>
          <p class="text-xs text-gray-500 mt-3">Optionnels: <span class="font-mono">description, image, category_handle</span></p>
        </div>

        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Fichier CSV *</label>
            <UInput type="file" accept=".csv" @change="onCsvSelected" />
          </div>
        </div>

        <div class="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <UButton color="gray" variant="ghost" icon="i-lucide-download" to="/template_import_dounia-market.csv" target="_blank" download class="text-xs">
            Modèle CSV
          </UButton>
          <div class="flex flex-col gap-2 sm:flex-row sm:gap-3">
            <UButton color="gray" variant="outline" @click="showImportModal = false">Annuler</UButton>
            <UButton color="black" :loading="importing" :disabled="!csvFile" @click="processImportCSV">Lancer l'importation</UButton>
          </div>
        </div>
      </div>
    </UModal>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: ['admin']
})

const api = useBackendApi()
const toast = useToast()

// State
const loading = ref(true)
const saving = ref(false)
const creating = ref(false)
const uploadingImage = ref(false)
const products = ref<any[]>([])
const search = ref('')
const stockFilter = ref('')
const showEditModal = ref(false)
const showCreateModal = ref(false)
const showImportModal = ref(false)
const importing = ref(false)
const csvFile = ref<File | null>(null)
const editingProduct = ref<any>(null)
const editForm = reactive({
  stockQuantity: 0,
  inStock: true
})
const createForm = reactive({
  title: '',
  price: 0,
  subtitle: '',
  description: '',
  category: '',
  category_handle: '',
  thumbnail: '',
  stock_quantity: 0,
})

const stockFilterOptions = [
  { label: 'Tous les statuts', value: '' },
  { label: 'En stock', value: 'in_stock' },
  { label: 'Stock faible (< 10)', value: 'low_stock' },
  { label: 'Rupture', value: 'out_of_stock' },
]

// Computed
const inStockCount = computed(() => products.value.filter(p => p.in_stock && (p.stock_quantity ?? 1) > 0).length)
const lowStockCount = computed(() => products.value.filter(p => p.in_stock && p.stock_quantity !== null && p.stock_quantity > 0 && p.stock_quantity < 10).length)
const outOfStockCount = computed(() => products.value.filter(p => !p.in_stock || p.stock_quantity === 0).length)
const inventoryStats = computed(() => [
  { label: 'Total produits', value: products.value.length, icon: 'lucide:package', bgColor: 'bg-zinc-100', iconColor: 'text-zinc-700' },
  { label: 'En stock', value: inStockCount.value, icon: 'lucide:check-circle', bgColor: 'bg-emerald-50', iconColor: 'text-emerald-700' },
  { label: 'Stock faible', value: lowStockCount.value, icon: 'lucide:alert-triangle', bgColor: 'bg-amber-50', iconColor: 'text-amber-700' },
  { label: 'Rupture', value: outOfStockCount.value, icon: 'lucide:x-circle', bgColor: 'bg-red-50', iconColor: 'text-red-700' },
])

const filteredProducts = computed(() => {
  let result = [...products.value]

  if (search.value) {
    const q = search.value.toLowerCase()
    result = result.filter(p => p.title?.toLowerCase().includes(q) || p.handle?.toLowerCase().includes(q))
  }

  if (stockFilter.value === 'in_stock') {
    result = result.filter(p => p.in_stock && (p.stock_quantity ?? 1) > 0)
  } else if (stockFilter.value === 'low_stock') {
    result = result.filter(p => p.in_stock && p.stock_quantity !== null && p.stock_quantity > 0 && p.stock_quantity < 10)
  } else if (stockFilter.value === 'out_of_stock') {
    result = result.filter(p => !p.in_stock || p.stock_quantity === 0)
  }

  return result
})

// Fetch products from backend API
const fetchProducts = async () => {
  loading.value = true
  try {
    const result = await api.adminStocks()
    products.value = result?.data || []
  } catch (error) {
    console.error('Error fetching products:', error)
    toast.add({ title: 'Erreur', description: 'Impossible de charger les produits', color: 'red' })
  } finally {
    loading.value = false
  }
}

// Open edit modal
const openEditModal = (product: any) => {
  editingProduct.value = product
  editForm.stockQuantity = product.stock_quantity ?? 0
  editForm.inStock = product.in_stock ?? true
  showEditModal.value = true
}

// Save stock update via backend API
const saveStock = async () => {
  if (!editingProduct.value) return
  saving.value = true

  try {
    await api.adminStockUpdate(editingProduct.value.id, {
      stock_quantity: editForm.stockQuantity,
      in_stock: editForm.inStock,
    })

    toast.add({ title: 'Succès', description: 'Stock mis à jour', color: 'green' })
    showEditModal.value = false
    fetchProducts()
  } catch (error: any) {
    console.error('Error saving stock:', error)
    toast.add({ title: 'Erreur', description: error.message || 'Impossible de mettre à jour le stock', color: 'red' })
  } finally {
    saving.value = false
  }
}

// Create new product
const createProduct = async () => {
  creating.value = true
  try {
    await api.adminProductCreate({
      title: createForm.title,
      price: createForm.price,
      subtitle: createForm.subtitle || undefined,
      description: createForm.description || undefined,
      category: createForm.category || undefined,
      category_handle: createForm.category_handle || undefined,
      thumbnail: createForm.thumbnail || undefined,
      stock_quantity: createForm.stock_quantity,
      in_stock: true,
    })

    toast.add({ title: 'Succès', description: 'Produit créé avec succès', color: 'green' })
    showCreateModal.value = false
    // Reset form
    Object.assign(createForm, { title: '', price: 0, subtitle: '', description: '', category: '', category_handle: '', thumbnail: '', stock_quantity: 0 })
    fetchProducts()
  } catch (error: any) {
    console.error('Error creating product:', error)
    toast.add({ title: 'Erreur', description: error?.data?.message || error.message || 'Impossible de créer le produit', color: 'red' })
  } finally {
    creating.value = false
  }
}

// Upload Image
const onImageSelected = async (e: any) => {
  // Gère à la fois l'événement natif et l'émission directe de liste de fichiers par Nuxt UI
  const file = e?.target?.files?.[0] || (e instanceof FileList ? e[0] : null) || (Array.isArray(e) ? e[0] : e)
  
  if (!file || !(file instanceof File)) {
    console.error('Aucun fichier valide sélectionné', e);
    return;
  }
  
  uploadingImage.value = true
  try {
    const res = await api.adminUploadFile(file)
    createForm.thumbnail = res.url
    toast.add({ title: 'Aperçu généré', description: `L'image est prête !`, color: 'green' })
  } catch (error: any) {
    console.error('Upload failed:', error)
    toast.add({ title: 'Erreur', description: `Impossible de télécharger l'image.`, color: 'red' })
  } finally {
    uploadingImage.value = false
  }
}

// Delete product
const deleteProduct = async (product: any) => {
  if (!confirm(`Supprimer "${product.title}" ? Cette action est irréversible.`)) return

  try {
    await api.adminProductDelete(product.id)
    toast.add({ title: 'Supprimé', description: 'Produit supprimé', color: 'green' })
    fetchProducts()
  } catch (error: any) {
    toast.add({ title: 'Erreur', description: error.message || 'Impossible de supprimer', color: 'red' })
  }
}

// Upload CSV logic
const onCsvSelected = (e: any) => {
  const file = e?.target?.files?.[0] || (e instanceof FileList ? e[0] : null) || (Array.isArray(e) ? e[0] : e)
  if (file && file instanceof File) {
    csvFile.value = file
  } else {
    csvFile.value = null
  }
}

const processImportCSV = async () => {
  if (!csvFile.value) return
  
  importing.value = true
  try {
    const res = await api.adminStockImport(csvFile.value)
    if (res.success) {
      toast.add({ 
        title: 'Importation réussie 🎉', 
        description: `${res.stats?.created} créés, ${res.stats?.updated} mis à jour.`, 
        color: 'green',
        timeout: 6000
      })
      showImportModal.value = false
      csvFile.value = null
      fetchProducts()
    } else {
      toast.add({ title: 'Erreur', description: res.message || 'Erreur lors de l\'importation', color: 'red' })
    }
  } catch (error: any) {
    console.error('Import failed:', error)
    toast.add({ title: 'Échec de l\'importation', description: error.message || 'Vérifiez le format de votre fichier CSV.', color: 'red' })
  } finally {
    importing.value = false
  }
}

// Helpers
const formatPrice = (amount: number) => {
  return useCartStore().formatPrice(amount || 0)
}

const getStockColor = (product: any) => {
  const qty = product.stock_quantity
  if (qty === null || qty === undefined) return 'text-gray-400'
  if (qty === 0) return 'text-red-600'
  if (qty < 10) return 'text-amber-600'
  return 'text-green-600'
}

const getStatusBadge = (product: any) => {
  const qty = product.stock_quantity
  if (!product.in_stock || qty === 0) return { label: 'Rupture', color: 'red' }
  if (qty !== null && qty < 10) return { label: 'Stock faible', color: 'amber' }
  return { label: 'En stock', color: 'green' }
}

// Fetch on mount
onMounted(() => {
  fetchProducts()
})

useHead({
  title: 'Stocks - Admin Dounia Market'
})
</script>

