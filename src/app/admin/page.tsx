'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { DollarSign, Download, Upload } from 'lucide-react';

import { validateRewardVaultFunding } from '@/ai/flows/validate-reward-vault-funding';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
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

const fundFormSchema = z.object({
  amount: z.number().positive('Amount must be positive.'),
});

const withdrawFormSchema = z.object({
  amount: z.number().positive('Amount must be positive.'),
});

const VAULT_ADDRESS = '0x1234aBcdE5678F...';
const MOCK_BLOCKCHAIN_STATE = JSON.stringify({
  wallets: {
    admin_wallet: { balance: 1000000 },
    [VAULT_ADDRESS]: { balance: 50000, pending_tx: [] },
  },
  totalSupply: 10000000,
  recentTransactions: [],
});

export default function AdminPage() {
  const [isFunding, setIsFunding] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [rewardBalance, setRewardBalance] = useState(50000);
  const { toast } = useToast();

  const fundForm = useForm<z.infer<typeof fundFormSchema>>({
    resolver: zodResolver(fundFormSchema),
    defaultValues: { amount: 0 },
  });

  const withdrawForm = useForm<z.infer<typeof withdrawFormSchema>>({
    resolver: zodResolver(withdrawFormSchema),
    defaultValues: { amount: 0 },
  });

  async function handleFundVault(values: z.infer<typeof fundFormSchema>) {
    setIsFunding(true);
    try {
      const validation = await validateRewardVaultFunding({
        amount: values.amount,
        vaultAddress: VAULT_ADDRESS,
        blockChainState: MOCK_BLOCKCHAIN_STATE,
      });

      if (validation.isValid) {
        setRewardBalance((prev) => prev + values.amount);
        toast({
          title: 'Funding Successful',
          description: `Funded vault with ${values.amount} $TRACKER. New balance: ${rewardBalance + values.amount}`,
        });
        fundForm.reset();
      } else {
        toast({
          variant: 'destructive',
          title: 'Funding Validation Failed',
          description:
            validation.discrepancyExplanation ||
            'The transaction is not valid.',
        });
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'An error occurred while funding the vault.',
      });
    } finally {
      setIsFunding(false);
    }
  }

  function handleWithdrawRewards(values: z.infer<typeof withdrawFormSchema>) {
    setIsWithdrawing(true);
    if (values.amount > rewardBalance) {
      toast({
        variant: 'destructive',
        title: 'Withdrawal Failed',
        description: 'Withdrawal amount exceeds reward balance.',
      });
      setIsWithdrawing(false);
      return;
    }
    
    setTimeout(() => {
        setRewardBalance((prev) => prev - values.amount);
        toast({
            title: 'Withdrawal Successful',
            description: `Withdrew ${values.amount} $TRACKER from vault.`,
        });
        withdrawForm.reset();
        setIsWithdrawing(false);
    }, 1000);
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="mx-auto grid w-full max-w-6xl gap-2">
          <h1 className="text-3xl font-semibold font-headline">Admin Panel</h1>
          <p className="text-muted-foreground">Manage the TrackerStake pool.</p>
        </div>

        <div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Reward Vault Funding</CardTitle>
              <CardDescription>
                Add funds to the reward vault. Balances are validated against a
                simulated chain state by GenAI.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4 rounded-lg border bg-card-foreground/5 p-3">
                <p className="text-sm text-muted-foreground">
                  Current Reward Vault Balance
                </p>
                <p className="text-2xl font-bold font-code text-primary">
                  {rewardBalance.toLocaleString()} $TRACKER
                </p>
              </div>
              <Form {...fundForm}>
                <form
                  onSubmit={fundForm.handleSubmit(handleFundVault)}
                  className="space-y-4"
                >
                  <FormField
                    control={fundForm.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Amount to Fund</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <DollarSign className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                            <Input
                              type="number"
                              className="pl-10"
                              placeholder="10000"
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
                  <Button type="submit" className="w-full" disabled={isFunding}>
                    {isFunding ? 'Funding...' : 'Fund Vault'}
                    <Upload className="ml-2 h-4 w-4" />
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Withdraw Unused Rewards</CardTitle>
              <CardDescription>
                Withdraw unused funds from the reward vault to the admin
                wallet.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...withdrawForm}>
                <form
                  onSubmit={withdrawForm.handleSubmit(handleWithdrawRewards)}
                  className="space-y-4"
                >
                  <FormField
                    control={withdrawForm.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Amount to Withdraw</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <DollarSign className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                            <Input
                              type="number"
                              className="pl-10"
                              placeholder="5000"
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
                  <Button
                    type="submit"
                    variant="outline"
                    className="w-full"
                    disabled={isWithdrawing}
                  >
                    {isWithdrawing ? 'Withdrawing...' : 'Withdraw Rewards'}
                    <Download className="ml-2 h-4 w-4" />
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
