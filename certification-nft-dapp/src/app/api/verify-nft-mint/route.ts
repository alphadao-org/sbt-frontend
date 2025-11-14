import { NextRequest, NextResponse } from "next/server";
import { verifyNFTMint } from "@/lib/taskVerification";

export async function POST(request: NextRequest) {
  try {
    const { userAddress } = await request.json();

    if (!userAddress) {
      return NextResponse.json(
        { success: false, message: "User address is required" },
        { status: 400 }
      );
    }

    const result = await verifyNFTMint(userAddress);

    return NextResponse.json(result);
  } catch (error) {
    console.error("NFT verification error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to verify NFT mint" },
      { status: 500 }
    );
  }
}
