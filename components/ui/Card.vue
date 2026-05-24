<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  class?: string
}>(), {
  class: ''
})

const classes = computed(() => {
  return [
    'rounded-xl border bg-card text-card-foreground shadow-sm',
    props.class
  ].join(' ')
})
</script>

<template>
  <div :class="classes">
    <slot />
  </div>
</template>
