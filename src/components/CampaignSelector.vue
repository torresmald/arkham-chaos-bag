<template>
  <section>
    <label class="mb-1 block text-xs text-slate-400">Campaña</label>
    <select
      v-model="selectedCampaign"
      class="mb-3 w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-100"
    >
      <option v-for="{ campaign } in campaigns" :key="campaign" :value="campaign">
        {{ campaign }}
      </option>
    </select>

    <label class="mb-1 block text-xs text-slate-400">Dificultad</label>
    <select
      v-model="selectedDifficulty"
      class="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-100"
    >
      <option v-for="difficulty in difficulties" :key="difficulty" :value="difficulty">
        {{ difficulty.charAt(0).toUpperCase() + difficulty.slice(1) }}
      </option>
    </select>

    <label class="mb-1 mt-3 block text-xs text-slate-400">Escenario</label>
    <select
      v-model="selectedScenarioId"
      class="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-100"
    >
      <option v-for="scenario in availableScenarios" :key="scenario.id" :value="scenario.id">
        {{ scenario.name }}
      </option>
    </select>

    <label class="mb-1 mt-3 block text-xs text-slate-400">Narrativa</label>
    <select
      v-model="selectedTrack"
      class="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-100"
    >
      <option value="agenda">Plan</option>
      <option value="act">Acto</option>
    </select>

    <div
      v-if="currentScenarioText"
      class="mt-3 rounded-lg border border-slate-700 bg-slate-800/40 p-2 text-xs text-slate-300"
    >
      <p class="mb-1 text-[11px] text-slate-400">
        {{ selectedTrack === "agenda" ? "Plan" : "Acto" }} {{ currentTrackIndex + 1 }} /
        {{ currentScenarioTexts.length }}
      </p>
      <p>{{ currentScenarioText }}</p>
    </div>

    <button
      class="mt-3 w-full rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500"
      @click="applyCampaign"
    >
      Cargar campaña
    </button>

    <div class="mt-2 grid grid-cols-2 gap-2">
      <button
        class="rounded-lg border border-slate-600 px-2 py-1.5 text-xs font-medium text-slate-200 transition hover:border-slate-400 disabled:cursor-not-allowed disabled:opacity-50"
        :disabled="!currentScenarioText"
        @click="readCurrentScenarioText"
      >
        Leer texto
      </button>
      <button
        class="rounded-lg border border-slate-600 px-2 py-1.5 text-xs font-medium text-slate-200 transition hover:border-slate-400 disabled:cursor-not-allowed disabled:opacity-50"
        :disabled="!canAdvanceScenarioText"
        @click="advanceScenarioText"
      >
        Siguiente {{ selectedTrack === "agenda" ? "plan" : "acto" }}
      </button>
    </div>

    <div class="mt-2 grid grid-cols-2 gap-2">
      <button
        class="rounded-lg border border-violet-700 bg-violet-900/20 px-2 py-1.5 text-xs font-medium text-violet-100 transition hover:bg-violet-900/40 disabled:cursor-not-allowed disabled:opacity-50"
        :disabled="!canAdvanceAgenda"
        @click="advanceAgenda"
      >
        Avanzar plan
      </button>
      <button
        class="rounded-lg border border-teal-700 bg-teal-900/20 px-2 py-1.5 text-xs font-medium text-teal-100 transition hover:bg-teal-900/40 disabled:cursor-not-allowed disabled:opacity-50"
        :disabled="!canAdvanceAct"
        @click="advanceAct"
      >
        Avanzar acto
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { useChaosBagStore } from "../stores/bag/chaos";
import { useCampaignStore } from "../stores/campaign/campaign";
import { useSoundsStore } from "../stores/sounds/sounds";
import { difficulties, type Difficulty } from "../types/campaign";

const store = useChaosBagStore();
const campaignStore = useCampaignStore();
const soundsStore = useSoundsStore();
const campaigns = computed(() => campaignStore.campaigns);

const selectedCampaign = ref<string>("");
const selectedDifficulty = ref<Difficulty>(difficulties[0]);
const selectedScenarioId = ref<string>("");
const selectedTrack = ref<"agenda" | "act">("agenda");
const agendaIndex = ref(0);
const actIndex = ref(0);
const emit = defineEmits<{
  (e: "close-selector"): void;
}>();

onMounted(async () => {
  await campaignStore.loadCampaigns();
  if (campaigns.value.length > 0) {
    selectedCampaign.value =
      campaignStore.selectedCampaign?.campaign ?? campaigns.value[0].campaign;
  }
  selectedDifficulty.value = campaignStore.selectedDifficulty ?? difficulties[0];
});

const selectedCampaignConfig = computed(() =>
  campaigns.value.find((item) => item.campaign === selectedCampaign.value),
);

const availableScenarios = computed(() => selectedCampaignConfig.value?.scenarios ?? []);

const currentScenario = computed(() =>
  availableScenarios.value.find((scenario) => scenario.id === selectedScenarioId.value),
);

const currentScenarioTexts = computed(() =>
  selectedTrack.value === "agenda"
    ? (currentScenario.value?.texts.agenda.phases ?? [])
    : (currentScenario.value?.texts.act.phases ?? []),
);

const currentTrackIndex = computed(() =>
  selectedTrack.value === "agenda" ? agendaIndex.value : actIndex.value,
);

const currentScenarioText = computed(
  () => currentScenarioTexts.value[currentTrackIndex.value]?.text ?? "",
);

const canAdvanceScenarioText = computed(
  () => currentTrackIndex.value < currentScenarioTexts.value.length - 1,
);

const canAdvanceAgenda = computed(() => {
  const phases = currentScenario.value?.texts.agenda.phases ?? [];
  return agendaIndex.value < phases.length - 1;
});

const canAdvanceAct = computed(() => {
  const phases = currentScenario.value?.texts.act.phases ?? [];
  return actIndex.value < phases.length - 1;
});

const clampProgressIndices = () => {
  const agendaMaxIndex = Math.max(
    0,
    (currentScenario.value?.texts.agenda.phases.length ?? 1) - 1,
  );
  const actMaxIndex = Math.max(
    0,
    (currentScenario.value?.texts.act.phases.length ?? 1) - 1,
  );
  agendaIndex.value = Math.min(Math.max(0, agendaIndex.value), agendaMaxIndex);
  actIndex.value = Math.min(Math.max(0, actIndex.value), actMaxIndex);
};

watch(
  availableScenarios,
  (scenarios) => {
    const preferredScenarioId = campaignStore.selectedScenarioId;
    const hasPreferredScenario = scenarios.some(
      (scenario) => scenario.id === preferredScenarioId,
    );

    selectedScenarioId.value = hasPreferredScenario
      ? preferredScenarioId ?? ""
      : (scenarios[0]?.id ?? "");

    agendaIndex.value = Math.max(0, campaignStore.agendaIndex);
    actIndex.value = Math.max(0, campaignStore.actIndex);
    clampProgressIndices();
  },
  { immediate: true },
);

watch(selectedScenarioId, () => {
  const hasScenarioInProgress =
    selectedScenarioId.value === campaignStore.selectedScenarioId;
  if (!hasScenarioInProgress) {
    agendaIndex.value = 0;
    actIndex.value = 0;
  }
  clampProgressIndices();
});

watch(
  [selectedScenarioId, agendaIndex, actIndex],
  ([scenarioId, nextAgendaIndex, nextActIndex]) => {
    campaignStore.setScenarioProgress({
      scenarioId: scenarioId || null,
      agendaIndex: nextAgendaIndex,
      actIndex: nextActIndex,
    });
  },
  { immediate: true },
);

const applyCampaign = () => {
  const campaign = selectedCampaignConfig.value;
  if (!campaign) return;
  const difficultyConfig = campaign.difficulties[selectedDifficulty.value];
  store.setInitialBag(difficultyConfig.tokens);
  campaignStore.selectCampaign(campaign);
  campaignStore.selectDifficulty(selectedDifficulty.value);
  campaignStore.setScenarioProgress({
    scenarioId: selectedScenarioId.value || null,
    agendaIndex: agendaIndex.value,
    actIndex: actIndex.value,
  });
  emit("close-selector");
};

const readCurrentScenarioText = async () => {
  if (!currentScenarioText.value) return;
  await soundsStore.speak(currentScenarioText.value);
};

const advanceScenarioText = async () => {
  if (!canAdvanceScenarioText.value) return;
  if (selectedTrack.value === "agenda") {
    agendaIndex.value += 1;
  } else {
    actIndex.value += 1;
  }
  await readCurrentScenarioText();
};

const advanceAgenda = async () => {
  if (!canAdvanceAgenda.value) return;
  selectedTrack.value = "agenda";
  agendaIndex.value += 1;
  await readCurrentScenarioText();
};

const advanceAct = async () => {
  if (!canAdvanceAct.value) return;
  selectedTrack.value = "act";
  actIndex.value += 1;
  await readCurrentScenarioText();
};
</script>
