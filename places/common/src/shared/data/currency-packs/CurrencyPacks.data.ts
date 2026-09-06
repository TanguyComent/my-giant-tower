import { ECurrencyPacksProducts } from "@common/shared/marketplace/EDevProducts"

export interface ICurrencyPackData {
    minimumAwarded: number;
    duration: number; // in seconds
}

export const CURRENCY_PACKS_DATA: Record<ECurrencyPacksProducts, ICurrencyPackData> = {
    [ECurrencyPacksProducts.CURRENCY_PACK_1]: {
        minimumAwarded: 1000/6,
        duration: 60 * 10,
    },
    [ECurrencyPacksProducts.CURRENCY_PACK_2]: {
        minimumAwarded: 1000,
        duration: 60 * 60,
    },
    [ECurrencyPacksProducts.CURRENCY_PACK_3]: {
        minimumAwarded: 10000,
        duration: 60 * 60 * 10,
    },
}