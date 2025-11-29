import SDK from '@atala/prism-wallet-sdk';
import * as ed from '@noble/ed25519';

/**
 * DID Operations using Identus SDK
 * 
 * This module handles:
 * - DID creation (Ed25519 keypair)
 * - DID storage in localStorage
 * - Message signing for authentication
 */

const STORAGE_KEY_DID = 'rize_did';
const STORAGE_KEY_PRIVATE_KEY = 'rize_private_key';

export interface DIDKeyPair {
  did: string;
  privateKey: string;
}

/**
 * Create a new DID using Ed25519 cryptography.
 * Generates an Ed25519 keypair and creates a DID identifier.
 */
export async function createDid(): Promise<DIDKeyPair> {
  try {
    console.log('Creating new DID with Ed25519...');
    
    // Generate random 32-byte private key
    const privateKeyBytes = new Uint8Array(32);
    crypto.getRandomValues(privateKeyBytes);
    
    // Generate public key from private key (32 bytes for Ed25519)
    const publicKeyBytes = await ed.getPublicKeyAsync(privateKeyBytes);
    
    // Convert to hex strings
    const privateKeyHex = Array.from(privateKeyBytes)
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
    
    const publicKeyHex = Array.from(publicKeyBytes)
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
    
    // Create DID using FULL public key (64 hex chars = 32 bytes)
    // Format: did:prism:<full-public-key-hex>
    const didString = `did:prism:${publicKeyHex}`;
    
    // Store in localStorage
    localStorage.setItem(STORAGE_KEY_DID, didString);
    localStorage.setItem(STORAGE_KEY_PRIVATE_KEY, privateKeyHex);
    
    console.log('DID created successfully:', didString);
    
    return {
      did: didString,
      privateKey: privateKeyHex
    };
    
  } catch (error) {
    console.error('Error creating DID:', error);
    throw new Error('Failed to create DID: ' + (error as Error).message);
  }
}

/**
 * Load existing DID from localStorage.
 */
export function loadDid(): DIDKeyPair | null {
  try {
    const did = localStorage.getItem(STORAGE_KEY_DID);
    const privateKey = localStorage.getItem(STORAGE_KEY_PRIVATE_KEY);
    
    if (!did || !privateKey) {
      return null;
    }
    
    return { did, privateKey };
    
  } catch (error) {
    console.error('Error loading DID:', error);
    return null;
  }
}

/**
 * Sign a message with the DID's private key.
 * Returns a JWS compact serialization.
 */
export async function signWithDid(message: string, privateKeyHex: string): Promise<string> {
  try {
    console.log('Signing message with DID...');
    
    // Convert hex private key to Uint8Array
    const privateKeyBytes = new Uint8Array(
      privateKeyHex.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16))
    );
    
    // Create JWS compact format: header.payload.signature
    const header = {
      alg: 'EdDSA',
      typ: 'JWT'
    };
    
    const headerB64 = base64UrlEncode(JSON.stringify(header));
    const payloadB64 = base64UrlEncode(message);
    
    // Message to sign is: header.payload (JWS standard)
    const jwsSigningInput = `${headerB64}.${payloadB64}`;
    const signingInputBytes = new TextEncoder().encode(jwsSigningInput);
    
    // Sign using Ed25519 (first 32 bytes of private key)
    const signatureBytes = await ed.signAsync(signingInputBytes, privateKeyBytes.slice(0, 32));
    
    // Convert signature bytes to base64url
    const signatureB64 = base64UrlEncodeBytes(signatureBytes);
    
    const jws = `${headerB64}.${payloadB64}.${signatureB64}`;
    
    console.log('Message signed successfully');
    return jws;
    
  } catch (error) {
    console.error('Error signing message:', error);
    throw new Error('Failed to sign message: ' + (error as Error).message);
  }
}

/**
 * Clear DID from storage (logout).
 */
export function clearDid(): void {
  localStorage.removeItem(STORAGE_KEY_DID);
  localStorage.removeItem(STORAGE_KEY_PRIVATE_KEY);
  console.log('DID cleared from storage');
}

/**
 * Base64 URL encode string (RFC 4648)
 */
function base64UrlEncode(str: string): string {
  return btoa(str)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

/**
 * Base64 URL encode bytes (RFC 4648)
 */
function base64UrlEncodeBytes(bytes: Uint8Array): string {
  const binary = Array.from(bytes)
    .map(b => String.fromCharCode(b))
    .join('');
  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

/**
 * Check if a DID exists in storage
 */
export function hasDid(): boolean {
  return !!localStorage.getItem(STORAGE_KEY_DID);
}

/**
 * Export DID and private key for backup.
 * User should save this securely!
 */
export function exportDid(): DIDKeyPair | null {
  return loadDid();
}

/**
 * Import DID and private key from backup.
 * Restores a previously created DID.
 */
export function importDid(did: string, privateKey: string): DIDKeyPair {
  try {
    // Validate format
    if (!did.startsWith('did:')) {
      throw new Error('Invalid DID format. Must start with "did:"');
    }
    
    if (!/^[0-9a-f]{64}$/i.test(privateKey)) {
      throw new Error('Invalid private key format. Must be 64 hex characters');
    }
    
    // Store in localStorage
    localStorage.setItem(STORAGE_KEY_DID, did);
    localStorage.setItem(STORAGE_KEY_PRIVATE_KEY, privateKey);
    
    console.log('DID imported successfully:', did);
    
    return { did, privateKey };
    
  } catch (error) {
    console.error('Error importing DID:', error);
    throw new Error('Failed to import DID: ' + (error as Error).message);
  }
}

/**
 * Download DID backup as JSON file.
 * User can save this file and import it later.
 */
export function downloadDidBackup(): void {
  const didData = loadDid();
  
  if (!didData) {
    throw new Error('No DID found to backup');
  }
  
  const backup = {
    did: didData.did,
    privateKey: didData.privateKey,
    exportedAt: new Date().toISOString(),
    warning: 'KEEP THIS FILE SECURE! Anyone with this file can impersonate you.'
  };
  
  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `rize-did-backup-${Date.now()}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  
  console.log('DID backup downloaded');
}
