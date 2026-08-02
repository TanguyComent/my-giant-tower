import { DestroyableComponent } from "@common/shared/components/BaseComponents";
import { IUnlockedWorkshopStandAttributes, IWorkshopStandInstance } from "@common/shared/data/components-instances/WorkshopStand.instance";
import { Tags } from "@common/shared/Tags";
import { Component } from "@flamework/components";
import { OnStart } from "@flamework/core";
import { Players } from "@rbxts/services";

@Component({
    tag: Tags.PLAYER_UNLOCKABLE_WORKSHOP_STAND_TAG(Players.LocalPlayer.User.Id)
})
export class PlayerUnlockedWorkshopStandComponent extends DestroyableComponent<IUnlockedWorkshopStandAttributes, IWorkshopStandInstance> implements OnStart {

    onStart(): void {
        
    }
} 