import React, { createContext, useContext, useState, useEffect } from 'react';
import { BACKEND_API_URL } from '../config/cardano';

export interface PendingCampaign {
  id: string;
  campaign_name: string;
  campaign_description: string;
  campaign_objective: string;
  target_audience: string;
  budget: string;
  duration_days: string;
  input_text: string;
  created_at: string;
  status: 'pending_payment' | 'paid' | 'submitted';
}

interface CampaignContextType {
  pendingCampaigns: PendingCampaign[];
  addPendingCampaign: (campaign: Omit<PendingCampaign, 'id' | 'created_at' | 'status'>) => void;
  removePendingCampaign: (id: string) => void;
  updateCampaignStatus: (id: string, status: PendingCampaign['status']) => void;
  getPendingCampaign: (id: string) => PendingCampaign | undefined;
  submitCampaign: (campaignId: string, txHash: string, did: string) => Promise<void>;
}

const CampaignContext = createContext<CampaignContextType | undefined>(undefined);

export const CampaignProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [pendingCampaigns, setPendingCampaigns] = useState<PendingCampaign[]>(() => {
    const stored = localStorage.getItem('pending_campaigns');
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem('pending_campaigns', JSON.stringify(pendingCampaigns));
  }, [pendingCampaigns]);

  const addPendingCampaign = (campaign: Omit<PendingCampaign, 'id' | 'created_at' | 'status'>) => {
    const newCampaign: PendingCampaign = {
      ...campaign,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      status: 'pending_payment'
    };
    setPendingCampaigns(prev => [newCampaign, ...prev]);
  };

  const removePendingCampaign = (id: string) => {
    setPendingCampaigns(prev => prev.filter(c => c.id !== id));
  };

  const updateCampaignStatus = (id: string, status: PendingCampaign['status']) => {
    setPendingCampaigns(prev =>
      prev.map(c => (c.id === id ? { ...c, status } : c))
    );
  };

  const getPendingCampaign = (id: string) => {
    return pendingCampaigns.find(c => c.id === id);
  };

  const submitCampaign = async (campaignId: string, txHash: string, did: string) => {
    const campaign = pendingCampaigns.find(c => c.id === campaignId);
    if (!campaign) {
      throw new Error('Campaign not found');
    }

    // Update status to paid first
    updateCampaignStatus(campaignId, 'paid');

    try {
      const response = await fetch(`${BACKEND_API_URL}/campaigns`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          did,
          campaign_name: campaign.campaign_name,
          campaign_description: campaign.campaign_description,
          campaign_objective: campaign.campaign_objective,
          target_audience: campaign.target_audience,
          budget: parseFloat(campaign.budget),
          duration_days: parseInt(campaign.duration_days),
          input_text: campaign.input_text,
          tx_hash: txHash
        })
      });

      if (!response.ok) {
        throw new Error('Failed to submit campaign');
      }

      // Update status to submitted and eventually remove from pending
      updateCampaignStatus(campaignId, 'submitted');
      
      // Remove from pending campaigns after successful submission
      setTimeout(() => {
        removePendingCampaign(campaignId);
      }, 2000);
    } catch (error) {
      // Revert status on error
      updateCampaignStatus(campaignId, 'pending_payment');
      throw error;
    }
  };

  return (
    <CampaignContext.Provider
      value={{
        pendingCampaigns,
        addPendingCampaign,
        removePendingCampaign,
        updateCampaignStatus,
        getPendingCampaign,
        submitCampaign
      }}
    >
      {children}
    </CampaignContext.Provider>
  );
};

export const useCampaign = () => {
  const context = useContext(CampaignContext);
  if (!context) {
    throw new Error('useCampaign must be used within a CampaignProvider');
  }
  return context;
};
