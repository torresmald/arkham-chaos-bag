import { computed, ref, watch } from "vue";
import { useCampaignStore } from "../stores/campaign/campaign";
import {
  difficulties,
  type CampaignPhase,
  type CampaignTransition,
  type Difficulty,
  type Track,
} from "../types/campaign";

export interface UseCampaignProgressStateOptions {
  persistProgress?: boolean;
}

export function useCampaignProgressState(
  options: UseCampaignProgressStateOptions = {},
) {
  const { persistProgress = true } = options;
  const campaignStore = useCampaignStore();

  const campaigns = computed(() => campaignStore.campaigns);

  const selectedCampaign = ref<string>("");
  const selectedDifficulty = ref<Difficulty>(difficulties[0]);
  const selectedScenarioId = ref<string>("");
  const selectedTrack = ref<Track>("agenda");
  const agendaIndex = ref(0);
  const actIndex = ref(0);
  const isPrologueActive = ref(false);
  const isScenarioBaseTextActive = ref(false);
  const isShowingBackText = ref(false);

  const selectedCampaignConfig = computed(() =>
    campaigns.value.find((item) => item.campaign === selectedCampaign.value),
  );

  const availableScenarios = computed(
    () => selectedCampaignConfig.value?.scenarios ?? [],
  );

  const currentScenario = computed(() =>
    availableScenarios.value.find(
      (scenario) => scenario.id === selectedScenarioId.value,
    ),
  );

  const currentPrologue = computed(() => selectedCampaignConfig.value?.prologue ?? null);

  const currentScenarioTexts = computed(() =>
    selectedTrack.value === "agenda"
      ? (currentScenario.value?.texts.agenda.phases ?? [])
      : (currentScenario.value?.texts.act.phases ?? []),
  );

  const currentTrackIndex = computed(() =>
    selectedTrack.value === "agenda" ? agendaIndex.value : actIndex.value,
  );

  const currentPhase = computed<CampaignPhase | null>(
    () => currentScenarioTexts.value[currentTrackIndex.value] ?? null,
  );

  const phaseFrontText = computed(
    () => currentPhase.value?.textFront ?? currentPhase.value?.text ?? "",
  );

  const phaseBackText = computed(() => currentPhase.value?.textBack ?? "");

  const currentScenarioText = computed(() =>
    isPrologueActive.value
      ? (currentPrologue.value?.baseText ?? currentPrologue.value?.text ?? "")
      : (isScenarioBaseTextActive.value
          ? (currentScenario.value?.baseText ?? phaseFrontText.value)
          : (isShowingBackText.value
              ? (phaseBackText.value || phaseFrontText.value)
              : phaseFrontText.value)),
  );

  const resolveTransition = (
    track: Track,
    index: number,
    phase: CampaignPhase | null,
  ): CampaignTransition | null => {
    if (!phase) return null;
    if (phase.next?.type === "phase") return phase.next;
    if (phase.next?.type === "scenario" || phase.next?.type === "campaign-end") {
      return null;
    }
    const phases =
      track === "agenda"
        ? (currentScenario.value?.texts.agenda.phases ?? [])
        : (currentScenario.value?.texts.act.phases ?? []);
    if (index < phases.length - 1) {
      return { type: "phase", track, index: index + 1 };
    }
    return null;
  };

  const canAdvanceScenarioText = computed(() => {
    if (isPrologueActive.value) return false;
    if (isScenarioBaseTextActive.value) return true;
    if (isShowingBackText.value) return false;
    return !!phaseBackText.value;
  });

  const canAdvanceAgenda = computed(
    () =>
      !isPrologueActive.value &&
      !isScenarioBaseTextActive.value &&
      resolveTransition(
        "agenda",
        agendaIndex.value,
        currentScenario.value?.texts.agenda.phases[agendaIndex.value] ?? null,
      ) !== null,
  );

  const canAdvanceAct = computed(
    () =>
      !isPrologueActive.value &&
      !isScenarioBaseTextActive.value &&
      resolveTransition(
        "act",
        actIndex.value,
        currentScenario.value?.texts.act.phases[actIndex.value] ?? null,
      ) !== null,
  );

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

  const syncProgressForScenario = (scenarioId: string) => {
    const hasScenarioInProgress = scenarioId === campaignStore.selectedScenarioId;
    if (!hasScenarioInProgress) {
      agendaIndex.value = 0;
      actIndex.value = 0;
    }
    clampProgressIndices();
  };

  const onSelectedScenarioChange = (scenarioId: string) => {
    selectedScenarioId.value = scenarioId;
    isPrologueActive.value = false;
    isShowingBackText.value = false;
    isScenarioBaseTextActive.value = !!availableScenarios.value.find(
      (scenario) => scenario.id === scenarioId,
    )?.baseText;
    syncProgressForScenario(scenarioId);
  };

  const initialize = async () => {
    await campaignStore.loadCampaigns();
    if (campaigns.value.length > 0) {
      selectedCampaign.value =
        campaignStore.selectedCampaign?.campaign ?? campaigns.value[0].campaign;
    }
    selectedDifficulty.value =
      campaignStore.selectedDifficulty ?? difficulties[0];

    isPrologueActive.value =
      !!selectedCampaignConfig.value?.prologue && !campaignStore.selectedScenarioId;
    isShowingBackText.value = false;
    isScenarioBaseTextActive.value =
      !isPrologueActive.value && !!currentScenario.value?.baseText;
  };

  watch(availableScenarios, (scenarios) => {
    const preferredScenarioId = campaignStore.selectedScenarioId;
    const hasPreferredScenario = scenarios.some(
      (scenario) => scenario.id === preferredScenarioId,
    );

    selectedScenarioId.value = hasPreferredScenario
      ? preferredScenarioId ?? ""
      : (scenarios[0]?.id ?? "");

    agendaIndex.value = Math.max(0, campaignStore.agendaIndex);
    actIndex.value = Math.max(0, campaignStore.actIndex);
    syncProgressForScenario(selectedScenarioId.value);

    isPrologueActive.value =
      !!selectedCampaignConfig.value?.prologue && !campaignStore.selectedScenarioId;
    isShowingBackText.value = false;
    isScenarioBaseTextActive.value =
      !isPrologueActive.value && !!availableScenarios.value.find(
        (scenario) => scenario.id === selectedScenarioId.value,
      )?.baseText;
  });

  watch([selectedTrack, currentTrackIndex], () => {
    isShowingBackText.value = false;
  });

  if (persistProgress) {
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
  }

  return {
    campaignStore,
    campaigns,
    selectedCampaign,
    selectedDifficulty,
    selectedScenarioId,
    selectedTrack,
    agendaIndex,
    actIndex,
    isPrologueActive,
    isScenarioBaseTextActive,
    isShowingBackText,
    selectedCampaignConfig,
    availableScenarios,
    currentScenario,
    currentScenarioTexts,
    currentPhase,
    currentTrackIndex,
    phaseFrontText,
    phaseBackText,
    currentScenarioText,
    canAdvanceScenarioText,
    canAdvanceAgenda,
    canAdvanceAct,
    resolveTransition,
    onSelectedScenarioChange,
    initialize,
    difficulties,
  };
}
