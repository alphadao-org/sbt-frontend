import { Award, Loader2, CheckCircle, ExternalLink } from "lucide-react";
import { type FormEvent, useState } from "react";
import { useContract } from "@/hooks/useContract";
import { useContractState } from "@/hooks/useContractState";
import { validateAddress } from "@/lib/utils/address";

interface MintFormProps {
  onSuccess?: () => void;
}

export const MintForm = ({ onSuccess }: MintFormProps) => {
  const [address, setAddress] = useState("");
  const [validationError, setValidationError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [lastMintedTokenId, setLastMintedTokenId] = useState<number | null>(null);
  const { mint, loading, error } = useContract();
  const { refetch, startPolling, state } = useContractState();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setValidationError("");
    setSuccessMessage("");

    if (!address.trim()) {
      setValidationError("Enter student address");
      return;
    }

    if (!validateAddress(address)) {
      setValidationError("Invalid TON address");
      return;
    }

    // Record current token count before mint
    const previousTokenCount = state?.total || 0;

    const result = await mint(address, () => {
      // Immediately start polling for state updates
      console.log("Transaction sent, starting to poll for state changes...");
      startPolling(30000); // Poll for 30 seconds
    });

    if (result.success) {
      setAddress("");
      
      // Set success message
      setSuccessMessage(`✅ Mint transaction sent! Waiting for blockchain confirmation...`);
      
      // Wait a bit then check if nextId increased
      setTimeout(async () => {
        try {
          await refetch();
          const newTokenCount = state?.total || previousTokenCount;
          
          if (newTokenCount > previousTokenCount) {
            const newTokenId = previousTokenCount + 1;
            setLastMintedTokenId(newTokenId);
            setSuccessMessage(
              `✅ NFT Minted! Token ID: #${newTokenId} for ${address.slice(0, 6)}...${address.slice(-4)}`
            );
            onSuccess?.();
          }
        } catch (err) {
          console.error("Error refreshing state:", err);
        }
      }, 2000);

      // Clear success after 5 seconds
      setTimeout(() => {
        setSuccessMessage("");
        setLastMintedTokenId(null);
      }, 8000);
    }
  };

  return (
    <div className="bg-gray-800 rounded-xl shadow-md border border-gray-700 p-4 sm:p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-pink-900/50 rounded-lg">
          <Award className="w-6 h-6 text-pink-300" />
        </div>
        <div>
          <h2 className="text-xl font-bold">Mint Certificate</h2>
          <p className="text-sm text-gray-400">Admin only</p>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="student-address"
            className="block text-sm font-medium text-gray-300 mb-2"
          >
            Student Address
          </label>
          <input
            id="student-address"
            type="text"
            value={address}
            onChange={(e) => {
              setAddress(e.target.value);
              setValidationError("");
            }}
            placeholder="Enter student address to mint..."
            className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-shadow text-white placeholder-gray-500"
            disabled={loading}
          />
          {validationError && (
            <p className="mt-1 text-sm text-red-400">{validationError}</p>
          )}
        </div>
        {error && (
          <div className="p-3 bg-red-900/50 border border-red-700 rounded-lg">
            <p className="text-sm text-red-300">{error}</p>
          </div>
        )}
        {successMessage && (
          <div className="p-3 bg-green-900/50 border border-green-700 rounded-lg flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
            <p className="text-sm text-green-300">{successMessage}</p>
          </div>
        )}
        {lastMintedTokenId && (
          <div className="p-3 bg-blue-900/50 border border-blue-700 rounded-lg">
            <a
              href={`https://testnet.tonscan.org/nft/${lastMintedTokenId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-300 hover:text-blue-200 flex items-center gap-2 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              View on TON Explorer
            </a>
          </div>
        )}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-pink-600 hover:bg-pink-700 disabled:bg-gray-700 text-white font-medium py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" /> Minting...
            </>
          ) : (
            <>
              <Award className="w-5 h-5" /> Mint Certificate
            </>
          )}
        </button>
      </form>
    </div>
  );
};
