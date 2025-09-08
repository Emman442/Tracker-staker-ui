'use client';

import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { add, format, differenceInDays } from 'date-fns';

import { ensureUnstakingValidity } from '@/ai/flows/ensure-unstaking-validity';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Header } from '@/components/layout/Header';
import { Progress } from '@/components/ui/progress';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';

const stakeFormSchema = z.object({
  amount: z
    .number({ invalid_type_error: 'Please enter a valid number.' })
    .positive({ message: 'Amount must be positive.' })
    .min(0.000001, { message: 'Amount is too small.' }),
});

type StakeFormValues = z.infer<typeof stakeFormSchema>;

const unstakeFormSchema = z.object({
  amount: z
    .number({ invalid_type_error: 'Please enter a valid number.' })
    .positive({ message: 'Amount must be positive.' })
    .min(0.000001, { message: 'Amount is too small.' }),
});

type UnstakeFormValues = z.infer<typeof unstakeFormSchema>;

const UsdcIconSm = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
        <path d="M12.9248 7.375H10.1648V8.695H12.8048C13.2948 8.695 13.6348 8.785 13.8248 8.965C14.0148 9.145 14.1098 9.425 14.1098 9.805C14.1098 10.185 14.0148 10.465 13.8248 10.645C13.6348 10.825 13.2948 10.915 12.8048 10.915H9.68477V12.235H12.9248C13.4148 12.235 13.7548 12.325 13.9448 12.505C14.1348 12.685 14.2298 12.965 14.2298 13.345C14.2298 13.725 14.1348 14.005 13.9448 14.185C13.7548 14.365 13.4148 14.455 12.9248 14.455H10.1648V15.775H12.9248C13.8448 15.775 14.5348 15.545 14.9948 15.085C15.4548 14.625 15.6848 13.995 15.6848 13.195C15.6848 12.445 15.4648 11.835 15.0248 11.365C14.5848 10.895 13.9448 10.66 13.1048 10.66C13.9548 10.59 14.6098 10.355 15.0698 9.955C15.5298 9.555 15.7598 8.975 15.7598 8.215C15.7598 7.425 15.4948 6.795 14.9648 6.325C14.4348 5.855 13.7348 5.625 12.8648 5.625H8.70477V17.525H10.1648V16.205H12.9248C13.8448 16.205 14.5448 16.435 15.0248 16.9C15.5048 17.365 15.7448 17.995 15.7448 18.79H17.1848V7.375H12.9248Z" fill="currentColor"/>
    </svg>
)

export default function StakingPage() {
  const [userTrackerBalance, setUserTrackerBalance] = useState(9.990478);
  const [stakedBalance, setStakedBalance] = useState(0);
  const [stakeDate, setStakeDate] = useState<Date | null>(null);
  const [isUnstaking, setIsUnstaking] = useState(false);
  const [isStaking, setIsStaking] = useState(false);
  const { toast } = useToast();
  const [lockupPeriod, setLockupPeriod] = useState(7);

  const stakeForm = useForm<StakeFormValues>({
    resolver: zodResolver(stakeFormSchema),
  });

  const unstakeForm = useForm<UnstakeFormValues>({
    resolver: zodResolver(unstakeFormSchema),
  });

  const unlockDate = stakeDate ? add(stakeDate, { days: lockupPeriod }) : null;

  function handleStake(data: StakeFormValues) {
    if (data.amount > userTrackerBalance) {
      toast({
        variant: 'destructive',
        title: 'Insufficient Balance',
        description: 'You do not have enough USDC to stake this amount.',
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
        description: `You have successfully staked ${data.amount} USDC.`,
      });
      stakeForm.reset({ amount: 0 });
      setIsStaking(false);
    }, 1000);
  }

  async function handleUnstake(data: UnstakeFormValues) {
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
    if (data.amount > stakedBalance) {
      toast({
        variant: 'destructive',
        title: 'Unstake Error',
        description: 'Amount exceeds staked balance.',
      });
      setIsUnstaking(false);
      return;
    }

    try {
      const result = await ensureUnstakingValidity({
        unstakeRequestDate: stakeDate.toISOString(),
        lockupPeriodDays: lockupPeriod,
        currentDate: new Date().toISOString(),
        stakedBalance: data.amount,
      });

      if (result.isValid) {
        setUserTrackerBalance((prev) => prev + result.unlockedBalance);
        setStakedBalance((prev) => prev - result.unlockedBalance);
        if (stakedBalance - result.unlockedBalance < 0.000001) {
          setStakeDate(null);
        }
        toast({
          title: 'Unstake Successful',
          description: `You have successfully unstaked ${result.unlockedBalance} USDC.`,
        });
        unstakeForm.reset({ amount: 0 });
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
    toast({
      title: 'Rewards Claimed',
      description: `Claim functionality not implemented.`,
    });
  }
  
  const daysRemaining = unlockDate ? differenceInDays(unlockDate, new Date()) : lockupPeriod;
  const isReadyToUnstake = daysRemaining <= 0;

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex-1 p-4 md:p-8">
        <div className="mx-auto w-full max-w-6xl space-y-8">
          <Card className="bg-card/80">
            <CardContent className="p-4 flex items-center justify-between">
              <h1 className="text-2xl font-semibold text-white">Nsme</h1>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Reward</p>
                <p className="font-semibold text-white">0.00000 USDC/day</p>
              </div>
            </CardContent>
            <CardContent className="px-4 pb-4">
              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <span>{stakedBalance.toFixed(2)} / { (stakedBalance * 2).toFixed(2)} Staked</span>
              </div>
              <Progress value={50} className="h-2" />
            </CardContent>
          </Card>

          <div className="grid gap-8 md:grid-cols-2">
            <Card className="bg-card/80">
              <CardHeader>
                <CardTitle className="text-white">Stake</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <Button
                    onClick={() => setLockupPeriod(7)}
                    variant={lockupPeriod === 7 ? 'default' : 'secondary'}
                  >
                    7 days
                  </Button>
                  <Button
                    onClick={() => setLockupPeriod(30)}
                    variant={lockupPeriod === 30 ? 'default' : 'secondary'}
                  >
                    30 days
                  </Button>
                </div>
                <Form {...stakeForm}>
                  <form
                    onSubmit={stakeForm.handleSubmit(handleStake)}
                    className="space-y-4"
                  >
                    <FormField
                      control={stakeForm.control}
                      name="amount"
                      render={({ field }) => (
                        <FormItem>
                          <div className="bg-input rounded-md p-3">
                            <div className="flex justify-between items-center text-xs text-muted-foreground">
                                <span>You stake</span>
                                <span>Balance: {userTrackerBalance.toFixed(6)} USDC</span>
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                                <Input
                                    type="number"
                                    placeholder="0"
                                    className="bg-transparent border-none text-2xl p-0 h-auto focus-visible:ring-0 focus-visible:ring-offset-0"
                                    {...field}
                                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                />
                                <div className='flex items-center gap-2 text-primary'>
                                    <UsdcIconSm/>
                                    <span className='font-bold'>USDC</span>
                                </div>
                            </div>
                            <div className='flex justify-end gap-1 mt-1'>
                                <Button size="sm" variant="secondary" type="button" onClick={() => stakeForm.setValue('amount', userTrackerBalance)} className="h-6 px-2 text-xs">Max</Button>
                                <Button size="sm" variant="secondary" type="button" onClick={() => stakeForm.setValue('amount', userTrackerBalance/2)} className="h-6 px-2 text-xs">Half</Button>
                            </div>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" size="lg" className="w-full text-lg" disabled={isStaking}>
                      {isStaking ? 'Staking...' : 'Stake'}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>

            <Card className="bg-card/80">
              <CardHeader>
                <CardTitle className="text-white">Claim / Unstake</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex justify-between items-center bg-input p-4 rounded-md">
                    <div>
                        <p className="text-sm text-muted-foreground">Your Claimable Tokens</p>
                        <p className="text-2xl font-bold text-white">0.00000 USDC</p>
                    </div>
                    <Button variant="secondary" onClick={handleClaimRewards}>Claim</Button>
                </div>
                <div className="space-y-4">
                    <Form {...unstakeForm}>
                        <form onSubmit={unstakeForm.handleSubmit(handleUnstake)} className="space-y-4">
                            <FormField
                                control={unstakeForm.control}
                                name="amount"
                                render={({ field }) => (
                                <FormItem>
                                    <div className="bg-input rounded-md p-3">
                                        <div className="flex justify-between items-center text-xs text-muted-foreground">
                                            <span>Unstake</span>
                                            {stakedBalance > 0 && unlockDate && (
                                                <span className={`${isReadyToUnstake ? 'text-primary' : ''}`}>
                                                    {daysRemaining > 0 ? `${daysRemaining} days` : 'Unlocked'} ({format(unlockDate, 'dd/MM/yyyy HH:mm')})
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2 mt-1">
                                            <Input
                                                type="number"
                                                placeholder="0"
                                                className="bg-transparent border-none text-2xl p-0 h-auto focus-visible:ring-0 focus-visible:ring-offset-0"
                                                {...field}
                                                onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                            />
                                            <div className='flex items-center gap-2 text-primary'>
                                                <UsdcIconSm/>
                                                <span className='font-bold'>USDC</span>
                                            </div>
                                        </div>
                                         <div className='flex justify-end gap-1 mt-1'>
                                            <Button size="sm" variant="secondary" type="button" onClick={() => unstakeForm.setValue('amount', stakedBalance)} className="h-6 px-2 text-xs">Max</Button>
                                            <Button size="sm" variant="secondary" type="button" onClick={() => unstakeForm.setValue('amount', stakedBalance/2)} className="h-6 px-2 text-xs">Half</Button>
                                        </div>
                                    </div>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                            <Button type="submit" size="lg" variant="secondary" className="w-full text-lg" disabled={isUnstaking || stakedBalance === 0 || !isReadyToUnstake}>
                                {isUnstaking ? 'Unstaking...' : 'Unstake'}
                            </Button>
                        </form>
                    </Form>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-card/80">
            <CardHeader>
              <CardTitle className="text-white">Your Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className='border-b-white/20'>
                    <TableHead>Action</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Lock time - Date</TableHead>
                    <TableHead>Transaction</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow className="border-none">
                    <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                      No Activity yet!
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
