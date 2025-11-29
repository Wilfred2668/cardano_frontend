import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '../contexts/ToastContext';

interface ShareReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  campaignId: string;
}

const ShareReportModal = ({ isOpen, onClose, campaignId }: ShareReportModalProps) => {
  const { showToast } = useToast();
  const shareLink = `https://rize.report/demo/${campaignId}`;
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
    showToast('Share link copied to clipboard', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-50 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div
              className="bg-gray-900 border border-gray-800 rounded-lg shadow-2xl max-w-md w-full p-6 pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-semibold">Share Report</h2>
                </div>
                <button
                  onClick={onClose}
                  className="text-gray-500 hover:text-white transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Description */}
              <p className="text-sm text-gray-400 mb-4">
                Share this campaign report with stakeholders. The link provides read-only access to the results.
              </p>

              {/* Demo Badge */}
              <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-3 mb-4">
                <div className="flex items-center space-x-2 mb-2">
                  <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-xs text-gray-500 uppercase tracking-wide font-medium">Demo Mode</span>
                </div>
                <p className="text-xs text-gray-500">
                  This is a simulated shareable link. In production, this would generate a secure, time-limited URL.
                </p>
              </div>

              {/* Share Link */}
              <div className="bg-gray-950 border border-gray-800 rounded-lg p-4 mb-4">
                <div className="text-xs text-gray-500 mb-2 uppercase tracking-wide">Shareable Link</div>
                <div className="flex items-center justify-between">
                  <code className="text-sm font-mono text-gray-300 flex-1 overflow-hidden text-ellipsis">
                    {shareLink}
                  </code>
                  <button
                    onClick={handleCopy}
                    className="ml-3 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded text-xs font-medium transition-colors flex items-center space-x-1.5"
                  >
                    {copied ? (
                      <>
                        <svg className="w-3.5 h-3.5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-green-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-3">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ShareReportModal;
