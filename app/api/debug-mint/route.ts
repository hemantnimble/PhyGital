import { NextResponse } from "next/server";
import { getWeb3, getContract, getServerAddress, hashProductId } from "@/utils/web3";

export async function GET() {
  try {
    const web3 = getWeb3();
    const contract = getContract();
    const serverAddress = getServerAddress();

    // Check 1: What is the contract owner?
    const contractOwner = await (contract.methods as any).owner().call();

    // Check 2: What is your server wallet address?
    const serverWallet = serverAddress;

    // Check 3: Do they match?
    const isOwner = contractOwner.toLowerCase() === serverWallet.toLowerCase();

    // Check 4: What is your server wallet ETH balance?
    const balance = await web3.eth.getBalance(serverAddress);
    const balanceETH = web3.utils.fromWei(balance, "ether");

    // Check 5: What chain are we on?
    const chainId = await web3.eth.getChainId();

    return NextResponse.json({
      contractOwner,
      serverWallet,
      isOwner,               // ← THIS MUST BE true
      balanceETH,            // ← MUST BE > 0
      chainId: chainId.toString(), // ← must be 11155111
      contractAddress: process.env.CONTRACT_ADDRESS,
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}