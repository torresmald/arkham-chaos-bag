<template>
  <section
    class="rounded-xl border border-slate-800 bg-slate-900/70 p-4 cursor-pointer"
    @click="isOpen = true"
  >
    <h2 class="mb-2 text-sm font-semibold text-slate-100">Añadir tokens</h2>
    <div class="flex items-center justify-center gap-2">
      <div
        class="flex items-center justify-center w-full gap-1 rounded-lg border border-slate-700 bg-slate-800/50 px-1 py-1.5"
      >
        <img
          :src="'/src/assets/bag.png'"
          :alt="`Bolsa de Chaos`"
          class="h-10 w-10 rounded-full border border-slate-700 object-contain"
        />
        <span class="text-sm font-semibold text-slate-100">{{ bagCount }}</span>
      </div>
    </div>
  </section>

  <Modal :open="isOpen" @close="isOpen = false">
    <template #title>
      <h3 class="text-sm font-semibold text-slate-100">
        Añadir o quitar tokens
      </h3>
    </template>

    <div class="max-h-[58svh] space-y-2 overflow-auto pr-1">
      <div
        v-for="token in availableTokens"
        :key="token.type"
        class="flex items-center justify-between rounded-lg border border-slate-700 bg-slate-800/50 px-3 py-2"
      >
        <button
          class="h-8 w-8 rounded-md border border-slate-600 text-lg leading-none text-slate-200 transition hover:border-slate-400"
          :disabled="!canRemove(token.type)"
          :class="{ 'cursor-not-allowed opacity-50': !canRemove(token.type) }"
          @click="removeOne(token.type)"
        >
          -
        </button>
        <div class="flex items-center gap-2">
          <img
            :src="token.image.front"
            :alt="`Ficha ${token.type}`"
            class="h-10 w-10 rounded-full border border-slate-700"
          />
          <span class="text-sm font-semibold text-slate-100">{{
            countInBag(token.type)
          }}</span>
        </div>
        <button
          class="h-8 w-8 rounded-md border border-slate-600 text-lg leading-none text-slate-200 transition hover:border-slate-400"
          :disabled="!canAdd(token.type)"
          :class="{ 'cursor-not-allowed opacity-50': !canAdd(token.type) }"
          @click="addOne(token)"
        >
          +
        </button>
      </div>
    </div>
  </Modal>
</template>
<script setup lang="ts">
import { computed, ref } from "vue";
import { tokens } from "@/data/tokens/tokens";
import { useChaosBagStore } from "@/stores/bag/chaos";
import type { Token } from "@/types/token";
import type { TokenType } from "@/types/token";
import Modal from "@/components/modal/Modal.vue";

const store = useChaosBagStore();
const isOpen = ref(false);

const availableTokens = computed(() =>
  tokens.filter((token) => token.type !== "blessed" && token.type !== "cursed"),
);

const bagCount = computed(() => store.bag.length);

const addOne = (token: Token) => {
  if (!canAdd(token.type)) return;
  store.addToken({
    type: token.type,
    image: {
      front: token.image.front,
      back: token.image.back,
    },
  });
};

const removeOne = (type: TokenType) => {
  if (!canRemove(type)) return;
  const tokenToRemove = store.bag.find((token) => token.type === type);
  if (!tokenToRemove) return;
  store.removeToken(tokenToRemove);
};

const countInBag = (type: TokenType) =>
  store.bag.filter((token) => token.type === type).length;

const canAdd = (type: TokenType) => {
  if (type === "success" || type === "fail") {
    return countInBag(type) < 1;
  }
  return true;
};

const canRemove = (type: TokenType) => {
  const count = countInBag(type);
  if (type === "success" || type === "fail") {
    return count > 1;
  }
  return count > 0;
};
</script>
<style scoped></style>
