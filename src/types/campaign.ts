import type { Token } from "./token";

export type Difficulty = "facil" | "medio" | "dificil";
export const difficulties: Difficulty[] = ["facil", "medio", "dificil"];

export interface CampaignDifficultyConfig {
  difficulty: Difficulty;
  tokens: Token[];
}

interface Agenda {
  phases: {
    text: string;
  }[];
}

interface Act {
  phases: {
    text: string;
  }[];
}

interface CampaignScenarioTexts {
  agenda: Agenda;
  act: Act;
}

export interface CampaignScenario {
  id: string;
  name: string;
  texts: CampaignScenarioTexts;
}

export interface CampaignConfigFile {
  campaign: string;
  difficulties: Record<Difficulty, CampaignDifficultyConfig>;
  scenarios: CampaignScenario[];
}
export interface CampaignProgress {
  scenarioId: string | null;
  agendaIndex: number;
  actIndex: number;
}
