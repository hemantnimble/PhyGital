import { NextResponse } from "next/server";
import { getWeb3, getContract, getServerAccount } from "@/utils/web3";

export async function GET() {
  try {
    const web3 = getWeb3();

    // Check 1: connected to Sepolia?
    const chainId = await web3.eth.getChainId();

    // Check 2: server wallet balance
    const account = getServerAccount();
    const balance = await web3.eth.getBalance(account.address);
    const balanceInEth = web3.utils.fromWei(balance, "ether");

    // Check 3: contract address loaded
    const contractAddress = process.env.CONTRACT_ADDRESS;

    return NextResponse.json({
      connected: true,
      chainId: chainId.toString(),
      serverWallet: account.address,
      balanceETH: balanceInEth,
      contractAddress,
    });

  } catch (error: any) {
    return NextResponse.json({
      connected: false,
      error: error.message,
    }, { status: 500 });
  }
}