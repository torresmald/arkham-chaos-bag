<template>
  <div class="mb-4 rounded-lg border border-slate-700 bg-slate-800/50 p-3">
    <p
      class="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-300"
    >
      Estado actual
    </p>
    <div class="space-y-1 text-xs text-slate-200">
      <p>
        Campaña: <span class="font-medium">{{ currentCampaignName }}</span>
      </p>
      <p>
        Dificultad:
        <span class="font-medium">{{ currentDifficultyLabel }}</span>
      </p>
      <p>
        Escenario: <span class="font-medium">{{ currentScenarioName }}</span>
      </p>
      <p>
        Plan: <span class="font-medium">{{ agendaProgressLabel }}</span>
      </p>
      <p>
        Acto: <span class="font-medium">{{ actProgressLabel }}</span>
      </p>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed } from "vue";
import { useCampaignStore } from "@/stores/campaign/campaign";

const campaignStore = useCampaignStore();

const currentCampaignName = computed(
  () => campaignStore.selectedCampaign?.campaign ?? "",
);
const currentDifficultyLabel = computed(
  () => campaignStore.selectedDifficulty?.toUpperCase() ?? "",
);
const currentScenarioName = computed(
  () => campaignStore.selectedScenario?.name ?? "",
);
const agendaProgressLabel = computed(() => (campaignStore.agendaIndex + 1).toString());
const actProgressLabel = computed(() => (campaignStore.actIndex + 1).toString());
</script>
