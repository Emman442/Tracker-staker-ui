"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { Header } from "@/components/layout/Header";
import { Progress } from "@/components/ui/progress";
import { formatDate } from "@/helpers/formatDate";
import {
  clusterApiUrl,
  Connection,
  PublicKey,
  SystemProgram,
} from "@solana/web3.js";
import { useAnchorWallet, useWallet } from "@solana/wallet-adapter-react";
import { AnchorProvider, BN } from "@coral-xyz/anchor";
import { useFetchActivity } from "@/hooks/useFetchActivity";
import { useProgram } from "@/hooks/use-program";
import { decimals, TRACKER_MINT } from "@/constants/constants";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import {
  getOrCreateAssociatedTokenAccount,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { getTokenBalance } from "@/helpers/getTokenBalance";
import { ExternalLink } from "lucide-react";
import { truncateHash } from "@/helpers/truncateHash";
import Link from "next/link";
import { usePostData } from "@/hooks/usePostData";
import { formatNumber } from "@/helpers/formatNumber";

export default function StakingPage() {
  const { publicKey } = useWallet();
  const wallet = useAnchorWallet();
  const { program } = useProgram();
  const { mutate } = usePostData();
  const [stakedBalance, setStakedBalance] = useState(24960000);
  const [tokenBalace, setTokenBalance] = useState<number>(0);
  const [globalState, setGlobalState] = useState<any>(null);
  const [stakingPoolDetails, setStakingPooLDetails] = useState<any>(null);
  const totalStaked = 999720000;
  const [stakeDate, setStakeDate] = useState<Date | null>(new Date());
  const [isUnstaking, setIsUnstaking] = useState(false);
  const [isStaking, setIsStaking] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);
  const [stakeAmount, setStakeAmount] = useState(0);
  const [userDetails, setUserDetails] = useState<any>();
  const [lockupPeriod, setLockupPeriod] = useState(7);
  const [unstakeAmount, setUnstakeAmount] = useState(0);
  const [unstakeLockupPeriod, setUnstakeLockupPeriod] = useState("7");
  const src = "/seekerstake.jpeg";
  const connection = new Connection(clusterApiUrl("devnet"), {
    commitment: "confirmed",
  });
  const provider = new AnchorProvider(connection, wallet!, {
    preflightCommitment: "processed",
  });
  console.log("global state: ", globalState);

  const { data, isLoading, error } = useFetchActivity(publicKey, "TRACKER");
  const [globalStatePda, globalStatePdaBump] = useMemo(() => {
    if (!program) return [null, null];
    return PublicKey.findProgramAddressSync(
      [Buffer.from("global_state")],
      program.programId
    );
  }, [program]);
  const [stakingPoolPda, stakingPoolbump] = useMemo(() => {
    if (!program || !globalState?.admin) return [null, null];
    return PublicKey.findProgramAddressSync(
      [
        Buffer.from("staking_pool"),
        globalState.admin.toBuffer(),
        new PublicKey(TRACKER_MINT).toBuffer(),
      ],
      program.programId
    );
  }, [program?.programId, globalState]);
  const [stakeVaultPda, stakeVaultPdaBump] = useMemo(() => {
    if (!program || !stakingPoolPda) return [null, null];
    return PublicKey.findProgramAddressSync(
      [Buffer.from("stake_vault"), stakingPoolPda.toBuffer()],
      program.programId
    );
  }, [program, stakingPoolPda]);
  const [rewardVaultPda, rewardVaultPdaBump] = useMemo(() => {
    if (!program || !stakingPoolPda) return [null, null];
    return PublicKey.findProgramAddressSync(
      [Buffer.from("reward_vault"), stakingPoolPda.toBuffer()],
      program.programId
    );
  }, [program, stakingPoolPda]);
  useEffect(() => {
    const fetchTokenBal = async () => {
      if (!publicKey) return;

      try {
        const balance = await getTokenBalance(
          new PublicKey(publicKey),
          new PublicKey(TRACKER_MINT)
        );
        setTokenBalance(balance);
      } catch (err) {
        console.error("Error fetching token balance:", err);
      }
    };

    fetchTokenBal();
  }, [publicKey]);

  useEffect(() => {
    const fetchStakingPoolDetails = async () => {
      if (!publicKey || !stakingPoolPda) return;

      try {
        const details = await program?.account.stakingPool.fetch(
          stakingPoolPda!
        );
        console.log("details: ", details);
        setStakingPooLDetails(details);
      } catch (err) {
        console.error("Error fetching token balance:", err);
      }
    };

    fetchStakingPoolDetails();
  }, [publicKey, stakingPoolPda]);

  const [userStakePda, userStakePdaBump] = useMemo(() => {
    if (!program || !publicKey || !stakingPoolPda) return [null, null];
    return PublicKey.findProgramAddressSync(
      [
        Buffer.from("user_stake"),
        publicKey.toBuffer(),
        stakingPoolPda.toBuffer(),
      ],
      program.programId
    );
  }, [program, publicKey, stakingPoolPda]);

  useEffect(() => {
    const fetchGlobalState = async () => {
      if (!program || !globalStatePda) return;

      try {
        // Fetch the account data from the blockchain
        const poolAccount = await program.account.globalState.fetch(
          globalStatePda
        );
        setGlobalState(poolAccount);
      } catch (error) {
        console.error("Error fetching pool account:", error);
      }
    };

    fetchGlobalState();
  }, [program, globalStatePda]);

  useEffect(() => {
    const fetchUserStakeDetails = async () => {
      if (!userStakePda || !program) return;
      try {
        const details = await program.account.userStake.fetch(userStakePda);
        setUserDetails(details);
      } catch (err) {
        // If account doesn't exist, fallback to default values
        setUserDetails({
          amount: new BN(0),
          pendingRewards: new BN(0),
          lastUpdateTime: new BN(Math.floor(Date.now() / 1000)),
          lockupDuration: new BN(0),
          startTime: new BN(0),
        });
      }
    };

    fetchUserStakeDetails();
  }, [userStakePda, program]);

  if (!publicKey) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-400">
        <div className="flex flex-col gap-2 items-center">
          Please connect your wallet to continue
          <WalletMultiButton />
        </div>
      </div>
    );
  }

  const handleStake = async () => {
    setIsStaking(true);
    const stakeAccount = await getOrCreateAssociatedTokenAccount(
      provider.connection,
      provider.wallet.payer!,
      new PublicKey(TRACKER_MINT),
      provider.wallet.publicKey
    );
    if (!program || !publicKey) return;
    try {
      const lockupDuration = new BN(lockupPeriod * 24 * 60 * 60);
      const tx = await program.methods
        .stake(new BN(stakeAmount * 10 ** decimals), lockupDuration)
        .accounts({
          user: provider.wallet.publicKey,
          stakingPool: stakingPoolPda!,
          //@ts-ignore
          userStake: userStakePda,
          userStakeAccount: stakeAccount.address,
          stakeVault: stakeVaultPda,

          systemProgram: SystemProgram.programId,
          tokenProgram: TOKEN_PROGRAM_ID,
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

        if (decoded?.name === "tokensStaked") {
          setIsStaking(false);
          const newActivity = {
            user: publicKey.toString(),
            action: "stake",
            amount: stakeAmount,
            lock_time: no_of_days.toString(),
            timestamp: startTimeSec,
            transaction: tx,
            tokenSymbol: "TRACKER",
          };

          mutate(newActivity);
          toast.success("You've successfully staked your tokens!", {
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
    } catch (error) {
      console.log(error);
      setIsStaking(false);
      toast.error("Something went wrong, please try staking again");
    }
  };
  const handleUnstake = async () => {
    setIsUnstaking(true);
    const stakeAccount = await getOrCreateAssociatedTokenAccount(
      provider.connection,
      provider.wallet.payer!,
      new PublicKey(TRACKER_MINT),
      provider.wallet.publicKey
    );
    if (!program || !publicKey) return;
    try {
      const tx = await program.methods
        .unstake(new BN(unstakeAmount * 10 ** decimals))
        .accounts({
          // @ts-ignore
          userStake: userStakePda,
          user: provider.wallet.publicKey,
          stakingPool: stakingPoolPda!,
          userStakeAccount: stakeAccount.address,
          stakeVault: stakeVaultPda,
          tokenProgram: TOKEN_PROGRAM_ID,
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

        if (decoded?.name === "tokensUnstaked") {
          setIsUnstaking(false);
          const newActivity = {
            user: publicKey.toString(),
            action: "unstake",
            amount: unstakeAmount,
            // lockTime: null,
            timestamp: Math.floor(Date.now() / 1000),
            transaction: tx,
            tokenSymbol: "TRACKER",
          };

          mutate(newActivity);
          toast.success("You've successfully unstaked your tokens!", {
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
    } catch (error) {
      console.log(error);
      setIsUnstaking(false);
      toast.error("Something went wrong, please try unstaking again");
    }
  };
  const handleClaim = async () => {
    setIsClaiming(true);
    const stakeAccount = await getOrCreateAssociatedTokenAccount(
      provider.connection,
      provider.wallet.payer!,
      new PublicKey(TRACKER_MINT),
      provider.wallet.publicKey
    );

    const platformFeeVault = await getOrCreateAssociatedTokenAccount(
      provider.connection,
      provider.wallet.payer!,
      new PublicKey(TRACKER_MINT),
      new PublicKey(process.env.NEXT_PUBLIC_PLATFORM_FEE_VAULT!),
      true
    );
    if (!program || !publicKey) return;
    try {
      const tx = await program.methods
        .claimRewards()
        .accounts({
          user: provider.wallet.publicKey,
          stakingPool: stakingPoolPda!,
          userRewardAccount: stakeAccount.address,
          //@ts-ignore
          userStake: userStakePda,
          userStakeAccount: stakeAccount.address,
          stakeVault: stakeVaultPda,
          platformFeeVault: platformFeeVault.address,
          tokenProgram: TOKEN_PROGRAM_ID,
          rewardVault: rewardVaultPda,
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

        if (decoded?.name === "rewardsClaimed") {
          setIsClaiming(false);
          const newActivity = {
            action: "claim",
            user: publicKey.toString(),
            amount: claimable,
            // lockTime: null,
            timestamp: Math.floor(Date.now() / 1000),
            transaction: tx,
            tokenSymbol: "TRACKER",
          };
          mutate(newActivity);
          toast.success("You've successfully claimed your rewards!", {
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
    } catch (error) {
      console.log(error);
      setIsClaiming(false);
      toast.error("Something went wrong, please try claiming again");
    }
  };
  function calculateClaimable() {
    if (!userDetails || !stakingPoolDetails) return;
    const now = Math.floor(Date.now() / 1000); // seconds
    const timeElapsed = now - userDetails.lastUpdateTime.toNumber();
    const newRewards =
      timeElapsed *
      (userDetails?.amount.toNumber() / 10 ** decimals) *
      (stakingPoolDetails.rewardRatePerTokenPerSecond.toNumber() / 10000);

    console.log(timeElapsed);

    return userDetails?.pendingRewards.toNumber() + newRewards;
  }

  const lockupDurationSeconds = userDetails?.lockupDuration.toNumber();
  const no_of_days = lockupDurationSeconds / (24 * 60 * 60);
  const startTimeSec = userDetails?.startTime.toNumber();
  const endTimeSec = startTimeSec + lockupDurationSeconds;
  const endDate = new Date(endTimeSec * 1000);
  const nowSec = Math.floor(Date.now() / 1000);
  const canUnstake = unstakeAmount > 0 && nowSec >= endTimeSec;

  function calculateDailyReward(tokensStaked: number) {
    if (!stakingPoolDetails) return 0;
    const secondsInDay = 86400;
    return (
      ((stakingPoolDetails.rewardRatePerTokenPerSecond.toNumber() / 10000) *
        tokensStaked *
        secondsInDay) /
      10 ** decimals
    );
  }
  const claimable = calculateClaimable() / 10 ** decimals;
  const canClaim = claimable > 0;

  console.log("staking P D", stakingPoolDetails);

  return (
    <div className="flex min-h-screen w-full flex-col bg-background text-foreground bg-[url('/supa-bg.svg')] bg-no-repeat bg-top bg-contain">
      <Header />
      <main className="flex-1 p-4 md:p-8">
        <div className="mx-auto w-full max-w-6xl space-y-6">
          <Card className="bg-card/80 backdrop-blur-sm">
            <CardContent className="p-4 flex flex-col md:flex-row items-center justify-between gap-4">
              <h2 className="text-xl font-semibold">TRACKER Staking</h2>
              <div className="flex-1 w-full md:w-auto flex flex-col items-center">
                <div className="text-sm">
                  {formatNumber(
                    (stakingPoolDetails?.totalStaked ?? 0) /
                      10 ** (decimals ?? 0)
                  )}{" "}
                  /{" "}
                  {formatNumber(
                    (stakingPoolDetails?.maxPoolSize ?? 1_000_000_000_000) /
                      10 ** decimals
                  )}{" "}
                  STAKED
                </div>
                <Progress
                  value={
                    ((stakingPoolDetails?.totalStaked ?? 0) /
                      (stakingPoolDetails?.maxPoolSize ?? 1_000_000_000)) *
                    100
                  }
                  className="h-2 bg-primary/20 w-1/2"
                />
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">REWARD</p>
                <p className="font-semibold whitespace-nowrap">
                  {" "}
                  {calculateDailyReward(
                    userDetails?.amount.toNumber() / 10 ** decimals
                  ).toFixed(5) || 0}{" "}
                  TRACKER/day
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            <Card className="bg-gray-900/80 border border-gray-700">
              <CardHeader>
                <CardTitle>Stake</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Button
                    // variant="secondary"
                    variant="outline"
                    onClick={() => setLockupPeriod(7)}
                    className={`${
                      lockupPeriod === 7 ? "bg-primary/90" : ""
                    } hover:bg-primary/90 text-primary-foreground border-none text-white flex-1`}
                  >
                    7 days
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setLockupPeriod(30)}
                    className={`${
                      lockupPeriod === 30 ? "bg-primary" : ""
                    } border-none hover:bg-gray-800 flex-1`}
                  >
                    30 days
                  </Button>
                </div>
                <div className="border border-gray-700 rounded-md p-3 bg-gray-800/50">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">You stake</span>
                    <div className="flex gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs h-6 px-2 border-gray-600 hover:bg-gray-700"
                        onClick={() => setStakeAmount(tokenBalace)}
                      >
                        Max
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs h-6 px-2 border-gray-600 hover:bg-gray-700"
                        onClick={() => setStakeAmount(tokenBalace / 2)}
                      >
                        Half
                      </Button>
                    </div>
                  </div>
                  <div className="flex justify-between items-end mt-1">
                    <Input
                      type="number"
                      placeholder="0"
                      min="0"
                      className="bg-transparent border-none outline-none text-2xl font-bold p-0 h-auto focus-visible:ring-0"
                      value={stakeAmount}
                      onChange={(e) => {
                        setStakeAmount(Number(e.target.value));
                      }}
                    />
                    <div className="flex items-center gap-1 justify-center bg-primary text-primary-foreground px-3 py-1 rounded-md">
                      <Image
                        src={src}
                        width={24}
                        height={24}
                        alt="token"
                        className="rounded-full"
                        data-ai-hint="token icon"
                      />
                      <span className="font-bold">TRACKER</span>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 mt-2">
                    Balance: {tokenBalace} TRACKER
                  </div>
                </div>
                <Button
                  size="lg"
                  onClick={handleStake}
                  disabled={isStaking}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg"
                >
                  {isStaking ? "Staking..." : "Stake"}
                </Button>
              </CardContent>
            </Card>
            {/* Claim/Unstake Box */}
            <Card className="bg-gray-900/80 border border-gray-700">
              <CardHeader>
                <CardTitle>Claim / Unstake</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-gray-400">Your Locked Tokens</div>
                    <div className="text-2xl font-bold">
                      {(userDetails?.amount.toString() ?? 0) / 10 ** decimals}{" "}
                      TRACKER
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-400">Your Claimable Tokens</div>
                    <div className="text-2xl font-bold">
                      {claimable.toFixed(1)} TRACKER
                    </div>
                  </div>
                </div>
                <Button
                  size="lg"
                  className="w-full bg-gray-400 hover:bg-gray-600"
                  disabled={!canClaim}
                  onClick={handleClaim}
                >
                  {isClaiming ? "Claiming..." : "Claim"}
                </Button>

                <div className="border border-destructive/50 rounded-md p-3 bg-gray-800/50">
                  <div className="flex justify-between items-center text-sm">
                    <span>Unstake</span>
                    <span className="text-gray-400">
                      {no_of_days} days (
                      {formatDate(new Date(startTimeSec * 1000))} →{" "}
                      {formatDate(endDate)})
                    </span>
                  </div>
                  <div className="flex justify-between items-end mt-1">
                    <Input
                      value={unstakeAmount}
                      type="text"
                      placeholder="0"
                      className="bg-transparent border-none text-2xl font-bold p-0 h-auto focus-visible:ring-0"
                      defaultValue="0"
                    />
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs h-6 px-2 border-gray-600 hover:bg-gray-700"
                          onClick={() =>
                            setUnstakeAmount(
                              userDetails?.amount.toNumber() / 10 ** decimals
                            )
                          }
                        >
                          Max
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs h-6 px-2 border-gray-600 hover:bg-gray-700"
                          onClick={() =>
                            setUnstakeAmount(
                              userDetails?.amount.toNumber() /
                                10 ** decimals /
                                2
                            )
                          }
                        >
                          Half
                        </Button>
                      </div>
                      <div className="flex items-center justify-center gap-1 bg-destructive text-destructive-foreground px-4 py-1 rounded-md">
                        <Image
                          src={src}
                          width={24}
                          height={24}
                          alt="token"
                          className="rounded-full object-fit"
                          data-ai-hint="token icon"
                        />
                        <span className="font-bold">TRACKER</span>
                      </div>
                    </div>
                  </div>
                </div>
                <Button
                  size="lg"
                  className="w-full bg-gray-400 hover:bg-gray-600"
                  disabled={!canUnstake || isUnstaking}
                  onClick={handleUnstake}
                >
                  {isUnstaking ? "Unstaking..." : "Unstake"}
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8">
            <Card className="bg-gray-900/80 border border-gray-700">
              <CardHeader>
                <CardTitle>Your Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-700 hover:bg-gray-800/50">
                      <TableHead className="text-gray-400">Action</TableHead>
                      <TableHead className="text-gray-400">Amount</TableHead>
                      <TableHead className="text-gray-400">
                        Lock time - Date
                      </TableHead>
                      <TableHead className="text-gray-400">
                        Transaction
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {!data || data.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={4}
                          className="text-center text-gray-500 py-8"
                        >
                          No Activity yet!
                        </TableCell>
                      </TableRow>
                    ) : (
                      data.map((activity, idx) => (
                        <TableRow
                          key={idx}
                          className="border-gray-800 hover:bg-gray-800/30"
                        >
                          <TableCell>{activity.action}</TableCell>
                          <TableCell>{activity.amount.toFixed(5)}</TableCell>
                          <TableCell className="pl-2">
                            {activity.action === "stake" ? (
                              <>
                                {`${activity.lock_time} days - ${formatDate(
                                  new Date(activity.timestamp * 1000)
                                )}`}
                              </>
                            ) : (
                              formatDate(
                                new Date(activity.timestamp * 1000)
                              ) ?? <span className="pl-14">-</span>
                            )}
                          </TableCell>

                          <TableCell>
                            <a
                              href={`https://explorer.solana.com/tx/${activity.transaction}?cluster=devnet`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-400 hover:underline"
                            >
                              <Link
                                href={`https://solscan.io/tx/${activity.transaction}?cluster=devnet`}
                                className="flex items-center gap-1 hover:text-primary transition-colors"
                              >
                                {truncateHash(activity.transaction)}
                                <ExternalLink className="h-4 w-4" />
                              </Link>
                            </a>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
