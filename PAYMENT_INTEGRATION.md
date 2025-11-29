# Payment Integration - Complete

## Overview
The Cardano payment integration with Eternl wallet is now fully implemented. Users can create campaigns, pay with ADA via Eternl wallet, and submit campaigns to the backend.

## Flow

1. **Create Campaign** (`/create-campaign`)
   - User fills out campaign form (all fields required)
   - Campaign saved to localStorage (status: `pending_payment`)
   - Redirected to Dashboard

2. **Dashboard** (`/dashboard`)
   - Shows pending campaigns awaiting payment
   - Click "Complete Payment" button on any campaign card
   - Opens PaymentModal

3. **PaymentModal**
   - Shows campaign details and payment amount
   - User clicks "Connect Eternl Wallet"
   - Eternl browser extension prompts for connection
   - Once connected, shows wallet address
   - User clicks "Send Payment"
   - Transaction built using Lucid Evolution SDK:
     - Amount: Campaign budget in ADA (from campaign.budget)
     - Receiver: `addr_test1qpdtyplnyguczu6h2avql94j8shlm93k5y88gs0xmtew83m6a8s8jezs0luq2d982c8e244m4up44crjg3j5t5tf0fzq4krtkv`
     - Network: Cardano Preview Testnet
   - Eternl prompts user to sign transaction
   - Transaction submitted to blockchain
   - Returns `txHash`

4. **Backend Submission**
   - On successful payment, calls `submitCampaign(campaignId, txHash, did)`
   - Updates campaign status to `paid`
   - Sends POST request to backend API:
     - Endpoint: `https://noncommunistic-unexcusedly-kinley.ngrok-free.dev/campaigns`
     - Body: campaign data + txHash + DID
   - Backend stores campaign and returns unique identifier
   - Campaign status updated to `submitted`
   - Campaign removed from pending list after 2 seconds

## Components

### CardanoWalletContext
- **Location**: `src/contexts/CardanoWalletContext.tsx`
- **Purpose**: Manage Cardano wallet connection state
- **State**: `lucid`, `address`, `connected`, `connecting`
- **Functions**: `connectWallet()` - Initializes Lucid with Blockfrost and Eternl

### PaymentModal
- **Location**: `src/components/PaymentModal.tsx`
- **Props**: 
  - `campaign`: PendingCampaign object
  - `isOpen`: boolean
  - `onClose`: callback
  - `onSuccess`: callback with txHash
- **Features**:
  - Wallet connection UI
  - Payment details display
  - Transaction building and signing
  - Error handling

### CampaignContext (Updated)
- **Location**: `src/contexts/CampaignContext.tsx`
- **New Function**: `submitCampaign(campaignId, txHash, did)`
- **Purpose**: Submit campaign to backend after successful payment

### Dashboard (Updated)
- **Location**: `src/pages/Dashboard.tsx`
- **Changes**:
  - Import PaymentModal and useDID
  - Add paymentCampaign state
  - Open PaymentModal on "Complete Payment" click
  - Call submitCampaign on payment success

### App.tsx (Updated)
- **Added**: `CardanoWalletProvider` wrapper
- **Purpose**: Make wallet context available throughout app

## Configuration

### Cardano Config
**File**: `src/config/cardano.ts`
```typescript
export const CARDANO_CONFIG = {
  NETWORK: 'Preview',
  RECEIVER_ADDRESS: 'addr_test1qpdtyplnyguczu6h2avql94j8shlm93k5y88gs0xmtew83m6a8s8jezs0luq2d982c8e244m4up44crjg3j5t5tf0fzq4krtkv',
  KOIOS_URL: 'https://preview.koios.rest/api/v1',
  BACKEND_API_URL: 'https://noncommunistic-unexcusedly-kinley.ngrok-free.dev'
};
```

## Testing Steps

1. **Install Eternl Wallet**
   - Browser extension from eternl.io
   - Create/restore wallet on Preview Testnet
   - Get test ADA from Cardano testnet faucet

2. **Create Campaign**
   - Navigate to `/create-campaign`
   - Fill all fields (budget in ADA)
   - Submit form

3. **Pay for Campaign**
   - Go to Dashboard
   - Find pending campaign
   - Click "Complete Payment"
   - Connect Eternl wallet when prompted
   - Click "Send Payment"
   - Approve transaction in Eternl popup
   - Wait for confirmation

4. **Verify Backend Submission**
   - Check browser console for success message
   - Campaign should disappear from pending list
   - Check backend API for campaign data

## Dependencies

- `@lucid-evolution/lucid` - Cardano transaction building
- `@lucid-evolution/provider` - Blockfrost API integration
- Eternl browser extension (user must install)

## Environment Variables

Currently using hardcoded values. For production, move to `.env`:
- `VITE_CARDANO_NETWORK`
- `VITE_RECEIVER_ADDRESS`
- `VITE_BLOCKFROST_PROJECT_ID`
- `VITE_BACKEND_API_URL`

## Known Issues / TODO

- [ ] Add loading state during backend submission
- [ ] Better error messages for specific failure cases
- [ ] Transaction confirmation UI
- [ ] Support for other wallets (Nami, Yoroi, etc.)
- [ ] Payment history/receipts
- [ ] Retry mechanism for failed submissions
