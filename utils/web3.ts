import { Web3 } from "web3";
import contractABI from "@/utils/blockchain/PhygitalNFT.json";

let web3Instance: Web3 | null = null;

export function getWeb3(): Web3 {
  if (!web3Instance) {
    web3Instance = new Web3(process.env.ALCHEMY_SEPOLIA_URL!);
  }
  return web3Instance;
}

export function getContract() {
  const web3 = getWeb3();
  return new web3.eth.Contract(
    contractABI.abi as any,
    process.env.CONTRACT_ADDRESS!
  );
}

export function hashProductId(productId: string): string {
  const web3 = getWeb3();
  return web3.utils.keccak256(productId);
}

export function getPrivateKey(): string {
  const rawKey = process.env.BRAND_PRIVATE_KEY!;
  // Ensure 0x prefix is present
  return rawKey.startsWith("0x") ? rawKey : `0x${rawKey}`;
}

export function getServerAddress(): string {
  const web3 = getWeb3();
  // Derive public address from private key
  const account = web3.eth.accounts.privateKeyToAccount(getPrivateKey());
  return account.address;
}