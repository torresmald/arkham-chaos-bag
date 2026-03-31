<template>
  <section>
    <CampaignSetupStep
      v-if="!campaignStore.isSelectedCampaign"
      :campaigns="campaigns"
      :difficulties="difficulties"
      :selected-campaign="selectedCampaign"
      :selected-difficulty="selectedDifficulty"
      :available-scenarios="availableScenarios"
      :selected-scenario-id="selectedScenarioId"
      :selected-track="selectedTrack"
      :current-track-index="currentTrackIndex"
      :current-scenario-texts-length="currentScenarioTexts.length"
      :current-scenario-text="currentScenarioText"
      @update:selected-campaign="selectedCampaign = $event"
      @update:selected-difficulty="selectedDifficulty = $event"
      @update:selected-scenario-id="onSelectedScenarioChange"
      @apply-campaign="handleApplyCampaign"
    />

    <CampaignManageStep
      v-if="campaignStore.isSelectedCampaign"
      :current-scenario-text="currentScenarioText"
      :is-prologue-active="isPrologueActive"
      :is-scenario-base-text-active="isScenarioBaseTextActive"
      :available-scenarios="availableScenarios"
      :selected-scenario-id="selectedScenarioId"
      :can-advance-scenario-text="canAdvanceScenarioText"
      :selected-track="selectedTrack"
      :can-advance-agenda="canAdvanceAgenda"
      :can-advance-act="canAdvanceAct"
      :current-track-index="currentTrackIndex"
      :current-scenario-texts-length="currentScenarioTexts.length"
      @read-current-scenario-text="readCurrentScenarioText"
      @advance-scenario-text="advanceScenarioText"
      @advance-agenda="advanceAgenda"
      @advance-act="advanceAct"
      @update:selected-scenario-id="handleScenarioSelection"
      @update:selected-track="selectedTrack = $event"
    />
  </section>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import CampaignSetupStep from "@/components/Campaign/CampaignSetupStep.vue";
import CampaignManageStep from "@/components/Campaign/CampaignManageStep.vue";
import { useCampaignProgress } from "@/composables/useCampaignProgress";
const emit = defineEmits<{
  (e: "close-selector"): void;
}>();

const {
  campaignStore,
  campaigns,
  selectedCampaign,
  selectedDifficulty,
  selectedScenarioId,
  selectedTrack,
  isPrologueActive,
  isScenarioBaseTextActive,
  availableScenarios,
  currentScenarioTexts,
  currentTrackIndex,
  currentScenarioText,
  canAdvanceScenarioText,
  canAdvanceAgenda,
  canAdvanceAct,
  onSelectedScenarioChange,
  initialize,
  applyCampaign,
  readCurrentScenarioText,
  advanceScenarioText,
  advanceAgenda,
  advanceAct,
  difficulties,
} = useCampaignProgress();

onMounted(async () => {
  await initialize();
});

const handleScenarioSelection = (scenarioId: string) => {
  if (isPrologueActive.value) {
    selectedScenarioId.value = scenarioId;
    return;
  }
  onSelectedScenarioChange(scenarioId);
};

const handleApplyCampaign = () => {
  if (applyCampaign()) {
    emit("close-selector");
  }
};
</script>
