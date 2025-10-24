"use client";
import { TonConnectButton, useTonAddress } from "@tonconnect/ui-react";
import { Shield, User, CheckCircle, BookOpen, Trophy, Star, Zap, Award } from "lucide-react";
import { useState } from "react";
import { AddAdminForm } from "@/components/AddAdminForm";
import { CertificateShelf } from "@/components/CertificateShelf";
import { ContractState } from "@/components/ContractState";
import { MintForm } from "@/components/MintForm";
import { NFTScanner } from "@/components/NFTScanner";
import { TokenViewer } from "@/components/TokenViewer";
import { useContractState } from "@/hooks/useContractState";
import { CONTRACT_ADDRESS } from "@/lib/constants";

export default function Home() {
  const userAddress = useTonAddress();
  const { isOwner, isAdmin, refetch } = useContractState();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [courseProgress, setCourseProgress] = useState({
    blockchain: false,
    ton: false,
    nfts: false,
  });
  const [showAlphaNotification, setShowAlphaNotification] = useState(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState(true);

  const completedCourses = Object.values(courseProgress).filter(Boolean).length;
  const totalCourses = Object.keys(courseProgress).length;
  const progressPercentage = (completedCourses / totalCourses) * 100;

  const handleTransactionSuccess = (message: string) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(null), 5000);
    setTimeout(refetch, 3000);
  };

  const handleDisconnect = () => {
    if (typeof window === "undefined") return;
    try {
      Object.keys(localStorage).forEach((key) => {
        const k = key.toLowerCase();
        if (
          k.includes("tonconnect") ||
          k.includes("ton-connect") ||
          k.includes("ton:")
        ) {
          localStorage.removeItem(key);
        }
      });
      localStorage.removeItem("tonconnect");
    } catch (_e) {}
    setTimeout(() => location.reload(), 150);
  };

  const handleMarkAsRead = (course: keyof typeof courseProgress) => {
    setCourseProgress(prev => {
      const updated = { ...prev, [course]: true };
      // Check if all courses are completed
      if (Object.values(updated).every(complete => complete)) {
        setTimeout(() => setShowAlphaNotification(true), 500);
      }
      return updated;
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-purple-900 text-white antialiased">
      {/* Welcome Modal */}
      {showWelcomeModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/95 backdrop-blur-md">
          <div className="bg-gray-800 p-8 rounded-2xl max-w-md mx-4 text-center border border-gray-700 shadow-2xl">
            <div className="mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Welcome to ALPHA DAO</h2>
              <p className="text-gray-400 text-sm">
                Enter the alpha matrix! Complete our Web3 knowledge vault to unlock your alpha status and join the revolution.
              </p>
            </div>
            <button
              onClick={() => setShowWelcomeModal(false)}
              className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium rounded-lg transition-all transform hover:scale-105"
            >
              Get Started
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-50 bg-black/60 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <img
              src="/Daologo.png"
              alt="CertificationNFT logo"
              className="w-8 h-8"
            />
            <div>
              <h1 className="text-lg sm:text-2xl font-extrabold tracking-tight">
                ALPHA DAO
              </h1>
              <p className="text-xs sm:text-sm text-gray-400">Web3 Certification Mintplace</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {userAddress && (
              <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-gray-800">
                {isOwner && (
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-purple-300 bg-purple-900/50 px-2 py-0.5 rounded">
                    <Shield className="w-3 h-3" />
                    Owner
                  </span>
                )}
                {isAdmin && !isOwner && (
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-pink-300 bg-pink-900/50 px-2 py-0.5 rounded">
                    <User className="w-3 h-3" />
                    Admin
                  </span>
                )}
              </div>
            )}
            <div className="rounded-xl overflow-hidden shadow-md ring-1 ring-gray-700">
              <div className="bg-gray-900 p-1">
                <TonConnectButton />
              </div>
            </div>
            {userAddress && (
              <button
                type="button"
                onClick={handleDisconnect}
                className="px-3 py-2 text-sm font-medium rounded-lg bg-red-900/50 text-red-300 hover:bg-red-900 transition-shadow shadow-sm"
              >
                Disconnect
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Progress Dashboard */}
        <section className="mb-8">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-400" />
                  Learning Progress
                </h2>
                <p className="text-sm text-gray-400">Complete all courses to unlock your alpha status and join the elite</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-purple-400">{completedCourses}/{totalCourses}</div>
                <div className="text-sm text-gray-400">Courses Completed</div>
              </div>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-3 mb-4">
              <div
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Progress: {Math.round(progressPercentage)}%</span>
              {completedCourses === totalCourses && (
                <span className="text-green-400 flex items-center gap-1">
                  <Award className="w-4 h-4" />
                  Alpha Status Unlocked!
                </span>
              )}
            </div>
          </div>
        </section>

        {successMessage && (
          <div className="fixed inset-x-4 top-20 z-50 mx-auto max-w-md p-3 rounded-xl bg-green-900/80 border border-green-700 shadow-lg">
            <p className="text-green-200 font-medium text-sm text-center">
              {successMessage}
            </p>
          </div>
        )}

        {showAlphaNotification && (
          <div className="fixed inset-x-4 top-20 z-50 mx-auto max-w-md p-4 rounded-xl bg-gradient-to-r from-purple-900/80 to-pink-900/80 border border-purple-700 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                <Trophy className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-white font-bold text-sm">🎉 Achievement Unlocked!</p>
                <p className="text-purple-200 text-xs">You are now an Alpha learner!</p>
              </div>
            </div>
          </div>
        )}

        <section id="contract-state" className="mb-8">
          <ContractState />
        </section>

        <section id="certificate-gallery" className="mb-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold">
                Alpha Vault
              </h2>
              <p className="text-sm text-gray-400">
                Freshly minted alpha certifications from our Web3 pioneers
              </p>
            </div>
          </div>
          <CertificateShelf />
        </section>

        {userAddress && (isAdmin || isOwner) && (
          <section id="admin-dashboard" className="mb-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold">
                  Alpha Command Center
                </h2>
                <p className="text-sm text-gray-400">
                  Forge new alpha certifications and expand the DAO
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {isAdmin && (
                <MintForm
                  onSuccess={() =>
                    handleTransactionSuccess("Certificate minted!")
                  }
                />
              )}
              {(isOwner || isAdmin) && (
                <AddAdminForm
                  onSuccess={() => handleTransactionSuccess("Admin added!")}
                />
              )}
            </div>
          </section>
        )}

        <section id="nft-scanner" className="mb-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold">
                NFT Blockchain Scanner
              </h2>
              <p className="text-sm text-gray-400">Scan all minted certificates on the TON blockchain</p>
            </div>
          </div>
          <NFTScanner />
        </section>

        <section id="certificate-explorer" className="mb-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold">
                Alpha Oracle
              </h2>
              <p className="text-sm text-gray-400">Query the blockchain oracle to verify alpha certifications</p>
            </div>
          </div>
          <TokenViewer />
        </section>

        {!userAddress && (
          <section className="p-6 bg-gray-800 rounded-2xl text-center mb-8 shadow-lg border border-gray-700">
            <div className="max-w-xl mx-auto">
              <img
                src="/Daologo.png"
                alt="CertificationNFT logo"
                className="w-12 h-12 mx-auto mb-4"
              />
              <h3 className="text-lg sm:text-2xl font-bold mb-2">
                Enter the Alpha Matrix
              </h3>
              <p className="text-sm text-gray-400 mb-4">
                Connect your wallet to join the alpha revolution. Mint certifications, claim rewards, and shape the future of Web3.
              </p>
              <div className="flex justify-center">
                <div className="rounded-xl overflow-hidden shadow-lg ring-1 ring-gray-700">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-0.5 rounded-xl">
                    <div className="bg-gray-900 p-2 rounded-lg">
                      <TonConnectButton />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        <section className="mt-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold mb-2">
              Why Join ALPHA DAO?
            </h2>
            <p className="text-sm sm:text-lg text-gray-400">
              The ultimate Web3 certification ecosystem on TON
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="bg-gray-800 p-5 rounded-xl shadow-md border border-gray-700 hover:shadow-xl transition-all">
              <div className="p-3 bg-purple-900/50 rounded-lg w-fit mb-4">
                <svg
                  className="w-6 h-6 text-purple-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="font-semibold mb-2">Immutable Alpha Proof</h3>
              <p className="text-sm text-gray-400">Your certifications are forever etched in the TON blockchain.</p>
            </div>
            {/* Similar for other cards, with pink/green accents */}
            <div className="bg-gray-800 p-5 rounded-xl shadow-md border border-gray-700 hover:shadow-xl transition-all">
              <div className="p-3 bg-pink-900/50 rounded-lg w-fit mb-4">
                <Shield className="w-6 h-6 text-pink-300" />
              </div>
              <h3 className="font-semibold mb-2">DAO Governance</h3>
              <p className="text-sm text-gray-400">Alpha members control the future of Web3 certification standards.</p>
            </div>
            <div className="bg-gray-800 p-5 rounded-xl shadow-md border border-gray-700 hover:shadow-xl transition-all">
              <div className="p-3 bg-green-900/50 rounded-lg w-fit mb-4">
                <User className="w-6 h-6 text-green-300" />
              </div>
              <h3 className="font-semibold mb-2">True Ownership</h3>
              <p className="text-sm text-gray-400">
                Your alpha certifications live in your wallet, not on some centralized database.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500/10 to-pink-500/10 px-4 py-2 rounded-full border border-purple-500/20 mb-4">
              <Zap className="w-4 h-4 text-purple-400" />
              <span className="text-sm font-medium text-purple-300">Interactive Learning</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-3 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Alpha Knowledge Vault
            </h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Level up your Web3 IQ! Master blockchain fundamentals, TON ecosystem mastery, and NFT sorcery through our interactive alpha training program
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className={`bg-gray-800 p-6 rounded-xl shadow-lg border transition-all duration-300 hover:scale-105 ${
              courseProgress.blockchain
                ? 'border-green-500 bg-gradient-to-br from-gray-800 to-green-900/20'
                : 'border-gray-700 hover:border-purple-500 hover:shadow-purple-500/10'
            }`}>
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg w-fit transition-all ${
                  courseProgress.blockchain
                    ? 'bg-green-900/50'
                    : 'bg-purple-900/50'
                }`}>
                  <svg
                    className={`w-6 h-6 transition-colors ${
                      courseProgress.blockchain ? 'text-green-300' : 'text-purple-300'
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    />
                  </svg>
                </div>
                {courseProgress.blockchain && (
                  <div className="flex items-center gap-1 bg-green-900/50 px-2 py-1 rounded-full">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-xs text-green-300 font-medium">Done</span>
                  </div>
                )}
              </div>
              <h3 className="font-bold text-lg mb-3">Blockchain Basics: The Alpha Foundation</h3>
              <p className="text-sm text-gray-400 mb-6 leading-relaxed">
                Unleash the power of decentralized ledgers! Learn how blockchain creates immutable, transparent transactions that cut out the middlemen and put power back in your hands.
              </p>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <BookOpen className="w-3 h-3" />
                  <span>5 min read</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-yellow-400">
                  <Star className="w-3 h-3 fill-current" />
                  <span>Beginner</span>
                </div>
              </div>
              <button
                onClick={() => handleMarkAsRead('blockchain')}
                disabled={courseProgress.blockchain}
                className={`w-full px-4 py-3 text-sm font-medium rounded-lg transition-all transform ${
                  courseProgress.blockchain
                    ? 'bg-green-600 text-white cursor-not-allowed'
                    : 'bg-purple-600 hover:bg-purple-700 text-white hover:scale-105 shadow-lg hover:shadow-purple-500/25'
                }`}
              >
                {courseProgress.blockchain ? (
                  <span className="flex items-center justify-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Completed
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    Mark as Read
                  </span>
                )}
              </button>
            </div>

            <div className={`bg-gray-800 p-6 rounded-xl shadow-lg border transition-all duration-300 hover:scale-105 ${
              courseProgress.ton
                ? 'border-green-500 bg-gradient-to-br from-gray-800 to-green-900/20'
                : 'border-gray-700 hover:border-pink-500 hover:shadow-pink-500/10'
            }`}>
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg w-fit transition-all ${
                  courseProgress.ton
                    ? 'bg-green-900/50'
                    : 'bg-pink-900/50'
                }`}>
                  <svg
                    className={`w-6 h-6 transition-colors ${
                      courseProgress.ton ? 'text-green-300' : 'text-pink-300'
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                {courseProgress.ton && (
                  <div className="flex items-center gap-1 bg-green-900/50 px-2 py-1 rounded-full">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-xs text-green-300 font-medium">Done</span>
                  </div>
                )}
              </div>
              <h3 className="font-bold text-lg mb-3">TON Mastery: Lightning-Fast Blockchain</h3>
              <p className="text-sm text-gray-400 mb-6 leading-relaxed">
                Dominate the decentralized space! Dive deep into TON's revolutionary architecture - instant transactions, infinite scalability, and smart contracts that actually work.
              </p>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <BookOpen className="w-3 h-3" />
                  <span>7 min read</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-yellow-400">
                  <Star className="w-3 h-3 fill-current" />
                  <span>Intermediate</span>
                </div>
              </div>
              <button
                onClick={() => handleMarkAsRead('ton')}
                disabled={courseProgress.ton}
                className={`w-full px-4 py-3 text-sm font-medium rounded-lg transition-all transform ${
                  courseProgress.ton
                    ? 'bg-green-600 text-white cursor-not-allowed'
                    : 'bg-pink-600 hover:bg-pink-700 text-white hover:scale-105 shadow-lg hover:shadow-pink-500/25'
                }`}
              >
                {courseProgress.ton ? (
                  <span className="flex items-center justify-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Completed
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    Mark as Read
                  </span>
                )}
              </button>
            </div>

            <div className={`bg-gray-800 p-6 rounded-xl shadow-lg border transition-all duration-300 hover:scale-105 ${
              courseProgress.nfts
                ? 'border-green-500 bg-gradient-to-br from-gray-800 to-green-900/20'
                : 'border-gray-700 hover:border-green-500 hover:shadow-green-500/10'
            }`}>
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg w-fit transition-all ${
                  courseProgress.nfts
                    ? 'bg-green-900/50'
                    : 'bg-green-900/50'
                }`}>
                  <svg
                    className={`w-6 h-6 transition-colors ${
                      courseProgress.nfts ? 'text-green-300' : 'text-green-300'
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                {courseProgress.nfts && (
                  <div className="flex items-center gap-1 bg-green-900/50 px-2 py-1 rounded-full">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-xs text-green-300 font-medium">Done</span>
                  </div>
                )}
              </div>
              <h3 className="font-bold text-lg mb-3">NFT Sorcery: Digital Ownership Revolution</h3>
              <p className="text-sm text-gray-400 mb-6 leading-relaxed">
                Become an NFT wizard! Master the art of digital scarcity, provenance, and true ownership. Turn your achievements into legendary artifacts that live forever on the blockchain.
              </p>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <BookOpen className="w-3 h-3" />
                  <span>6 min read</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-yellow-400">
                  <Star className="w-3 h-3 fill-current" />
                  <span>Advanced</span>
                </div>
              </div>
              <button
                onClick={() => handleMarkAsRead('nfts')}
                disabled={courseProgress.nfts}
                className={`w-full px-4 py-3 text-sm font-medium rounded-lg transition-all transform ${
                  courseProgress.nfts
                    ? 'bg-green-600 text-white cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700 text-white hover:scale-105 shadow-lg hover:shadow-green-500/25'
                }`}
              >
                {courseProgress.nfts ? (
                  <span className="flex items-center justify-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Completed
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    Mark as Read
                  </span>
                )}
              </button>
            </div>
          </div>
        </section>
      </main>

      <footer className="mt-12 py-8 border-t bg-black/80 backdrop-blur-sm border-gray-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-6">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <img
                  src="/Daologo.png"
                  alt="ALPHA DAO logo"
                  className="w-5 h-5"
                />
                <span className="text-lg font-bold">ALPHA DAO</span>
              </div>
              <p className="text-sm text-gray-400 mb-4">
                The premier Web3 certification mintplace on TON blockchain. Mint your expertise, claim your alpha status.
              </p>
              <div className="flex items-center gap-2 text-sm">
                <span className="font-medium text-gray-300">Contract:</span>
                <code className="text-xs bg-gray-800 px-3 py-1.5 rounded-lg font-mono">
                  {CONTRACT_ADDRESS.slice(0, 8)}...{CONTRACT_ADDRESS.slice(-6)}
                </code>
                <a
                  href={`https://testnet.tonviewer.com/${CONTRACT_ADDRESS}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-purple-400 hover:text-purple-300 transition-colors"
                >
                  <span>View on TON Explorer</span>
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            </div>
            {/* Platform and Resources lists with hover:text-purple-300 */}
            <div>
              <h3 className="font-semibold mb-3">Platform</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="#contract-state" className="hover:text-purple-300">
                    Explore
                  </a>
                </li>
                {/* ... */}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Resources</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a
                    href="https://docs.ton.org"
                    target="_blank"
                    className="hover:text-purple-300"
                  >
                    TON Docs
                  </a>
                </li>
                {/* ... */}
              </ul>
            </div>
          </div>
          <div className="pt-6 border-t border-gray-800 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-400">
              © 2025 ALPHA DAO. Forging the future of Web3 certification.
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span>TON Testnet</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
