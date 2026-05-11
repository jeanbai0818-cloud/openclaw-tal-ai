// Optional: custom usage/billing endpoint helper
// Use when your provider has a non-standard usage reporting API.

export interface UsageRecord {
  modelId: string;
  inputTokens: number;
  outputTokens: number;
  cacheReadTokens?: number;
  cacheWriteTokens?: number;
  requestId?: string;
  timestamp: number;
}

export function buildUsageCost(record: UsageRecord, cost: {
  input: number;
  output: number;
  cacheRead: number;
  cacheWrite: number;
}): number {
  // Cost rates are per million tokens
  const inputCost = (record.inputTokens / 1_000_000) * cost.input;
  const outputCost = (record.outputTokens / 1_000_000) * cost.output;
  const cacheReadCost = ((record.cacheReadTokens ?? 0) / 1_000_000) * cost.cacheRead;
  const cacheWriteCost = ((record.cacheWriteTokens ?? 0) / 1_000_000) * cost.cacheWrite;
  return inputCost + outputCost + cacheReadCost + cacheWriteCost;
}
