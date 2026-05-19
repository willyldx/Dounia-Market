<template>
  <div class="group relative flex flex-col h-full bg-white rounded-[2rem] border border-[var(--color-border)] shadow-sm overflow-hidden animate-pulse">
    <!-- Image Skeleton -->
    <div class="relative w-full aspect-[4/5] bg-gray-100 flex items-center justify-center">
      <div class="w-16 h-16 bg-gray-200 rounded-2xl"></div>
    </div>
    
    <!-- Content Skeleton -->
    <div class="p-6 md:p-8 flex flex-col flex-grow relative bg-white">
      <!-- Badge Skeleton -->
      <div class="w-20 h-5 bg-gray-200 rounded-full mb-3"></div>
      
      <!-- Title Skeleton -->
      <div class="w-full h-6 bg-gray-200 rounded-md mb-2"></div>
      <div class="w-3/4 h-6 bg-gray-200 rounded-md mb-2"></div>
      
      <!-- Subtitle Skeleton -->
      <div class="w-1/2 h-4 bg-gray-100 rounded-md mt-1 mb-8"></div>
      
      <!-- Price and Cart Button Skeleton (Bottom aligned) -->
      <div class="mt-auto flex items-end justify-between pt-4 border-t border-[var(--color-border)]">
        <div class="flex flex-col gap-1">
          <div class="w-10 h-3 bg-gray-200 rounded-full"></div>
          <div class="w-24 h-7 bg-gray-200 rounded-md"></div>
        </div>
        <div class="w-12 h-12 rounded-2xl bg-gray-200 shrink-0"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Simple static skeleton component for perceived performance
</script>
