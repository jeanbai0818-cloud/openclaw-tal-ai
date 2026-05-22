export interface UsageRecord {
    modelId: string;
    inputTokens: number;
    outputTokens: number;
    cacheReadTokens?: number;
    cacheWriteTokens?: number;
    requestId?: string;
    timestamp: number;
}
export declare function buildUsageCost(record: UsageRecord, cost: {
    input: number;
    output: number;
    cacheRead: number;
    cacheWrite: number;
}): number;
//# sourceMappingURL=usage.d.ts.map