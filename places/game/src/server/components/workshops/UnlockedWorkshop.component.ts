import { DestroyableComponent } from "@common/shared/components/BaseComponents";
import { EWorkshopStandAttributes, IUnlockedWorkshopStandAttributes, IWorkshopStandInstance } from "@common/shared/data/components-instances/WorkshopStand.instance";
import { ETowerParts } from "@common/shared/data/tower-parts/ETowerPart";
import { Tags } from "@common/shared/Tags";
import { Component } from "@flamework/components";

@Component({
    tag: Tags.UNLOCKED_WORKSHOP_STAND_TAG
})
export class UnlockedWorkshopComponent extends DestroyableComponent<IUnlockedWorkshopStandAttributes, IWorkshopStandInstance> {
    public setProcessingTowerPart(processedTowerPartName: ETowerParts, initialProgress: number) {
        this.instance.SetAttribute(EWorkshopStandAttributes.PROCESSING_TOWER_PART_NAME, processedTowerPartName);
        this.instance.SetAttribute(EWorkshopStandAttributes.PROCESSING_INITIAL_PROGRESS, initialProgress);
        this.instance.AddTag(Tags.PROCESSING_WORKSHOP_STAND_TAG);
        this.instance.AddTag(Tags.PLAYER_PROCESSING_WORKSHOP_STAND_TAG(this.attributes[EWorkshopStandAttributes.OWNER_ID]));
    }

    public clearProcessingTowerPart() {
        this.instance.RemoveTag(Tags.PROCESSING_WORKSHOP_STAND_TAG);
        this.instance.RemoveTag(Tags.PLAYER_PROCESSING_WORKSHOP_STAND_TAG(this.attributes[EWorkshopStandAttributes.OWNER_ID]));
        this.instance.SetAttribute(EWorkshopStandAttributes.PROCESSING_TOWER_PART_NAME, undefined);
        this.instance.SetAttribute(EWorkshopStandAttributes.PROCESSING_INITIAL_PROGRESS, undefined);
    }
}