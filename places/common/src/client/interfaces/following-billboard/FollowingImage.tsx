import { Workspace } from "@rbxts/services"
import { FollowingBillboard } from "./FollowingBillboard"
import React from "@rbxts/react"

export class FollowingImage extends FollowingBillboard {
    
    constructor(
        initialPivot: CFrame,
        targetPivot: CFrame,
        image: string,
        parent: Instance = Workspace
    ) {
        super(
            initialPivot, 
            targetPivot, 
            (
                <imagelabel
                    Image={image}
                    Size={UDim2.fromScale(1, 1)}
                    BackgroundTransparency={1}
                >
                    <uiaspectratioconstraint />
                </imagelabel>
            ),
            parent
        )

        const trail = new Instance("Trail");
        const a0 = new Instance("Attachment");
        const a1 = new Instance("Attachment");
        a0.Position = new Vector3(0, -0.5, 0);
        a1.Position = new Vector3(0, 0.5, 0);
        trail.Attachment0 = a0;
        trail.Attachment1 = a1;
        trail.Lifetime = 0.2;
        trail.FaceCamera = true;
        trail.Transparency = new NumberSequence(0, 0.2);
        trail.WidthScale = new NumberSequence(1, 0);
        trail.Color = new ColorSequence(Color3.fromRGB(252, 207, 0));
        a0.Parent = this.model.PrimaryPart;
        a1.Parent = this.model.PrimaryPart;
        trail.Parent = this.model.PrimaryPart;
        
        this.billboardGui.AlwaysOnTop = true;
        this.billboardGui.Size = UDim2.fromScale(1.5, 1.5);
    }
}