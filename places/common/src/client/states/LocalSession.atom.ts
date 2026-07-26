import { IUserSession } from "@common/shared/profileStore/model/IUserSession"
import { Atom, atom } from "@rbxts/charm"

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
    }
}

export const LocalSessionAtom: Atom<IUserSession> = atom(defaultProfile)