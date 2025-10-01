export const SUBSCRIPTION_TIERS = {
  free: {
    name: 'Free',
    price: 0,
    monthlyThreads: 5,
    platforms: ['twitter'],
    features: [
      '5 threads per month',
      'Basic thread generation',
      'Twitter format only',
      'Community support',
    ],
  },
  starter: {
    name: 'Starter',
    price: 12,
    monthlyThreads: 50,
    platforms: ['twitter', 'linkedin'],
    features: [
      '50 threads per month',
      'All platforms (Twitter, LinkedIn)',
      'Basic scheduling',
      'Email support',
      'Thread templates',
    ],
    stripePriceId: process.env.STRIPE_PRICE_ID_STARTER,
  },
  pro: {
    name: 'Pro',
    price: 29,
    monthlyThreads: -1, // unlimited
    platforms: ['twitter', 'linkedin'],
    features: [
      'Unlimited threads',
      'Advanced AI optimization',
      'Team collaboration (3 users)',
      'Analytics dashboard',
      'Priority support',
    ],
    stripePriceId: process.env.STRIPE_PRICE_ID_PRO,
  },
  agency: {
    name: 'Agency',
    price: 79,
    monthlyThreads: -1, // unlimited
    platforms: ['twitter', 'linkedin'],
    features: [
      'Everything in Pro',
      'White-label branding',
      'Client management',
      'API access',
      'Custom integrations',
    ],
    stripePriceId: process.env.STRIPE_PRICE_ID_AGENCY,
  },
} as const

export type SubscriptionTier = keyof typeof SUBSCRIPTION_TIERS

export function getThreadLimit(tier: string): number {
  const subscription = SUBSCRIPTION_TIERS[tier as SubscriptionTier]
  return subscription?.monthlyThreads || 0
}

export function canCreateThread(currentCount: number, tier: string): boolean {
  const limit = getThreadLimit(tier)
  if (limit === -1) return true // unlimited
  return currentCount < limit
}

export function isFeatureAvailable(feature: string, tier: string): boolean {
  const subscription = SUBSCRIPTION_TIERS[tier as SubscriptionTier]
  if (!subscription) return false
  
  const features = {
    scheduling: ['starter', 'pro', 'agency'].includes(tier),
    analytics: ['pro', 'agency'].includes(tier),
    collaboration: ['pro', 'agency'].includes(tier),
    whiteLabel: ['agency'].includes(tier),
    api: ['agency'].includes(tier),
  }
  
  return features[feature as keyof typeof features] || false
}
