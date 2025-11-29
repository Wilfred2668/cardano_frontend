// ===================================================================
// CENTRALIZED TYPE DEFINITIONS
// ===================================================================

export type CampaignStatus = 'draft' | 'active' | 'completed' | 'paused';

export interface Campaign {
  id: string;
  name: string;
  status: CampaignStatus;
  budget: number;
  spend: number;
  impressions: number;
  clicks: number;
  createdAt: string;
}

export interface ContentVariant {
  id: string;
  type: 'A' | 'B' | 'C';
  headline: string;
  body: string;
  cta: string;
  imageUrl?: string;
  score?: number;
}

export interface CampaignStrategy {
  summary: string;
  targetAudience: string;
  channels: string[];
  timeline: string;
  expectedROI: string;
}

export interface CampaignDetails {
  campaign: Campaign;
  strategy: CampaignStrategy;
  variants: ContentVariant[];
}

export interface Metrics {
  impressions: number;
  clicks: number;
  conversions: number;
  spend: number;
}

export interface ProgressStep {
  id: string;
  label: string;
  status: 'completed' | 'in-progress' | 'pending';
  timestamp?: string;
}

export type CampaignProgressStatus = 'preparing' | 'running' | 'completed';

export interface CampaignProgress {
  campaignId: string;
  status: CampaignProgressStatus;
  currentStep: string;
  completedSteps: string[];
  metrics: Metrics;
  progress: number; // 0-100
}

export interface FinalMetrics {
  totalImpressions: number;
  totalClicks: number;
  totalConversions: number;
  totalSpend: number;
  roi: number;
  ctr: number;
  conversionRate: number;
}

export interface CampaignResults {
  campaignId: string;
  finalMetrics: FinalMetrics;
  topVariant: ContentVariant;
  ipfsHash: string;
  transactionHash: string;
  completedAt: string;
}

export interface CreateCampaignData {
  name: string;
  brand: string;
  targetUrl: string;
  budget: number;
  targetAudience: string;
  goals: string;
}

export interface LoginChallenge {
  challenge: string;
  timestamp: number;
}

export interface LoginVerification {
  token: string;
  expiresAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface MetricData {
  label: string;
  value: number;
  target?: number;
  color?: string;
}
