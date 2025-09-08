'use client';

import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {toast} from "sonner"
import { Header } from '@/components/layout/Header';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { formatDate } from '@/helpers/formatDate';


const TrackerIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 2L2 7L12 12L22 7L12 2Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M2 17L12 22L22 17"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M2 12L12 17L22 12"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const activities = [
  {
    action: 'Stake',
    amount: '10,000 SUPA',
    lockTime: '7 days',
    date: '2024-08-01 10:30',
    transaction: '0x123...abc',
  },
  {
    action: 'Unstake',
    amount: '5,000 SUPA',
    lockTime: 'N/A',
    date: '2024-08-08 11:00',
    transaction: '0x456...def',
  },
];

export default function StakingPage() {
  const [userTrackerBalance, setUserTrackerBalance] = useState(100000);
  const [stakedBalance, setStakedBalance] = useState(24960000);
  const [tokenBalace, setTokenBalance] = useState(2)
  const totalStaked = 999720000;
  const [stakeDate, setStakeDate] = useState<Date | null>(new Date());
  const [isUnstaking, setIsUnstaking] = useState(false);
  const [isStaking, setIsStaking] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false)
  const [stakeAmount, setStakeAmount] = useState(0)

  const [lockupPeriod, setLockupPeriod] = useState(7);
  const [unstakeAmount, setUnstakeAmount] = useState(0);
  const [unstakeLockupPeriod, setUnstakeLockupPeriod] = useState('7');
  const src =
    "https://ipfs.io/ipfs/QmNZyZtUf61FQkNB1L39zENFDHQcsC9mE8JssQssQcscP7";

    const handleStake = async()=>{}
    const handleUnstake = async()=>{}
    const handleClaim = async()=>{}
    const claimable = 200000
    const canClaim = claimable>0


  return (
    <div className="flex min-h-screen w-full flex-col bg-background text-foreground bg-[url('/supa-bg.svg')] bg-no-repeat bg-top bg-contain">
      <Header />
      <main className="flex-1 p-4 md:p-8">
        <div className="mx-auto w-full max-w-6xl space-y-6">
          <Card className="bg-card/80 backdrop-blur-sm">
            <CardContent className="p-4 flex flex-col md:flex-row items-center justify-between gap-4">
              <h2 className="text-xl font-semibold">Supa Staking</h2>
              <div className="flex-1 w-full md:w-auto flex flex-col items-center">
                <div className="text-sm">
                  {/* {formatNumber(stakedBalance)}/{formatNumber(totalStaked)}{" "} */}
                  STAKED
                </div>
                <Progress
                  value={(stakedBalance / totalStaked) * 100}
                  className="h-2 bg-primary/20 w-1/2"
                />
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">REWARD</p>
                <p className="font-semibold whitespace-nowrap">0 SUPA/day</p>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            {/* <Card className="bg-card/80 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Stake</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      LOCK TIME
                    </span>
                    <Button
                      variant={lockupPeriod === 7 ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setLockupPeriod(7)}
                      className="rounded-lg"
                    >
                      7 days
                    </Button>
                    <Button
                      variant={lockupPeriod === 30 ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setLockupPeriod(30)}
                      className="rounded-lg"
                    >
                      30 days
                    </Button>
                  </div>
                </div>

                <Form {...stakeForm}>
                  <form
                    // onSubmit={stakeForm.handleSubmit(handleStake)}
                    className="space-y-4"
                  >
                    <div className="border border-primary rounded-lg p-3 bg-background/50">
                      <FormField
                        control={stakeForm.control}
                        name="amount"
                        render={({ field }) => (
                          <FormItem>
                            <div className="flex justify-between items-center">
                              <div>
                                <span className="text-xs text-muted-foreground">
                                  You stake
                                </span>
                                <FormControl>
                                  <Input
                                    type="number"
                                    placeholder="0"
                                    className="bg-transparent border-none text-2xl p-0 h-auto focus-visible:ring-0 focus-visible:ring-offset-0"
                                    {...field}
                                    onChange={e =>
                                      field.onChange(
                                        parseFloat(e.target.value) || 0
                                      )
                                    }
                                  />
                                </FormControl>
                                <span className="text-xs text-muted-foreground">
                                  Balance: {userTrackerBalance.toLocaleString()}{' '}
                                  SUPA
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className='flex flex-col gap-1'>
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="outline"
                                  className="rounded-md h-6 text-xs px-2"
                                  onClick={() =>
                                    stakeForm.setValue(
                                      'amount',
                                      userTrackerBalance
                                    )
                                  }
                                >
                                  Max
                                </Button>
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="outline"
                                  className="rounded-md h-6 text-xs px-2"
                                  onClick={() =>
                                    stakeForm.setValue(
                                      'amount',
                                      userTrackerBalance / 2
                                    )
                                  }
                                >
                                  Half
                                </Button>
                                </div>
                                <Button
                                  size="sm"
                                  className="bg-primary text-primary-foreground pointer-events-none rounded-md"
                                >
                                  <TrackerIcon />
                                  SUPA
                                </Button>
                              </div>
                            </div>
                             <FormMessage className="text-xs"/>
                          </FormItem>
                        )}
                      />
                    </div>
                    <Button
                      type="submit"
                      size="lg"
                      className="w-full text-lg font-bold"
                      disabled={isStaking}
                    >
                      {isStaking ? 'Staking...' : 'Stake'}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card> */}
            <Card className="bg-gray-900/80 border border-gray-700">
              <CardHeader>
                <CardTitle>Stake</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Button
                    // variant="secondary"
                    variant="outline"
                    // onClick={() => setLockupDuration(7)}
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
                      {/* <span className="font-bold">{pool.tokenSymbol || 2}</span> */}
                      <span className="font-bold">USDC</span>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 mt-2">
                    {/* Balance: {tokenBalace} {pool.tokenSymbol} */}
                    Balance: 2 $TRACKER
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

            {/* <Card className="bg-card/80 backdrop-blur-sm">
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold mb-4">Claim</h3>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Your Locked Tokens
                    </p>
                    <p className="text-xl font-semibold">
                      {stakedBalance > 0 ? stakedBalance.toLocaleString() : 0}{" "}
                      SUPA
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Your Claimable Tokens
                    </p>
                    <p className="text-xl font-semibold">0 SUPA</p>
                  </div>
                </div>
                <Button className="w-full mb-4" variant="secondary" disabled>
                  Claim
                </Button>

                <Form {...unstakeForm}>
                  <form
                    // onSubmit={unstakeForm.handleSubmit(handleUnstake)}
                    className="space-y-4"
                  >
                    <div className="border border-destructive rounded-lg p-3 bg-background/50">
                      <FormField
                        control={unstakeForm.control}
                        name="unstakeAmount"
                        render={({ field }) => (
                          <FormItem>
                            <div className="flex justify-between items-center text-xs mb-1">
                              <label className="font-medium">Unstake</label>
                              <div className="flex items-center gap-2">
                                <Select
                                  value={unstakeLockupPeriod}
                                  onValueChange={setUnstakeLockupPeriod}
                                  disabled={stakedBalance <= 0}
                                >
                                  <SelectTrigger className="w-[80px] h-6 text-xs">
                                    <SelectValue placeholder="Days" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="7">7 days</SelectItem>
                                    <SelectItem value="30">30 days</SelectItem>
                                  </SelectContent>
                                </Select>
                                {unlockDate && stakedBalance > 0 && (
                                  <span className="text-muted-foreground text-xs">
                                    ({format(unlockDate, "dd/MM/yyyy HH:mm")})
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="flex justify-between items-center">
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="0"
                                  className="bg-transparent border-none text-2xl p-0 h-auto focus-visible:ring-0 focus-visible:ring-offset-0 text-white"
                                  {...field}
                                  onChange={(e) =>
                                    field.onChange(
                                      parseFloat(e.target.value) || 0
                                    )
                                  }
                                />
                              </FormControl>
                              <div className="flex items-center gap-2">
                                <div className="flex flex-col gap-1">
                                  <Button
                                    type="button"
                                    size="sm"
                                    variant="outline"
                                    className="rounded-md h-6 text-xs px-2"
                                    onClick={() =>
                                      unstakeForm.setValue(
                                        "unstakeAmount",
                                        stakedBalance
                                      )
                                    }
                                  >
                                    Max
                                  </Button>
                                  <Button
                                    type="button"
                                    size="sm"
                                    variant="outline"
                                    className="rounded-md h-6 text-xs px-2"
                                    onClick={() =>
                                      unstakeForm.setValue(
                                        "unstakeAmount",
                                        stakedBalance / 2
                                      )
                                    }
                                  >
                                    Half
                                  </Button>
                                </div>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  className="pointer-events-none rounded-md"
                                >
                                  <TrackerIcon />
                                  SUPA
                                </Button>
                              </div>
                            </div>
                            <FormMessage className="text-xs" />
                          </FormItem>
                        )}
                      />
                    </div>
                    <Button
                      type="submit"
                      variant="secondary"
                      size="lg"
                      className="w-full text-lg font-bold"
                      disabled={isUnstaking || stakedBalance <= 0}
                    >
                      {isUnstaking ? "Unstaking..." : "Unstake"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card> */}
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
                      {/* {(userDetails?.amount.toString() ?? 0) /
                        10 ** poolDetails?.decimals}{" "}
                      {pool.tokenSymbol} */}

                      10000 $TRACKER
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-400">Your Claimable Tokens</div>
                    <div className="text-2xl font-bold">
                      {claimable.toFixed(5)} $TRACKER
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
                      {/* {no_of_days} days (
                      {formatDate(new Date(startTimeSec * 1000))} →{" "}
                      {formatDate(endDate)}) */}
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
                              // userDetails?.amount.toNumber() /
                              //   10 ** poolDetails?.decimals
                              2
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
                              // userDetails?.amount.toNumber() /
                              //   10 ** poolDetails?.decimals /
                              //   2
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
                          width={20}
                          height={20}
                          alt="token"
                          className="rounded-full"
                          data-ai-hint="token icon"
                        />
                        <span className="font-bold">$TRACKER</span>
                      </div>
                    </div>
                  </div>
                </div>
                <Button
                  size="lg"
                  className="w-full bg-gray-400 hover:bg-gray-600"
                  disabled={unstakeAmount <= 0}
                  onClick={handleUnstake}
                >
                  {isUnstaking ? "Unstaking..." : "Unstake"}
                </Button>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-card/80 backdrop-blur-sm">
            <CardContent className="p-4">
              <h3 className="text-lg font-semibold mb-4">Your activity</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Action</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Lock time - Date</TableHead>
                    <TableHead>Transaction</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activities.map((activity, index) => (
                    <TableRow key={index}>
                      <TableCell>{activity.action}</TableCell>
                      <TableCell>{activity.amount}</TableCell>
                      <TableCell>
                        {activity.lockTime} - {activity.date}
                      </TableCell>
                      <TableCell className="text-primary">
                        {activity.transaction}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
