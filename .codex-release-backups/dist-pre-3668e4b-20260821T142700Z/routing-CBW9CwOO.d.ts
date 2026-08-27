import { n as OpenClawConfig } from "./types.openclaw-DhIzMzKO.js";
import { C as Skill } from "./channel-id.types-B5s7n0Md.js";
//#region src/skills/types.d.ts
type SkillTelemetrySource = "bundled" | "unknown" | "workspace";
type SkillUsagePath = {
  /** Path visible to the tool runtime when it reads SKILL.md. */readPath: string; /** Canonical source SKILL.md path used as the lifecycle identity. */
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
  prompt: string; /** Complete eligible sync identities, including skills hidden from the model prompt. */
  skills: Array<{
    name: string; /** Config key can differ from the prompt-facing skill name. */
    skillKey?: string;
    primaryEnv?: string;
    requiredEnv?: string[];
  }>; /** Normalized agent-level filter used to build this snapshot; undefined means unrestricted. */
  skillFilter?: string[]; /** Sparse per-session overlay applied after the agent-level filter. */
  skillOverrides?: Record<string, boolean>; /** Effective node-exec eligibility used to select connected node-hosted skills. */
  nodeSkillsEligibility?: SkillEligibilityContext["nodeSkills"];
  resolvedSkills?: Skill[];
  version?: number;
  promptFormatVersion?: number;
};
//#endregion
//#region src/agents/agent-scope-config.d.ts
declare function resolveAgentWorkspaceDir(cfg: OpenClawConfig, agentId: string, env?: NodeJS.ProcessEnv): string;
declare function resolveAgentDir(cfg: OpenClawConfig, agentId: string, env?: NodeJS.ProcessEnv): string;
//#endregion
export { SkillSnapshot as a, SkillEligibilityContext as i, resolveAgentWorkspaceDir as n, SkillTelemetrySource as o, ExplicitSkillSelection as r, SkillUsagePath as s, resolveAgentDir as t };