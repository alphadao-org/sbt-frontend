import { useState, useEffect, useCallback } from "react";
import { contractService } from "@/lib/contract/contractService";

export interface MintedNFT {
  id: bigint;
  student: string;
  metadata: string;
}

export const useMintedNFTs = (userAddress?: string | null) => {
  const [nfts, setNfts] = useState<MintedNFT[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserNFTs = useCallback(async () => {
    if (!userAddress) {
      setNfts([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const contractState = await contractService.getState();

      if (!contractState || contractState.total <= 0) {
        setNfts([]);
        return;
      }

      const userNFTs: MintedNFT[] = [];

      // Iterate through NFT IDs and find ones owned by user
      // Limit to checking last 50 minted NFTs to avoid expensive iterations
      const startId = BigInt(Math.max(1, Number(contractState.total) - 49));

      for (let i = startId; i <= BigInt(contractState.total); i++) {
        try {
          const token = await contractService.getToken(BigInt(i));
          if (token && token.student.toLowerCase() === userAddress.toLowerCase()) {
            userNFTs.push({
              id: token.id,
              student: token.student,
              metadata: token.metadata,
            });
          }
        } catch (_e) {
          // Continue if NFT fetch fails
          continue;
        }
      }

      setNfts(userNFTs.reverse()); // Show newest first
    } catch (err) {
      console.error("Failed to fetch user NFTs:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch NFTs");
    } finally {
      setLoading(false);
    }
  }, [userAddress]);

  const refetch = useCallback(() => {
    fetchUserNFTs();
  }, [fetchUserNFTs]);

  useEffect(() => {
    fetchUserNFTs();
  }, [fetchUserNFTs]);

  return {
    nfts,
    loading,
    error,
    refetch,
  };
};
