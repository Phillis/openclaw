import "./types.openclaw-CZEJqSSW.js";
import { d as Skill } from "./channel-id.types-CSuowlIu.js";
//#region src/skills/types.d.ts
type SkillTelemetrySource = "bundled" | "unknown" | "workspace";
type SkillUsagePath = {
  /** Path visible to the tool runtime when it reads SKILL.md. */
  readPath: string;
  /** Canonical source SKILL.md path used as the lifecycle identity. */
  skillFile: string;
  skillName: string;
  skillSource: SkillTelemetrySource;
};
type ExplicitSkillSelection = {
  name: string;
  path: string;
};
type SkillEligibilityContext = {
  nodeSkills?: {
    canExec: boolean;
    node?: string;
  };
  remote?: {
    platforms: string[];
    hasBin: (bin: string) => boolean;
    hasAnyBin: (bins: string[]) => boolean;
    note?: string;
  };
};
type SkillSnapshot = {
  prompt: string;
  /** Complete eligible sync identities, including skills hidden from the model prompt. */
  skills: Array<{
    name: string;
    /** Config key can differ from the prompt-facing skill name. */
    skillKey?: string;
    primaryEnv?: string;
    requiredEnv?: string[];
  }>;
  /** Normalized agent-level filter used to build this snapshot; undefined means unrestricted. */
  skillFilter?: string[];
  /** Sparse per-session overlay applied after the agent-level filter. */
  skillOverrides?: Record<string, boolean>;
  /** Effective node-exec eligibility used to select connected node-hosted skills. */
  nodeSkillsEligibility?: SkillEligibilityContext["nodeSkills"];
  resolvedSkills?: Skill[];
  /** Present only when a session merges skills from distinct agent and execution roots. */
  skillRoots?: {
    agentWorkspaceDir: string;
    executionSkillsDir: string;
  };
  version?: number;
  promptFormatVersion?: number;
};
//#endregion
export { SkillUsagePath as a, SkillTelemetrySource as i, SkillEligibilityContext as n, SkillSnapshot as r, ExplicitSkillSelection as t };