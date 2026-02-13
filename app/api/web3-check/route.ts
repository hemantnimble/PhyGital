import { NextResponse } from "next/server";
import { getWeb3, getContract } from "@/utils/web3";

export async function GET() {
  try {
    const web3 = getWeb3();
    const contract = getContract();

    console.log("CONTRACT ADDRESS FROM ENV:", process.env.CONTRACT_ADDRESS);
    console.log("ALCHEMY URL:", process.env.ALCHEMY_SEPOLIA_URL?.slice(0, 50) + "...");

    // Check how many tokens have been minted on this contract
    const account = web3.eth.accounts.privateKeyToAccount(
      process.env.BRAND_PRIVATE_KEY!
    );

    return NextResponse.json({
      contractAddress: process.env.CONTRACT_ADDRESS,
      alchemyUrl: process.env.ALCHEMY_SEPOLIA_URL?.slice(0, 50) + "...",
      serverWallet: account.address,
    });

  } catch (error: any) {
    return NextResponse.json({
      error: error.message,
    }, { status: 500 });
  }
}