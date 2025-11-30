import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext';
import { apiGet, apiPost } from '../utils/apiClient';

export interface JobStatus {
  job_id: string;
  status: string;
  payment_status: string | null;
  result: any | null;
}

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
  job_id?: string;
  job_status?: JobStatus;
  status_check_count?: number;
}

interface CampaignContextType {
  pendingCampaigns: PendingCampaign[];
  addPendingCampaign: (campaign: Omit<PendingCampaign, 'id' | 'created_at' | 'status'>) => void;
  removePendingCampaign: (id: string) => void;
  updateCampaignStatus: (id: string, status: PendingCampaign['status']) => void;
  getPendingCampaign: (id: string) => PendingCampaign | undefined;
  submitCampaign: (campaignId: string, txHash: string, did: string) => Promise<void>;
  checkJobStatus: (campaignId: string, showAlert?: boolean) => Promise<void>;
}

const CampaignContext = createContext<CampaignContextType | undefined>(undefined);

export const CampaignProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { showToast } = useToast();
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

  const checkJobStatusById = async (jobId: string, campaignId: string) => {
    try {
      const statusResult: JobStatus = await apiGet(
        `https://dac99f68ab3e.ngrok-free.app/status?job_id=${jobId}`,
        {
          headers: {
            'ngrok-skip-browser-warning': 'true'
          },
          mode: 'cors'
        }
      );
      
      // Get campaign name for logging
      const campaign = pendingCampaigns.find(c => c.id === campaignId);
      
      console.log('=== Job Status ===');
      console.log('Campaign:', campaign?.campaign_name || 'Unknown');
      console.log('Job ID:', jobId);
      console.log('Status Response:', statusResult);
      console.log('==================');

      // Store the status in campaign and increment check count
      setPendingCampaigns(prev =>
        prev.map(c => {
          if (c.id === campaignId) {
            const currentCount = c.status_check_count || 0;
            return {
              ...c,
              job_status: statusResult,
              status_check_count: currentCount + 1
            };
          }
          return c;
        })
      );

      return statusResult;
    } catch (error) {
      console.error('Failed to check job status:', error);
      return null;
    }
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
      // Call start_job API with authentication
      const result = await apiPost(
        'https://dac99f68ab3e.ngrok-free.app/start_job',
        {
          identifier_from_purchaser: identifier,
          input_data: {
            text: campaign.input_text
          }
        },
        {
          mode: 'cors'
        }
      );
      console.log('Job started successfully:', result);
      console.log('Job ID:', result.job_id);

      // Store job_id in campaign
      setPendingCampaigns(prev =>
        prev.map(c => (c.id === campaignId ? { ...c, status: 'submitted', job_id: result.job_id, status_check_count: 0 } : c))
      );

      // Check status 5 times every 1 minute
      if (result.job_id) {
        for (let i = 0; i < 5; i++) {
          setTimeout(async () => {
            const currentCampaign = pendingCampaigns.find(c => c.id === campaignId);
            const checkCount = currentCampaign?.status_check_count || 0;
            
            // Only check if we haven't exceeded 5 checks
            if (checkCount < 5) {
              console.log(`Auto-checking status (${checkCount + 1}/5)...`);
              await checkJobStatusById(result.job_id, campaignId);
            }
          }, (i + 1) * 60000); // 60000ms = 1 minute
        }
      }
    } catch (error) {
      console.error('Failed to start job:', error);
      // Keep status as paid even if API fails - payment was successful
      throw error;
    }
  };

  const checkJobStatus = async (campaignId: string, showAlert = false) => {
    const campaign = pendingCampaigns.find(c => c.id === campaignId);
    if (!campaign || !campaign.job_id) {
      console.error('Campaign or job_id not found');
      if (showAlert) {
        showToast('No job ID found for this campaign', 'error');
      }
      return;
    }

    const status = await checkJobStatusById(campaign.job_id, campaignId);
    
    if (showAlert && status) {
      // Show toast notification with status
      showToast(`Job Status: ${status.status} | Payment: ${status.payment_status || 'N/A'}`, 'info');
      console.log('Full Status Details:', status);
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
        submitCampaign,
        checkJobStatus
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
