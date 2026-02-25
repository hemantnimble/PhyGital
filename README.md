# Phygital 🔐

> **Blockchain-backed authenticity verification for physical products.**

Phygital bridges the physical and digital worlds by minting ERC-721 NFT certificates for physical products. Brands register their products, customers scan a QR code to instantly verify authenticity, and ownership is tracked on-chain — forever.

---

## ✨ Features

- **NFT Certificate Minting** — Each product gets a unique ERC-721 token minted to the brand's Ethereum wallet on Sepolia testnet
- **QR Code Verification** — Customers scan a QR code to view blockchain-backed authenticity, brand details, and full ownership history
- **Ownership Transfer** — On-chain transfer of NFT certificates between wallets (claim & resell)
- **Brand Dashboard** — Brands can register products, activate them, mint NFTs, and manage inventory
- **Admin Panel** — Review and approve/reject brand applications with optional rejection notes
- **Counterfeit Detection** — Cross-references token ID in DB vs on-chain to detect tampering

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Auth | NextAuth v5 (Google OAuth) |
| Database | MongoDB via Prisma ORM |
| Blockchain | Ethereum Sepolia (Web3.js v4) |
| Smart Contract | ERC-721 (OpenZeppelin) |
| Image Uploads | Cloudinary |
| Styling | Tailwind CSS + inline styles |
| QR Codes | `html5-qrcode` (scan) + `qrcode` (generate) |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- MongoDB database (Atlas recommended)
- Google OAuth credentials
- Alchemy Sepolia RPC URL
- A deployed instance of the `PhygitalNFT` contract
- A server Ethereum wallet with Sepolia ETH (for signing mint/transfer transactions)
- Cloudinary account

### Installation

```bash
git clone https://github.com/your-org/phygital.git
cd phygital
npm install
```

### Environment Variables

Create a `.env` file in the root:

```env
# Database
DATABASE_URL="mongodb+srv://..."

# NextAuth
AUTH_SECRET="your-nextauth-secret"
NEXTAUTH_URL="http://localhost:3000"

# Google OAuth
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."

# Blockchain
ALCHEMY_SEPOLIA_URL="https://eth-sepolia.g.alchemy.com/v2/your-key"
CONTRACT_ADDRESS="0x..."
BRAND_PRIVATE_KEY="0x..."  # Server wallet private key (for signing txs)

# Cloudinary
CLOUDINARY_CLOUD_NAME="..."
CLOUDINARY_API_KEY="..."
CLOUDINARY_API_SECRET="..."

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Structure

```
phygital/
├── app/
│   ├── api/
│   │   ├── brand/          # Brand apply, approve, reject, pending
│   │   ├── products/       # CRUD for products
│   │   ├── mint/           # Mint NFT certificate
│   │   ├── claim/          # Claim ownership (first buyer)
│   │   ├── transfer/       # Transfer NFT between wallets
│   │   ├── verify/         # Blockchain verification by productId
│   │   └── upload/         # Cloudinary image upload
│   ├── brand/
│   │   ├── register/       # Brand application form
│   │   └── products/       # Brand product management
│   ├── dashboard/          # Admin + Brand dashboards
│   ├── verify/[productId]/ # Public product verification page
│   └── scanQr/             # QR code scanner
├── components/
│   ├── admin/              # Admin brand approvals
│   ├── brand/              # Image uploader
│   ├── home/               # Landing page sections
│   └── products/           # Product list client component
├── prisma/
│   └── schema.prisma       # MongoDB schema
├── utils/
│   ├── web3.ts             # Web3 + contract helpers
│   ├── errors.ts           # Blockchain error parsing
│   ├── network.ts          # MetaMask network switching
│   └── blockchain/
│       └── PhygitalNFT.json # Contract ABI
└── auth.ts                 # NextAuth configuration
```

---

## 🔄 User Flows

### Brand Flow
1. Sign in with Google
2. Apply at `/brand/register` with brand details + wallet address
3. Admin approves → role upgrades to `BRAND`
4. Add products at `/product/add`
5. Activate a product → QR identity generated
6. Mint NFT certificate → ERC-721 token created on Sepolia

### Customer Flow
1. Scan QR code on physical product (or visit `/scanQr`)
2. View product details, brand info, and blockchain certificate
3. Claim ownership by entering your Ethereum wallet address
4. Transfer ownership when reselling

### Admin Flow
1. Sign in (account with `ADMIN` role)
2. Visit `/dashboard` to see platform stats
3. Review pending brand applications
4. Approve or reject with optional notes

---

## 🔗 Smart Contract

The `PhygitalNFT` contract is an ERC-721 with custom minting and ownership logic:

| Function | Description |
|---|---|
| `mintCertificate(brandWallet, productHash)` | Mints NFT to brand wallet; maps hash → tokenId |
| `verifyCertificate(productHash)` | Returns `(isValid, tokenId, currentOwner)` |
| `transferOwnership(tokenId, from, to)` | Transfers NFT between wallets |

> The server wallet (set via `BRAND_PRIVATE_KEY`) must be the contract **owner** to call `mintCertificate`.

---

## 🗄 Database Schema (Prisma + MongoDB)

Key models:

- **User** — Auth + role (`USER`, `BRAND`, `ADMIN`)
- **Brand** — Brand profile + wallet address
- **BrandVerification** — Application status (`PENDING`, `APPROVED`, `REJECTED`)
- **Product** — Product details + status (`DRAFT`, `ACTIVE`, `FLAGGED`)
- **ProductIdentity** — QR identity value (= productId)
- **NFTCertificate** — On-chain token info (tokenId, contract, chain)
- **OwnershipHistory** — Full transfer history with tx hashes

---

## 🚢 Deployment

The easiest way to deploy is via [Vercel](https://vercel.com):

```bash
npx vercel --prod
```

Make sure all environment variables are set in your Vercel project settings.

> **Note:** The Prisma client is generated automatically via the `postinstall` script.

---

## 📜 License

<<<<<<< HEAD
MIT © 2026 Phygital
=======
MIT © 2026 Phygital
>>>>>>> 75bbf9cb96f0613d69694cc3eb5ff5de8fb3359f
