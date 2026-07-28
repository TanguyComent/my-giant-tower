import { Tags } from "@common/shared/Tags";
import { BaseComponent, Component } from "@flamework/components";
import { OnStart } from "@flamework/core";
import { AssignedPlotAttributes, PlotInstance } from "@game/shared/data/components-instances/Plot.instance";
import { Players, TweenService } from "@rbxts/services";

@Component({
    tag: Tags.PLAYER_ASSIGNED_PLOT_TAG(Players.LocalPlayer.User.Id)
})
export class PlayerAssignedPlotComponent extends BaseComponent<AssignedPlotAttributes, PlotInstance> implements OnStart {
    private spinTowerPartsLeverProximityPrompt: ProximityPrompt = new Instance("ProximityPrompt");
    
    onStart(): void {
        this.setupLeverProximityPrompt(this.instance.Lever);
    }

    private setupLeverProximityPrompt(lever: typeof this.instance.Lever) {
        this.spinTowerPartsLeverProximityPrompt.ActionText = "Spin";
        this.spinTowerPartsLeverProximityPrompt.RequiresLineOfSight = false;
        this.spinTowerPartsLeverProximityPrompt.HoldDuration = 0;
        this.spinTowerPartsLeverProximityPrompt.MaxActivationDistance = 10;
        this.spinTowerPartsLeverProximityPrompt.Parent = lever.PrimaryPart;
        this.spinTowerPartsLeverProximityPrompt.Enabled = true;

        this.spinTowerPartsLeverProximityPrompt.Triggered.Connect(() => {
            this.spinTowerPartsLeverProximityPrompt.Enabled = false;
            this.rotateLever(lever).then(() => {
                this.spinTowerPartsLeverProximityPrompt.Enabled = true;
            })
        })
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