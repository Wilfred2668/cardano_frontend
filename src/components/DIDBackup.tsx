import { useState } from 'react';
import { useAuth } from '../auth/AuthContext';

/**
 * DID Import/Export Component
 * Allows users to backup and restore their DID identity
 */
export default function DIDBackup() {
  const { did, importDidFromBackup, downloadBackup } = useAuth();
  const [showImport, setShowImport] = useState(false);
  const [importDid, setImportDid] = useState('');
  const [importKey, setImportKey] = useState('');
  const [error, setError] = useState('');

  const handleImport = () => {
    try {
      setError('');
      importDidFromBackup(importDid.trim(), importKey.trim());
      setShowImport(false);
      setImportDid('');
      setImportKey('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Import failed');
    }
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const backup = JSON.parse(event.target?.result as string);
        setImportDid(backup.did);
        setImportKey(backup.privateKey);
        setError('');
      } catch (err) {
        setError('Invalid backup file');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-4">
      {/* Export/Backup Section */}
      {did && (
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={downloadBackup}
            className="flex-1 px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg text-sm font-medium transition-colors"
          >
            📥 Download Backup
          </button>
          
          <button
            onClick={() => setShowImport(false)}
            className="flex-1 px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg text-sm font-medium transition-colors"
          >
            📋 View Details
          </button>
        </div>
      )}

      {/* Import Section Toggle */}
      {!did && (
        <button
          onClick={() => setShowImport(!showImport)}
          className="w-full px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg text-sm font-medium transition-colors"
        >
          {showImport ? '❌ Cancel Import' : '📤 Import Existing DID'}
        </button>
      )}

      {/* Import Form */}
      {showImport && (
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 space-y-4">
          <h3 className="text-lg font-semibold">Import DID from Backup</h3>
          
          {/* File Upload */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">
              Upload Backup File (JSON)
            </label>
            <input
              type="file"
              accept=".json"
              onChange={handleFileImport}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm"
            />
          </div>

          <div className="text-center text-gray-500 text-sm">— OR —</div>

          {/* Manual Input */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">
              DID (starts with "did:")
            </label>
            <input
              type="text"
              value={importDid}
              onChange={(e) => setImportDid(e.target.value)}
              placeholder="did:prism:abc123..."
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm font-mono"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">
              Private Key (64 hex characters)
            </label>
            <input
              type="password"
              value={importKey}
              onChange={(e) => setImportKey(e.target.value)}
              placeholder="a3f2b8d4e6c1f9a7..."
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm font-mono"
            />
          </div>

          {error && (
            <div className="p-3 bg-red-900/20 border border-red-800 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          <button
            onClick={handleImport}
            disabled={!importDid || !importKey}
            className="w-full px-4 py-2 bg-white text-black hover:bg-gray-200 disabled:bg-gray-700 disabled:text-gray-500 rounded-lg font-medium transition-colors"
          >
            Import DID
          </button>

          <div className="text-xs text-gray-500 bg-gray-800/50 p-3 rounded">
            ⚠️ <strong>Security Warning:</strong> Only import DIDs from backups you created yourself. 
            Never share your private key with anyone!
          </div>
        </div>
      )}
    </div>
  );
}
