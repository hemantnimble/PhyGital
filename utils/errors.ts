// utils/errors.ts

export class UserFriendlyError extends Error {
  constructor(
    message: string,
    public userMessage: string,
    public action?: string
  ) {
    super(message)
    this.name = "UserFriendlyError"
  }
}

export function parseBlockchainError(error: any): {
  title: string
  message: string
  action?: string
} {
  const errorString = error?.message || error?.toString() || ""

  // User rejected transaction
  if (
    errorString.includes("user rejected") ||
    errorString.includes("User denied") ||
    errorString.includes("rejected")
  ) {
    return {
      title: "Transaction Cancelled",
      message: "You cancelled the transaction in MetaMask.",
      action: "Try again when you're ready.",
    }
  }

  // Insufficient funds
  if (
    errorString.includes("insufficient funds") ||
    errorString.includes("not enough")
  ) {
    return {
      title: "Insufficient Funds",
      message: "Your wallet doesn't have enough ETH to pay for gas fees.",
      action: "Get test ETH from sepoliafaucet.com or switch to a wallet with funds.",
    }
  }

  // Wrong network
  if (
    errorString.includes("network") ||
    errorString.includes("chain")
  ) {
    return {
      title: "Wrong Network",
      message: "Please switch to Sepolia testnet in MetaMask.",
      action: "Open MetaMask → Switch network → Sepolia",
    }
  }

  // Contract revert
  if (
    errorString.includes("revert") ||
    errorString.includes("execution reverted")
  ) {
    return {
      title: "Transaction Failed",
      message: "The blockchain rejected this transaction. This usually means the operation isn't allowed right now.",
      action: "Check that you're the owner and the product status is correct.",
    }
  }

  // Timeout
  if (
    errorString.includes("timeout") ||
    errorString.includes("timed out")
  ) {
    return {
      title: "Transaction Timeout",
      message: "The blockchain is taking longer than expected.",
      action: "Wait a bit and check Etherscan. The transaction might still complete.",
    }
  }

  // Already claimed/used
  if (
    errorString.includes("already claimed") ||
    errorString.includes("already used")
  ) {
    return {
      title: "Already Claimed",
      message: "This product has already been claimed by another user.",
      action: "Check the ownership history to see who owns it.",
    }
  }

  // Generic fallback
  return {
    title: "Transaction Failed",
    message: errorString.slice(0, 200) || "An unexpected error occurred.",
    action: "Try again or contact support if this persists.",
  }
}

export function parseAPIError(error: any): {
  title: string
  message: string
} {
  if (error?.response?.data?.error) {
    return {
      title: "Error",
      message: error.response.data.error,
    }
  }

  if (error?.message) {
    return {
      title: "Error",
      message: error.message,
    }
  }

  return {
    title: "Error",
    message: "Something went wrong. Please try again.",
  }
}