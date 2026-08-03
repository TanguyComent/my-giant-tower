import { Dependency, OnStart, Service } from "@flamework/core";
import { ProfilesService } from "./Profile.service";
import { Events } from "../Networking";
import { TowerPartsUtils } from "@common/shared/utils/TowerParts.utils";
import { TowerPartsData } from "@common/shared/data/tower-parts/TowerParts.data";
import { BackpackUtils } from "@common/shared/utils/Backpack.utils";
import { Tags } from "@common/shared/Tags";
import { CommonEvents } from "@common/server/Networking";
import { ServerBackpackUtils } from "@game/shared/utils/ServerBackpack.utils";
import { EWorkshops, EWorkshopsStands, EWorkshopStandState } from "@common/shared/data/workshops/EWorkshops";
import { Components } from "@flamework/components";
import { UnlockedWorkshopComponent } from "../components/workshops/UnlocedWorkshop.component";
import { EWorkshopStandAttributes } from "@common/shared/data/components-instances/WorkshopStand.instance";
import Object from "@rbxts/object-utils";
import { ProcessingWorkshopComponent } from "../components/workshops/ProcessingWorshop.component";

@Service()
export class TowerPartsService implements OnStart {

    constructor(
        private readonly profilesService: ProfilesService,
    ) {}
    
    onStart(): void {
        Events.towerPartStand.drawTowerPart.connect((p) => this.drawTowerPart(p))
        Events.towerPartStand.buyCurrentTowerPart.connect((p) => this.buyCurrentTowerPart(p))
        Events.towerPartStand.deleteInHandTowerPart.connect((p) => this.deleteInHandTowerPart(p))
        Events.workshops.depositInHandTowerPart.connect((p, wn, wsn) => this.depositInHandTowerPart(p, wn, wsn))
        this.profilesService.beforeProfileSaveProviders.push((player, session) => {
            const processingWorkshops = Dependency<Components>().getAllComponents<ProcessingWorkshopComponent>().filter((c) => {
                return c.attributes[EWorkshopStandAttributes.OWNER_ID] === player.User.Id
            })
            processingWorkshops.forEach((workshop) => {
                const workshopName = workshop.attributes[EWorkshopStandAttributes.WORKSHOP_NAME];
                const workshopStandName = workshop.attributes[EWorkshopStandAttributes.WORKSHOP_STAND_NAME];
                if (session.workshops[workshopName][workshopStandName].state !== EWorkshopStandState.UNLOCKED || !session.workshops[workshopName][workshopStandName].processingTowerPart) return;
                session.workshops[workshopName][workshopStandName].processingTowerPart.processingInitialProgress = workshop.getProgress();
            })

            return session;
        })
    }

    private depositInHandTowerPart(player: Player, workshopName: EWorkshops, workshopStandName: EWorkshopsStands) {
        const playerSession = this.profilesService.getPlayerSession(player.User.Id)
        if (!playerSession?.inHandTowerPart) return;

        const workshopStand = playerSession.workshops[workshopName][workshopStandName];
        if (workshopStand.state !== EWorkshopStandState.UNLOCKED) return;
        if (workshopStand.processingTowerPart !== undefined) {
            Events.messages.createError(player, "This workshop is already working!");
            return;
        }
        
        const inHandTowerPart = playerSession.inHandTowerPart;
        if (!inHandTowerPart) return;
        const towerPartDatum = TowerPartsData[inHandTowerPart.towerPartName];
        const canProcess = towerPartDatum.workshipProcessor === workshopName;
        if (!canProcess) {
            Events.messages.createError(player, "This tower part cannot be processed in this workshop!");
            return;
        }

        const success = this.profilesService.updateFields(player.User.Id, [
            {
                path: ["inHandTowerPart"],
                provider: () => undefined,
            },
            {
                path: ["workshops", workshopName, workshopStandName],
                provider: (old) => {
                    if (old.state !== EWorkshopStandState.UNLOCKED) return old;
                    return {
                        ...old,
                        processingTowerPart: {
                            towerPartName: inHandTowerPart.towerPartName,
                            processingInitialProgress: 0,
                        }
                    }
                }
            }
        ])

        if (success) {
            const inHandTool = BackpackUtils.getEquippedTool(player);
            if (inHandTool && inHandTool.HasTag(Tags.TOWER_PART_TOOL_TAG)) {
                inHandTool.Destroy();
            }

            const workshopComponent = Dependency<Components>().getAllComponents<UnlockedWorkshopComponent>().find((c) => {
                return c.attributes[EWorkshopStandAttributes.WORKSHOP_NAME] === workshopName &&
                    c.attributes[EWorkshopStandAttributes.WORKSHOP_STAND_NAME] === workshopStandName &&
                    c.attributes[EWorkshopStandAttributes.OWNER_ID] === player.User.Id;
            })
            if (workshopComponent) {
                workshopComponent.setProcessingTowerPart(inHandTowerPart.towerPartName, 0);
            } else {
                warn(`[TowerPartsService.depositInHandTowerPart] - Workshop component not found.`);
            }
        }
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