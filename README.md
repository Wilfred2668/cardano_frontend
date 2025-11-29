# 🚀 RIZE - Decentralized Marketing Platform

RIZE is a cutting-edge marketing platform that leverages **Hyperledger Identus** (formerly Atala PRISM) for true decentralized identity and authentication, running on the **Cardano blockchain**.

## 🌟 Features

### DID-Based Authentication
- ✅ **Passwordless Authentication**: No passwords, no usernames, no personal data
- ✅ **Self-Sovereign Identity**: You own your identity, stored locally
- ✅ **Cryptographic Security**: Ed25519 signatures for authentication
- ✅ **Zero-Knowledge Proofs**: Privacy-preserving authentication
- ✅ **Blockchain-Verified**: DIDs resolved on Cardano blockchain

### Marketing Platform
- 📊 Campaign Management Dashboard
- 🎯 A/B Testing with AI-powered variant generation
- 📈 Real-time Analytics and Insights
- 🔐 Privacy-first approach to user data
- 🌗 Light/Dark theme support

## 🏗️ Technology Stack

### Frontend
- **React 19** - Modern UI library
- **TypeScript** - Type-safe development
- **Vite** - Lightning-fast build tool
- **TailwindCSS 4** - Utility-first CSS
- **Framer Motion** - Smooth animations
- **@atala/prism-wallet-sdk** - Identus SDK for DID operations
- **@noble/ed25519** - Cryptographic operations

### Backend
- **FastAPI** - Modern Python web framework
- **Uvicorn** - ASGI server
- **python-jose** - JWT/JWS operations
- **Hyperledger Identus Cloud Agent** - DID resolver

### Infrastructure
- **Docker** - Container orchestration
- **Cardano Blockchain** - DID registry
- **PostgreSQL** - Optional persistent storage

## 🚀 Quick Start

### Prerequisites
- **Docker Desktop** - For running Identus Cloud Agent
- **Python 3.10+** - Backend runtime
- **Node.js 18+** - Frontend runtime

### One-Command Setup

**Windows:**
```bash
setup.bat
```

**macOS/Linux:**
```bash
chmod +x setup.sh
./setup.sh
```

This will:
1. ✅ Check dependencies
2. ✅ Start Hyperledger Identus Cloud Agent
3. ✅ Setup Python backend environment
4. ✅ Install frontend dependencies
5. ✅ Generate secure JWT secrets
6. ✅ Create environment files

### Manual Setup

See **[DID_AUTHENTICATION_GUIDE.md](./DID_AUTHENTICATION_GUIDE.md)** for detailed setup instructions.

## 🔐 DID Authentication Flow

```
1. User clicks "Create DID"
   └─> Frontend generates Ed25519 keypair
       └─> Stores DID + private key in localStorage

2. User clicks "Sign In with DID"
   └─> Backend generates random challenge
       └─> Frontend signs challenge with private key
           └─> Backend verifies signature using DID Document
               └─> Issues JWT token on success

3. User accesses protected routes
   └─> JWT token validates authentication
```

## 📚 Documentation

- **[DID Authentication Guide](./DID_AUTHENTICATION_GUIDE.md)** - Complete setup and usage guide
- **[Backend API Docs](./backend/README.md)** - FastAPI backend documentation
- **Interactive API Docs**: http://localhost:8000/docs (when running)

## 🎯 Usage

### Starting the System

**Terminal 1 - Start Backend:**
```bash
cd backend
source venv/bin/activate  # macOS/Linux
# or
venv\Scripts\activate     # Windows

python main.py
```

**Terminal 2 - Start Frontend:**
```bash
npm run dev
```

**Access the Application:**
- Frontend: http://localhost:5173
- DID Auth Page: http://localhost:5173/did-auth
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

### Authentication

1. Navigate to http://localhost:5173/did-auth
2. Click **"Create DID"** to generate your decentralized identity
3. Click **"Sign In with DID"** to authenticate
4. Access the dashboard with your verified identity

## 🏃‍♂️ Development

### Frontend Development
```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Backend Development
```bash
cd backend
source venv/bin/activate
python main.py       # Start with auto-reload
pytest tests/        # Run tests
black .              # Format code
```

## 📦 Project Structure

```
rize_wil/
├── backend/                    # FastAPI backend
│   ├── main.py                # API endpoints
│   ├── config.py              # Configuration
│   ├── auth/                  # Authentication modules
│   │   ├── challenge_store.py # Challenge management
│   │   ├── jwt_utils.py       # JWT operations
│   │   └── verifier.py        # DID verification
│   └── requirements.txt       # Python dependencies
├── src/                       # React frontend
│   ├── auth/                  # DID authentication
│   │   └── AuthContext.tsx    # Auth state management
│   ├── wallet/                # DID operations
│   │   └── did.ts             # DID creation & signing
│   ├── api/                   # Backend API client
│   │   └── auth.ts            # Auth API calls
│   ├── components/            # React components
│   ├── pages/                 # Application pages
│   │   ├── Home.tsx           # DID auth landing
│   │   └── DashboardDID.tsx   # Authenticated dashboard
│   └── contexts/              # React contexts
├── docker-compose.yml         # Docker orchestration
├── DID_AUTHENTICATION_GUIDE.md # Complete guide
└── README.md                  # This file
```

## 🔒 Security

### Production Considerations

1. **JWT Secret**: Change `JWT_SECRET_KEY` in `backend/.env` to a strong random value
2. **HTTPS**: Use HTTPS for all API calls in production
3. **CORS**: Update `CORS_ORIGINS` to your production domain
4. **Private Keys**: Consider using hardware wallets or secure enclaves instead of localStorage

### Current Security Features

- ✅ Ed25519 cryptographic signatures
- ✅ Challenge-response authentication (5-minute expiration)
- ✅ Single-use challenges
- ✅ JWT token expiration (24 hours)
- ✅ CORS protection
- ✅ Comprehensive error handling

## 🧪 Testing

### Test DID Authentication

```bash
# Get challenge
curl "http://localhost:8000/auth/challenge?did=did:prism:test"

# Check health
curl http://localhost:8000/health

# Check Identus agent
curl http://localhost:8080/health
```

## 🐛 Troubleshooting

### Identus Agent Not Starting
```bash
docker stop identus-cloud-agent
docker rm identus-cloud-agent
docker pull ghcr.io/hyperledger/identus-cloud-agent:latest
docker run -d --name identus-cloud-agent -p 8080:8080 ghcr.io/hyperledger/identus-cloud-agent:latest
```

### Backend Errors
```bash
cd backend
pip install -r requirements.txt --force-reinstall
python main.py
```

### Frontend Errors
```bash
rm -rf node_modules package-lock.json
npm install
npm run dev
```

## 📖 Learn More

- **Hyperledger Identus**: https://docs.atalaprism.io/
- **DID Core Specification**: https://www.w3.org/TR/did-core/
- **Cardano Blockchain**: https://cardano.org/
- **Ed25519 Cryptography**: https://ed25519.cr.yp.to/

## 🤝 Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📄 License

MIT License - See LICENSE file for details

---

**Built with ❤️ using Hyperledger Identus and Cardano**

React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
