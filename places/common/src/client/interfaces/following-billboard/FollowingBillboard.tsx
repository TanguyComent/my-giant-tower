import { BaseBillboard } from "@common/shared/interfaces/classes/BaseBillboard"
import { AnimationsUtils } from "@common/shared/utils/AnimationsUtils"
import { InstancesUtils } from "@common/shared/utils/Instances.utils"
import { Players, Workspace } from "@rbxts/services"

export class FollowingBillboard extends BaseBillboard {
    protected model: Model;

    constructor(
        initialPivot: CFrame, 
        targetPivot: CFrame, 
        app: JSX.Element,
        parent: Instance = Workspace
    ) {
        const part = InstancesUtils.createDummyPart();
        const model = new Instance("Model");
        part.Parent = model;
        model.PrimaryPart = part;
        part.CFrame = initialPivot;
        model.Parent = parent;
        super(model, "FollowingBillboard");
        this.model = model;
        
        this.render(app);
        this.bringModelToTarget(targetPivot).then(() => this.startFollowingPlayer())
    }
    
    private async bringModelToTarget(targetPivot: CFrame) {
        await AnimationsUtils.bringModelInCurveToAsync(this.model, targetPivot, 0.5)
    }

    private async startFollowingPlayer() {
        const epsilon = 0.5;
        let player = Players.LocalPlayer;
        let speed = 20;

        do {
            const playerPosition = player.Character?.PrimaryPart?.Position;
            if (!playerPosition) {
                task.wait();
                continue;
            }

            const substraction = playerPosition.sub(this.model.GetPivot().Position);
            const directionTowardsPlayer = substraction.Unit;
            const distance = substraction.Magnitude;
            if (distance > epsilon) {
                const tick = task.wait();
                const traveledDistance = speed * tick;
                speed = speed + speed * tick;
                const newPosition = this.model.GetPivot().Position.add(directionTowardsPlayer.mul(traveledDistance));
                this.model.PivotTo(new CFrame(newPosition));
            } else {
                this.destroy();
                break;
            }
        } while (true);
    }

    override destroy(): void {
        super.destroy();
        this.model.Destroy();
    }
}