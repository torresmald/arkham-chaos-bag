<template>
  <div ref="audioRoot" class="relative">
    <button
      class="rounded-lg border border-green-700 px-3 py-1.5 text-xs text-green-300 transition hover:border-green-500 hover:text-green-100"
      @click="manageAudio"
    >
      <img
        v-if="soundsStore.disableAudio"
        src="/src/assets/sounds/audio_off.svg"
        alt="Audio apagado"
        class="h-4 w-4"
      />
      <img
        v-else
        src="/src/assets/sounds/audio.svg"
        alt="Audio activo"
        class="h-4 w-4"
      />
    </button>

    <div
      v-if="isAudioModalOpen"
      class="absolute right-0 top-11 z-50 w-56 rounded-xl border border-slate-700 bg-slate-900 p-3 shadow-xl"
    >
        <div class="mb-3 flex items-center justify-between">
          <span class="text-xs font-semibold text-slate-100">Audio</span>
          <button
            class="rounded border border-slate-600 px-1.5 py-0.5 text-[10px] text-slate-300 transition hover:border-slate-400 hover:text-white"
            @click="isAudioModalOpen = false"
          >
            ✕
          </button>
        </div>

        <button
          class="mb-3 w-full rounded-lg border px-2 py-1.5 text-xs font-medium transition"
          :class="
            soundsStore.disableAudio
              ? 'border-green-700 bg-green-900/40 text-green-200 hover:bg-green-900/60'
              : 'border-slate-600 text-slate-200 hover:border-slate-400'
          "
          @click="soundsStore.toggleAudio()"
        >
          {{ soundsStore.disableAudio ? "Activar audio" : "Silenciar audio" }}
        </button>

        <label class="mb-1 block text-[11px] text-slate-400">
          Volumen ({{ Math.round(localVolume * 100) }}%)
        </label>
        <input
          v-model.number="localVolume"
          type="range"
          min="0"
          max="1"
          step="0.01"
          class="w-full accent-green-700"
          @input="soundsStore.setVolume(localVolume)"
        />
    </div>
  </div>
</template>
<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from "vue";
import { useSoundsStore } from "@/stores/sounds/sounds";
const soundsStore = useSoundsStore();
const isAudioModalOpen = ref(false);
const localVolume = ref(soundsStore.volume);
const audioRoot = ref<HTMLElement | null>(null);

const manageAudio = () => {
  isAudioModalOpen.value = !isAudioModalOpen.value;
};

const handleClickOutside = (event: MouseEvent) => {
  if (!isAudioModalOpen.value) return;
  const target = event.target as Node | null;
  if (audioRoot.value && target && !audioRoot.value.contains(target)) {
    isAudioModalOpen.value = false;
  }
};

onMounted(() => {
  window.addEventListener("mousedown", handleClickOutside);
});

onUnmounted(() => {
  window.removeEventListener("mousedown", handleClickOutside);
});

watch(
  () => soundsStore.volume,
  (value) => {
    localVolume.value = value;
  },
  { immediate: true }
);
</script>
