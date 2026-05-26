import { ConvexClient } from "convex/browser";
import type { FunctionReference } from "convex/server";

const VISITOR_ID_KEY = "dounia_market_visitor_id";

function getVisitorId(): string {
  if (typeof window === "undefined") return "";
  
  let visitorId = localStorage.getItem(VISITOR_ID_KEY);
  if (!visitorId) {
    visitorId = crypto.randomUUID();
    localStorage.setItem(VISITOR_ID_KEY, visitorId);
  }
  return visitorId;
}

export function useCart() {
  const config = useRuntimeConfig();
  const authStore = useAuthStore();
  
  // État local
  const cart = ref<any>(null);
  const isLoading = ref(false);
  const convex = ref<ConvexClient | null>(null);

  // Initialiser le client Convex
  onMounted(() => {
    if (config.public.convexUrl) {
      convex.value = new ConvexClient(config.public.convexUrl);
      subscribeToCart();
    }
  });

  onUnmounted(() => {
    convex.value?.close();
  });

  // Subscription temps réel au panier
  function subscribeToCart() {
    if (!convex.value) return;

    const visitorId = getVisitorId();
    
    convex.value.onUpdate(
      "cart:getCart" as unknown as FunctionReference<"query">,
      { visitorId },
      (updatedCart) => {
        cart.value = updatedCart;
      }
    );
  }

  // Charger le panier
  async function fetchCart() {
    if (!convex.value) return;
    
    isLoading.value = true;
    try {
      const visitorId = getVisitorId();
      cart.value = await convex.value.query("cart:getCart" as unknown as FunctionReference<"query">, { visitorId });
    } finally {
      isLoading.value = false;
    }
  }

  // Ajouter au panier
  async function addItem(product: {
    productId: string;
    variantId?: string;
    title: string;
    thumbnail?: string;
    price: number;
    quantity?: number;
  }) {
    if (!convex.value) return;

    await convex.value.mutation("cart:addItem" as unknown as FunctionReference<"mutation">, {
      visitorId: getVisitorId(),
      productId: product.productId,
      variantId: product.variantId,
      title: product.title,
      thumbnail: product.thumbnail,
      price: product.price,
      quantity: product.quantity || 1,
    });
  }

  // Mettre à jour quantité
  async function updateQuantity(itemId: string, quantity: number) {
    if (!convex.value) return;

    await convex.value.mutation("cart:updateQuantity" as unknown as FunctionReference<"mutation">, {
      itemId,
      quantity,
    });
  }

  // Supprimer item
  async function removeItem(itemId: string) {
    if (!convex.value) return;

    await convex.value.mutation("cart:removeItem" as unknown as FunctionReference<"mutation">, {
      itemId,
    });
  }

  // Vider le panier
  async function clearCart() {
    if (!convex.value) return;

    await convex.value.mutation("cart:clearCart" as unknown as FunctionReference<"mutation">, {
      visitorId: getVisitorId(),
    });
  }

  // Merger au login
  async function mergeOnLogin(userId: string) {
    if (!convex.value) return;

    await convex.value.mutation("cart:mergeCartOnLogin" as unknown as FunctionReference<"mutation">, {
      visitorId: getVisitorId(),
      userId,
    });
  }

  // Computed
  const items = computed(() => cart.value?.items || []);
  const totalItems = computed(() => cart.value?.totalItems || 0);
  const totalPrice = computed(() => cart.value?.totalPrice || 0);
  const isEmpty = computed(() => totalItems.value === 0);

  return {
    cart,
    items,
    totalItems,
    totalPrice,
    isEmpty,
    isLoading,
    fetchCart,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    mergeOnLogin,
  };
}
