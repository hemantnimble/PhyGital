// utils/network.ts

declare global {
  interface Window {
    ethereum?: {
      isMetaMask?: boolean
      request: (args: { method: string; params?: any[] }) => Promise<any>
      on?: (event: string, handler: (...args: any[]) => void) => void
      removeListener?: (event: string, handler: (...args: any[]) => void) => void
    }
  }
}

export async function checkNetwork(): Promise<{
  correct: boolean
  current?: string
  expected: string
}> {
  if (!window.ethereum) {
    throw new Error("MetaMask not installed")
  }

  const chainId = await window.ethereum.request({ method: "eth_chainId" })
  const currentChainId = parseInt(chainId as string, 16)

  const SEPOLIA_CHAIN_ID = 11155111

  return {
    correct: currentChainId === SEPOLIA_CHAIN_ID,
    current: currentChainId.toString(),
    expected: "Sepolia (11155111)",
  }
}

export async function switchToSepolia(): Promise<boolean> {
  if (!window.ethereum) return false

  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: "0xaa36a7" }], // Sepolia chain ID in hex
    })
    return true
  } catch (error: any) {
    // Chain not added, try adding it
    if (error.code === 4902) {
      try {
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: "0xaa36a7",
              chainName: "Sepolia",
              rpcUrls: ["https://sepolia.infura.io/v3/"],
              nativeCurrency: {
                name: "Sepolia ETH",
                symbol: "ETH",
                decimals: 18,
              },
              blockExplorerUrls: ["https://sepolia.etherscan.io"],
            },
          ],
        })
        return true
      } catch {
        return false
      }
    }
    return false
  }
}