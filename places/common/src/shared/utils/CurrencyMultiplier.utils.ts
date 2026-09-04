import { CURRENCY_MULTIPLIERS_DATA, ORDERED_CURRENCY_MULTIPLIERS } from "../data/currency-multipliers/CurrencyMultipliers.data"
import { ECurrencyMultipliers } from "../data/currency-multipliers/ECurrencyMultipliers"
import { EDevProducts } from "../marketplace/EDevProducts"

export namespace CurrencyMultiplierUtils {

    export function getNextCurrencyMultiplierName(currencyMultiplierName: ECurrencyMultipliers): ECurrencyMultipliers | undefined {
        const index = ORDERED_CURRENCY_MULTIPLIERS.indexOf(currencyMultiplierName)
        return ORDERED_CURRENCY_MULTIPLIERS[index + 1];
    } 

    export function getNextCurrencyMultiplierProduct(currencyMultiplierName: ECurrencyMultipliers): EDevProducts | undefined {
        const nextMultiplierName = getNextCurrencyMultiplierName(currencyMultiplierName);
        if (!nextMultiplierName) return undefined;
        return CURRENCY_MULTIPLIERS_DATA[nextMultiplierName].productName;
    }
}