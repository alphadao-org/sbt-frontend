import { useState, useEffect, useCallback, useRef } from "react";
import { useTonAddress } from "@tonconnect/ui-react";
import { contractService } from "@/lib/contract/contractService";
import { addressesEqual } from "@/lib/utils/address";
import type { ContractState } from "@/types";

export const useContractState = () => {
  const userAddress = useTonAddress();
  const [state, setState] = useState<ContractState | null>(null);
  const [isOwner, setIsOwner] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const refetchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const fetchState = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const contractState = await contractService.getState();
      setState(contractState);

      if (userAddress) {
        const owner = addressesEqual(userAddress, contractState.owner);
        setIsOwner(owner);

        const admin = await contractService.isAdmin(userAddress);
        setIsAdmin(admin || owner);
      } else {
        setIsOwner(false);
        setIsAdmin(false);
      }
    } catch (err: any) {
      setError(err?.message || "Failed to fetch contract state");
    } finally {
      setLoading(false);
    }
  }, [userAddress]);

  // Manual refetch on demand
  const refetch = useCallback(() => {
    fetchState();
  }, [fetchState]);

  // Poll for state changes (every 5 seconds) for up to 30 seconds after a mint
  const startPolling = useCallback((duration: number = 30000) => {
    // Clear existing polling
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
    }

    const startTime = Date.now();
    pollingIntervalRef.current = setInterval(() => {
      if (Date.now() - startTime > duration) {
        if (pollingIntervalRef.current) {
          clearInterval(pollingIntervalRef.current);
          pollingIntervalRef.current = null;
        }
      } else {
        fetchState();
      }
    }, 5000);
  }, [fetchState]);

  // Initial fetch on mount
  useEffect(() => {
    fetchState();
  }, [fetchState]);

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
      if (refetchTimeoutRef.current) {
        clearTimeout(refetchTimeoutRef.current);
      }
    };
  }, []);

  return {
    state,
    isOwner,
    isAdmin,
    loading,
    error,
    refetch,
    startPolling,
  };
};
