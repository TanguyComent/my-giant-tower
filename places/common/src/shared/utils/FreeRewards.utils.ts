export namespace FreeRewardsUtils {
    export function getFreeRewardCurrencyAmount(currencyPerSecond: number): number {
        return math.max(currencyPerSecond * 60 * 2, 1000); /// 2 min of cash earnings
    }
}