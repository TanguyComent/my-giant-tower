import { LastRemoteDataType } from "@common/server/migrations/MigrationManager";
import { ECurrencyMultipliers } from "../data/currency-multipliers/ECurrencyMultipliers"
import { IS_DEVELOP, IS_STUDIO } from "../GlobalConfig"

function createPlayerDataRemoteProduction(): LastRemoteDataType {
    return {
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
        lastFreeRewardClaimDate: 0,
    }
}

function createPlayerDataRemoteStudio(): LastRemoteDataType {
    return {
        ...createPlayerDataRemoteProduction(),
        currency: 1000000000,
    }
}

function createPlayerDataRemoteDevelop(): LastRemoteDataType {
    return {
        ...createPlayerDataRemoteProduction(),
    }
}

export const PlayerDataRemoteTemplate: LastRemoteDataType = IS_STUDIO ? createPlayerDataRemoteStudio() : IS_DEVELOP ? createPlayerDataRemoteDevelop() : createPlayerDataRemoteProduction();