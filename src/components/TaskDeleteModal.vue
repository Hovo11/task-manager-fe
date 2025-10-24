<template>
  <div
      v-if="show"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
  >
    <div class="bg-white rounded-lg p-6 w-80 shadow-lg">
      <h3 class="text-lg font-semibold mb-4">Confirm Delete</h3>
      <p class="text-sm text-gray-600 mb-6">
        Are you sure you want to delete this task? This action cannot be undone.
      </p>
      <div class="flex justify-end space-x-3">
        <button
            class="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            @click="$emit('cancel')"
        >
          Cancel
        </button>
        <button
            class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            @click="$emit('confirm')"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ show: boolean }>()
</script>
