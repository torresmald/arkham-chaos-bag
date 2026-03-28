<template>
  <button
    class="w-full rounded-xl bg-green-700 px-4 py-3 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:bg-green-300 disabled:text-white"
    :disabled="isDrawing || bag.length === 0"
    @click="handleDraw"
  >
    {{ isDrawing ? "Robando..." : "Robar token" }}
  </button>
  <div class="grid grid-cols-2 gap-2" v-if="lastDraw">
    <button
      class="rounded-xl bg-indigo-700 px-3 py-2 text-xs font-semibold text-white transition disabled:cursor-not-allowed disabled:bg-indigo-300"
      :disabled="isDrawing || !lastDraw || bag.length === 0"
      @click="handleDrawAnother"
    >
      Robar otra ficha
    </button>
    <button
      class="rounded-xl border border-indigo-400/40 bg-indigo-500/15 px-3 py-2 text-xs font-semibold text-indigo-100 transition disabled:cursor-not-allowed disabled:opacity-50"
      :disabled="temporarilyDrawnTokens.length === 0 || isDrawing"
      @click="store.restoreTemporarilyDrawnTokens()"
    >
      Devolver retiradas ({{ temporarilyDrawnTokens.length }})
    </button>
  </div>
</template>
<script setup lang="ts">
import { useChaosBagStore } from "../../stores/bag/chaos";
import { useSoundsStore } from "../../stores/sounds/sounds";
import { computed } from "vue";
const store = useChaosBagStore();
const isDrawing = computed(() => store.isDrawing);
const bag = computed(() => store.bag);
const lastDraw = computed(() => store.lastDraw);
const soundsStore = useSoundsStore();

const temporarilyDrawnTokens = computed(() => store.temporarilyDrawnTokens);
async function handleDraw() {
  await soundsStore.handleDraw();
}

async function handleDrawAnother() {
  if (store.isDrawing || !store.lastDraw || store.bag.length === 0) return;
  store.temporarilyRemoveLastDrawFromBag();
  await soundsStore.handleDraw();
}
</script>
<style scoped></style>
