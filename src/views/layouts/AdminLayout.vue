<template>
  <div>
    <Navbar />
    <main>
      <div class="p-4">
        <router-view />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import Navbar from '@/components/Navbar.vue'
</script>
