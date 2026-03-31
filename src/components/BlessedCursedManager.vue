<template>
  <section
    class="rounded-xl border border-slate-800 bg-slate-900/70 p-4 cursor-pointer"
    @click="isOpen = true"
  >
    <div
      class="mt-1 flex items-center justify-around gap-3 text-xs text-slate-300"
    >
      <div class="flex items-center gap-2">
        <img
          v-if="blessedTemplate"
          :src="blessedTemplate.image.front"
          alt="Ficha bendita"
          class="h-10 w-10 rounded-full border border-slate-700"
        />
        <span class="text-lg font-bold">{{ blessedInBag }}</span>
      </div>
      <div class="flex items-center gap-2">
        <img
          v-if="cursedTemplate"
          :src="cursedTemplate.image.front"
          alt="Ficha maldita"
          class="h-10 w-10 rounded-full border border-slate-700"
        />
        <span class="text-lg font-bold">{{ cursedInBag }}</span>
      </div>
    </div>
  </section>

  <Modal :open="isOpen" @close="isOpen = false">
    <template #title>
      <h3 class="text-sm font-semibold text-slate-100">
        Ajustar tokens especiales
      </h3>
    </template>

    <div class="space-y-3">
      <div
        class="flex items-center justify-between rounded-lg border border-slate-700 bg-slate-800/50 px-3 py-2"
      >
        <button
          class="h-8 w-8 rounded-md border border-slate-600 text-lg leading-none text-slate-200 transition hover:border-slate-400"
          :class="{ 'opacity-50 cursor-not-allowed': cursedInBag <= 0 }"
          @click="removeOne('cursed')"
        >
          -
        </button>
        <div class="flex items-center gap-2">
          <img
            v-if="cursedTemplate"
            :src="cursedTemplate.image.front"
            alt="Ficha maldita"
            class="h-10 w-10 rounded-full border border-slate-700"
          />
          <span class="text-sm font-semibold text-slate-100">{{
            cursedInBag
          }}</span>
        </div>
        <button
          class="h-8 w-8 rounded-md border border-slate-600 text-lg leading-none text-slate-200 transition hover:border-slate-400"
          :class="{ 'opacity-50 cursor-not-allowed': cursedInBag >= 10 }"
          @click="addOne(cursedTemplate)"
        >
          +
        </button>
      </div>

      <div
        class="flex items-center justify-between rounded-lg border border-slate-700 bg-slate-800/50 px-3 py-2"
      >
        <button
          class="h-8 w-8 rounded-md border border-slate-600 text-lg leading-none text-slate-200 transition hover:border-slate-400"
          :class="{ 'opacity-50 cursor-not-allowed': blessedInBag <= 0 }"
          @click="removeOne('blessed')"
        >
          -
        </button>
        <div class="flex items-center gap-2">
          <img
            v-if="blessedTemplate"
            :src="blessedTemplate.image.front"
            alt="Ficha bendita"
            class="h-10 w-10 rounded-full border border-slate-700"
          />
          <span class="text-sm font-semibold text-slate-100">{{
            blessedInBag
          }}</span>
        </div>
        <button
          class="h-8 w-8 rounded-md border border-slate-600 text-lg leading-none text-slate-200 transition hover:border-slate-400"
          :class="{ 'opacity-50 cursor-not-allowed': blessedInBag >= 10 }"
          @click="addOne(blessedTemplate)"
        >
          +
        </button>
      </div>

      <button
        class="w-full rounded-lg border border-red-700 bg-red-500/10 px-3 py-2 text-xs text-red-200 transition hover:bg-red-500/20"
        :class="{ 'opacity-50 cursor-not-allowed': blessedInBag <= 0 && cursedInBag <= 0 }"
        @click="removeAll"
      >
        Quitar todos
      </button>
    </div>
  </Modal>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useChaosBagStore } from "@/stores/bag/chaos";
import { tokens } from "@/data/tokens/tokens";
import type { Token } from "@/types/token";
import Modal from "@/components/modal/Modal.vue";

const store = useChaosBagStore();
const isOpen = ref(false);

const blessedTemplate = tokens.find((token) => token.type === "blessed") as
  | Token
  | undefined;
const cursedTemplate = tokens.find((token) => token.type === "cursed") as
  | Token
  | undefined;

const blessedInBag = computed(
  () => store.bag.filter((token) => token.type === "blessed").length,
);
const cursedInBag = computed(
  () => store.bag.filter((token) => token.type === "cursed").length,
);

function addByType(template: Token | undefined) {
  if (!template) return;

  store.addToken({
    type: template.type,
    image: {
      front: template.image.front,
      back: template.image.back,
    },
  });
}

function removeByType(type: "blessed" | "cursed") {
  const tokenToRemove = store.bag.find((token) => token.type === type);
  if (!tokenToRemove) return;
  store.removeToken(tokenToRemove);
}

function addOne(template: Token | undefined) {
  if (!template) return;
  if (template.type === "blessed" && blessedInBag.value >= 10) return;
  if (template.type === "cursed" && cursedInBag.value >= 10) return;
  addByType(template);
}

function removeOne(type: "blessed" | "cursed") {
  if (type === "blessed" && blessedInBag.value <= 0) return;
  if (type === "cursed" && cursedInBag.value <= 0) return;
  removeByType(type);
}

function removeAll() {
  if (blessedInBag.value <= 0 && cursedInBag.value <= 0) return;
  store.bag = store.bag.filter(
    (token) => token.type !== "blessed" && token.type !== "cursed",
  );
  store.saveToStorage();
}
</script>
