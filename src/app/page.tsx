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
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';

const formSchema = z.object({
  amount: z
    .number({ invalid_type_error: 'Please enter a valid number.' })
    .positive({ message: 'Amount must be positive.' })
    .min(0.000001, { message: 'Amount is too small.' }),
});

type FormValues = z.infer<typeof formSchema>;

const TrackerIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="hsl(var(--primary))" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M2 17L12 22L22 17" stroke="hsl(var(--primary))" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M2 12L12 17L22 12" stroke="hsl(var(--primary))" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
)

export default function StakingPage() {
  const [userTrackerBalance, setUserTrackerBalance] = useState(1337.42);
  const [stakedBalance, setStakedBalance] = useState(0);
  const [stakeDate, setStakeDate] = useState<Date | null>(null);
  const [isUnstaking, setIsUnstaking] = useState(false);
  const [isStaking, setIsStaking] = useState(false);
  const { toast } = useToast();
  const [lockupPeriod, setLockupPeriod] = useState(30);
  const [activeTab, setActiveTab] = useState('stake');

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: 0,
    }
  });

  const unlockDate = stakeDate ? add(stakeDate, { days: lockupPeriod }) : null;

  function handleStake(data: FormValues) {
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
      form.reset({ amount: 0 });
      setIsStaking(false);
    }, 1000);
  }

  async function handleUnstake(data: FormValues) {
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
          description: `You have successfully unstaked ${result.unlockedBalance} $TRACKER.`,
        });
        form.reset({ amount: 0 });
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

  function handleSubmit(data: FormValues) {
    if (activeTab === 'stake') {
      handleStake(data);
    } else {
      handleUnstake(data);
    }
  }

  const daysRemaining = unlockDate ? differenceInDays(unlockDate, new Date()) : 0;
  const isReadyToUnstake = stakedBalance > 0 && daysRemaining <= 0;

  return (
    <div className="flex min-h-screen w-full flex-col font-code">
      <Header />
      <main className="flex-1 p-4 md:p-8">
        <div className="mx-auto w-full max-w-4xl space-y-8">
          
          <div className="grid gap-8 md:grid-cols-2">
            <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
              <CardHeader>
                <CardTitle className="text-primary font-mono tracking-widest">STAKE_TERMINAL</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex border-b border-primary/20 mb-4">
                  <button onClick={() => setActiveTab('stake')} className={`px-4 py-2 text-sm ${activeTab === 'stake' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground'}`}>STAKE</button>
                  <button onClick={() => setActiveTab('unstake')} className={`px-4 py-2 text-sm ${activeTab === 'unstake' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground'}`}>UNSTAKE</button>
                </div>
                
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(handleSubmit)}
                    className="space-y-4"
                  >
                    <FormField
                      control={form.control}
                      name="amount"
                      render={({ field }) => (
                        <FormItem>
                          <div className="bg-black/30 rounded-md p-3">
                            <div className="flex justify-between items-center text-xs text-muted-foreground">
                                <span>{activeTab === 'stake' ? 'Your balance' : 'Staked balance'}</span>
                                <span>{activeTab === 'stake' ? userTrackerBalance.toFixed(4) : stakedBalance.toFixed(4)} $TRACKER</span>
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                                <Input
                                    type="number"
                                    placeholder="0.0"
                                    className="bg-transparent border-none text-2xl p-0 h-auto focus-visible:ring-0 focus-visible:ring-offset-0 text-primary"
                                    {...field}
                                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                />
                                <div className='flex items-center gap-2 text-primary'>
                                    <TrackerIcon/>
                                    <span className='font-bold text-lg'>$TRACKER</span>
                                </div>
                            </div>
                          </div>
                          <FormMessage className="text-red-500"/>
                        </FormItem>
                      )}
                    />
                     <Button type="submit" size="lg" className="w-full text-lg font-bold" disabled={isStaking || isUnstaking}>
                      {isStaking && 'STAKING...'}
                      {isUnstaking && 'UNSTAKING...'}
                      {!isStaking && !isUnstaking && (activeTab === 'stake' ? 'STAKE' : 'UNSTAKE')}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>

            <div className="space-y-8">
              <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
                <CardHeader>
                   <CardTitle className="text-primary font-mono tracking-widest">STAKING_INFO</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Staked Balance</span>
                        <span className="text-primary font-bold">{stakedBalance.toFixed(4)} $TRACKER</span>
                    </div>
                    <Separator className="bg-primary/20"/>
                     <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Lockup Period</span>
                        <span className="text-primary font-bold">{lockupPeriod} Days</span>
                    </div>
                    <Separator className="bg-primary/20"/>
                     <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Unlock Date</span>
                        <span className={`font-bold ${isReadyToUnstake ? 'text-green-400' : 'text-primary'}`}>
                          {stakedBalance > 0 && unlockDate ? (isReadyToUnstake ? 'Ready to Unstake' : format(unlockDate, 'dd MMM yyyy')) : 'N/A'}
                        </span>
                    </div>
                </CardContent>
              </Card>

               <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
                <CardHeader>
                   <CardTitle className="text-primary font-mono tracking-widest">REWARDS</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                     <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Claimable Rewards</span>
                        <span className="text-primary font-bold">0.0000 $TRACKER</span>
                    </div>
                    <Button variant="outline" className="w-full" onClick={() => toast({ title: 'Coming Soon!', description: 'Reward claiming will be available soon.'})}>
                      CLAIM REWARDS
                    </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
            <CardHeader>
              <CardTitle className="text-primary font-mono tracking-widest">ACTIVITY_LOG</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className='border-b-primary/20'>
                    <TableHead className="text-primary">Action</TableHead>
                    <TableHead className="text-primary">Amount</TableHead>
                    <TableHead className="text-primary">Date</TableHead>
                    <TableHead className="text-primary">Transaction</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow className="border-none">
                    <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                      ::NO_RECENT_ACTIVITY::
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
