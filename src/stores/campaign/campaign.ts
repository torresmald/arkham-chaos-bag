import { defineStore } from "pinia";
import type { Difficulty, CampaignConfigFile, CampaignProgress, CampaignScenario } from "@/types/campaign";
const CAMPAIGNS_STORAGE_KEY = "arkham-chaos-campaigns";
const DIFFICULTY_STORAGE_KEY = "arkham-chaos-difficulty";
const PROGRESS_STORAGE_KEY = "arkham-chaos-campaign-progress";


export const useCampaignStore = defineStore("campaign", {
    state: () => ({
        campaigns: [] as CampaignConfigFile[],
        isSelectedCampaign: false,
        selectedCampaign: null as CampaignConfigFile | null,
        selectedDifficulty: null as Difficulty | null,
        selectedScenarioId: null as string | null,
        selectedScenario: null as CampaignScenario | null,
        agendaIndex: 0,
        actIndex: 0,
    }),
    actions: {
        async loadCampaigns() {
            const campaigns = import.meta.glob("@/data/campaigns/*.json");
            const campaignsData = await Promise.all(Object.values(campaigns).map(async (module) => {
                const loaded = await module();
                const data = (loaded as { default?: CampaignConfigFile }).default ?? (loaded as CampaignConfigFile);
                return data;
            }));
            this.campaigns = campaignsData;

            const storedCampaignRaw = localStorage.getItem(CAMPAIGNS_STORAGE_KEY);
            if (storedCampaignRaw) {
                try {
                    const storedCampaign = JSON.parse(storedCampaignRaw) as CampaignConfigFile;
                    this.selectedCampaign = this.campaigns.find(
                        (campaign) => campaign.campaign === storedCampaign.campaign
                    ) ?? null;
                    this.isSelectedCampaign = this.selectedCampaign !== null;
                } catch {
                    this.selectedCampaign = null;
                    this.isSelectedCampaign = false;
                }
            }

            const storedDifficultyRaw = localStorage.getItem(DIFFICULTY_STORAGE_KEY);
            if (storedDifficultyRaw) {
                try {
                    this.selectedDifficulty = JSON.parse(storedDifficultyRaw) as Difficulty;
                } catch {
                    this.selectedDifficulty = null;
                }
            }

            const storedProgressRaw = localStorage.getItem(PROGRESS_STORAGE_KEY);
            if (storedProgressRaw) {
                try {
                    const storedProgress = JSON.parse(storedProgressRaw) as CampaignProgress;
                    this.selectedScenarioId = storedProgress.scenarioId;
                    this.agendaIndex = storedProgress.agendaIndex;
                    this.actIndex = storedProgress.actIndex;
                } catch {
                    this.selectedScenarioId = null;
                    this.selectedScenario = null;
                    this.agendaIndex = 0;
                    this.actIndex = 0;
                }
            }
        },
        selectCampaign(campaign: CampaignConfigFile) {
            this.selectedCampaign = campaign;
            this.isSelectedCampaign = true;
            localStorage.setItem(CAMPAIGNS_STORAGE_KEY, JSON.stringify(this.selectedCampaign));
        },
        selectDifficulty(difficulty: Difficulty) {
            this.selectedDifficulty = difficulty;
            localStorage.setItem(DIFFICULTY_STORAGE_KEY, JSON.stringify(difficulty));
        },
        setScenarioProgress(progress: CampaignProgress) {
            this.selectedScenarioId = progress.scenarioId;
            this.selectedScenario = this.campaigns.find(
                (campaign) => campaign.campaign === this.selectedCampaign?.campaign
            )?.scenarios.find(
                (scenario) => scenario.id === this.selectedScenarioId
            ) ?? null;
            this.agendaIndex = progress.agendaIndex;
            this.actIndex = progress.actIndex;
            localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(progress));
        },
        resetSelectedCampaign() {
            this.selectedCampaign = null;
            this.selectedDifficulty = null;
            this.isSelectedCampaign = false;
            this.selectedScenarioId = null;
            this.selectedScenario = null;
            this.agendaIndex = 0;
            this.actIndex = 0;
            localStorage.removeItem(CAMPAIGNS_STORAGE_KEY);
            localStorage.removeItem(DIFFICULTY_STORAGE_KEY);
            localStorage.removeItem(PROGRESS_STORAGE_KEY);
        },
    },
});