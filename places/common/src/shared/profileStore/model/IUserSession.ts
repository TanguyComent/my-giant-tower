import { ETowerParts } from "@common/shared/data/tower-parts/ETowerPart";
import { EWorkshopStandState, EWorkshops, EWorkshopsStands } from "@common/shared/data/workshops/EWorkshops";
import { EGamePasses } from "@common/shared/marketplace/EGamePasses";

export interface IUserSession {
    UtcLastConnection: number | undefined;
    dates: IDates;
    UtcOffset: number | undefined;
    currency: number;
    dailyStats: IDailyStats;
    globalStats: IGlobalStats;
    boughtGamePasses: Partial<Record<EGamePasses, IBoughtGamePasse>>;
    purchases: IPurchase[];
    settings: ISettings;
    towerPartStand?: {
        towerPartName: ETowerParts;
    }
    inHandTowerPart?: IInHandTowerPart;
    workshops: Record<EWorkshops, Record<EWorkshopsStands, TWorkshopStand>>
}

export type TWorkshopStand = ILockedWorkshopStand | IUnlockedWorkshopStand;

export interface ILockedWorkshopStand {
    state: EWorkshopStandState.LOCKED;
}

export interface IUnlockedWorkshopStand {
    state: EWorkshopStandState.UNLOCKED;
    processingTowerPart?: {
        towerPartName: ETowerParts;
        processingInitialProgress: number;
    }
}

export interface IInHandTowerPart {
    towerPartName: ETowerParts;
}

export interface IDates {
    lastDeconnectionDate: number;
    sessionStartDate: number;
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