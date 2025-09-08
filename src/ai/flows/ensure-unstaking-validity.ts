'use server';

/**
 * @fileOverview Ensures the validity of unstaking requests by verifying the lockup period has expired.
 *
 * - ensureUnstakingValidity - A function that verifies if an unstaking request is valid based on the lockup period.
 * - EnsureUnstakingValidityInput - The input type for the ensureUnstakingValidity function.
 * - EnsureUnstakingValidityOutput - The return type for the ensureUnstakingValidity function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EnsureUnstakingValidityInputSchema = z.object({
  unstakeRequestDate: z
    .string()
    .describe('The date the unstake request was made, in ISO format.'),
  lockupPeriodDays: z
    .number()
    .describe('The number of days the tokens are locked for.'),
  currentDate: z
    .string()
    .describe('The current date, in ISO format.'),
  stakedBalance: z
    .number()
    .describe('The amount of tokens that are staked'),
});
export type EnsureUnstakingValidityInput = z.infer<
  typeof EnsureUnstakingValidityInputSchema
>;

const EnsureUnstakingValidityOutputSchema = z.object({
  isValid: z
    .boolean()
    .describe(
      'Whether the unstake request is valid based on the lockup period and current date.'
    ),
  reason: z
    .string()
    .optional()
    .describe('The reason the unstake request is invalid, if applicable.'),
  unlockedBalance: z
    .number()
    .describe('The amount of tokens available to unstake, if applicable.'),
});
export type EnsureUnstakingValidityOutput = z.infer<
  typeof EnsureUnstakingValidityOutputSchema
>;

export async function ensureUnstakingValidity(
  input: EnsureUnstakingValidityInput
): Promise<EnsureUnstakingValidityOutput> {
  return ensureUnstakingValidityFlow(input);
}

const ensureUnstakingValidityPrompt = ai.definePrompt({
  name: 'ensureUnstakingValidityPrompt',
  input: {schema: EnsureUnstakingValidityInputSchema},
  output: {schema: EnsureUnstakingValidityOutputSchema},
  prompt: `You are a security expert specializing in validating unstaking requests in a staking pool.

You will determine if an unstaking request is valid based on the lockup period and the current date. Ensure that the request does not circumvent the time lock.

Unstake Request Date: {{{unstakeRequestDate}}}
Lockup Period (days): {{{lockupPeriodDays}}}
Current Date: {{{currentDate}}}
Staked Balance: {{{stakedBalance}}}

Determine if the unstake request is valid. If it is not valid, provide a reason.

Set the isValid field to true if the unstake request is valid, and false otherwise. If it is valid, set unlockedBalance to the stakedBalance.
If it is not valid, explain the reason in the reason field and set unlockedBalance to 0.
`,  
});

const ensureUnstakingValidityFlow = ai.defineFlow(
  {
    name: 'ensureUnstakingValidityFlow',
    inputSchema: EnsureUnstakingValidityInputSchema,
    outputSchema: EnsureUnstakingValidityOutputSchema,
  },
  async input => {
    const {output} = await ensureUnstakingValidityPrompt(input);
    return output!;
  }
);
