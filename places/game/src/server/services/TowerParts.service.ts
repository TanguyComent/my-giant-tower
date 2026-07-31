import { OnStart, Service } from "@flamework/core";
import { ProfilesService } from "./Profile.service";
import { Events } from "../Networking";
import { TowerPartsUtils } from "@common/shared/utils/TowerParts.utils";
import { TowerPartsData } from "@common/shared/data/tower-parts/TowerParts.data";
import { BackpackUtils } from "@common/shared/utils/Backpack.utils";
import { Tags } from "@common/shared/Tags";
import { CommonEvents } from "@common/server/Networking";
import { ServerBackpackUtils } from "@game/shared/utils/ServerBackpack.utils";

@Service()
export class TowerPartsService implements OnStart {

    constructor(
        private readonly profilesService: ProfilesService,
    ) {}
    
    onStart(): void {
        Events.towerPartStand.drawTowerPart.connect((p) => this.drawTowerPart(p))
        Events.towerPartStand.buyCurrentTowerPart.connect((p) => this.buyCurrentTowerPart(p))
        Events.towerPartStand.deleteInHandTowerPart.connect((p) => this.deleteInHandTowerPart(p))
    }

    private deleteInHandTowerPart(player: Player) {
        const playerSession = this.profilesService.getPlayerSession(player.User.Id)
        if (!playerSession?.inHandTowerPart) return;

        const success = this.profilesService.updateField(player.User.Id, ["inHandTowerPart"], (_) => undefined)
        if (success) {
            const inHandTool = BackpackUtils.getEquippedTool(player);
            if (inHandTool && inHandTool.HasTag(Tags.TOWER_PART_TOOL_TAG)) {
                inHandTool.Destroy();
            }
            Events.messages.createSuccess(player, "Successfully deleted tower part from stand!");
        }
    }

    private buyCurrentTowerPart(player: Player) {
        const playerSession = this.profilesService.getPlayerSession(player.User.Id)
        if (!playerSession?.towerPartStand) return;

        const standContent = playerSession.towerPartStand;
        const towerPartDatum = TowerPartsData[standContent.towerPartName];
        const hasEnoughCurrency = playerSession.currency >= towerPartDatum.price;
        if (!hasEnoughCurrency) {
            Events.messages.createError(player, "Not Enough Currency");
            return;
        }

        const success = this.profilesService.updateFields(player.User.Id, [
            {
                path: ["currency"],
                provider: (c) => c - towerPartDatum.price,
            },
            {
                path: ["towerPartStand"],
                provider: (_) => undefined,
            },
            {
                path: ["inHandTowerPart"],
                provider: (_) => ({
                    towerPartName: standContent.towerPartName,
                })
            }
        ])

        if (success) {
            Events.messages.createSuccess(player, `Successfully bought ${towerPartDatum.displayName}!`);
            Events.towerPartStand.setStandContent(player, undefined)

            const towerPartTool = ServerBackpackUtils.addTowerPartToolToBackpack(player, standContent.towerPartName);
            if (!towerPartTool) {
                warn("[TowerPartsService.buyCurrentTowerPart] - Failed to add tower part tool to player's backpack");
                return;
            }

            const inHandTool = BackpackUtils.getEquippedTool(player);
            if (inHandTool) {
                if (inHandTool.HasTag(Tags.TOWER_PART_TOOL_TAG)) {
                    inHandTool.Destroy(); /// Overwrite the current tower part tool if the player has one
                }
            }

            CommonEvents.backpack.equipTool(player, towerPartTool)
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