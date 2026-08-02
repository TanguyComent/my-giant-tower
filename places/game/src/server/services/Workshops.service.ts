import { EWorkshops, EWorkshopStandState } from "@common/shared/data/workshops/EWorkshops";
import { OnStart, Service } from "@flamework/core";
import { Events } from "../Networking";
import { PlotsService } from "./Plots.service";
import { ProfilesService } from "./Profile.service";
import { WorkshopsUtils } from "@common/shared/utils/Workshops.utils";
import { WorkshopStandsData } from "@common/shared/data/workshops/WorkshopStands.data";
import { PlayerService } from "./Player.service";

@Service()
export class WorkshopsService implements OnStart {

    constructor(
        private readonly playersService: PlayerService,
        private readonly profilesService: ProfilesService,
        private readonly plotsService: PlotsService,
    ) {}

    onStart(): void {
        Events.workshops.unlockNextWorkshopStand.connect((player, workshopName) => this.tryUnlockNextWorkshopStand(player, workshopName))    
    }

    private tryUnlockNextWorkshopStand(player: Player, workshopName: EWorkshops) {
        const playerSession = this.profilesService.getPlayerSession(player.User.Id);
        assert(playerSession, `[WorkshopsService.tryUnlockNextWorkshopStand] - Player ${player.User.Id} session not found.`);

        const nextStandToUnlock = WorkshopsUtils.getNextWorkshopStandToUnlock(workshopName, playerSession.workshops);
        if (!nextStandToUnlock) return;

        const standDatum = WorkshopStandsData[nextStandToUnlock];
        if (!this.playersService.hasEnoughCurrency(player.User.Id, standDatum.unlockPrice)) {
            Events.messages.createError(player, "Not enough currency to unlock this workshop stand.");
            return;
        }

        const success = this.profilesService.updateFields(player.User.Id, [
            {
                path: ["currency"],
                provider: (prev) => prev - standDatum.unlockPrice
            },
            {
                path: ["workshops", workshopName, nextStandToUnlock],
                provider: (prev) => {
                    return {
                        ...prev,
                        state: EWorkshopStandState.UNLOCKED,
                    }
                }
            }
        ])
        
        if (success) {
            this.plotsService.getPlayerPlot(player).then(plot => {
                plot.destroyTranslucentWorkshopStandModel(workshopName);
                plot.createWorkshopStandModel(workshopName, nextStandToUnlock);
                plot.tryCreateWorkshopTranslucentModel(workshopName);
            })
        }
    }
}
