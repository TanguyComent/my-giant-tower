import { ECurrencyMultipliers } from "@common/shared/data/currency-multipliers/ECurrencyMultipliers"
import { ETowerParts } from "@common/shared/data/tower-parts/ETowerPart"
import { EWorkshops, EWorkshopsStands, EWorkshopStandState } from "@common/shared/data/workshops/EWorkshops"
import { IUserSession } from "@common/shared/profileStore/model/IUserSession"
import { Atom, atom, computed } from "@rbxts/charm"
import Object from "@rbxts/object-utils"

const defaultProfile: IUserSession = {
    currency: 0,
    towerCurrency: 0,
    dates: {
        sessionStartDate: DateTime.now().UnixTimestamp,
        lastDeconnectionDate: DateTime.now().UnixTimestamp,
    },
    dailyStats: {},
    UtcLastConnection: 0,
    UtcOffset: 0,
    globalStats: {
        playTime: 0,
        totalCurrencyEarned: 0,
    },
    boughtGamePasses: {},
    purchases: [],
    settings: {
        musicVolume: 1,
        sfxVolume: 1,
        autoReconnectEnabled: true,
    },
    workshops: Object.values(EWorkshops).reduce((acc, workshipName) => {
        acc[workshipName] = Object.values(EWorkshopsStands).reduce((acc2, workshipStandName) => {
            acc2[workshipStandName] = {
                state: EWorkshopStandState.LOCKED,
            }
            return acc2;
        }, {} as IUserSession["workshops"][typeof workshipName])
        return acc;
    }, {} as IUserSession["workshops"]),
    towerParts: Object.values(ETowerParts).reduce((acc, towerPartName) => {
        acc[towerPartName] = {
            amount: 0
        }
        return acc;
    }, {} as IUserSession["towerParts"]),
    currencyMultiplier: ECurrencyMultipliers.X1,
}

export const LocalSessionAtom: Atom<IUserSession> = atom(defaultProfile)
export const WorkshopStandSelector = (workshopName: EWorkshops, workshopStandName: EWorkshopsStands) => computed(() => LocalSessionAtom().workshops[workshopName][workshopStandName]);
export const TowerCurrencySelector = computed(() => LocalSessionAtom().towerCurrency);