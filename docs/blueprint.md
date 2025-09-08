# **App Name**: TrackerStake

## Core Features:

- Reward Vault Funding: Admin functionality to fund reward vaults for the $TRACKER staking pool by entering the amount to fund. Balances will be tracked internally; use an LLM tool to ensure balances match the chain.
- Reward Withdrawal: Admin function to withdraw unused rewards from the $TRACKER staking pool to the admin wallet.
- Staking Details: Display the $TRACKER staking pool details on the user page, showing the token symbol/logo, lockup duration, and total staked amount. Also show all this information plus the rewards per day, total staked, total stakers, and reward balance.
- Stake Functionality: User interface to input the amount of $TRACKER tokens to stake in the staking pool. Implement a stake button and display user balance.
- Unstake Functionality: User interface to view the staked balance and allow withdrawal of tokens if the lockup period has expired. It will be backed by an LLM tool that double checks dates of unstaking requests and unlocks them at the correct time. Balances are tracked internally, but the LLM has the responsibility to ensure that requests do not circumvent time locks.
- Claim Rewards Functionality: User interface to display pending rewards and a claim button to claim available rewards.

## Style Guidelines:

- Primary color: Vibrant green (#39FF14) to reflect the high-energy and tech-forward feel of modern staking platforms. Chosen to evoke a sense of growth and vibrancy.
- Background color: Dark charcoal (#121212) to provide a sleek, modern backdrop that enhances the visibility of the bright UI elements. Desaturated, same hue as the primary color, brightness 7%.
- Accent color: Bright cyan (#14F0FF) for interactive elements and highlights, offering a strong contrast to the primary color and enhancing the futuristic vibe. Analogous, a different hue and different saturation to stand apart.
- Body and headline font: 'Space Grotesk', a proportional sans-serif with a computerized, techy, scientific feel.
- Code font: 'Source Code Pro' for displaying code snippets.
- Use minimalistic icons that are bright green and geometric.
- Implement subtle animations with framer-motion for transitions and interactive elements to provide a smooth user experience.