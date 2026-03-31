import type { Token } from "./token";

export type Difficulty = "facil" | "medio" | "dificil";
export const difficulties: Difficulty[] = ["facil", "medio", "dificil"];

export interface CampaignDifficultyConfig {
  difficulty: Difficulty;
  tokens: Token[];
}

export type CampaignTransition =
  | {
      type: "phase";
      track: Track;
      index?: number;
    }
  | {
      type: "scenario";
      scenarioId: string;
    }
  | {
      type: "campaign-end";
    };

export interface CampaignPhase {
  text?: string;
  textFront?: string;
  textBack?: string;
  next?: CampaignTransition;
}

interface Agenda {
  phases: CampaignPhase[];
}

interface Act {
  phases: CampaignPhase[];
}

interface CampaignScenarioTexts {
  agenda: Agenda;
  act: Act;
}

export interface CampaignScenario {
  id: string;
  name: string;
  baseText?: string;
  texts: CampaignScenarioTexts;
}

export interface CampaignPrologue {
  id: string;
  name: string;
  text?: string;
  baseText?: string;
}

export interface CampaignConfigFile {
  campaign: string;
  icon?: string;
  difficulties: Record<Difficulty, CampaignDifficultyConfig>;
  prologue?: CampaignPrologue;
  scenarios: CampaignScenario[];
}
export interface CampaignProgress {
  scenarioId: string | null;
  agendaIndex: number;
  actIndex: number;
}

export type Track = "agenda" | "act";
