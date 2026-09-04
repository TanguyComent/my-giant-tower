import { LastRemoteDataType } from "@common/server/migrations/MigrationManager";
import { ECurrencyMultipliers } from "../data/currency-multipliers/ECurrencyMultipliers"

export const UserTemplate: LastRemoteDataType = {
    currentVersion: 1,
    currency: 0,
    towerCurrency: 0,
    UtcLastConnection: undefined,
    dates: {
        sessionStartDate: DateTime.now().UnixTimestamp,
        lastDeconnectionDate: DateTime.now().UnixTimestamp,
    },
    UtcOffset: undefined,
    dailyStats: {},
    globalStats: {
        totalCurrencyEarned: 0,
        playTime: 0
    },
    boughtGamePasses: {},
    purchases: [],
    settings: {
        musicVolume: 1,
        sfxVolume: 1,
        autoReconnectEnabled: true,
    },
    workshops: {},
    towerParts: {},
    currencyMultiplier: ECurrencyMultipliers.X1,
}