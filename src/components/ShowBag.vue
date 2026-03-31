<template>
  <Modal :open="open" @close="emit('close')">
    <template #title>
      <h2 class="text-base font-semibold text-slate-100">
        Bolsa ({{ bag.length }})
      </h2>
    </template>

    <p
      v-if="bag.length === 0"
      class="rounded-lg border border-slate-700 p-4 text-sm text-slate-400"
    >
      No hay tokens en la bolsa.
    </p>
    <ul
      v-else
      class="grid max-h-[35svh] grid-cols-4 gap-2 overflow-auto pr-1 sm:grid-cols-5"
    >
      <li
        v-for="(token, index) in bag"
        :key="`${token.type}-${index}`"
        class="relative"
      >
        <img
          :src="token.image.front"
          :alt="`Token ${token.type}`"
          class="h-16 rounded-full border border-slate-700 bg-slate-800 object-contain"
        />
        <button
          v-if="mode === 'seal'"
          class="absolute right-2 top-0 flex h-5 w-5 items-center justify-center rounded-full border border-violet-400/70 bg-violet-500 text-[10px] font-bold leading-none text-white shadow transition hover:bg-violet-400"
          @click="store.sealToken(token)"
        >
          🔒
        </button>
      </li>
    </ul>

    <h2 class="text-base font-semibold text-slate-100 mt-4">
      Tokens sellados ({{ sealedTokens.length }})
    </h2>
    <ul
      v-if="sealedTokens.length > 0"
      class="grid max-h-[55svh] grid-cols-4 gap-2 overflow-auto pr-1 sm:grid-cols-5 mt-2"
    >
      <li
        v-for="(token, index) in sealedTokens"
        :key="`${token.type}-${index}`"
        class="relative"
      >
        <img
          :src="token.image.front"
          :alt="`Token ${token.type}`"
          class="h-16 rounded-full border border-slate-700 bg-slate-800 object-contain"
        />
        <button
          v-if="mode === 'return'"
          class="absolute right-2 top-0 flex h-5 w-5 items-center justify-center rounded-full border border-green-400/70 bg-green-700 text-[10px] font-bold leading-none text-white shadow transition hover:bg-green-900"
          @click="store.returnSealedToken(token)"
        >
          🔓
        </button>
      </li>
    </ul>
    <p
      v-else
      class="rounded-lg border border-slate-700 p-4 text-sm text-slate-400"
    >
      No hay tokens sellados.
    </p>
    <button
      v-if="canSeal || canReturn"
      class="mt-3 w-full rounded-xl px-4 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-300"
      :class="
        mode === 'seal'
          ? 'bg-violet-600 text-violet-100 hover:bg-violet-500'
          : 'bg-green-700 text-green-100 hover:bg-green-900'
      "
      :disabled="isCurrentModeDisabled"
      @click="toggleMode"
    >
      {{ mode === "seal" ? "Sellando" : "Sacando" }}
    </button>
  </Modal>
</template>
<script setup lang="ts">
import { useChaosBagStore } from "@/stores/bag/chaos";
import { computed, ref } from "vue";
import Modal from "@/components/modal/Modal.vue";
const store = useChaosBagStore();
const bag = computed(() => store.bag);
const sealedTokens = computed(() => store.sealedTokens);
const preferredMode = ref<"seal" | "return">("seal");
defineProps<{
  open: boolean;
}>();

const emit = defineEmits<{
  (event: "close"): void;
}>();

const canSeal = computed(() => bag.value.length > 0);
const canReturn = computed(() => sealedTokens.value.length > 0);

const mode = computed<"seal" | "return">(() => {
  if (preferredMode.value === "seal" && canSeal.value) return "seal";
  if (preferredMode.value === "return" && canReturn.value) return "return";
  if (canSeal.value) return "seal";
  if (canReturn.value) return "return";
  return preferredMode.value;
});

const isCurrentModeDisabled = computed(() =>
  mode.value === "seal" ? !canSeal.value : !canReturn.value,
);

const toggleMode = () => {
  preferredMode.value = mode.value === "seal" ? "return" : "seal";
};
</script>
