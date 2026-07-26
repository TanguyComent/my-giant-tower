import { OnStart, OnTick, Service } from "@flamework/core";
import { Players } from "@rbxts/services";
import { ProfilesService } from "./Profile.service"

@Service()
export class DailyStatsService implements OnTick {
    private RESET_CHECK_INTERVAL = 60 * 30;
    private lastCheckChunk = 0;

    constructor(
        private profileService: ProfilesService,
    ) {}
    
    onTick(dt: number): void {
        const now = DateTime.now().UnixTimestamp;
        const currentChunk = now - (now % this.RESET_CHECK_INTERVAL);

        if (currentChunk !== this.lastCheckChunk) {
            this.lastCheckChunk = currentChunk;
            for (const player of Players.GetPlayers()) {
                this.profileService.tryResetDailyStats(player);
            }
        }
    }
}