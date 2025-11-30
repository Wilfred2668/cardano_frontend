import React, { createContext, useContext, useState, useEffect } from 'react';

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

    // Generate unique identifier from DID (use last 24 chars of DID as hex identifier)
    const identifier = did.replace(/[^a-f0-9]/gi, '').slice(-24).padStart(24, '0');

    try {
      // Call start_job API
      const response = await fetch('https://dac99f68ab3e.ngrok-free.app/start_job', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        mode: 'cors',
        body: JSON.stringify({
          identifier_from_purchaser: identifier,
          input_data: {
            text: campaign.input_text
          }
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error:', response.status, errorText);
        throw new Error(`Failed to start job: ${response.status}`);
      }

      const result = await response.json();
      console.log('Job started successfully:', result);

      // Update status to submitted
      updateCampaignStatus(campaignId, 'submitted');
    } catch (error) {
      console.error('Failed to start job:', error);
      // Keep status as paid even if API fails - payment was successful
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
