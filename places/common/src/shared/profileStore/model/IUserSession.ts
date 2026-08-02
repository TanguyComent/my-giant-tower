import { ETowerPart } from "@common/shared/data/tower-parts/ETowerPart";
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
        towerPartName: ETowerPart;
    }
    inHandTowerPart?: IInHandTowerPart;
    workshops: Record<EWorkshops, Record<EWorkshopsStands, TWorkshipStand>>
}

export type TWorkshipStand = ILockedWorkshipStand | IUnlockedWorkshipStand;

interface ILockedWorkshipStand {
    state: EWorkshopStandState.LOCKED;
}

interface IUnlockedWorkshipStand {
    state: EWorkshopStandState.UNLOCKED;
    processingTowerPart?: {
        towerPartName: ETowerPart;
        processingInitialProgress: number;
    }
}

export interface IInHandTowerPart {
    towerPartName: ETowerPart;
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