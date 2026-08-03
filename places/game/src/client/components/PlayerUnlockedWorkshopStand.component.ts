import { DestroyableComponent } from "@common/shared/components/BaseComponents";
import { IUnlockedWorkshopStandAttributes, IWorkshopStandInstance } from "@common/shared/data/components-instances/WorkshopStand.instance";
import { Tags } from "@common/shared/Tags";
import { Component } from "@flamework/components";
import { OnStart } from "@flamework/core";
import { peek, subscribe } from "@rbxts/charm";
import { Players } from "@rbxts/services";
import { WorkshopStandSelector } from "../states/LocalSession.atom";
import { IUnlockedWorkshopStand, TWorkshopStand } from "@common/shared/profileStore/model/IUserSession";
import { EWorkshopStandState } from "@common/shared/data/workshops/EWorkshops";
import { ClassicProximityPrompt } from "../interfaces/proximity-prompts/classic-proximity-prompt";
import { BackpackUtils } from "@common/shared/utils/Backpack.utils";
import { BackpackController } from "../controllers/Backpack.controller";
import { Events } from "../Networking";

@Component({
    tag: Tags.PLAYER_UNLOCKED_WORKSHOP_STAND_TAG(Players.LocalPlayer.User.Id)
})
export class PlayerUnlockedWorkshopStandComponent extends DestroyableComponent<IUnlockedWorkshopStandAttributes, IWorkshopStandInstance> implements OnStart {
    private processingTowerPart: IUnlockedWorkshopStand["processingTowerPart"] = undefined;
    private depositInHandTowerPartProximityPrompt: ProximityPrompt;

    constructor(
        private readonly backpackController: BackpackController
    ) {
        super();
        this.depositInHandTowerPartProximityPrompt = ClassicProximityPrompt.Create();
        this.depositInHandTowerPartProximityPrompt.ActionText = "Insert"
        this.depositInHandTowerPartProximityPrompt.RequiresLineOfSight = false;
        this.depositInHandTowerPartProximityPrompt.HoldDuration = 0;
        this.depositInHandTowerPartProximityPrompt.MaxActivationDistance = 10;
        this.depositInHandTowerPartProximityPrompt.Parent = this.instance.ProximityPromptAnchor;
        this.depositInHandTowerPartProximityPrompt.Enabled = true;
        
        this.depositInHandTowerPartProximityPrompt.Triggered.Connect(() => Events.workshops.depositInHandTowerPart(this.attributes["workshopName"], this.attributes["workshopStandName"]))
    }

    onStart(): void {
        const unsubscribe = subscribe(WorkshopStandSelector(this.attributes["workshopName"], this.attributes["workshopStandName"]), (newVal) => this.onContentChanged(newVal))
        this.janitor.Add(() => unsubscribe())
        this.onContentChanged(peek(WorkshopStandSelector(this.attributes["workshopName"], this.attributes["workshopStandName"])))
        
        const connection = this.backpackController.onEquippedToolChanged.Connect(() => this.updateProximityPromptEnabled());
        this.janitor.Add(connection, "Disconnect");
    }

    private onContentChanged(newContent: TWorkshopStand) {
        if (newContent.state !== EWorkshopStandState.UNLOCKED) return;
        this.processingTowerPart = newContent.processingTowerPart;
        this.updateProximityPromptEnabled();
    }

    private updateProximityPromptEnabled() {
        const isProcessing = this.processingTowerPart !== undefined;
        const inHandTool = BackpackUtils.getEquippedTool(Players.LocalPlayer);
        const hasTowerPartInHand = inHandTool?.HasTag(Tags.TOWER_PART_TOOL_TAG) ?? false;
        this.depositInHandTowerPartProximityPrompt.Enabled = !isProcessing && hasTowerPartInHand;
        /// TODO: Verify if the in hand part can be given to this workshop, if not, disable the prompt
    }
} 