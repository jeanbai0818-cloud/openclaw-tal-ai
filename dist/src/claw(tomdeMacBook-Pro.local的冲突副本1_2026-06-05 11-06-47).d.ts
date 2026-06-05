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
//# sourceMappingURL=claw(tomdeMacBook-Pro.local%E7%9A%84%E5%86%B2%E7%AA%81%E5%89%AF%E6%9C%AC1_2026-06-05%2011-06-47).d.ts.map