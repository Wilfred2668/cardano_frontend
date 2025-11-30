import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCardanoWallet } from '../contexts/CardanoWalletContext';
import { type PendingCampaign } from '../contexts/CampaignContext';
import { CARDANO_CONFIG } from '../config/cardano';

interface PaymentModalProps {
  campaign: PendingCampaign;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (txHash: string) => void;
}

export default function PaymentModal({ campaign, isOpen, onClose, onSuccess }: PaymentModalProps) {
  const { lucid, address, connected, connecting, connectWallet, walletApi } = useCardanoWallet();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConnectWallet = async () => {
    try {
      setError(null);
      await connectWallet();
    } catch (err: any) {
      setError(err.message || 'Failed to connect wallet');
    }
  };

  const handleSendPayment = async () => {
    if (!lucid || !address) {
      setError('Wallet not connected');
      return;
    }

    if (!campaign.budget) {
      setError('Invalid campaign budget');
      return;
    }

    if (!walletApi) {
      setError('Wallet API not available. Please reconnect your wallet.');
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      const budgetADA = parseFloat(campaign.budget);
      if (isNaN(budgetADA) || budgetADA <= 0) {
        throw new Error('Invalid budget amount');
      }

      // Re-select wallet before transaction to ensure fresh connection
      console.log('Re-selecting wallet API...');
      lucid.selectWallet.fromAPI(walletApi);

      // Check wallet has UTxOs
      const utxos = await lucid.wallet().getUtxos();
      console.log('Wallet UTxOs:', utxos.length);
      
      if (!utxos || utxos.length === 0) {
        throw new Error('No UTxOs found in wallet. Please ensure your wallet has ADA.');
      }

      const lovelaceAmount = BigInt(Math.floor(budgetADA * 1_000_000));
      console.log('Sending payment:', budgetADA, 'ADA =', lovelaceAmount.toString(), 'lovelace');
      console.log('To address:', CARDANO_CONFIG.RECEIVER_ADDRESS);

      // Build transaction
      const tx = await lucid
        .newTx()
        .pay.ToAddress(CARDANO_CONFIG.RECEIVER_ADDRESS, { lovelace: lovelaceAmount })
        .complete();

      console.log('Transaction built, requesting signature...');

      // Sign with wallet
      const signedTx = await tx.sign.withWallet().complete();

      console.log('Transaction signed, submitting...');

      // Submit transaction
      const txHash = await signedTx.submit();

      console.log('Payment successful, txHash:', txHash);
      onSuccess(txHash);
    } catch (err: any) {
      console.error('Payment failed:', err);
      setError(err.message || 'Payment failed');
    } finally {
      setProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-gray-900 border border-gray-700 rounded-lg max-w-md w-full"
        >
          {/* Header */}
          <div className="border-b border-gray-800 p-6 flex items-start justify-between">
            <div>
              <h2 className="text-xl font-bold mb-1">Complete Payment</h2>
              <p className="text-gray-400 text-sm">{campaign.campaign_name}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            {/* Payment Details */}
            <div className="bg-gray-800 rounded-lg p-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400">Amount</span>
                <span className="text-white font-bold">₳{parseFloat(campaign.budget).toLocaleString()} ADA</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Network</span>
                <span className="text-white">Preprod Testnet</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-gray-400">Receiver</span>
                <span className="text-white text-xs font-mono break-all">{CARDANO_CONFIG.RECEIVER_ADDRESS}</span>
              </div>
            </div>

            {/* Wallet Connection Status */}
            {!connected ? (
              <button
                onClick={handleConnectWallet}
                disabled={connecting}
                className="w-full bg-white hover:bg-gray-200 text-black font-medium py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {connecting ? 'Connecting...' : 'Connect Eternl Wallet'}
              </button>
            ) : (
              <>
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
                  <p className="text-green-400 text-sm">✓ Wallet Connected</p>
                  <p className="text-gray-400 text-xs mt-1 font-mono break-all">{address}</p>
                </div>

                <button
                  onClick={handleSendPayment}
                  disabled={processing}
                  className="w-full bg-white hover:bg-gray-200 text-black font-medium py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {processing ? 'Processing Payment...' : 'Send Payment'}
                </button>
              </>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            {/* Info */}
            <div className="text-gray-500 text-xs text-center">
              <p>Your Eternl wallet will open for approval</p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
