import type {
  Campaign,
  CampaignDetails,
  CampaignProgress,
  CampaignResults,
  LoginChallenge,
  LoginVerification,
  ContentVariant,
  CampaignStrategy
} from '../types';
import { apiGet, apiPost } from '../utils/apiClient';

// ===================================================================
// API CONFIGURATION
// ===================================================================
// Configuration for switching between mock and real API (for future use)
// const USE_MOCK = true; // Toggle between mock and real API
// const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// ===================================================================
// API HELPER FUNCTIONS
// ===================================================================
// Helper function for switching between mock and real API calls
// Currently commented out - uncomment when ready to integrate with real backend
// All real API calls will automatically include JWT token via apiGet/apiPost from apiClient
/*
async function apiCall<T>(
  endpoint: string,
  mockFn: () => Promise<T>,
  options?: RequestInit
): Promise<T> {
  if (USE_MOCK) {
    return mockFn();
  }
  
  // Real API call (for future backend integration) - automatically includes JWT token
  const data = await apiGet(`${BASE_URL}${endpoint}`, options);
  return data;
}

// Example of using tokenized POST request:
async function apiPostCall<T>(
  endpoint: string,
  mockFn: () => Promise<T>,
  body?: any,
  options?: RequestInit
): Promise<T> {
  if (USE_MOCK) {
    return mockFn();
  }
  
  // Real API call with authentication
  const data = await apiPost(`${BASE_URL}${endpoint}`, body, options);
  return data;
}
*/

// Mock data
const mockCampaigns: Campaign[] = [
  {
    id: '1',
    name: 'Q4 Product Launch',
    status: 'active',
    budget: 50000,
    spend: 32450,
    impressions: 1250000,
    clicks: 45230,
    createdAt: '2024-11-15',
  },
  {
    id: '2',
    name: 'Brand Awareness Campaign',
    status: 'active',
    budget: 30000,
    spend: 18900,
    impressions: 890000,
    clicks: 28100,
    createdAt: '2024-11-20',
  },
  {
    id: '3',
    name: 'Holiday Special Promo',
    status: 'draft',
    budget: 75000,
    spend: 0,
    impressions: 0,
    clicks: 0,
    createdAt: '2024-11-25',
  },
];

const mockStrategy: CampaignStrategy = {
  summary: 'A data-driven multi-channel campaign targeting tech-savvy millennials with a focus on social proof and urgency. The strategy emphasizes visual storytelling and interactive content to maximize engagement.',
  targetAudience: 'Tech professionals aged 25-40, high income, interested in productivity tools and SaaS products',
  channels: ['LinkedIn Ads', 'Twitter/X Ads', 'Google Display Network', 'Reddit Sponsored Posts'],
  timeline: '4 weeks with weekly optimization cycles',
  expectedROI: '3.2x - 4.5x based on historical data and market analysis',
};

const mockVariants: ContentVariant[] = [
  {
    id: 'v1',
    type: 'A',
    headline: 'Transform Your Workflow in Minutes',
    body: 'Join 50,000+ professionals who boosted productivity by 3x. No credit card required.',
    cta: 'Start Free Trial',
    score: 87,
  },
  {
    id: 'v2',
    type: 'B',
    headline: 'The Smart Way to Work Faster',
    body: 'AI-powered automation that saves you 10 hours every week. Trusted by leading companies.',
    cta: 'See How It Works',
    score: 92,
  },
  {
    id: 'v3',
    type: 'C',
    headline: 'Stop Wasting Time on Manual Tasks',
    body: 'Automate your workflow and focus on what matters. 14-day free trial, cancel anytime.',
    cta: 'Get Started Now',
    score: 85,
  },
];

export const getCampaigns = async (): Promise<Campaign[]> => {
  await delay(800);
  return mockCampaigns;
};

export const createCampaign = async (_data: {
  name: string;
  brand: string;
  targetUrl: string;
  budget: number;
  targetAudience: string;
  goals: string;
}): Promise<{ campaignId: string }> => {
  await delay(1500);
  return { campaignId: `${Date.now()}` };
};

export const getCampaignDetails = async (campaignId: string): Promise<CampaignDetails> => {
  await delay(1000);
  const campaign = mockCampaigns.find(c => c.id === campaignId) || mockCampaigns[0];
  return {
    campaign,
    strategy: mockStrategy,
    variants: mockVariants,
  };
};

export const approveCampaign = async (_campaignId: string, _variantId: string): Promise<{ success: boolean }> => {
  await delay(1200);
  return { success: true };
};

export const getCampaignProgress = async (campaignId: string): Promise<CampaignProgress> => {
  await delay(800);
  return {
    campaignId,
    status: 'running',
    currentStep: 'Optimizing ad placement based on performance data',
    completedSteps: [
      'Campaign deployed to advertising platforms',
      'Initial targeting configured',
      'A/B testing initiated',
      'First optimization cycle completed',
    ],
    metrics: {
      impressions: 125000,
      clicks: 4520,
      conversions: 180,
      spend: 3240,
    },
    progress: 65, // 0-100 percentage
  };
};

export const getCampaignResults = async (campaignId: string): Promise<CampaignResults> => {
  await delay(1000);
  return {
    campaignId,
    finalMetrics: {
      totalImpressions: 1250000,
      totalClicks: 45230,
      totalConversions: 1823,
      totalSpend: 32450,
      roi: 4.2,
      ctr: 3.62,
      conversionRate: 4.03,
    },
    topVariant: mockVariants[1],
    ipfsHash: 'QmX7fYcK9J3Z8wH2nN5sL4pR6vT9mQ1xY3dE8uI5hG2fK7',
    transactionHash: '0xa7f4c9e2d8b3f1a6c5e9d4b2f7a1c8e3d6b5f2a9c7e4d1b8f5a3c6e2d9b4f7a1',
    completedAt: new Date().toISOString(),
  };
};

// ===================================================================
// AUTHENTICATION FUNCTIONS
// ===================================================================

export const getLoginChallenge = async (walletAddress: string): Promise<LoginChallenge> => {
  await delay(500);
  return {
    challenge: `Sign this message to authenticate with RIZE:\nWallet: ${walletAddress}\nTimestamp: ${Date.now()}`,
    timestamp: Date.now(),
  };
};

export const verifyLogin = async (
  walletAddress: string,
  signature: string,
  challenge: string
): Promise<LoginVerification> => {
  await delay(800);
  // Mock verification - always succeeds
  console.log('Mock login verification', { walletAddress, signature, challenge });
  
  const token = `mock_token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(); // 24 hours
  
  return {
    token,
    expiresAt,
  };
};

// Mock message signing function
export const signMessage = async (message: string): Promise<string> => {
  await delay(600);
  // Mock signature - in reality this would call wallet.signData()
  const mockSignature = `sig_${btoa(message).slice(0, 20)}_${Math.random().toString(36).substr(2, 9)}`;
  return mockSignature;
};
