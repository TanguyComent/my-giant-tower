import { EGamePasses } from "@common/shared/marketplace/EGamePasses";

export interface IUserSession {
    UtcLastConnection: number | undefined;
    dates: {
        lastDeconnectionDate: number;
        sessionStartDate: number;
    }
    UtcOffset: number | undefined;
    currency: number;
    dailyStats: IDailyStats;
    globalStats: IGlobalStats;
    boughtGamePasses: Partial<Record<EGamePasses, IBoughtGamePasse>>;
    purchases: IPurchase[];
    settings: ISettings;
}

export interface ISettings {
    musicVolume: number;
    sfxVolume: number;
    autoReconnectEnabled: boolean;
}

export interface IDailyStats {

}

export interface IGlobalStats {
    totalCurrencyEarned: number;
    playTime: number;
}

export interface IBoughtGamePasse {
    owned: boolean;
}

export interface IPurchase {
    productId: number;
    robuxSpent: number;
    success: boolean;
}