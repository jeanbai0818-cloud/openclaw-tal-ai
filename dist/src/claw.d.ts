export declare const clawProvider: {
    id: string;
    label: string;
    docsPath: string;
    envVars: string[];
    auth: import("openclaw/plugin-sdk/plugin-entry").ProviderAuthMethod[];
    prepareRuntimeAuth: (ctx: any) => Promise<{
        apiKey: any;
        request: {
            headers: {
                "X-Agent-Channel": string;
            };
        };
    }>;
    staticCatalog: {
        order: "simple";
        run: (_ctx: any) => Promise<any>;
    };
    catalog: {
        order: "simple";
        run: (ctx: any) => Promise<any>;
    };
};
//# sourceMappingURL=claw.d.ts.map