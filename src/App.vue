<template>
  <main class="min-h-dvh bg-slate-950 text-slate-100">
    <Header />

    <section class="mx-auto flex w-full max-w-md flex-col gap-4 p-4">
      <TokenResult :token="lastDraw" />
      <button
        class="w-full rounded-xl bg-green-700 px-4 py-3 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:bg-green-300 disabled:text-white"
        :disabled="isDrawing || bag.length === 0"
        @click="handleDraw"
      >
        {{ isDrawing ? "Robando..." : "Robar token" }}
      </button>

      <button
        class="w-full rounded-xl border border-indigo-400/40 bg-indigo-500/15 px-4 py-3 flex items-center justify-around text-sm font-medium text-indigo-100 transition hover:bg-indigo-500/25"
        @click="modalStore.show(true)"
      >
        <span class="text-sm font-semibold text-slate-100"> Bolsa ({{ bag.length }}) </span>
        <span v-if="sealedTokens.length > 0" class="text-sm font-semibold text-slate-100"> Sellados ({{ sealedTokens.length }}) </span>
      </button>
      <BlessedCursedManager />
      <AddToken />
    </section>

    <ShowBag :open="modalStore.isOpen" @close="modalStore.show(false)" />
  </main>
</template>
<script setup lang="ts">
import { useChaosBagStore } from "./stores/bag/chaos";
import { onMounted, onUnmounted, computed } from "vue";
import TokenResult from "./components/TokenResult.vue";
import AddToken from "./components/AddToken.vue";
import BlessedCursedManager from "./components/BlessedCursedManager.vue";
import ShowBag from "./components/ShowBag.vue";
import { useModalStore } from "./stores/modal/modal";
import { useSoundsStore } from "./stores/sounds/sounds";
import Header from "./components/Header/Header.vue";
const store = useChaosBagStore();
const modalStore = useModalStore();
const soundsStore = useSoundsStore();
onMounted(() => {
  store.loadFromStorage();
});
const bag = computed({
  get: () => store.bag,
  set: (value) => {
    store.bag = value;
    store.saveToStorage();
  },
});
const lastDraw = computed(() => store.lastDraw);
const isDrawing = computed(() => store.isDrawing);
const sealedTokens = computed(() => store.sealedTokens);

async function handleDraw() {
  await soundsStore.handleDraw();
}

onUnmounted(() => {
  soundsStore.stopAll();
});
</script>
