<template>
  <main class="min-h-dvh bg-slate-950 text-slate-100">
    <Header />

    <section class="mx-auto flex w-full max-w-md flex-col gap-4 p-4">
      <TokenResult :token="lastDraw" />
      <TokenExtracted />
      <DrawTokens />

      <button
        class="flex w-full items-center justify-around rounded-xl border border-indigo-400/40 bg-indigo-500/15 px-4 py-3 text-sm font-medium text-indigo-100 transition hover:bg-indigo-500/25"
        @click="modalStore.show(true)"
      >
        <span class="text-sm font-semibold text-slate-100">
          Bolsa ({{ bag.length }})
        </span>
        <span
          v-if="sealedTokens.length > 0"
          class="text-sm font-semibold text-slate-100"
        >
          Sellados ({{ sealedTokens.length }})
        </span>
      </button>
      <BlessedCursedManager />
      <AddToken />
    </section>

    <ShowBag :open="modalStore.isOpen" @close="modalStore.show(false)" />
  </main>
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue";
import Header from "@/components/Header/Header.vue";
import TokenResult from "@/components/Tokens/TokenResult.vue";
import TokenExtracted from "@/components/Tokens/TokenExtracted.vue";
import DrawTokens from "@/components/Tokens/DrawTokens.vue";
import AddToken from "@/components/Tokens/AddToken.vue";
import BlessedCursedManager from "@/components/BlessedCursedManager.vue";
import ShowBag from "@/components/ShowBag.vue";
import { useChaosBagStore } from "@/stores/bag/chaos";
import { useModalStore } from "@/stores/modal/modal";

const store = useChaosBagStore();
const modalStore = useModalStore();

onMounted(() => {
  store.loadFromStorage();
});

const bag = computed(() => store.bag);
const lastDraw = computed(() => store.lastDraw);
const sealedTokens = computed(() => store.sealedTokens);
</script>
