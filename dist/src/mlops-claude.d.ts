export declare const mlopsClaudeProvider: {
    id: string;
    label: string;
    docsPath: string;
    envVars: string[];
    auth: import("openclaw/plugin-sdk/plugin-entry").ProviderAuthMethod[];
    staticCatalog: {
        order: "simple";
        run: (_ctx: any) => Promise<any>;
    };
    catalog: {
        order: "simple";
        run: (ctx: any) => Promise<any>;
    };
};
//# sourceMappingURL=mlops-claude.d.ts.map