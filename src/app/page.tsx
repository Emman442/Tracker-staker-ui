'use client';

import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { add, format } from 'date-fns';

import { ensureUnstakingValidity } from '@/ai/flows/ensure-unstaking-validity';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Header } from '@/components/layout/Header';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const formSchema = z.object({
  amount: z
    .number({ invalid_type_error: 'Please enter a valid number.' })
    .positive({ message: 'Amount must be positive.' })
    .min(0.000001, { message: 'Amount is too small.' }),
});

type FormValues = z.infer<typeof formSchema>;

const unstakeFormSchema = z.object({
  unstakeAmount: z
    .number({ invalid_type_error: 'Please enter a valid number.' })
    .positive({ message: 'Amount must be positive.' })
    .min(0.000001, { message: 'Amount is too small.' }),
});

type UnstakeFormValues = z.infer<typeof unstakeFormSchema>;

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
  const totalStaked = 999720000;
  const [stakeDate, setStakeDate] = useState<Date | null>(new Date());
  const [isUnstaking, setIsUnstaking] = useState(false);
  const [isStaking, setIsStaking] = useState(false);
  const { toast } = useToast();
  const [lockupPeriod, setLockupPeriod] = useState(7);
  const [unstakeLockupPeriod, setUnstakeLockupPeriod] = useState('7');

  const stakeForm = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: 0,
    },
  });

  const unstakeForm = useForm<UnstakeFormValues>({
    resolver: zodResolver(unstakeFormSchema),
    defaultValues: {
      unstakeAmount: 0,
    },
  });

  const unlockDate = stakeDate
    ? add(stakeDate, { days: parseInt(unstakeLockupPeriod, 10) })
    : null;

  function handleStake(data: FormValues) {
    if (data.amount > userTrackerBalance) {
      toast({
        variant: 'destructive',
        title: 'Insufficient Balance',
        description: 'You do not have enough $SUPA to stake this amount.',
      });
      return;
    }
    setIsStaking(true);
    setTimeout(() => {
      setUserTrackerBalance(prev => prev - data.amount);
      setStakedBalance(prev => prev + data.amount);
      setStakeDate(new Date());
      toast({
        title: 'Stake Successful',
        description: `You have successfully staked ${data.amount} $SUPA.`,
      });
      stakeForm.reset({ amount: 0 });
      setIsStaking(false);
    }, 1000);
  }

  async function handleUnstake(data: UnstakeFormValues) {
    const amountToUnstake = data.unstakeAmount;
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
    if (amountToUnstake > stakedBalance) {
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
        lockupPeriodDays: parseInt(unstakeLockupPeriod, 10),
        currentDate: new Date().toISOString(),
        stakedBalance: amountToUnstake,
      });

      if (result.isValid) {
        setUserTrackerBalance(prev => prev + result.unlockedBalance);
        setStakedBalance(prev => prev - result.unlockedBalance);
        if (stakedBalance - result.unlockedBalance < 0.000001) {
          setStakeDate(null);
        }
        toast({
          title: 'Unstake Successful',
          description: `You have successfully unstaked ${result.unlockedBalance} $SUPA.`,
        });
        unstakeForm.reset({ unstakeAmount: 0 });
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

  const formatNumber = (num: number) => {
    if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(2)}M`;
    if (num >= 1_000) return `${(num / 1_000).toFixed(2)}K`;
    return num.toString();
  };

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
                    {formatNumber(stakedBalance)}/{formatNumber(totalStaked)}{' '}
                    STAKED
                </div>
                <Progress
                    value={(stakedBalance / totalStaked) * 100}
                    className="h-2 bg-primary/20 w-1/2"
                />
              </div>
               <div className="text-right">
                  <p className="text-sm text-muted-foreground">REWARD</p>
                  <p className="font-semibold whitespace-nowrap">
                    0 SUPA/day
                  </p>
                </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            <Card className="bg-card/80 backdrop-blur-sm">
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
                    onSubmit={stakeForm.handleSubmit(handleStake)}
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
            </Card>

            <Card className="bg-card/80 backdrop-blur-sm">
              <CardContent className="p-4">
                 <h3 className="text-lg font-semibold mb-4">Claim</h3>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Your Locked Tokens
                    </p>
                    <p className="text-xl font-semibold">
                      {stakedBalance > 0 ? stakedBalance.toLocaleString() : 0}{' '}
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
                    onSubmit={unstakeForm.handleSubmit(handleUnstake)}
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
                                    ({format(unlockDate, 'dd/MM/yyyy HH:mm')})
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
                                  onChange={e =>
                                    field.onChange(
                                      parseFloat(e.target.value) || 0
                                    )
                                  }
                                />
                              </FormControl>
                              <div className="flex items-center gap-2">
                                <div className='flex flex-col gap-1'>
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="outline"
                                  className="rounded-md h-6 text-xs px-2"
                                  onClick={() =>
                                    unstakeForm.setValue(
                                      'unstakeAmount',
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
                                      'unstakeAmount',
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
                             <FormMessage className="text-xs"/>
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
                      {isUnstaking ? 'Unstaking...' : 'Unstake'}
                    </Button>
                  </form>
                </Form>
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
