import { Tags } from "@common/shared/Tags";
import { Component, Components } from "@flamework/components";
import { Dependency, OnStart } from "@flamework/core";
import { AssignedPlotAttributes, PlotInstance } from "@common/shared/data/components-instances/Plot.instance";
import { Players, TweenService } from "@rbxts/services";
import { Events } from "../Networking";
import { PlayerTowerPartStandComponent } from "./PlayerTowerPartStand.component";
import { ETowerPart } from "@common/shared/data/tower-parts/ETowerPart";
import { DestroyableComponent } from "@common/shared/components/BaseComponents";
import { ClassicProximityPrompt } from "../interfaces/proximity-prompts/classic-proximity-prompt";

@Component({
    tag: Tags.PLAYER_ASSIGNED_PLOT_TAG(Players.LocalPlayer.User.Id)
})
export class PlayerAssignedPlotComponent extends DestroyableComponent<AssignedPlotAttributes, PlotInstance> implements OnStart {
    private spinTowerPartsLeverProximityPrompt: ProximityPrompt = ClassicProximityPrompt.Create();
    
    onStart(): void {
        this.setupLeverProximityPrompt(this.instance.Lever);
        const c1 = Events.towerPartStand.setStandContent.connect((towerPartName) => this.onTowerPartDrawn(towerPartName));
        this.janitor.Add(c1, "Disconnect");
    }

    private onTowerPartDrawn(towerPartName: ETowerPart | undefined) {
        const towerPartStandComponent = Dependency<Components>().getComponent<PlayerTowerPartStandComponent>(this.instance.Stand);
        if (!towerPartStandComponent) {
            warn("[PlayerAssignedPlotComponent.onTowerPartDrawn] - PlayerTowerPartStandComponent not found on Stand instance");
            return;
        }

        towerPartStandComponent.destroyCurrentTowerPartModel();
        if (towerPartName) {
            this.spinTowerPartsLeverProximityPrompt.Enabled = false;

            const promises: Promise<void>[] = []
            const p1 = towerPartStandComponent.playTowerPartDrawAnimation().then(() => {
                towerPartStandComponent.setCurrentTowerPart(towerPartName);
            })
            promises.push(p1);

            const p2 = this.rotateLever(this.instance.Lever)
            promises.push(p2);

            Promise.all(promises).then(() => this.spinTowerPartsLeverProximityPrompt.Enabled = true)
        }
    }

    private setupLeverProximityPrompt(lever: typeof this.instance.Lever) {
        this.spinTowerPartsLeverProximityPrompt.ActionText = "Spin";
        this.spinTowerPartsLeverProximityPrompt.RequiresLineOfSight = false;
        this.spinTowerPartsLeverProximityPrompt.HoldDuration = 0;
        this.spinTowerPartsLeverProximityPrompt.MaxActivationDistance = 10;
        this.spinTowerPartsLeverProximityPrompt.Parent = lever.PrimaryPart;
        this.spinTowerPartsLeverProximityPrompt.Enabled = true;
        this.spinTowerPartsLeverProximityPrompt.Triggered.Connect(() => Events.towerPartStand.drawTowerPart());
    }

    private async rotateLever(lever: typeof this.instance.Lever) {
        const initialPivotCFrame = lever.Pivot.CFrame
        const targetPivotCFrame = initialPivotCFrame.Rotation.mul(CFrame.Angles(0, 0, math.rad(70))).add(initialPivotCFrame.Position)

        const tweenInfo = new TweenInfo(0.5, Enum.EasingStyle.Quad, Enum.EasingDirection.InOut, 0, true, 0)
        const tween = TweenService.Create(lever.Pivot, tweenInfo, { CFrame: targetPivotCFrame })

        tween.Play()
        tween.Completed.Wait()
    }
}