import { ETowerPart } from "@common/shared/data/tower-parts/ETowerPart";
import { Tags } from "@common/shared/Tags";
import { Component } from "@flamework/components";
import { OnStart } from "@flamework/core";
import { AssignedTowerPartStandAttributes, TowerPartStandInstance } from "@common/shared/data/components-instances/TowerPartStand.instance";
import { Players } from "@rbxts/services";
import { TowerPartsUtils } from "@common/shared/utils/TowerParts.utils";
import { DestroyableComponent } from "@common/shared/components/BaseComponents";
import { ClassicProximityPrompt } from "../interfaces/proximity-prompts/classic-proximity-prompt";
import { Events } from "../Networking";

@Component({
    tag: Tags.PLAYER_ASSIGNED_TOWER_PART_STAND_TAG(Players.LocalPlayer.User.Id)
})
export class PlayerTowerPartStandComponent extends DestroyableComponent<AssignedTowerPartStandAttributes, TowerPartStandInstance> implements OnStart {
    
    private currentTowerPartModel?: {
        model: Model;
        buyPrompt: ProximityPrompt;
    }

    onStart(): void {

    }

    public async playTowerPartDrawAnimation(options?: { duration?: number; }) {
        const duration = options?.duration ?? 2;
        const amountOfDraws = 15;
        const drawInterval = duration / amountOfDraws;

        for (let i = 0; i < amountOfDraws; i++) {
            const randomTowerPart = TowerPartsUtils.getRandomTowerPart();
            const minScale = 0.35;
            const maxScale = 0.5;
            const towerPartModel = TowerPartsUtils.getTowerPartModelClone(randomTowerPart, math.random() * (maxScale - minScale) + minScale);
            towerPartModel.PivotTo(this.instance.ItemPosition.CFrame);

            const highlight = new Instance("Highlight");
            highlight.FillTransparency = 0
            highlight.OutlineTransparency = 0
            highlight.OutlineColor = Color3.fromRGB(255, 255, 255)
            highlight.FillColor = Color3.fromRGB(0, 0, 0)
            highlight.Parent = towerPartModel;
            highlight.DepthMode = Enum.HighlightDepthMode.Occluded;

            towerPartModel.Parent = this.instance;
            task.wait(drawInterval);
            towerPartModel.Destroy();
        }
    }

    public setCurrentTowerPart(towerPartName: ETowerPart) {
        this.destroyCurrentTowerPartModel();
        const towerPartModel = TowerPartsUtils.getTowerPartModelClone(towerPartName, 0.5);
        towerPartModel.PivotTo(this.instance.ItemPosition.CFrame);
        towerPartModel.Parent = this.instance;

        const buyPrompt = ClassicProximityPrompt.Create();
        buyPrompt.ActionText = `Buy`;
        buyPrompt.RequiresLineOfSight = false;
        buyPrompt.HoldDuration = 0.5;
        buyPrompt.MaxActivationDistance = 10;
        buyPrompt.Parent = towerPartModel.PrimaryPart;
        buyPrompt.Enabled = true;

        buyPrompt.Triggered.Connect(() => Events.towerPartStand.buyCurrentTowerPart());

        this.currentTowerPartModel = {
            model: towerPartModel,
            buyPrompt: buyPrompt
        }
    }

    public shiftCurrentTowerPartModel(): typeof this.currentTowerPartModel {
        const currentTowerPartModel = this.currentTowerPartModel;
        this.currentTowerPartModel = undefined;
        return currentTowerPartModel;
    }

    public destroyCurrentTowerPartModel() {
        if (!this.currentTowerPartModel) return;
        this.currentTowerPartModel.model.Destroy();
        this.currentTowerPartModel = undefined;
    }
}