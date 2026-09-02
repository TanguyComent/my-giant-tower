import { EDevProducts } from "@common/shared/marketplace/EDevProducts";
import { ECurrencyMultipliers } from "./ECurrencyMultipliers";

export interface ICurrencyMultiplierData {
    currencyMultiplier: number;
    productName: EDevProducts
}

export const ORDERED_CURRENCY_MULTIPLIERS: ECurrencyMultipliers[] = [
    ECurrencyMultipliers.X2,
    ECurrencyMultipliers.X4,
]   

export const CURRENCY_MULTIPLIERS_DATA: Record<ECurrencyMultipliers, ICurrencyMultiplierData> = {
    [ECurrencyMultipliers.X2]: {
        currencyMultiplier: 2,
        productName: EDevProducts.CURRENCY_MULTIPLIER_X2,
    },
    [ECurrencyMultipliers.X4]: {
        currencyMultiplier: 4,
        productName: EDevProducts.CURRENCY_MULTIPLIER_X4,
    },
}