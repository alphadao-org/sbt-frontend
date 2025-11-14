import { useState, useCallback } from "react";
import { useTonConnectUI } from "@tonconnect/ui-react";
import { contractService } from "@/lib/contract/contractService";
import type { TransactionResult } from "@/types";

export interface MintTransactionResult extends TransactionResult {
  tokenId?: number;
  studentAddress?: string;
  transactionHash?: string;
}

export const useContract = () => {
  const [tonConnectUI] = useTonConnectUI();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mint = useCallback(
    async (studentAddress: string, onMintSent?: () => void): Promise<MintTransactionResult> => {
      setLoading(true);
      setError(null);

      try {
        const transaction =
          contractService.buildMintTransaction(studentAddress);
        const result = await tonConnectUI.sendTransaction(transaction);

        // Call callback immediately after transaction is sent
        onMintSent?.();

        return {
          success: true,
          hash: result.boc,
          transactionHash: result.boc,
          studentAddress,
        };
      } catch (err: any) {
        const errorMsg = err?.message || "Transaction failed";
        setError(errorMsg);
        console.error("Mint error:", err);
        return {
          success: false,
          error: errorMsg,
        };
      } finally {
        setLoading(false);
      }
    },
    [tonConnectUI],
  );

  const addAdmin = useCallback(
    async (adminAddress: string): Promise<TransactionResult> => {
      setLoading(true);
      setError(null);

      try {
        const transaction =
          contractService.buildAddAdminTransaction(adminAddress);
        const result = await tonConnectUI.sendTransaction(transaction);

        return {
          success: true,
          hash: result.boc,
        };
      } catch (err: any) {
        const errorMsg = err?.message || "Transaction failed";
        setError(errorMsg);
        console.error("Add admin error:", err);
        return {
          success: false,
          error: errorMsg,
        };
      } finally {
        setLoading(false);
      }
    },
    [tonConnectUI],
  );

  return {
    mint,
    addAdmin,
    loading,
    error,
    clearError: () => setError(null),
  };
};
