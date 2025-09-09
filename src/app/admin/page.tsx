"use client";

import React, { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DollarSign, Users, Zap, Percent } from "lucide-react";
import { formatNumber } from "@/helpers/formatNumber";
import { useProgram } from "@/hooks/use-program";
import { useWallet } from "@solana/wallet-adapter-react";
import { toast } from "sonner";
import { decimals, TRACKER_MINT } from "@/constants/constants";
import * as anchor from "@coral-xyz/anchor";
import { getOrCreateAssociatedTokenAccount, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { clusterApiUrl, Connection, PublicKey, SystemProgram } from "@solana/web3.js";
import { Label } from "recharts";

export default function AdminPage() {
  const { publicKey } = useWallet();
  const { program, provider } = useProgram();
  const connection = new Connection(clusterApiUrl("devnet"), {
    commitment: "confirmed",
  });
 const [globalState, setGlobalState] = useState({
   admin: "",
   platform_fee_bps: 0,
   // total_pools_created: 0,
   platform_fee_vault: "",
 });
  const [fundAmount, setFundAmount] = useState(0);
  const [isCreating, setIsCreating] = useState(false);
  const [isFunding, setIsFunding] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [isUpdatingSettings, setIsUpdatingSettings] = useState(false);
  const [rewardRate, setRewardRate] = useState<number>();
   const [pdaExists, setPdaExists] = useState<boolean | null>(null);
    const [isCreatingGlobalState, setIsCreatingGlobalState] = useState(false);
   const [globalStatePDA, _] = program
     ? PublicKey.findProgramAddressSync(
         [Buffer.from("global_state")],
         program.programId
       )
     : [null, null];

   useEffect(() => {
     const checkPda = async () => {
       if (!program || !globalStatePDA) return;

       try {
         const account = await program.account.globalState.fetch(
           globalStatePDA
         );
         if (account) {
           setPdaExists(true);
           setGlobalState({
             admin: account.admin.toBase58(),
             platform_fee_bps: account.platformFeeBps,
             platform_fee_vault: account.platformFeeVault.toBase58(),
           });
         }
       } catch (err) {
         // PDA does not exist yet
         setPdaExists(false);
       }
     };

     checkPda();
   }, [program, globalStatePDA]);
  const [stats, setStats] = useState({
    totalStaked: 0,
    totalStakers: 0,
    rewardRate: 0,
    platformFeeBps: 0,
    rewardVaultBalance: 0,
  });

   const handleCreateGlobalState = async () => {
     if (!program || !publicKey) return;
     try {
       setIsCreatingGlobalState(true);
       const tx = await program.methods
         .initializeGlobalState(new anchor.BN(globalState.platform_fee_bps))
         .accounts({
           admin: publicKey,
           //@ts-ignore
           global_state: globalStatePDA,
           platformFeeVault: publicKey,
           sytemProgram: anchor.web3.SystemProgram.programId,
         })
         .rpc();

       setPdaExists(true);
       setIsCreatingGlobalState(false);
       toast.success("Global State Initialized successfully", {
         cancel: {
           label: "View Transaction",
           onClick: () =>
             window.open(
               `https://solscan.io/tx/${tx}?cluster=devnet`,
               "_blank"
             ),
         },
       });
     } catch (error) {
      console.log(error)
       setIsCreatingGlobalState(false);
       toast.error(`Failed to Create Global State: ${error}`);
     } finally {
       setIsCreatingGlobalState(false);
     }
   };

  const [stakingPoolPda] =
    program && provider
      ? PublicKey.findProgramAddressSync(
          [
            Buffer.from("staking_pool"),
            provider.wallet.publicKey.toBuffer(),
            new PublicKey(TRACKER_MINT).toBuffer(),
          ],
          program.programId
        )
      : [PublicKey.default];

  const [userStakePda] =
    program && provider
      ? PublicKey.findProgramAddressSync(
          [
            Buffer.from("user_stake"),
            provider.wallet.publicKey.toBuffer(),
            stakingPoolPda.toBuffer(),
          ],
          program.programId
        )
      : [PublicKey.default];

  const [stakeVaultPda_] =
    program && provider
      ? PublicKey.findProgramAddressSync(
          [Buffer.from("stake_vault"), stakingPoolPda.toBuffer()],
          program.programId
        )
      : [PublicKey.default];

  const [rewardVaultPda] =
    program && provider
      ? PublicKey.findProgramAddressSync(
          [Buffer.from("reward_vault"), stakingPoolPda.toBuffer()],
          program.programId
        )
      : [PublicKey.default];


  if (!program || !provider) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-muted-foreground">Program not loaded yet...</p>
      </div>
    );
  }

  const handleFundPool = async () => {
    if (!program || !publicKey) return;
    if (!fundAmount) {
      toast.info("Fund Amount is Empty!");
      return;
    }

    const StakeAccount = await getOrCreateAssociatedTokenAccount(
      provider.connection,
      provider.wallet.payer!,
      new PublicKey(TRACKER_MINT),
      provider.wallet.publicKey
    );

    try {
      setIsFunding(true);
      const tx = await program.methods
        .fundRewardPool(new anchor.BN(fundAmount * 10 ** decimals))
        .accounts({
          funder: provider.wallet.publicKey,
          stakingPool: stakingPoolPda,
          funderRewardAccount: StakeAccount.address,
          //@ts-ignore
          rewardVault: rewardVaultPda,
          tokenProgram: anchor.utils.token.TOKEN_PROGRAM_ID,
        })
        .rpc();

      await new Promise((resolve) => setTimeout(resolve, 2000));

      const txDetails = await connection.getTransaction(tx, {
        commitment: "confirmed",
        maxSupportedTransactionVersion: 0,
      });

      if (!txDetails) {
        throw new Error("Transaction not found or not confirmed");
      }

      const logs = txDetails?.meta?.logMessages;
      const eventLog = logs?.find((l) => l.startsWith("Program data:"));

      if (eventLog) {
        const encoded = eventLog.replace("Program data: ", "");
        const decoded = program.coder.events.decode(encoded);

        if (decoded?.name === "poolFunded") {
          setIsFunding(false);
          toast.success("Rewards pool funded Succesfully!", {
            cancel: {
              label: "View Transaction",
              onClick: () =>
                window.open(
                  `https://solscan.io/tx/${tx}?cluster=devnet`,
                  "_blank"
                ),
            },
          });
          return;
        }
      }
      setIsFunding(false);
    } catch (err) {
      console.log(err);
      setIsFunding(false);
      toast.error(
        "Something Went Wrong while you were trying to fund the pool "
      );
    }
  };

  const handleCreateStakingPool = async () => {
    try {
      setIsCreating(true);
      const tx = await program.methods
        .createStakingPool(new anchor.BN(rewardRate))
        .accounts({
          //@ts-ignore
          stakingPool: stakingPoolPda,
          stakeTokenMint: new PublicKey(TRACKER_MINT),
          creator: provider.wallet.publicKey,
          rewardVault: rewardVaultPda,
          platformFeeVault: provider.publicKey,
          rewardTokenMint: new PublicKey(TRACKER_MINT),
          stakeVault: stakeVaultPda_,
          tokenProgram: TOKEN_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
        })
        .rpc();

      await new Promise((resolve) => setTimeout(resolve, 2000));

      const txDetails = await connection.getTransaction(tx, {
        commitment: "confirmed",
        maxSupportedTransactionVersion: 0,
      });

      if (!txDetails) {
        throw new Error("Transaction not found or not confirmed");
      }

      const logs = txDetails?.meta?.logMessages;
      const eventLog = logs?.find((l) => l.startsWith("Program data:"));

      if (eventLog) {
        const encoded = eventLog.replace("Program data: ", "");
        const decoded = program.coder.events.decode(encoded);

        if (decoded?.name === "poolCreated") {
          setIsCreating(false);
          toast.success("Stake pool initialized successfully!", {
            cancel: {
              label: "View Transaction",
              onClick: () =>
                window.open(
                  `https://solscan.io/tx/${tx}?cluster=devnet`,
                  "_blank"
                ),
            },
          });
          return;
        }
      }
      setIsCreating(false);
    } catch (error) {
      console.log(error);
      setIsCreating(false);
      toast.error("Error Initializing Stake pool");
    } finally {
      setIsCreating(false);
    }
  };

  function handleWithdraw() {
    setIsWithdrawing(true);
    setTimeout(() => setIsWithdrawing(false), 1500);
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-background text-foreground bg-[url('/TRACKER-bg.svg')] bg-no-repeat bg-top bg-contain">
      <Header />
      <main className="flex-1 p-4 md:p-8">
        <div className="mx-auto w-full max-w-6xl space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-primary">Admin Panel</h1>
            <p className="text-muted-foreground">
              Manage the staking pool and rewards.
            </p>
          </div>

          {/* Stats */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Total Staked"
              value={formatNumber(stats.totalStaked)}
              icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
              subtitle="TRACKER tokens currently staked"
            />
            <StatCard
              title="Total Stakers"
              value={formatNumber(stats.totalStakers)}
              icon={<Users className="h-4 w-4 text-muted-foreground" />}
              subtitle="Active stakers in the pool"
            />
            <StatCard
              title="Reward Rate"
              value={stats.rewardRate}
              icon={<Zap className="h-4 w-4 text-muted-foreground" />}
              subtitle="TRACKER/token/sec"
            />
            <StatCard
              title="Platform Fee"
              value={`${stats.platformFeeBps / 100}%`}
              icon={<Percent className="h-4 w-4 text-muted-foreground" />}
              subtitle={`${stats.platformFeeBps} BPS`}
            />
          </div>

          {/* Admin Form */}

          <div className="flex gap-2 justify-center pt-12">
            <section className=" max-w-2xl mx-auto">
              <Card className="bg-secondary/30 backdrop-blur-sm card-glow">
                <CardHeader>
                  <CardTitle>Global State</CardTitle>
                  <CardDescription>
                    These settings affect the entire platform. Be careful with
                    changes.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="admin">Admin Address</Label>
                    <Input id="admin" value={globalState.admin} readOnly />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="platform-fee">Platform Fee (BPS)</Label>
                    <Input
                      id="platform-fee"
                      type="number"
                      value={globalState.platform_fee_bps}
                      // readOnly
                      onChange={(e) => {
                        setGlobalState({
                          ...globalState,
                          platform_fee_bps: Number(e.target.value),
                        });
                      }}
                    />
                    <p className="text-xs text-muted-foreground">
                      Basis points. 100 BPS = 1%.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fee-vault">Platform Fee Vault</Label>
                    <Input
                      id="fee-vault"
                      value={globalState.platform_fee_vault}
                      readOnly
                    />
                  </div>
             
                  <div className="flex justify-end">
                    <Button
                      className="button-glow"
                      onClick={handleCreateGlobalState}
                      disabled={isCreatingGlobalState || pdaExists === null}
                    >
                      {pdaExists === null && "Loading..."}
                      {pdaExists !== null &&
                        !isCreatingGlobalState &&
                        (pdaExists ? "Update" : "Create")}
                      {isCreatingGlobalState && "Creating..."}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Actions */}
            <div className="grid gap-6 md:grid-cols-1">
              <Card className="bg-card/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Pool Configuration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Input
                    type="number"
                    step="0.0001"
                    placeholder="Enter new reward rate"
                    className="bg-background/50"
                    value={rewardRate}
                    onChange={(e) => setRewardRate(Number(e.target.value))}
                  />
                  <Button
                    className="w-full"
                    disabled={isCreating}
                    onClick={handleCreateStakingPool}
                  >
                    {isCreating
                      ? "Creating Staking Pool..."
                      : "Create Staking pool"}
                  </Button>
                </CardContent>
              </Card>

              {/* Reward Vault - move this DOWN */}
              <Card className="bg-card/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Reward Vault</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold">Current Balance</h3>
                      <p className="text-3xl font-bold text-primary">
                        {formatNumber(stats.rewardVaultBalance)} TRACKER
                      </p>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      {/* Fund */}
                      <div className="space-y-2">
                        <Input
                          type="number"
                          placeholder="Enter amount to fund"
                          value={fundAmount || ""}
                          onChange={(e) =>
                            setFundAmount(Number(e.target.value))
                          }
                          className="bg-background/50"
                        />
                        <Button
                          className="w-full"
                          disabled={isFunding}
                          onClick={handleFundPool}
                        >
                          {isFunding ? "Funding..." : "Fund Reward Pool"}
                        </Button>
                      </div>

                      {/* Withdraw */}
                      <div className="space-y-2">
                        <Input
                          type="number"
                          placeholder="Enter amount to withdraw"
                          className="bg-background/50"
                        />
                        <Button
                          variant="secondary"
                          className="w-full"
                          disabled={isWithdrawing}
                          onClick={handleWithdraw}
                        >
                          {isWithdrawing
                            ? "Withdrawing..."
                            : "Withdraw Remaining Funds"}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

/* Extracted stat card for DRYness */
function StatCard({
  title,
  value,
  subtitle,
  icon,
}: {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ReactNode;
}) {
  return (
    <Card className="bg-card/80 backdrop-blur-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{subtitle}</p>
      </CardContent>
    </Card>
  );
}
