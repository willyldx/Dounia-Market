<template>
  <div class="min-h-screen bg-background">
    <main class="container mx-auto px-4 py-12">
      <!-- Hero Section from v0 -->
      <section class="text-center mb-20 relative">
        <!-- Deco -->
        <div class="absolute top-0 right-10 w-64 h-64 bg-accent/10 rounded-full blur-3xl -z-10" />
        <div class="absolute bottom-0 left-10 w-48 h-48 bg-primary/10 rounded-full blur-2xl -z-10" />

        <UiBadge class="mb-4 bg-accent/10 text-accent border-accent/20 hover:bg-accent/20">
          Dounia Market — Diaspora
        </UiBadge>
        <h1 class="font-serif text-4xl md:text-5xl lg:text-7xl font-bold mb-6 text-foreground max-w-4xl mx-auto leading-tight">
          Le meilleur pour votre famille,
          <span class="block text-accent">sans compromis.</span>
        </h1>
        <p class="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Commandez les meilleurs produits pour vos proches au Tchad. 
          Livraison sécurisée, suivi clair, qualité garantie. Une logistique pensée pour la diaspora.
        </p>
        <div class="mt-8 flex justify-center gap-4">
          <NuxtLink to="/catalogue">
            <UiButton size="lg" class="bg-accent text-accent-foreground hover:bg-accent/90 glow-accent rounded-xl text-lg px-8">
              Explorer le catalogue
              <ArrowRight class="ml-2 h-5 w-5" />
            </UiButton>
          </NuxtLink>
        </div>
      </section>

      <!-- Trust Badges (v0 style) -->
      <section class="mb-20 flex justify-center">
        <div class="glass-strong rounded-2xl p-6 shadow-premium-lg flex flex-wrap justify-center gap-6 md:gap-12 w-full max-w-4xl">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center">
              <ShieldCheck class="w-5 h-5 text-success" />
            </div>
            <div class="text-left">
              <p class="font-bold text-foreground">Paiement Sécurisé</p>
              <p class="text-xs text-muted-foreground">Visa, Mastercard, Mobile Money</p>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Truck class="w-5 h-5 text-brand" />
            </div>
            <div class="text-left">
              <p class="font-bold text-foreground">Livraison 3-5 jours</p>
              <p class="text-xs text-muted-foreground">Directement à N'Djamena</p>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
              <Camera class="w-5 h-5 text-accent" />
            </div>
            <div class="text-left">
              <p class="font-bold text-foreground">Preuve Photo</p>
              <p class="text-xs text-muted-foreground">À la réception de la commande</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Feature Showcase (v0 Style) -->
      <section id="features" class="mb-20">
        <div class="mb-8 text-center">
          <h2 class="font-serif text-3xl font-bold mb-2 text-foreground">Pourquoi choisir Dounia Market ?</h2>
          <p class="text-muted-foreground">Une expérience premium pour la diaspora.</p>
        </div>

        <div class="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <UiCard class="shadow-premium-lg border-0 bg-gradient-to-br from-card to-secondary/30">
            <div class="p-6">
              <div class="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center mb-4">
                <Globe class="h-7 w-7 text-accent" />
              </div>
              <h3 class="font-serif text-xl font-bold mb-2">Connexion Globale</h3>
              <p class="text-muted-foreground leading-relaxed">
                Envoyez l'essentiel à votre famille depuis n'importe où dans le monde. Nous gérons la logistique locale.
              </p>
            </div>
          </UiCard>

          <UiCard class="shadow-premium-lg border-0 bg-gradient-to-br from-card to-secondary/30">
            <div class="p-6">
              <div class="w-14 h-14 rounded-2xl bg-success/10 flex items-center justify-center mb-4">
                <ShieldCheck class="h-7 w-7 text-success" />
              </div>
              <h3 class="font-serif text-xl font-bold mb-2">Livraison Vérifiée</h3>
              <p class="text-muted-foreground leading-relaxed">
                Preuve photo à chaque livraison. Suivez votre colis en temps réel pour une tranquillité d'esprit totale.
              </p>
            </div>
          </UiCard>

          <UiCard class="shadow-premium-lg border-0 bg-gradient-to-br from-card to-secondary/30">
            <div class="p-6">
              <div class="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                <Users class="h-7 w-7 text-brand" />
              </div>
              <h3 class="font-serif text-xl font-bold mb-2">La Famille d'Abord</h3>
              <p class="text-muted-foreground leading-relaxed">
                Construit par la diaspora, pour la diaspora. Nous comprenons exactement ce dont votre famille a besoin.
              </p>
            </div>
          </UiCard>
        </div>
      </section>

      <!-- Products Section (Keeping real logic but v0 style) -->
      <section v-if="featuredProducts.length > 0" class="mb-20">
        <div class="mb-8 flex items-center justify-between max-w-6xl mx-auto">
          <div>
            <h2 class="font-serif text-3xl font-bold text-foreground">Top tendances</h2>
            <p class="text-muted-foreground mt-1">Sélectionnés pour vos proches</p>
          </div>
          <NuxtLink to="/catalogue" class="hidden items-center gap-2 text-sm font-semibold text-brand hover:text-brand/80 md:flex">
            Voir tout le catalogue
            <ArrowRight class="h-4 w-4" />
          </NuxtLink>
        </div>
        
        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto">
          <ProductCard v-for="(product, i) in featuredProducts" :key="product.id" :product="product" :delay="i * 100" />
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import {
  ArrowRight,
  ShieldCheck,
  Truck,
  Camera,
  Globe,
  Users
} from 'lucide-vue-next'
import UiButton from '~/components/ui/Button.vue'
import UiBadge from '~/components/ui/Badge.vue'
import UiCard from '~/components/ui/Card.vue'
import ProductCard from '~/components/product/ProductCard.vue'

const featuredProducts = ref<any[]>([])
const loading = ref(true)

onMounted(() => {
  fetchFeaturedProducts()
})

const fetchFeaturedProducts = async () => {
  loading.value = true
  try {
    const { getProducts } = useProducts()
    const response = await getProducts({ limit: 4 })
    featuredProducts.value = response.products.map((p: any) => ({
      id: p.id.toString(),
      title: p.title,
      handle: p.slug,
      subtitle: p.subtitle || '',
      price: p.price || 0,
      thumbnail: p.thumbnail || '',
      category: p.category || '',
      categoryHandle: p.category_handle || '',
      inStock: p.in_stock,
    }))
  } catch (e) {
    featuredProducts.value = []
  } finally {
    loading.value = false
  }
}

useHead({ 
  title: 'Dounia Market — Le marché de la diaspora tchadienne',
  meta: [
    { name: 'description', content: 'Dounia Market, le marché de référence pour la diaspora tchadienne.' },
  ]
})
</script>
