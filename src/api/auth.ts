const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export interface ChallengeResponse {
  challenge: string;
  did: string;
}

export interface VerifyRequest {
  did: string;
  challenge: string;
  signature: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  did: string;
}

/**
 * Request an authentication challenge from the backend.
 */
export async function getChallenge(did: string): Promise<ChallengeResponse> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/auth/challenge?did=${encodeURIComponent(did)}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to get challenge');
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting challenge:', error);
    throw error;
  }
}

/**
 * Verify DID authentication with signature.
 */
export async function verifyAuthentication(
  request: VerifyRequest
): Promise<AuthResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Authentication failed');
    }

    return await response.json();
  } catch (error) {
    console.error('Error verifying authentication:', error);
    throw error;
  }
}

/**
 * Get current user info from JWT token.
 */
export async function getCurrentUser(token: string) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/auth/me`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to get user info');
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting current user:', error);
    throw error;
  }
}
