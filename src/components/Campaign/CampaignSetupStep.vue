<template>
  <div>
    <label class="mb-1 block text-xs text-slate-400">Campaña</label>
    <div ref="campaignDropdownRef" class="relative mb-3">
      <button
        class="flex w-full items-center justify-between rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-100"
        type="button"
        @click="isCampaignDropdownOpen = !isCampaignDropdownOpen"
      >
        <span class="flex items-center gap-2">
          <img
            v-if="selectedCampaignData?.icon"
            :src="selectedCampaignData.icon"
            :alt="`Icono ${selectedCampaignData.campaign}`"
            class="h-5 w-5 rounded object-contain bg-white"
          />
          <span>{{ selectedCampaignData?.campaign ?? "Selecciona campaña" }}</span>
        </span>
        <span class="text-xs text-slate-400">{{ isCampaignDropdownOpen ? "▲" : "▼" }}</span>
      </button>

      <div
        v-if="isCampaignDropdownOpen"
        class="absolute z-20 mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 p-1 shadow-xl"
      >
        <button
          v-for="campaign in props.campaigns"
          :key="campaign.campaign"
          class="flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-sm text-slate-100 transition hover:bg-slate-800"
          type="button"
          @click="selectCampaign(campaign.campaign)"
        >
          <img
            v-if="campaign.icon"
            :src="campaign.icon"
            :alt="`Icono ${campaign.campaign}`"
            class="h-5 w-5 rounded object-contain bg-white"
          />
          <span>{{ campaign.campaign }}</span>
        </button>
      </div>
    </div>

    <label class="mb-1 block text-xs text-slate-400">Dificultad</label>
    <select
      v-model="selectedDifficultyModel"
      class="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-100"
    >
      <option
        v-for="difficulty in props.difficulties"
        :key="difficulty"
        :value="difficulty"
      >
        {{ difficulty.charAt(0).toUpperCase() + difficulty.slice(1) }}
      </option>
    </select>

    <label class="mb-1 mt-3 block text-xs text-slate-400">Escenario</label>
    <select
      v-model="selectedScenarioIdModel"
      class="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-100"
    >
      <option
        v-for="scenario in props.availableScenarios"
        :key="scenario.id"
        :value="scenario.id"
      >
        {{ scenario.name }}
      </option>
    </select>

    <button
      class="mt-3 w-full rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500"
      @click="emit('apply-campaign')"
    >
      Cargar campaña
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from "vue";
import type {
  CampaignConfigFile,
  CampaignScenario,
  Difficulty,
} from "../../types/campaign";

const props = defineProps<{
  campaigns: CampaignConfigFile[];
  difficulties: Difficulty[];
  selectedCampaign: string;
  selectedDifficulty: Difficulty;
  availableScenarios: CampaignScenario[];
  selectedScenarioId: string;
}>();

const emit = defineEmits<{
  (e: "update:selectedCampaign", value: string): void;
  (e: "update:selectedDifficulty", value: Difficulty): void;
  (e: "update:selectedScenarioId", value: string): void;
  (e: "apply-campaign"): void;
}>();

const selectedCampaignModel = computed({
  get: () => props.selectedCampaign,
  set: (value: string) => emit("update:selectedCampaign", value),
});

const selectedDifficultyModel = computed({
  get: () => props.selectedDifficulty,
  set: (value: Difficulty) => emit("update:selectedDifficulty", value),
});

const selectedScenarioIdModel = computed({
  get: () => props.selectedScenarioId,
  set: (value: string) => emit("update:selectedScenarioId", value),
});

const isCampaignDropdownOpen = ref(false);
const campaignDropdownRef = ref<HTMLElement | null>(null);

const selectedCampaignData = computed(() =>
  props.campaigns.find((item) => item.campaign === props.selectedCampaign),
);

const selectCampaign = (campaign: string) => {
  selectedCampaignModel.value = campaign;
  isCampaignDropdownOpen.value = false;
};

const handleOutsideClick = (event: MouseEvent) => {
  if (!isCampaignDropdownOpen.value) return;
  const target = event.target as Node | null;
  if (campaignDropdownRef.value && target && !campaignDropdownRef.value.contains(target)) {
    isCampaignDropdownOpen.value = false;
  }
};

onMounted(() => {
  window.addEventListener("mousedown", handleOutsideClick);
});

onUnmounted(() => {
  window.removeEventListener("mousedown", handleOutsideClick);
});

</script>
