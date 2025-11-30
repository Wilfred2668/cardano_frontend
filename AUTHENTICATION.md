# Tokenized Authentication System

## Overview

All API calls after login are now protected with JWT (JSON Web Token) authentication. This ensures that only authenticated users can access protected resources and perform actions.

## Architecture

### 1. Token Management (`src/utils/apiClient.ts`)

The API client provides utilities for managing JWT tokens:

- **`getAuthToken()`**: Retrieves the JWT token from localStorage
- **`setAuthToken(token, expiresIn)`**: Stores JWT token with optional expiry time
- **`isTokenExpired()`**: Checks if the stored token has expired
- **`clearAuthTokens()`**: Removes all authentication tokens from storage

### 2. Authenticated API Calls

All API calls use the following helper functions that automatically include JWT tokens:

- **`apiGet(url, options)`**: Authenticated GET request
- **`apiPost(url, data, options)`**: Authenticated POST request
- **`apiPut(url, data, options)`**: Authenticated PUT request
- **`apiDelete(url, options)`**: Authenticated DELETE request

#### Example Usage:

```typescript
import { apiGet, apiPost } from '../utils/apiClient';

// GET request with authentication
const data = await apiGet('https://api.example.com/campaigns');

// POST request with authentication
const result = await apiPost(
  'https://api.example.com/start_job',
  { identifier: '...', input_data: {...} }
);
```

### 3. Token Flow

1. **Login Process**:
   - User creates/loads DID (Decentralized Identity)
   - Backend provides a challenge
   - User signs challenge with DID private key
   - Backend verifies signature and returns JWT token
   - Token is stored with 24-hour expiry

2. **API Requests**:
   - All requests automatically include `Authorization: Bearer <token>` header
   - Token expiry is checked before each request
   - If expired, user is redirected to login

3. **Token Expiration**:
   - Tokens expire after 24 hours (configurable)
   - On expiry, token is cleared and user must re-authenticate
   - 401 responses automatically trigger logout and redirect

4. **Logout**:
   - Clears JWT token and expiry timestamp
   - Keeps DID for future logins (like a username)

## Protected Routes

### Frontend Protection (`src/components/ProtectedRoute.tsx`)

All dashboard routes require both:
- ✓ Connected Cardano wallet
- ✓ Valid JWT token (authenticated)

Routes automatically redirect to login if either is missing.

### Backend Integration

The following API endpoints now require JWT authentication:

1. **Campaign APIs**:
   - `POST /start_job` - Submit new campaign
   - `GET /status?job_id={id}` - Check campaign status

2. **Future APIs** (when integrated):
   - All endpoints in `src/services/api.ts` are pre-configured to use tokenized requests

## Security Features

### 1. Automatic Token Validation
- Tokens are validated before every API call
- Expired tokens trigger automatic logout
- Invalid tokens clear authentication state

### 2. Secure Storage
- Tokens stored in localStorage (client-side only)
- Expiry timestamps tracked separately
- Automatic cleanup on logout

### 3. Error Handling
- 401 responses clear tokens and redirect to login
- Network errors are caught and reported
- User-friendly error messages via toast notifications

### 4. Token Refresh (Future Enhancement)
Currently tokens expire after 24 hours. Future versions can implement:
- Refresh token mechanism
- Silent token renewal before expiry
- Extended session management

## Implementation Details

### Modified Files

1. **`src/utils/apiClient.ts`** (NEW)
   - Core token management utilities
   - Authenticated request functions
   - Auto-redirect on 401

2. **`src/auth/AuthContext.tsx`**
   - Uses `setAuthToken()` to store JWT with expiry
   - Uses `clearAuthTokens()` on logout
   - Checks token expiry on mount

3. **`src/contexts/CampaignContext.tsx`**
   - Uses `apiGet()` for status checks
   - Uses `apiPost()` for job submission
   - All requests include JWT automatically

4. **`src/components/ProtectedRoute.tsx`**
   - Checks both wallet connection AND JWT token
   - Redirects unauthenticated users to login

5. **`src/api/auth.ts`**
   - Updated `getCurrentUser()` to use Authorization header
   - Token passed in header instead of query param

6. **`src/services/api.ts`**
   - Imported API client utilities
   - Added examples for future real API integration

## Testing Authentication

### 1. Login Flow
```bash
# User logs in with DID
# Check browser DevTools -> Application -> Local Storage
# Should see:
- rize_jwt: "eyJ..."
- rize_jwt_expiry: "1701234567890"
```

### 2. API Call Inspection
```bash
# Open Network tab in DevTools
# Make any API call (create campaign, check status)
# Request Headers should include:
Authorization: Bearer eyJ...
```

### 3. Token Expiration
```bash
# Manually set expiry in past:
localStorage.setItem('rize_jwt_expiry', '1')
# Refresh page or make API call
# Should redirect to login
```

## Future Enhancements

1. **Token Refresh**
   - Implement refresh token system
   - Auto-renew before expiry
   - Seamless session extension

2. **Token Scopes**
   - Different permission levels
   - Role-based access control
   - Fine-grained API access

3. **Multi-factor Authentication**
   - DID + Wallet signature
   - Biometric verification
   - Hardware key support

4. **Session Management**
   - Track active sessions
   - Revoke specific tokens
   - Device management

## Troubleshooting

### "No authentication token found"
- User not logged in
- Token was cleared
- Solution: Log in again

### "Authentication expired"
- Token expired (24 hours passed)
- Solution: Log in again

### 401 Unauthorized responses
- Invalid token
- Token tampered with
- Solution: Automatic logout and redirect

### API calls failing
- Check Network tab for Authorization header
- Verify token exists in localStorage
- Check token expiry timestamp
