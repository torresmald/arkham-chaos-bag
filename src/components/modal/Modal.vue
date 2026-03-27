<template>
  <dialog
    class="fixed inset-0 z-50 m-0 h-full w-full bg-slate-950/70 p-0 backdrop-blur-sm"
    :open="open"
    @click.self="emit('close')"
    @close="emit('close')"
  >
    <div class="relative mx-auto mt-12 w-[calc(100%-2rem)] max-w-md rounded-2xl border border-slate-700 bg-slate-900 p-4 shadow-xl">
      <div class="mb-3 flex items-center justify-between">
        <slot name="title"></slot>
        <button
          class="rounded-md border border-slate-700 px-2 py-1 text-xs text-slate-300 transition hover:border-slate-500 hover:text-white"
          @click="emit('close')"
        >
          ✕
        </button>
      </div>
      <slot></slot>
    </div>
  </dialog>
</template>
<script setup lang="ts">
defineProps<{
  open: boolean;
}>();

const emit = defineEmits<{
  (e: "close"): void;
}>();
</script>
