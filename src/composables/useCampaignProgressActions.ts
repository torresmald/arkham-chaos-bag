import { useChaosBagStore } from "@/stores/bag/chaos";
import { useSoundsStore } from "@/stores/sounds/sounds";
import type { useCampaignProgressState } from "./useCampaignProgressState";

type CampaignProgressState = ReturnType<typeof useCampaignProgressState>;

export function useCampaignProgressActions(state: CampaignProgressState) {
  const bagStore = useChaosBagStore();
  const soundsStore = useSoundsStore();

  const applyCampaign = () => {
    const campaign = state.selectedCampaignConfig.value;
    if (!campaign) return false;

    const difficultyConfig = campaign.difficulties[state.selectedDifficulty.value];
    bagStore.setInitialBag(difficultyConfig.tokens);
    state.campaignStore.selectCampaign(campaign);
    state.campaignStore.selectDifficulty(state.selectedDifficulty.value);
    state.isPrologueActive.value = !!campaign.prologue;
    state.isScenarioBaseTextActive.value =
      !state.isPrologueActive.value && !!state.currentScenario.value?.baseText;
    state.campaignStore.setScenarioProgress({
      scenarioId: state.isPrologueActive.value
        ? null
        : (state.selectedScenarioId.value || null),
      agendaIndex: 0,
      actIndex: 0,
    });
    return true;
  };

  const readCurrentScenarioText = async () => {
    if (!state.currentScenarioText.value) return;
    await soundsStore.speak(state.currentScenarioText.value);
  };

  const resolveAndApplyTransition = () => {
    const transition = state.resolveTransition(
      state.selectedTrack.value,
      state.currentTrackIndex.value,
      state.currentPhase.value,
    );
    if (!transition) return false;

    if (transition.type === "phase") {
      state.selectedTrack.value = transition.track;
      if (transition.track === "agenda") {
        const targetIndex =
          transition.index ?? Math.max(0, state.agendaIndex.value + 1);
        state.agendaIndex.value = targetIndex;
      } else {
        const targetIndex =
          transition.index ?? Math.max(0, state.actIndex.value + 1);
        state.actIndex.value = targetIndex;
      }
      state.isShowingBackText.value = false;
      return true;
    }

    return true;
  };

  const advanceScenarioText =  () => {
    if (state.isPrologueActive.value) {
      if (!state.selectedScenarioId.value) return;
      state.onSelectedScenarioChange(state.selectedScenarioId.value);
      return;
    }
    if (state.isScenarioBaseTextActive.value) {
      state.isScenarioBaseTextActive.value = false;
      return;
    }
    if (!state.phaseBackText.value) return;
    state.isShowingBackText.value = true;
  };

  const advanceAgenda = () => {
    if (state.isPrologueActive.value || !state.canAdvanceAgenda.value) return;
    state.selectedTrack.value = "agenda";
    resolveAndApplyTransition();
  };

  const advanceAct = () => {
    if (state.isPrologueActive.value || !state.canAdvanceAct.value) return;
    state.selectedTrack.value = "act";
    resolveAndApplyTransition();
  };

  return {
    applyCampaign,
    readCurrentScenarioText,
    advanceScenarioText,
    advanceAgenda,
    advanceAct,
  };
}
