export function calculateDailyRewards(userDetails: any, stakingPoolDetails: any, decimals: number) {
    if (!userDetails || !stakingPoolDetails) return 0;

    const userAmount = userDetails.amount?.toNumber() || 0;
    const totalStaked = stakingPoolDetails.totalStaked?.toNumber() || 0;
    const rewardRatePerSecond = stakingPoolDetails.rewardRatePerTokenPerSecond?.toNumber() || 0;

    if (userAmount === 0 || totalStaked === 0) return 0;

    const secondsInDay = 86400;
    const scale = 1_000_000_000_000;

    const dailyRewardRaw =
        ((userAmount * rewardRatePerSecond * secondsInDay) / totalStaked )

    return dailyRewardRaw / Math.pow(10, decimals);
}



export function calculateClaimable(userDetails: any, stakingPoolDetails: any, decimals: number) {
    if (!userDetails || !stakingPoolDetails) return 0;

    const scale = 1_000_000_000_000; 
    const currentTime = Math.floor(Date.now() / 1000);

    // Get current values
    const userAmount = userDetails.amount?.toNumber() || 0;
    const pendingRewards = userDetails.pendingRewards?.toNumber() || 0;
    const userRewardPerTokenPaid =
        userDetails.userRewardPerTokenPaid?.toNumber() || 0;

    const totalStaked = stakingPoolDetails.totalStaked?.toNumber() || 0;
    const rewardPerTokenStored =
        stakingPoolDetails.rewardPerTokenStored?.toNumber() || 0;
    const lastUpdateTime =
        stakingPoolDetails.lastUpdateTime?.toNumber() || currentTime;
    const rewardRatePerTokenPerSecond =
        stakingPoolDetails.rewardRatePerTokenPerSecond?.toNumber() || 0;

    if (userAmount === 0) return 0;

    // Calculate current reward per token (same logic as in your Rust contract)
    let currentRewardPerToken = rewardPerTokenStored;

    if (totalStaked > 0) {
        const timeElapsed = currentTime - lastUpdateTime;
        const additional = Math.floor(
            (timeElapsed * rewardRatePerTokenPerSecond * scale) / totalStaked
        );
        currentRewardPerToken = rewardPerTokenStored + additional;
    }

    // Calculate newly accrued rewards since last update
    const newRewards = Math.floor(
        (userAmount * (currentRewardPerToken - userRewardPerTokenPaid)) / scale
    );

    // Total claimable = pending rewards + newly accrued rewards
    const totalClaimable = pendingRewards + newRewards;

    // Convert to token decimals
    return totalClaimable / Math.pow(10, decimals);
}