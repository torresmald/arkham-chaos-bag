<template>
  <header
    class="relative z-40 overflow-visible border-b border-slate-800 bg-slate-950/95 px-4 py-4 backdrop-blur"
  >
    <div class="mx-auto flex w-full max-w-md items-center justify-between">
      <h1 class="text-lg font-semibold tracking-tight">Arkham Chaos Bag</h1>
      <div class="flex items-center gap-2">
        <button
          class="rounded-lg border border-rose-700 px-3 py-1.5 text-xs text-rose-300 transition hover:border-rose-500 hover:text-rose-100"
          @click="store.reset()"
        >
          Reset App
        </button>
        <Audio />
      </div>
    </div>
  </header>
</template>
<script setup lang="ts">
import { useChaosBagStore } from "../../stores/bag/chaos";
const store = useChaosBagStore();
import Audio from "./Audio.vue";
</script>
