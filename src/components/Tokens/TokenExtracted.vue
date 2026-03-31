<template>
  <div
    v-if="temporarilyDrawnTokens.length > 0"
    class="rounded-xl border border-slate-800 bg-slate-900/60 p-2"
  >
    <p class="mb-2 text-[11px] font-semibold text-slate-400">
      Retiradas temporalmente
    </p>
    <div class="flex gap-2 overflow-x-auto pb-1">
      <img
        v-for="(token, index) in temporarilyDrawnTokens"
        :key="`temp-${token.type}-${index}`"
        :src="token.image.front"
        :alt="`Token retirado ${token.type}`"
        class="h-8 w-8 shrink-0 rounded-full border border-slate-700 bg-slate-800 object-contain"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import { useChaosBagStore } from "@/stores/bag/chaos";
import { computed } from "vue";
const store = useChaosBagStore();
const temporarilyDrawnTokens = computed(() => store.temporarilyDrawnTokens);
</script>
