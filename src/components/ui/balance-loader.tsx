// BalanceLoader.tsx
import React from "react";

export function BalanceLoader({
  isLoading,
  balance,
}: {
  isLoading: boolean;
  balance: number | null;
}) {
  return isLoading ? (
    <div className="w-16 h-4 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 rounded animate-shimmer" />
  ) : (
    <span className="text-white font-medium">
      {balance !== null ? balance.toLocaleString() : "--"} TRACKER
    </span>
  );
}
