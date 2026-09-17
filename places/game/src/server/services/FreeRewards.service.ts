import { OnStart, Service } from "@flamework/core"
import { ProfilesService } from "./Profile.service"
import { Events } from "../Networking"
import { FREE_REWARD_CLAIM_COOLDOWN, GAME_GROUP_ID } from "@common/shared/GlobalConfig"
import { TowerPartsUtils } from "@common/shared/utils/TowerParts.utils"
import { FreeRewardsUtils } from "@common/shared/utils/FreeRewards.utils"
import { FormatUtils } from "@common/shared/utils/Format.utils"

@Service()
export class FreeRewardsService implements OnStart {
    
    constructor(
        private readonly profilesService: ProfilesService,
    ) {}
    
    onStart(): void {
        Events.freeReward.claim.connect((p) => this.onFreeRewardClaim(p))
    }

    private onFreeRewardClaim(player: Player) {
        const lastClaimedDate = this.profilesService.getField(player.User.Id, ["lastFreeRewardClaimDate"]);
        assert(lastClaimedDate !== undefined, `[FreeRewardsService.onFreeRewardClaim] lastFreeRewardClaimDate is undefined`);
        const now = DateTime.now().UnixTimestamp;
        
        if (lastClaimedDate + FREE_REWARD_CLAIM_COOLDOWN > now) {
            Events.messages.createError(player, `Next free reward available in ${FormatUtils.formatTime((lastClaimedDate + FREE_REWARD_CLAIM_COOLDOWN) - now)}`);
            return;
        }

        const isPlayerInGroup = player.IsInGroupAsync(GAME_GROUP_ID);
        if (!isPlayerInGroup) {
            Events.messages.createError(player, `You must like the game and join the group!`)
            return;
        }

        const playerSession = this.profilesService.getPlayerSession(player.User.Id);
        assert(playerSession, `[FreeRewardsService.onFreeRewardClaim] Player session not found when claiming free reward`);

        const currencyPerSec = TowerPartsUtils.getTowerGeneration(playerSession.towerParts, 1, {
            premiumMultiplierName: playerSession.currencyMultiplier,
        })
        const freeRewardAmount = FreeRewardsUtils.getFreeRewardCurrencyAmount(currencyPerSec);

        const success = this.profilesService.updateFields(player.User.Id, [
            {
                path: ["currency"],
                provider: (c) => c + freeRewardAmount,
            },
            {
                path: ["lastFreeRewardClaimDate"],
                provider: () => now,
            }
        ])

        if (success) {
            Events.messages.createSuccess(player, `You received $${FormatUtils.formatCurrency(freeRewardAmount)}!`);
        }
    }
} 