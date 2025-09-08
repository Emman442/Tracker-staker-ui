'use server';

/**
 * @fileOverview Validates reward vault funding inputs against the blockchain's current state.
 *
 * - validateRewardVaultFunding - A function that validates the reward vault funding input.
 * - ValidateRewardVaultFundingInput - The input type for the validateRewardVaultFunding function.
 * - ValidateRewardVaultFundingOutput - The return type for the validateRewardVaultFunding function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ValidateRewardVaultFundingInputSchema = z.object({
  amount: z.number().describe('The amount to fund the reward vault with.'),
  vaultAddress: z.string().describe('The address of the reward vault.'),
  blockChainState: z.string().describe('The current state of the blockchain as a JSON string'),
});
export type ValidateRewardVaultFundingInput = z.infer<typeof ValidateRewardVaultFundingInputSchema>;

const ValidateRewardVaultFundingOutputSchema = z.object({
  isValid: z.boolean().describe('Whether the reward vault funding input is valid.'),
  discrepancyExplanation: z
    .string()
    .optional()
    .describe('Explanation of any discrepancy found.'),
});
export type ValidateRewardVaultFundingOutput = z.infer<typeof ValidateRewardVaultFundingOutputSchema>;

export async function validateRewardVaultFunding(
  input: ValidateRewardVaultFundingInput
): Promise<ValidateRewardVaultFundingOutput> {
  return validateRewardVaultFundingFlow(input);
}

const prompt = ai.definePrompt({
  name: 'validateRewardVaultFundingPrompt',
  input: {schema: ValidateRewardVaultFundingInputSchema},
  output: {schema: ValidateRewardVaultFundingOutputSchema},
  prompt: `You are an expert in blockchain validation.

You will receive the proposed funding amount for a reward vault, the vault's address, and a snapshot of the blockchain's current state.

Your task is to determine if the proposed funding amount aligns with the blockchain's current state. If there is a discrepancy, explain the reason for the discrepancy. Ensure that your response includes a determination as to whether the funding is valid via the isValid field.

Funding Amount: {{{amount}}}
Vault Address: {{{vaultAddress}}}
Blockchain State: {{{blockChainState}}}

Considerations:
- Check if the funding amount exceeds the available balance in the blockchain state.
- Verify if the vault address exists within the blockchain state.
- Investigate if there are any pending transactions that might affect the validation.

Respond in a JSON format:
`,
});

const validateRewardVaultFundingFlow = ai.defineFlow(
  {
    name: 'validateRewardVaultFundingFlow',
    inputSchema: ValidateRewardVaultFundingInputSchema,
    outputSchema: ValidateRewardVaultFundingOutputSchema,
  },
  async input => {
    try {
      const blockChainStateParsed = JSON.parse(input.blockChainState);
      input.blockChainState = JSON.stringify(blockChainStateParsed, null, 2);
    } catch (e) {
      // If it's not parseable, then pass the string to the LLM anyway.
    }
    const {output} = await prompt(input);
    return output!;
  }
);
