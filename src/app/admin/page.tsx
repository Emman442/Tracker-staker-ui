"use client";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Header } from "@/components/layout/Header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DollarSign, Users, Zap, Percent, Info } from "lucide-react";
import { formatNumber } from "@/helpers/formatNumber";
import { useProgram } from "@/hooks/use-program";
import { useWallet } from "@solana/wallet-adapter-react";
import { toast } from "sonner";
import { decimals, TRACKER_MINT } from "@/constants/constants";
import * as anchor from "@coral-xyz/anchor";
import {
  getOrCreateAssociatedTokenAccount,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import {
  PublicKey,
  SystemProgram,
} from "@solana/web3.js";
import { Label } from "recharts";
import { useSolanaConnection } from "@/hooks/useConnection";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

export default function AdminPage() {
   const { publicKey } = useWallet();
   const { program, provider } = useProgram();
   const connection = useSolanaConnection()
   const [globalState, setGlobalState] = useState({
     admin: "",
     platform_fee_bps: 0,
     platform_fee_vault: "",
   });

   const [stats, setStats] = useState({
     totalStaked: 0,
     totalStakers: 0,
     rewardRate: 0,
     rewardVaultBalance: 0,
   });

   const [fundAmount, setFundAmount] = useState(0);
   const [isCreating, setIsCreating] = useState(false);
   const [isFunding, setIsFunding] = useState(false);
   const [isWithdrawing, setIsWithdrawing] = useState(false);
   const [rewardRate, setRewardRate] = useState<number>();
   const [pdaExists, setPdaExists] = useState<boolean | null>(null);
   const [stakes, setStakes] = useState<any>([]);
   const [isCreatingGlobalState, setIsCreatingGlobalState] = useState(false);

   // Memoize all PDA calculations to prevent infinite re-renders
   const globalStatePDA = useMemo(() => {
     if (!program) return null;
     try {
       const [pda] = PublicKey.findProgramAddressSync(
         [Buffer.from("global_state")],
         program.programId
       );
       return pda;
     } catch (error) {
       console.error("Error calculating globalStatePDA:", error);
       return null;
     }
   }, [program]);

   const stakingPoolPda = useMemo(() => {
     if (!program || !provider?.wallet?.publicKey) return null;
     try {
       const [pda] = PublicKey.findProgramAddressSync(
         [
           Buffer.from("staking_pool"),
           provider.wallet.publicKey.toBuffer(),
           new PublicKey(TRACKER_MINT).toBuffer(),
         ],
         program.programId
       );
       return pda;
     } catch (error) {
       console.error("Error calculating stakingPoolPda:", error);
       return null;
     }
   }, [program, provider?.wallet?.publicKey]);

   const userStakePda = useMemo(() => {
     if (!program || !provider?.wallet?.publicKey || !stakingPoolPda)
       return null;
     try {
       const [pda] = PublicKey.findProgramAddressSync(
         [
           Buffer.from("user_stake"),
           provider.wallet.publicKey.toBuffer(),
           stakingPoolPda.toBuffer(),
         ],
         program.programId
       );
       return pda;
     } catch (error) {
       console.error("Error calculating userStakePda:", error);
       return null;
     }
   }, [program, provider?.wallet?.publicKey, stakingPoolPda]);

   const stakeVaultPda = useMemo(() => {
     if (!program || !stakingPoolPda) return null;
     try {
       const [pda] = PublicKey.findProgramAddressSync(
         [Buffer.from("stake_vault"), stakingPoolPda.toBuffer()],
         program.programId
       );
       return pda;
     } catch (error) {
       console.error("Error calculating stakeVaultPda:", error);
       return null;
     }
   }, [program, stakingPoolPda]);

   const rewardVaultPda = useMemo(() => {
     if (!program || !stakingPoolPda) return null;
     try {
       const [pda] = PublicKey.findProgramAddressSync(
         [Buffer.from("reward_vault"), stakingPoolPda.toBuffer()],
         program.programId
       );
       return pda;
     } catch (error) {
       console.error("Error calculating rewardVaultPda:", error);
       return null;
     }
   }, [program, stakingPoolPda]);

   // Memoize the PDA check function to prevent unnecessary calls
   const checkPda = useCallback(async () => {
     if (!program || !globalStatePDA) return;

     try {
       const account = await program.account.globalState.fetch(globalStatePDA);
       if (account) {
         setPdaExists(true);
         setGlobalState({
           admin: account.admin.toBase58(),
           platform_fee_bps: account.platformFeeBps,
           platform_fee_vault: account.platformFeeVault.toBase58(),
         });
       }
     } catch (err) {
       console.log("PDA does not exist yet:", err);
       setPdaExists(false);
     }
   }, [program, globalStatePDA]);

   // Memoize the fetch functions to prevent unnecessary calls
   const fetchTotalStakers = useCallback(async () => {
     if (!program) return;

     try {
       const account = await program.account.userStake.all();
       setStakes(account);
     } catch (err) {
       console.error("Error fetching total stakers:", err);
     }
   }, [program]);

   const fetchPoolDetails = useCallback(async () => {
     if (!program || !stakingPoolPda) return;

     try {
       const account = await program.account.stakingPool.fetch(stakingPoolPda);

       console.log("rateeee: ",Number(account.rewardRatePerTokenPerSecond))
       // Fetch reward vault token balance
       const rewardVaultInfo = await connection.getTokenAccountBalance(
         account.rewardVault
       );

       setStats({
         totalStaked: Number(account.totalStaked) / 10 ** decimals,
         totalStakers: Number(account.totalStakers),
         rewardRate: Number(account.rewardRatePerTokenPerSecond),
         rewardVaultBalance:
           Number(rewardVaultInfo.value.amount) / 10 ** decimals,
       });
     } catch (err) {
       console.error("Error fetching pool details:", err);
     }
   }, [program, stakingPoolPda, connection]);

   useEffect(() => {
     checkPda();
   }, [checkPda]);

   useEffect(() => {
     fetchTotalStakers();
   }, [fetchTotalStakers]);

   useEffect(() => {
     fetchPoolDetails();
   }, [fetchPoolDetails]);

   // Add loading state check
   if (!program || !provider) {
    return (
          <div className="flex min-h-screen flex-col bg-background text-foreground bg-[url('/supa-bg.svg')] bg-no-repeat bg-cover bg-center">
            <div className="absolute inset-0 bg-black/30"></div>
            <Header />
            <main className="flex flex-1 items-center justify-center ">
              <div className="flex flex-col items-center text-center max-w-md space-y-6">
                <h1 className="text-3xl md:text-4xl font-bold text-[#00FF9C]">
                  Welcome to the Admin Portal.
                </h1>
                <p className="text-gray-400 text-base md:text-lg">
                  {/* Stake your <span className="font-semibold">$TRACKER</span> tokens */}
                  Please Connect your wallet to create a staking pool and get started.
                </p>
                <WalletMultiButton
                  style={{
                    background: "transparent",
                    height: "36px",
                    fontSize: "12px",
                    borderRadius: "8px",
                    cursor: "pointer",
                    color: "#00E6B8",
                    border: "1px solid #00E6B8",
                  }}
                />
              </div>
            </main>
          </div>
        );
   }

   const calculateExampleReward = () => {
     if (!rewardRate) return "0";
     if (Number(rewardRate) <= 0) return "0";

     try {
       const tokensStaked = 100;
       const secondsIn30Days = 30 * 24 * 60 * 60;
       const totalReward =
         (((Number(rewardRate) * tokensStaked) / 10 ** decimals!) *
           secondsIn30Days) /
         10 ** 4;
       return totalReward.toLocaleString(undefined, {
         maximumFractionDigits: 2,
       });
     } catch (error) {
       console.error("Error calculating example reward:", error);
       return "0";
     }
   };

   const handleFundPool = async () => {
     if (
       !program ||
       !publicKey ||
       !provider ||
       !stakingPoolPda ||
       !rewardVaultPda
     ) {
       toast.error("Missing required dependencies");
       return;
     }

     if (!fundAmount || fundAmount <= 0) {
       toast.info("Fund Amount must be greater than 0!");
       return;
     }

     try {
       setIsFunding(true);

       const stakeAccount = await getOrCreateAssociatedTokenAccount(
         provider.connection,
         provider.wallet.payer!,
         new PublicKey(TRACKER_MINT),
         provider.wallet.publicKey
       );

       const tx = await program.methods
         .fundRewardPool(new anchor.BN(fundAmount * 10 ** decimals))
         .accounts({
           funder: provider.wallet.publicKey,
           stakingPool: stakingPoolPda,
           funderRewardAccount: stakeAccount.address,
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
           toast.success("Rewards pool funded Successfully!", {
             cancel: {
               label: "View Transaction",
               onClick: () =>
                 window.open(
                   `https://solscan.io/tx/${tx}`,
                   "_blank"
                 ),
             },
           });
           // Refresh pool details
           fetchPoolDetails();
           setFundAmount(0);
           return;
         }
       }
     } catch (err) {
       console.error("Error funding pool:", err);
       toast.error("Something went wrong while funding the pool");
     } finally {
       setIsFunding(false);
     }
   };

   const handleCreateGlobalState = async () => {
     if (!program || !publicKey || !globalStatePDA) {
       toast.error("Missing required dependencies");
       return;
     }

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
       toast.success("Global State Initialized successfully", {
         cancel: {
           label: "View Transaction",
           onClick: () =>
             window.open(
               `https://solscan.io/tx/${tx}`,
               "_blank"
             ),
         },
       });
     } catch (error) {
       console.error("Error creating global state:", error);
       toast.error(`Failed to Create Global State: ${error}`);
     } finally {
       setIsCreatingGlobalState(false);
     }
   };

   const handleCreateStakingPool = async () => {
     if (
       !program ||
       !provider ||
       !stakingPoolPda ||
       !rewardVaultPda ||
       !stakeVaultPda
     ) {
       toast.error("Missing required dependencies");
       return;
     }

     if (!rewardRate || rewardRate <= 0) {
       toast.error("Please enter a valid reward rate");
       return;
     }

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
           stakeVault: stakeVaultPda,
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
       const eventLog = logs?.find((l: any) => l.startsWith("Program data:"));

       if (eventLog) {
         const encoded = eventLog.replace("Program data: ", "");
         const decoded = program.coder.events.decode(encoded);

         if (decoded?.name === "poolCreated") {
           toast.success("Stake pool initialized successfully!", {
             cancel: {
               label: "View Transaction",
               onClick: () =>
                 window.open(
                   `https://solscan.io/tx/${tx}`,
                   "_blank"
                 ),
             },
           });
           // Refresh data
           fetchPoolDetails();
           return;
         }
       }
     } catch (error) {
       console.error("Error creating staking pool:", error);
       toast.error("Error Initializing Stake pool");
     } finally {
       setIsCreating(false);
     }
   };

   const handleWithdraw = async () => {
     if (
       !program ||
       !provider ||
       !stakingPoolPda ||
       !rewardVaultPda ||
       !globalStatePDA
     ) {
       toast.error("Missing required dependencies");
       return;
     }

     try {
       setIsWithdrawing(true);

       const stakeAccount = await getOrCreateAssociatedTokenAccount(
         provider.connection,
         provider.wallet.payer!,
         new PublicKey(TRACKER_MINT),
         provider.wallet.publicKey
       );

       const tx = await program.methods
         .withdrawRewardsFromPool(new anchor.BN(rewardRate || 0))
         .accounts({
           //@ts-ignore
           admin: provider.wallet.publicKey,
           stakingPool: stakingPoolPda,
           creatorRewardAccount: stakeAccount.address,
           //@ts-ignore
           globalState: globalStatePDA,
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
       const eventLog = logs?.find((l: any) => l.startsWith("Program data:"));

       if (eventLog) {
         const encoded = eventLog.replace("Program data: ", "");
         const decoded = program.coder.events.decode(encoded);

         if (decoded?.name === "remainingClaimed") {
           toast.success("Remaining funds withdrawn successfully!", {
             cancel: {
               label: "View Transaction",
               onClick: () =>
                 window.open(
                   `https://solscan.io/tx/${tx}`,
                   "_blank"
                 ),
             },
           });
           // Refresh data
           fetchPoolDetails();
           return;
         }
       }
     } catch (error) {
       console.error("Error withdrawing funds:", error);
       toast.error("Error withdrawing remaining funds");
     } finally {
       setIsWithdrawing(false);
     }
   };
  return (
    <div className="flex min-h-screen w-full flex-col bg-background text-foreground bg-[url('/TRACKER-bg.svg')] bg-no-repeat bg-top bg-contain">
      <Header />
      <main className="flex-1 p-4 md:p-8">
        <div className="mx-auto w-full max-w-6xl space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-[#00FF9C]">Admin Panel</h1>
            <p className="text-muted-foreground">
              Manage the staking pool and rewards.
            </p>
          </div>

          {/* Stats */}
          <div className="grid gap-6 md:grid-cols-4 lg:grid-cols-4">
            <StatCard
              title="Total Staked"
              value={formatNumber(stats.totalStaked)}
              icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
              subtitle="TRACKER tokens currently staked"
            />
            <StatCard
              title="Total Stakers"
              value={formatNumber(stakes?.length) || 0}
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
              value={`${(globalState?.platform_fee_bps || 0) / 100}%`}
              icon={<Percent className="h-4 w-4 text-muted-foreground" />}
              subtitle={`Platform Fee BPS`}
            />
          </div>

          {/* Admin Form */}

          <div className="flex gap-5 md:gap-1 justify-center pt-12 flex-col md:flex-row">
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
                    <Input
                      id="admin"
                      value={globalState.admin}
                      readOnly
                      className="focus:outline-none border-none-outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="platform-fee">Platform Fee (BPS)</Label>
                    <Input
                      id="platform-fee"
                      type="number"
                      value={globalState.platform_fee_bps}
                      className="focus:outline-none border-none-outline-none"
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
                      className="focus:outline-none border-none-outline-none"
                    />
                  </div>

                  <div className="flex justify-end">
                    <Button
                      className="button-glow bg-[#00FF9C] hover:bg-[#00FF9C]/30"
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
              <Card className="bg-secondary/30 backdrop-blur-sm card-glow">
                <CardHeader>
                  <CardTitle>Pool Configuration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Input
                    type="number"
                    step="0.0001"
                    placeholder="Enter new reward rate e.g 100, 1000, 10000"
                    className="bg-background/50 focus:outline-none"
                    value={rewardRate}
                    onChange={(e) => setRewardRate(Number(e.target.value))}
                  />
                
                  <Button
                    className="w-full bg-[#00FF9C] hover:bg-[#00FF9C]/30"
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
              <Card className="bg-secondary/30 backdrop-blur-sm card-glow">
                <CardHeader>
                  <CardTitle>Reward Vault</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold">Current Balance</h3>
                      <p className="text-3xl font-bold text-[#00FF9C]">
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
                          className="bg-background/50 focus:outline-none border-none-outline-none"
                        />
                        <Button
                          className="w-full bg-[#00FF9C] hover:bg-[#00FF9C]/30"
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
                          className="bg-background/50 focus:outline-none border-none-outline-none"
                        />
                        <Button
                          variant="secondary"
                          className="w-full bg-[#00FF9C] hover:bg-[#00FF9C]/30"
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
    <Card className="backdrop-blur-sm  bg-[#00302C] border border-[#00FF9C]/30">
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
