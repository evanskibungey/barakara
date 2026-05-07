
export const TIER_NAMES = ['Starter', 'Growth', 'Scale'] as const;
export type TierName = (typeof TIER_NAMES)[number];

interface PricingTier {
  name: TierName;
  baseFee: number;
  memberFee: number;
  memberLimit: {
    min: number;
    max: number;
  };
  transactionFeePercent: number;
}

export const PRICING_TIERS: Record<TierName, PricingTier> = {
  Starter: {
    name: 'Starter',
    baseFee: 1000,
    memberFee: 100,
    memberLimit: { min: 1, max: 5 },
    transactionFeePercent: 0.5,
  },
  Growth: {
    name: 'Growth',
    baseFee: 2000,
    memberFee: 80,
    memberLimit: { min: 6, max: 15 },
    transactionFeePercent: 0.3,
  },
  Scale: {
    name: 'Scale',
    baseFee: 4000,
    memberFee: 60,
    memberLimit: { min: 16, max: Infinity },
    transactionFeePercent: 0.1,
  },
};

/**
 * Calculates the monthly subscription fee for a Chama based on its tier and member count.
 * This represents the predictable portion of the monthly bill. Transaction fees would be added on top.
 * @param tier - The subscription tier of the Chama.
 * @param memberCount - The number of members in the Chama.
 * @returns The total monthly subscription fee in KES.
 */
export function calculateSubscriptionFee(tier: TierName, memberCount: number): number {
  const selectedTier = PRICING_TIERS[tier];

  if (!selectedTier) {
    throw new Error(`Invalid pricing tier: ${tier}`);
  }

  // For this UI, we'll calculate the predictable part of the fee.
  // The variable transaction fees would be calculated and added at billing time.
  const memberCost = selectedTier.memberFee * memberCount;
  const totalFee = selectedTier.baseFee + memberCost;

  return totalFee;
}
    
