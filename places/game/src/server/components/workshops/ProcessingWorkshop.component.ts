import { ProfilesService } from "@common/server/services/Profile.service";
import { DestroyableComponent } from "@common/shared/components/BaseComponents";
import { EWorkshopStandAttributes, IProcessingWorkshopStandAttributes, IWorkshopStandInstance } from "@common/shared/data/components-instances/WorkshopStand.instance";
import { TowerPartsData } from "@common/shared/data/tower-parts/TowerParts.data";
import { EWorkshopStandState } from "@common/shared/data/workshops/EWorkshops";
import { Tags } from "@common/shared/Tags";
import { Component, Components } from "@flamework/components";
import { Dependency, OnStart, OnTick } from "@flamework/core";
import { UnlockedWorkshopComponent } from "./UnlockedWorkshop.component";
import { PlotsService } from "@game/server/services/Plots.service";
import { Players } from "@rbxts/services";

@Component({
    tag: Tags.PROCESSING_WORKSHOP_STAND_TAG,
})
export class ProcessingWorkshopComponent extends DestroyableComponent<IProcessingWorkshopStandAttributes, IWorkshopStandInstance> implements OnStart, OnTick {
    private timeToProcess = TowerPartsData[this.attributes[EWorkshopStandAttributes.PROCESSING_TOWER_PART_NAME]].timeToProcess;
    private progress = this.attributes[EWorkshopStandAttributes.PROCESSING_INITIAL_PROGRESS];

    private onTickEnabled = true;

    constructor(
        private readonly profilesService: ProfilesService,
        private readonly plotsService: PlotsService,
    ) {
        super()
    }

    onStart(): void {
        
    }

    onTick(dt: number): void {
        if (!this.onTickEnabled) return;

        /// If needed, processing speed boosts can be applied here
        this.progress += dt;
        if (this.progress >= this.timeToProcess) {
            this.onTickEnabled = false;
            this.onProcessed();
        }
    }

    public getProgress = () => this.progress;

    private onProcessed() {
        /// TODO: Add processed tower part to the giant tower && send request to play animation on the client side
        const success = this.profilesService.updateFields(this.attributes[EWorkshopStandAttributes.OWNER_ID], [
            {
                path: ["workshops", this.attributes[EWorkshopStandAttributes.WORKSHOP_NAME], this.attributes[EWorkshopStandAttributes.WORKSHOP_STAND_NAME]],
                provider: (old) => {
                    if (old.state !== EWorkshopStandState.UNLOCKED) return old;
                    return {
                        ...old,
                        processingTowerPart: undefined
                    }
                }
            },
            {
                path: ["towerParts", this.attributes[EWorkshopStandAttributes.PROCESSING_TOWER_PART_NAME]],
                provider: (old) => ({
                    ...old,
                    amount: old.amount + 1,
                })
            }
        ])
        if (success) {
            const plotOwner = Players.GetPlayerByUserId(this.attributes[EWorkshopStandAttributes.OWNER_ID]);
            if (!plotOwner) {
                throw `[ProcessingWorkshopComponent.onProcessed] - Plot owner not found for userId ${this.attributes[EWorkshopStandAttributes.OWNER_ID]}`;
            }

            const unlockedWorkshopComponent = Dependency<Components>().getComponent<UnlockedWorkshopComponent>(this.instance);
            if (unlockedWorkshopComponent) {
                unlockedWorkshopComponent.clearProcessingTowerPart();
                this.plotsService.getPlayerPlot(plotOwner).then((plotComponent) => {
                    plotComponent.addTowerPart(this.attributes[EWorkshopStandAttributes.PROCESSING_TOWER_PART_NAME]);
                })
            } else {
                throw `[ProcessingWorkshopComponent.onProcessed] - UnlockedWorkshopComponent not found.`;
            }
        }
    }
}