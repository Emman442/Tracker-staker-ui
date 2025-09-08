'use client';

import React, { useState, useEffect } from 'react';
import {
  ArrowDown,
  ArrowUp,
  Box,
  Coins,
  Gift,
  Lock,
  Users,
  Wallet,
  Calendar,
  Zap,
} from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { add, format, differenceInDays, isAfter } from 'date-fns';

import { ensureUnstakingValidity } from '@/ai/flows/ensure-unstaking-validity';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Header } from '@/components/layout/Header';

const stakeFormSchema = z.object({
  amount: z
    .number({ invalid_type_error: 'Please enter a valid number.' })
    .positive({ message: 'Amount must be positive.' })
    .min(1, { message: 'You must stake at least 1 $TRACKER.' }),
});

type StakeFormValues = z.infer<typeof stakeFormSchema>;

const LOCKUP_PERIOD_DAYS = 30;

export default function StakingPage() {
  const [isClient, setIsClient] = useState(false);
  const [userTrackerBalance, setUserTrackerBalance] = useState(1000);
  const [stakedBalance, setStakedBalance] = useState(0);
  const [stakeDate, setStakeDate] = useState<Date | null>(null);
  const [pendingRewards, setPendingRewards] = useState(0);
  const [isUnstaking, setIsUnstaking] = useState(false);
  const [isStaking, setIsStaking] = useState(false);
  const { toast } = useToast();

  const unlockDate = stakeDate
    ? add(stakeDate, { days: LOCKUP_PERIOD_DAYS })
    : null;

  useEffect(() => {
    setIsClient(true);
    if (stakedBalance > 0) {
      const interval = setInterval(() => {
        setPendingRewards((prev) => prev + stakedBalance * 0.001);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [stakedBalance]);

  const stakeForm = useForm<StakeFormValues>({
    resolver: zodResolver(stakeFormSchema),
    defaultValues: { amount: 0 },
  });

  function handleStake(data: StakeFormValues) {
    if (data.amount > userTrackerBalance) {
      toast({
        variant: 'destructive',
        title: 'Insufficient Balance',
        description: 'You do not have enough $TRACKER to stake this amount.',
      });
      return;
    }
    setIsStaking(true);
    setTimeout(() => {
      setUserTrackerBalance((prev) => prev - data.amount);
      setStakedBalance((prev) => prev + data.amount);
      setStakeDate(new Date());
      toast({
        title: 'Stake Successful',
        description: `You have successfully staked ${data.amount} $TRACKER.`,
      });
      stakeForm.reset();
      setIsStaking(false);
    }, 1000);
  }

  async function handleUnstake() {
    setIsUnstaking(true);
    if (!stakeDate) {
      toast({
        variant: 'destructive',
        title: 'Unstake Error',
        description: 'No stake date found.',
      });
      setIsUnstaking(false);
      return;
    }

    try {
      const result = await ensureUnstakingValidity({
        unstakeRequestDate: stakeDate.toISOString(),
        lockupPeriodDays: LOCKUP_PERIOD_DAYS,
        currentDate: new Date().toISOString(),
        stakedBalance: stakedBalance,
      });

      if (result.isValid) {
        setUserTrackerBalance((prev) => prev + result.unlockedBalance);
        setStakedBalance(0);
        setPendingRewards(0);
        setStakeDate(null);
        toast({
          title: 'Unstake Successful',
          description: `You have successfully unstaked ${result.unlockedBalance} $TRACKER.`,
        });
      } else {
        toast({
          variant: 'destructive',
          title: 'Unstake Failed',
          description: result.reason || 'Lockup period has not expired.',
        });
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Unstake Error',
        description: 'An unexpected error occurred during unstaking.',
      });
    } finally {
      setIsUnstaking(false);
    }
  }

  function handleClaimRewards() {
    setUserTrackerBalance((prev) => prev + pendingRewards);
    setPendingRewards(0);
    toast({
      title: 'Rewards Claimed',
      description: `You have successfully claimed ${pendingRewards.toFixed(
        4
      )} $TRACKER.`,
    });
  }

  const daysRemaining =
    unlockDate && isClient
      ? differenceInDays(unlockDate, new Date())
      : LOCKUP_PERIOD_DAYS;

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="mx-auto grid w-full max-w-6xl gap-2">
          <h1 className="text-3xl font-semibold font-headline">
            Staking Dashboard
          </h1>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 w-full max-w-6xl mx-auto">
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="font-headline text-primary">
                Your Wallet
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Balance</span>
                <span className="font-bold font-code">
                  {userTrackerBalance.toLocaleString()} $TRACKER
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Staked</span>
                <span className="font-bold font-code text-primary">
                  {stakedBalance.toLocaleString()} $TRACKER
                </span>
              </div>
            </CardContent>
          </Card>
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="font-headline text-accent">
                Pool Details
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Box className="w-5 h-5 text-accent" />
                <span>Total Staked: <strong>1,234,567 $TRACKER</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-accent" />
                <span>Total Stakers: <strong>4,321</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-accent" />
                <span>Lockup: <strong>{LOCKUP_PERIOD_DAYS} days</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Gift className="w-5 h-5 text-accent" />
                <span>Rewards/Day: <strong>~0.1%</strong></span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2 w-full max-w-6xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Stake / Unstake</CardTitle>
              <CardDescription>
                Manage your staked $TRACKER tokens.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="stake">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="stake">Stake</TabsTrigger>
                  <TabsTrigger value="unstake">Unstake</TabsTrigger>
                </TabsList>
                <TabsContent value="stake">
                  <Form {...stakeForm}>
                    <form
                      onSubmit={stakeForm.handleSubmit(handleStake)}
                      className="space-y-6 pt-4"
                    >
                      <FormField
                        control={stakeForm.control}
                        name="amount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Amount to Stake</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Coins className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                <Input
                                  type="number"
                                  placeholder="0.00"
                                  className="pl-10"
                                  {...field}
                                  onChange={(e) =>
                                    field.onChange(parseFloat(e.target.value))
                                  }
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button type="submit" className="w-full" disabled={isStaking}>
                        {isStaking ? "Staking..." : "Stake"}
                        <ArrowDown className="ml-2 h-4 w-4" />
                      </Button>
                    </form>
                  </Form>
                </TabsContent>
                <TabsContent value="unstake">
                  <div className="space-y-4 pt-4 text-center">
                    <p className="text-lg font-medium">
                      Your Staked Balance:
                    </p>
                    <p className="text-3xl font-bold font-code text-primary">
                      {stakedBalance.toLocaleString()} $TRACKER
                    </p>
                    {isClient && unlockDate && stakedBalance > 0 && (
                      <div className="text-sm text-muted-foreground space-y-1">
                        <div className="flex items-center justify-center gap-2">
                           <Calendar className="w-4 h-4"/>
                           <span>Staked on: {format(stakeDate!, 'PP')}</span>
                        </div>
                        <div className="flex items-center justify-center gap-2">
                          <Lock className="w-4 h-4"/>
                          <span>Unlock date: {format(unlockDate, 'PP')}</span>
                        </div>
                        <div className="flex items-center justify-center gap-2">
                          <Zap className="w-4 h-4"/>
                           <span>
                          {daysRemaining > 0
                            ? `~${daysRemaining} day(s) remaining`
                            : 'Ready to unstake'}
                          </span>
                        </div>
                      </div>
                    )}
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={handleUnstake}
                      disabled={stakedBalance === 0 || isUnstaking}
                    >
                      {isUnstaking ? 'Unstaking...' : 'Unstake All'}
                      <ArrowUp className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Claim Rewards</CardTitle>
              <CardDescription>
                Collect your earned $TRACKER rewards.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center gap-4 text-center">
              <p className="text-muted-foreground">Pending Rewards</p>
              <p className="text-4xl font-bold font-code text-accent">
                {pendingRewards.toFixed(4)}
              </p>
            </CardContent>
            <CardFooter>
              <Button
                onClick={handleClaimRewards}
                className="w-full"
                disabled={pendingRewards === 0}
                variant="secondary"
              >
                Claim Rewards
                <Gift className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  );
}
