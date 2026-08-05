import { ETowerParts } from "@common/shared/data/tower-parts/ETowerPart";
import { EWorkshops, EWorkshopsStands, EWorkshopStandState } from "@common/shared/data/workshops/EWorkshops";
import { EGamePasses } from "@common/shared/marketplace/EGamePasses";
import { TWorkshopStand } from "@common/shared/profileStore/model/IUserSession";

export interface IRemoteUserDataV1 {
    currentVersion: 1;
    UtcLastConnection: number | undefined;
    UtcOffset: number | undefined;
    dates: IDatesV1;
    currency: number;
    dailyStats: IDailyStatsV1;
    globalStats: IGlobalStatsV1;
    boughtGamePasses: Partial<Record<EGamePasses, IBoughtGamePasseV1>>;
    purchases: IPurchaseV1[];
    settings: ISettingsV1;
    inHandTowerPart?: IInHandTowerPartV1;
    workshops: Partial<Record<EWorkshops, Partial<Record<EWorkshopsStands, TWorkshopStand>>>>;
    towerParts: Partial<Record<ETowerParts, ITowerPartEntryV1>>;
}

export interface ITowerPartEntryV1 {
    amount: number;
}

export type TWorkshipStandV1 = ILockedWorkshipStandV1 | IUnlockedWorkshipStandV1;

interface ILockedWorkshipStandV1 {
    state: EWorkshopStandState.LOCKED;
}

interface IUnlockedWorkshipStandV1 {
    state: EWorkshopStandState.UNLOCKED;
    processingTowerPart?: {
        towerPartName: ETowerParts;
        processingInitialProgress: number;
    }
}

export interface IInHandTowerPartV1 {
    towerPartName: ETowerParts;
}

export interface IDatesV1 {
    lastDeconnectionDate: number;
    sessionStartDate: number;
}

export interface ISettingsV1 {
    musicVolume: number;
    sfxVolume: number;
    autoReconnectEnabled: boolean;
}

export interface IDailyStatsV1 {
    
}

export interface IGlobalStatsV1 {
    totalCurrencyEarned: number;
    playTime: number;
}

export interface IBoughtGamePasseV1 {
    owned: boolean;
}

export interface IPurchaseV1 {
    productId: number;
    robuxSpent: number;
    success: boolean;
}