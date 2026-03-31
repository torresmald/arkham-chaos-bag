<template>
  <div
    v-if="props.currentScenarioText"
    class="mt-3 rounded-lg border border-slate-700 bg-slate-800/40 p-2 text-xs text-slate-300"
  >
    <p
      v-if="!props.isScenarioBaseTextActive"
      class="mb-1 text-[11px] text-slate-400"
    >
      {{ props.selectedTrack === "agenda" ? "Plan" : "Acto" }}
      {{ props.currentTrackIndex + 1 }} / {{ props.currentScenarioTextsLength }}
    </p>
    <p
      v-else
      class="mb-1 text-[11px] text-slate-400"
    >
      Base del escenario
    </p>
    <p>{{ props.currentScenarioText }}</p>
  </div>
</template>
<script setup lang="ts">
type Track = "agenda" | "act";

const props = defineProps<{
  currentScenarioText: string;
  isScenarioBaseTextActive: boolean;
  selectedTrack: Track;
  currentTrackIndex: number;
  currentScenarioTextsLength: number;
}>();
</script>
