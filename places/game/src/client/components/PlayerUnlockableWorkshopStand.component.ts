import { DestroyableComponent } from "@common/shared/components/BaseComponents";
import { EWorkshopStandAttributes, iUnlockableWorkshopStandAttributes, IWorkshopStandInstance } from "@common/shared/data/components-instances/WorkshopStand.instance";
import { Tags } from "@common/shared/Tags";
import { Component } from "@flamework/components";
import { OnStart } from "@flamework/core";
import { Players } from "@rbxts/services";
import { ClassicProximityPrompt } from "../interfaces/proximity-prompts/classic-proximity-prompt";
import { WorkshopStandsData } from "@common/shared/data/workshops/WorkshopStands.data";
import { FormatUtils } from "@common/shared/utils/Format.utils";
import { Events } from "../Networking";

@Component({
    tag: Tags.PLAYER_UNLOCKABLE_WORKSHOP_STAND_TAG(Players.LocalPlayer.User.Id)
})
export class PlayerUnlockableWorkshopStandComponent extends DestroyableComponent<iUnlockableWorkshopStandAttributes, IWorkshopStandInstance> implements OnStart {

    onStart(): void {
        this.createUnlockStandProximityPrompt();
    }

    private createUnlockStandProximityPrompt() {
        const proximityPrompt = ClassicProximityPrompt.Create();
        const unlockPrice = WorkshopStandsData[this.attributes[EWorkshopStandAttributes.WORKSHOP_STAND_NAME]].unlockPrice;
        proximityPrompt.ActionText = `Unlock (${FormatUtils.formatCurrency(unlockPrice)})`;
        proximityPrompt.RequiresLineOfSight = false;
        proximityPrompt.HoldDuration = 0;
        proximityPrompt.MaxActivationDistance = 10;
        proximityPrompt.Parent = this.instance.ProximityPromptAnchor;
        proximityPrompt.Enabled = true;

        proximityPrompt.Triggered.Connect(() => Events.workshops.unlockNextWorkshopStand(this.attributes[EWorkshopStandAttributes.WORKSHOP_NAME]))
    }
}