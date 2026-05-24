<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'success'
  class?: string
}>(), {
  variant: 'default',
  class: ''
})

const variantClasses = {
  default: 'border-transparent bg-brand text-brand-foreground hover:bg-brand/80',
  secondary: 'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
  destructive: 'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80',
  success: 'border-transparent bg-success text-success-foreground hover:bg-success/80',
  outline: 'text-foreground'
}

const classes = computed(() => {
  return [
    'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
    variantClasses[props.variant],
    props.class
  ].join(' ')
})
</script>

<template>
  <div :class="classes">
    <slot />
  </div>
</template>
