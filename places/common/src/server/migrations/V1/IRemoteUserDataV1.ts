import { ETowerPart } from "@common/shared/data/tower-parts/ETowerPart";
import { EWorkships, EWorkshipsStands, EWorkshipStandState } from "@common/shared/data/workshops/EWorkships";
import { EGamePasses } from "@common/shared/marketplace/EGamePasses";
import { TWorkshipStand } from "@common/shared/profileStore/model/IUserSession";

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
    workships: Partial<Record<EWorkships, Partial<Record<EWorkshipsStands, TWorkshipStand>>>>
}

export type TWorkshipStandV1 = ILockedWorkshipStandV1 | IUnlockedWorkshipStandV1;

interface ILockedWorkshipStandV1 {
    state: EWorkshipStandState.LOCKED;
}

interface IUnlockedWorkshipStandV1 {
    state: EWorkshipStandState.UNLOCKED;
    processingTowerPart?: {
        towerPartName: ETowerPart;
        processingInitialProgress: number;
    }
}

export interface IInHandTowerPartV1 {
    towerPartName: ETowerPart;
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