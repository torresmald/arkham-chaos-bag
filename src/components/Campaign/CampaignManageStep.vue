<template>
  <p class="mt-3 text-[11px] text-slate-400">
    Paso actual: {{ currentStepLabel }}
  </p>

  <div v-if="props.isPrologueActive">
    <div
      class="mt-3 rounded-lg border border-slate-700 bg-slate-800/40 p-2 text-xs text-slate-300"
    >
      <p class="mb-1 text-[11px] text-slate-400">Prólogo</p>
      <p>{{ props.currentScenarioText }}</p>
    </div>
    <div class="mt-2 grid w-full">
      <button
        class="rounded-lg border border-slate-600 px-2 py-1.5 text-xs font-medium text-slate-200 transition hover:border-slate-400 disabled:cursor-not-allowed disabled:opacity-50"
        :disabled="!props.currentScenarioText"
        @click="emit('read-current-scenario-text')"
      >
        Leer prólogo
      </button>
      <button
        class="mt-2 rounded-lg border border-indigo-600 px-2 py-1.5 text-xs font-semibold text-indigo-100 transition hover:border-indigo-400 disabled:cursor-not-allowed disabled:opacity-50"
        :disabled="!props.selectedScenarioId"
        @click="emit('advance-scenario-text')"
      >
        Ir al escenario seleccionado
      </button>
    </div>
  </div>
  <label class="mb-1 mt-3 block text-xs text-slate-400">Escenario</label>
  <select
    :value="props.selectedScenarioId"
    class="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-100"
    @change="
      emit(
        'update:selectedScenarioId',
        ($event.target as HTMLSelectElement).value,
      )
    "
  >
    <option
      v-for="scenario in props.availableScenarios"
      :key="scenario.id"
      :value="scenario.id"
    >
      {{ scenario.name }}
    </option>
  </select>
  <div v-if="!props.isPrologueActive">
    <CurrentScenarioText
      :current-scenario-text="props.currentScenarioText"
      :is-scenario-base-text-active="props.isScenarioBaseTextActive"
      :selected-track="props.selectedTrack"
      :current-track-index="props.currentTrackIndex"
      :current-scenario-texts-length="props.currentScenarioTextsLength"
    />
    <label class="mb-1 mt-3 block text-xs text-slate-400">Narrativa</label>
    <select
      v-model="selectedTrackModel"
      class="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-100"
    >
      <option value="agenda">Plan</option>
      <option value="act">Acto</option>
    </select>
    <div class="mt-2 grid grid-cols-2 gap-2">
      <button
        class="rounded-lg border border-slate-600 px-2 py-1.5 text-xs font-medium text-slate-200 transition hover:border-slate-400 disabled:cursor-not-allowed disabled:opacity-50"
        :disabled="!props.currentScenarioText"
        @click="emit('read-current-scenario-text')"
      >
        Leer texto
      </button>
      <button
        class="rounded-lg border border-slate-600 px-2 py-1.5 text-xs font-medium text-slate-200 transition hover:border-slate-400 disabled:cursor-not-allowed disabled:opacity-50"
        :disabled="!props.canAdvanceScenarioText"
        @click="emit('advance-scenario-text')"
      >
        Siguiente {{ props.selectedTrack === "agenda" ? "plan" : "acto" }}
      </button>
    </div>

    <div class="mt-2 grid grid-cols-2 gap-2">
      <button
        class="rounded-lg border border-violet-700 bg-violet-900/20 px-2 py-1.5 text-xs font-medium text-violet-100 transition hover:bg-violet-900/40 disabled:cursor-not-allowed disabled:opacity-50"
        :disabled="!props.canAdvanceAgenda"
        @click="emit('advance-agenda')"
      >
        Avanzar plan
      </button>
      <button
        class="rounded-lg border border-teal-700 bg-teal-900/20 px-2 py-1.5 text-xs font-medium text-teal-100 transition hover:bg-teal-900/40 disabled:cursor-not-allowed disabled:opacity-50"
        :disabled="!props.canAdvanceAct"
        @click="emit('advance-act')"
      >
        Avanzar acto
      </button>
    </div>
  </div>
</template>
<script setup lang="ts">
import CurrentScenarioText from "./CurrentScenarioText.vue";
import type { CampaignScenario, Track } from "@/types/campaign";
import { computed } from "vue";
const props = defineProps<{
  currentScenarioText: string;
  isPrologueActive: boolean;
  isScenarioBaseTextActive: boolean;
  availableScenarios: CampaignScenario[];
  selectedScenarioId: string;
  canAdvanceScenarioText: boolean;
  selectedTrack: Track;
  canAdvanceAgenda: boolean;
  canAdvanceAct: boolean;
  currentTrackIndex: number;
  currentScenarioTextsLength: number;
}>();

const emit = defineEmits<{
  (e: "read-current-scenario-text"): void;
  (e: "advance-scenario-text"): void;
  (e: "advance-agenda"): void;
  (e: "advance-act"): void;
  (e: "update:selectedScenarioId", value: string): void;
  (e: "update:selectedTrack", value: Track): void;
}>();

const selectedTrackModel = computed({
  get: () => props.selectedTrack,
  set: (value: Track) => emit("update:selectedTrack", value),
});

const currentStepLabel = computed(() => {
  if (props.isPrologueActive) return "Prólogo";
  if (props.isScenarioBaseTextActive) return "Base del escenario";
  return "Agenda/Acto";
});
</script>
