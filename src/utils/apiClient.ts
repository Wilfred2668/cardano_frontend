/**
 * API Client utility for making authenticated requests
 * Automatically adds JWT token to all requests
 */

const JWT_STORAGE_KEY = 'rize_jwt';
const JWT_EXPIRY_KEY = 'rize_jwt_expiry';

export interface ApiRequestOptions extends RequestInit {
  requiresAuth?: boolean;
}

/**
 * Get JWT token from localStorage
 */
export const getAuthToken = (): string | null => {
  return localStorage.getItem(JWT_STORAGE_KEY);
};

/**
 * Set JWT token with optional expiry time
 */
export const setAuthToken = (token: string, expiresIn?: number): void => {
  localStorage.setItem(JWT_STORAGE_KEY, token);
  
  // If expiry is provided (in seconds), calculate and store expiry timestamp
  if (expiresIn) {
    const expiryTime = Date.now() + (expiresIn * 1000);
    localStorage.setItem(JWT_EXPIRY_KEY, expiryTime.toString());
  }
};

/**
 * Check if token is expired
 */
export const isTokenExpired = (): boolean => {
  const expiryStr = localStorage.getItem(JWT_EXPIRY_KEY);
  if (!expiryStr) {
    return false; // No expiry set, assume valid
  }
  
  const expiryTime = parseInt(expiryStr, 10);
  return Date.now() >= expiryTime;
};

/**
 * Clear authentication tokens
 */
export const clearAuthTokens = (): void => {
  localStorage.removeItem(JWT_STORAGE_KEY);
  localStorage.removeItem(JWT_EXPIRY_KEY);
};

/**
 * Make an authenticated API request
 * Automatically adds Authorization header with JWT token
 */
export const apiRequest = async (
  url: string,
  options: ApiRequestOptions = {}
): Promise<Response> => {
  const { requiresAuth = true, headers = {}, ...restOptions } = options;

  // Prepare headers
  const requestHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(headers as Record<string, string>),
  };

  // Add Authorization header if authentication is required
  if (requiresAuth) {
    const token = getAuthToken();
    if (!token) {
      throw new Error('No authentication token found. Please login again.');
    }
    
    // Check if token is expired
    if (isTokenExpired()) {
      clearAuthTokens();
      window.location.href = '/';
      throw new Error('Authentication expired. Please login again.');
    }
    
    requestHeaders['Authorization'] = `Bearer ${token}`;
  }

  // Make the request
  const response = await fetch(url, {
    ...restOptions,
    headers: requestHeaders,
  });

  // Handle 401 Unauthorized - token expired or invalid
  if (response.status === 401) {
    // Clear invalid token
    localStorage.removeItem(JWT_STORAGE_KEY);
    
    // Redirect to login page
    window.location.href = '/';
    
    throw new Error('Authentication expired. Please login again.');
  }

  return response;
};

/**
 * Make an authenticated GET request
 */
export const apiGet = async (url: string, options: ApiRequestOptions = {}): Promise<any> => {
  const response = await apiRequest(url, {
    ...options,
    method: 'GET',
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API Error (${response.status}): ${errorText}`);
  }

  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return await response.json();
  }

  return await response.text();
};

/**
 * Make an authenticated POST request
 */
export const apiPost = async (
  url: string,
  data?: any,
  options: ApiRequestOptions = {}
): Promise<any> => {
  const response = await apiRequest(url, {
    ...options,
    method: 'POST',
    body: data ? JSON.stringify(data) : undefined,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API Error (${response.status}): ${errorText}`);
  }

  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return await response.json();
  }

  return await response.text();
};

/**
 * Make an authenticated PUT request
 */
export const apiPut = async (
  url: string,
  data?: any,
  options: ApiRequestOptions = {}
): Promise<any> => {
  const response = await apiRequest(url, {
    ...options,
    method: 'PUT',
    body: data ? JSON.stringify(data) : undefined,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API Error (${response.status}): ${errorText}`);
  }

  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return await response.json();
  }

  return await response.text();
};

/**
 * Make an authenticated DELETE request
 */
export const apiDelete = async (
  url: string,
  options: ApiRequestOptions = {}
): Promise<any> => {
  const response = await apiRequest(url, {
    ...options,
    method: 'DELETE',
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API Error (${response.status}): ${errorText}`);
  }

  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return await response.json();
  }

  return await response.text();
};
