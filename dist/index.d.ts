import { mlopsClaudeProvider } from "./src/mlops-claude.js";
import { talMlopsProvider } from "./src/tal-mlops.js";
import { clawProvider } from "./src/claw.js";
export { mlopsClaudeProvider, talMlopsProvider, clawProvider };
declare const _default: {
    id: string;
    name: string;
    description: string;
    configSchema: import("openclaw/plugin-sdk/plugin-entry").OpenClawPluginConfigSchema;
    register: NonNullable<import("openclaw/plugin-sdk/plugin-entry").OpenClawPluginDefinition["register"]>;
} & Pick<import("openclaw/plugin-sdk/plugin-entry").OpenClawPluginDefinition, "kind" | "reload" | "nodeHostCommands" | "securityAuditCollectors">;
export default _default;
//# sourceMappingURL=index.d.ts.map