import { OnStart, Service } from "@flamework/core";
import { ProfilesService } from "./Profile.service";
import { Events } from "../Networking";
import { TowerPartsUtils } from "@common/shared/utils/TowerParts.utils";
import { TowerPartsData } from "@common/shared/data/tower-parts/TowerParts.data";

@Service()
export class TowerPartsService implements OnStart {

    constructor(
        private readonly profilesService: ProfilesService,
    ) {}
    
    onStart(): void {
        Events.towerPartStand.drawTowerPart.connect((p) => this.drawTowerPart(p))
        Events.towerPartStand.buyCurrentTowerPart.connect((p) => this.buyCurrentTowerPart(p))
    }

    private buyCurrentTowerPart(player: Player) {
        const playerSession = this.profilesService.getPlayerSession(player.User.Id)
        if (!playerSession?.towerPartStand) return;

        const towerPartDatum = TowerPartsData[playerSession.towerPartStand.towerPartName];
        const hasEnoughCurrency = playerSession.currency >= towerPartDatum.price;
        if (!hasEnoughCurrency) {
            Events.messages.createError(player, "Not Enough Currency");
            return;
        }

        const success = this.profilesService.updateFields(player.User.Id, [
            {
                path: ["currency"],
                provider: (c) => c - towerPartDatum.price
            },
            {
                path: ["towerPartStand"],
                provider: (_) => undefined,
            }
        ])
        if (success) {
            Events.messages.createSuccess(player, `Bought ${towerPartDatum}`);
            Events.towerPartStand.setStandContent(player, undefined)
        }
    }

    private drawTowerPart(player: Player) {
        const drawnTowerPart = TowerPartsUtils.getRandomTowerPart()
        const success = this.profilesService.updateField(player.User.Id, ["towerPartStand"], (_) => ({
            towerPartName: drawnTowerPart
        }))

        if (success) {
            Events.towerPartStand.setStandContent.fire(player, drawnTowerPart)
        }
    }
}