import { EWorkshops, EWorkshopsStands, EWorkshopStandState } from "@common/shared/data/workshops/EWorkshops"
import { IUserSession } from "@common/shared/profileStore/model/IUserSession"
import { Atom, atom } from "@rbxts/charm"
import Object from "@rbxts/object-utils"

const defaultProfile: IUserSession = {
    currency: 0,
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
    }, {} as IUserSession["workshops"])
}

export const LocalSessionAtom: Atom<IUserSession> = atom(defaultProfile)