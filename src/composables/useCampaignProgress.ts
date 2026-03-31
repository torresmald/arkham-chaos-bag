import { useCampaignProgressActions } from "./useCampaignProgressActions";
import { useCampaignProgressState } from "./useCampaignProgressState";

export function useCampaignProgress() {
  const state = useCampaignProgressState();
  const actions = useCampaignProgressActions(state);

  return {
    ...state,
    ...actions,
  };
}
