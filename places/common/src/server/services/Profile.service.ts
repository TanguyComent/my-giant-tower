import { Janitor } from "@rbxts/janitor";
import ProfileStore from "@rbxts/profile-store";
import { MarketplaceService, Players } from "@rbxts/services";
import { UserTemplate } from "@common/shared/profileStore/UserTemplate";
import Signal from "@rbxts/signal"
import { IS_DEVELOP } from "@common/shared/GlobalConfig"
import { CommonEvents, CommonFunctions } from "../Networking"
import { OnStart, OnTick, Service } from "@flamework/core"
import { LastRemoteDataType, Migrator } from "../migrations/MigrationManager";
import Object, { deepCopy } from "@rbxts/object-utils";
import { IUserSession } from "@common/shared/profileStore/model/IUserSession";
import { PathsUtils } from "@common/shared/utils/Paths.utils";
import { EGamePasses } from "@common/shared/marketplace/EGamePasses";
import { EWorkshops, EWorkshopsStands, EWorkshopStandState } from "@common/shared/data/workshops/EWorkshops";
import { ETowerParts } from "@common/shared/data/tower-parts/ETowerPart";

type FieldUpdate<P extends PathsUtils.Path<IUserSession>> = {
    path: P;
    provider: (value: PathsUtils.PathValue<IUserSession, P>) => PathsUtils.PathValue<IUserSession, P>;
};

@Service()
export class ProfilesService implements OnStart, OnTick {
    public readonly janitor = new Janitor()
    public readonly userStore = ProfileStore.New(`${IS_DEVELOP ? "DEVELOP" : "RELEASE"}-User-Profiles`, UserTemplate);
    public readonly profiles = new Map<number, ProfileStore.Profile<LastRemoteDataType, object>>()
    public readonly playerSessionMap = new Map<number, IUserSession>();
    public readonly onLastSave = new Signal<(player: Player, reason: "Manual" | "External" | "Shutdown") => void>();

    public readonly onProfileLoaded = new Signal<(player: Player) => void>();
    public readonly beforeProfileSaveProviders = new Array<(player: Player, profile: IUserSession) => IUserSession>();

    onStart() {
        for (const player of Players.GetPlayers()) {
            this.onPlayerAdded(player);
        }

        const playerAdded = Players.PlayerAdded.Connect((player) => this.onPlayerAdded(player));
        const playerRemoving = Players.PlayerRemoving.Connect((player) => this.onPlayerRemoved(player));

        this.janitor.Add(playerAdded, "Disconnect");
        this.janitor.Add(playerRemoving, "Disconnect");

        CommonFunctions.isProfileLoaded.setCallback((player) => this.isProfileLoaded(player))
        CommonFunctions.getSession.setCallback((player) => this.getPlayerSession(player.User.Id))
    }

    onTick(dt: number): void {}

    private transformRemoteDataToSession(player: Player, remoteData: LastRemoteDataType): IUserSession {
        const now = DateTime.now().UnixTimestamp;

        const offlineTime = now - (remoteData.dates.lastDeconnectionDate ?? now);
        const session: IUserSession = {
            currency: remoteData.currency,
            towerCurrency: remoteData.towerCurrency,
            UtcLastConnection: remoteData.UtcLastConnection,
            UtcOffset: remoteData.UtcOffset,
            dailyStats: remoteData.dailyStats,
            globalStats: remoteData.globalStats,
            boughtGamePasses: remoteData.boughtGamePasses,
            purchases: remoteData.purchases,
            settings: remoteData.settings,
            dates: {
                ...remoteData.dates,
                sessionStartDate: now,
            },
            inHandTowerPart: remoteData.inHandTowerPart,
            workshops: Object.values(EWorkshops).reduce((acc, workshipName) => {
                acc[workshipName] = Object.values(EWorkshopsStands).reduce((acc2, workshipStandName) => {
                    const remoteWorkshipStand = remoteData.workshops[workshipName]?.[workshipStandName];
                    acc2[workshipStandName] = remoteWorkshipStand ?? {
                        state: EWorkshopStandState.LOCKED,
                    }
                    return acc2;
                }, {} as IUserSession["workshops"][typeof workshipName])
                return acc;
            }, {} as IUserSession["workshops"]),
            towerParts: Object.values(ETowerParts).reduce((acc, towerPartName) => {
                acc[towerPartName] = remoteData.towerParts[towerPartName] ?? {
                    amount: 0
                }
                return acc;
            }, {} as IUserSession["towerParts"])
        }

        return session;
    }

    private transformSessionToRemoteData(player: Player, session: IUserSession): LastRemoteDataType {
        this.beforeProfileSaveProviders.forEach((provider) => session = provider(player, session))
        const now = DateTime.now().UnixTimestamp;

        return {
            currentVersion: 1,
            currency: session.currency,
            towerCurrency: session.towerCurrency,
            UtcLastConnection: session.UtcLastConnection,
            UtcOffset: session.UtcOffset,
            dailyStats: session.dailyStats,
            globalStats: {
                ...session.globalStats,
                playTime: session.globalStats.playTime + (now - session.dates.sessionStartDate),
            },
            boughtGamePasses: session.boughtGamePasses,
            purchases: session.purchases,
            settings: session.settings,
            dates: {
                ...session.dates,
                sessionStartDate: now,
                lastDeconnectionDate: now,
            },
            inHandTowerPart: session.inHandTowerPart,
            workshops: Object.entries(session.workshops).reduce((acc, [workshipName, workshipStands]) => {
                let shouldSaveWorkship = false;
                acc[workshipName] = Object.entries(workshipStands).reduce((acc2, [workshipStandName, workshipStand]) => {
                    let shouldSaveWorkshipStand = workshipStand.state !== EWorkshopStandState.LOCKED;
                    if (shouldSaveWorkshipStand) {
                        acc2[workshipStandName] = workshipStand;
                    }
                    shouldSaveWorkship = shouldSaveWorkship || shouldSaveWorkshipStand;
                    return acc2;
                }, {} as NonNullable<LastRemoteDataType["workshops"][typeof workshipName]>)
                if (!shouldSaveWorkship) {
                    delete acc[workshipName];
                }
                return acc;
            }, {} as LastRemoteDataType["workshops"]),
            towerParts: Object.entries(session.towerParts).reduce((acc, [towerPartName, towerPartEntry]) => {
                if (towerPartEntry.amount > 0) {
                    acc[towerPartName] = towerPartEntry;
                }
                return acc;
            }, {} as LastRemoteDataType["towerParts"])
        }
    }

    private onPlayerAdded(player: Player) {
        if (this.profiles.has(player.User.Id)) return;
        const profile = this.userStore.StartSessionAsync(tostring(player.User.Id), {Cancel: () => player.Parent !== Players});
        const profileJanitor = new Janitor();
        if (!profile) {
            warn(`Failed to load profile for player ${player.Name} (${player.User.Id})`);
            player.Kick("Failed to load profile.");
            return
        }

        profile.AddUserId(player.User.Id);
        profile.Data = Migrator.migrate(profile.Data);
        const lastSaveConnection = profile.OnLastSave.Connect((reason) => this.onLastSave.Fire(player, reason))
        profileJanitor.Add(lastSaveConnection, "Disconnect")
        this.profiles.set(player.User.Id, profile);
        
        const sessionEndConnection = profile.OnSessionEnd.Connect(() => {
            this.onSessionEnd(player)
            profileJanitor.Destroy();
        })
        profileJanitor.Add(sessionEndConnection, "Disconnect")

        const saveConnection = profile.OnSave.Connect(() => this.beforeProfileSave(player))
        profileJanitor.Add(saveConnection, "Disconnect")

        if (player.Parent !== Players) {
            profile.EndSession()
        }
        
        this.setPlayerSession(player.User.Id, this.transformRemoteDataToSession(player, profile.Data))
        
        const playerSession = this.getPlayerSession(player.User.Id)
        if (!playerSession) {
            player.Kick("Failed to initialize session.");
            return;
        }
        
        this.tryResetDailyStats(player);
        this.reloadOwnedGamePasses(player);
        this.onProfileLoaded.Fire(player);
        print(`Profile loaded for player ${player.Name}`);
        CommonEvents.onProfileLoaded.fire(player, playerSession)
    }


    private onPlayerRemoved(player: Player) {
        const profile = this.profiles.get(player.User.Id);
        
        if (profile) {
            profile.EndSession();
            this.profiles.delete(player.User.Id);
        }
    }

    private beforeProfileSave(player: Player) {
        const profile = this.profiles.get(player.User.Id);
        if (!profile) return;

        const session = this.getPlayerSession(player.User.Id)
        if (!session) return;

        profile.Data = this.transformSessionToRemoteData(player, session);
    }

    private onSessionEnd(player: Player) {
        this.tryResetDailyStats(player)
        const profile = this.profiles.get(player.User.Id);
        
        if (profile) {
            profile.EndSession();
        }

        this.playerSessionMap.delete(player.User.Id);
    }

    isProfileLoaded(player: Player): boolean {
        return this.playerSessionMap.has(player.User.Id);
    }

    setPlayerSession(playerId: number, data: IUserSession) {
        this.playerSessionMap.set(playerId, data);
    }

    getPlayerSession(playerId: number): IUserSession | undefined {
        return this.playerSessionMap.get(playerId);
    }

    updateField<P extends PathsUtils.Path<IUserSession>>(
        playerId: number,
        path: P,
        provider: (value: PathsUtils.PathValue<IUserSession, P>) => PathsUtils.PathValue<IUserSession, P>,
        refreshClient = true
    ) {
        const data = this.getPlayerSession(playerId);
        if (!data) return false;

        const currentValue = PathsUtils.get(data, path);
        const newValue = provider(currentValue);
        PathsUtils.set(data, path, newValue);
        this.setPlayerSession(playerId, data);

        if (refreshClient) {
            const player = Players.GetPlayerByUserId(playerId);
            if (!player) return false;
            CommonEvents.onFieldUpdated.fire(player, path as string[], newValue);
        }
        
        return true
    }

    updateFields<T extends PathsUtils.Path<IUserSession>[]>(
        playerId: number,
        fields: { [K in keyof T]: FieldUpdate<T[K]> },
        refreshClient = true
    ) {
        const data = this.getPlayerSession(playerId);
        if (!data) return false;

        for (const { path, provider } of fields) {
            const currentValue = PathsUtils.get(data, path);
            const newValue = provider(currentValue);
            PathsUtils.set(data, path, newValue);
        }

        this.setPlayerSession(playerId, data);

        if (refreshClient) {
            const player = Players.GetPlayerByUserId(playerId);
            if (!player) return false;
            CommonEvents.onFieldsUpdated.fire(player, fields.map(({ path }) => {
                return {
                    field: path as string[],
                    value: PathsUtils.get(data, path)!
                }
            }));
        }
        
        return true;
    }

    setField<P extends PathsUtils.Path<IUserSession>>(
        playerId: number,
        field: P,
        value: PathsUtils.PathValue<IUserSession, P>,
        refreshClient = true
    ) {
        return this.updateField(playerId, field, () => value, refreshClient);
    }

    setFields<P extends PathsUtils.Path<IUserSession>>(
        playerId: number,
        fields: Array<{
            field: P,
            value: PathsUtils.PathValue<IUserSession, P>
        }>,
        refreshClient = true
    ) {
        return this.updateFields(playerId, fields.map(({ field, value}) => {
            return {
                path: field,
                provider: () => value
            }
        }), refreshClient);
    }

    getField<P extends PathsUtils.Path<IUserSession>>(
        playerId: number,
        field: P
    ): PathsUtils.PathValue<IUserSession, P> | undefined {
        const data = this.getPlayerSession(playerId);
        if (!data) return undefined;
        return PathsUtils.get(data, field);
    }

    private reloadOwnedGamePasses(player: Player) {
        const playerSession = this.getPlayerSession(player.User.Id);
        if (!playerSession) return;

        for (const gamePassId of Object.values(EGamePasses)) {
            const hasPass = playerSession.boughtGamePasses[gamePassId as EGamePasses]?.owned === true;
            if (hasPass) continue; /// The player already has the pass, no need to check with Roblox API
            
            const ownsPass = MarketplaceService.UserOwnsGamePassAsync(player.User, gamePassId);
            if (ownsPass) {
                this.updateField(player.User.Id, ["boughtGamePasses"], (prev) => {
                    return {
                        ...prev,
                        [gamePassId as EGamePasses]: {
                            owned: true
                        }
                    }
                });
            }
        }
    }

    public tryResetDailyStats(player: Player) {
        const utcLastConnection = this.getField(player.User.Id, ["UtcLastConnection"]) 
        if (utcLastConnection === undefined) {
            this.actualizeUtcOffset(player.User.Id)
            this.actualizeLastConnectionDate(player.User.Id)
            return
        }

        const utcOffset = this.getField(player.User.Id, ["UtcOffset"])
        if (utcOffset === undefined) {
            this.actualizeUtcOffset(player.User.Id)
            this.actualizeLastConnectionDate(player.User.Id)
            return
        }

        const offsetInSeconds = utcOffset * 60
        const localizedLastConnectionDate = DateTime.fromUnixTimestamp(utcLastConnection + offsetInSeconds).ToUniversalTime()
        const currentLocalizedDate = DateTime.fromUnixTimestamp(DateTime.now().UnixTimestamp + offsetInSeconds).ToUniversalTime()

        const normalizedLastConnectionTimeStamp = DateTime.fromUniversalTime(localizedLastConnectionDate.Year, localizedLastConnectionDate.Month, localizedLastConnectionDate.Day, 0, 0, 0)
        const normalizedCurrentTimeStamp = DateTime.fromUniversalTime(currentLocalizedDate.Year, currentLocalizedDate.Month, currentLocalizedDate.Day, 0, 0, 0)

        this.actualizeLastConnectionDate(player.User.Id)

        const hasBeenConnectedToday = normalizedLastConnectionTimeStamp.UnixTimestamp === normalizedCurrentTimeStamp.UnixTimestamp
        if (hasBeenConnectedToday) return

        const hasBrokenConnectionStreak = (normalizedCurrentTimeStamp.UnixTimestamp - 24 * 60 * 60) !== normalizedLastConnectionTimeStamp.UnixTimestamp
        if (hasBrokenConnectionStreak) {
            this.actualizeUtcOffset(player.User.Id)
        }

        this.resetDailyStats(player.User.Id)
    }

    private resetDailyStats(userId: number) {
        this.setField(userId, ["dailyStats"], deepCopy(UserTemplate.dailyStats));
    }

    private actualizeLastConnectionDate(userId: number) {
        this.setField(userId, ["UtcLastConnection"], os.time(os.date('!*t')));
    }

    private actualizeUtcOffset(playerId: number) {
        const player = Players.GetPlayerByUserId(playerId)
        if (player === undefined) return

        CommonFunctions.getUtcOffset(player).then((offset) => {
            const clampedOffset = math.clamp(offset, -720, 840)
            this.updateField(playerId, ["UtcOffset"], () => clampedOffset)
        })
    }
}