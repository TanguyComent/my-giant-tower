import { PriorityHandler } from "@common/shared/class/PriorityHandler.class"
import { Controller, OnStart } from "@flamework/core";
import { Janitor } from "@rbxts/janitor"
import { Lighting, Players, TweenService, Workspace } from "@rbxts/services";

export enum ECameraFovPriority {
    DEFAULT = 0,
    INTERFACE = 100,
}

@Controller()
export class CameraController implements OnStart {
    public readonly initialFOV: number = Workspace.CurrentCamera ? Workspace.CurrentCamera.FieldOfView : 70;
    private blurEffect: BlurEffect;

    private positionBeforeForceMovement: CFrame | undefined;

    private fovQueue: PriorityHandler<{ priority: number, targetFOV: number, tweenInfo: TweenInfo }> = new PriorityHandler();
    private activeFovTween: Tween | undefined = undefined;

    private interfaceModeJanitor = new Janitor();

    constructor() {
        this.blurEffect = new Instance("BlurEffect")
        this.blurEffect.Size = 0
        this.blurEffect.Parent = Lighting
    }

    onStart(): void {
        this.fovQueue.addItem({ priority: ECameraFovPriority.DEFAULT, targetFOV: this.initialFOV, tweenInfo: new TweenInfo(0.22, Enum.EasingStyle.Back, Enum.EasingDirection.Out) });
        this.fovQueue.onActiveItemChanged.Connect((newActiveItem) => {
            if (!newActiveItem) return;
            const camera = Workspace.CurrentCamera;
            if (!camera) return;
            
            if (this.activeFovTween) {
                this.activeFovTween.Cancel();
            }
            this.activeFovTween = TweenService.Create(camera, newActiveItem.tweenInfo, { FieldOfView: newActiveItem.targetFOV });
            this.activeFovTween.Completed.Once((playstate) => {
                if (playstate === Enum.PlaybackState.Completed) {
                    this.activeFovTween = undefined;
                }
            })
            this.activeFovTween.Play();
        })
    }

    public requestCameraFOV(priority: number, targetFOV: number, tweenInfo: TweenInfo) {
        return this.fovQueue.addItem({ priority, targetFOV, tweenInfo });
    }

    public tweenBlurSize(targetSize: number, tweenInfo: TweenInfo) {
        const tween = game.GetService("TweenService").Create(this.blurEffect, tweenInfo, { Size: targetSize });
        tween.Play();
    }

    public setInInterfaceMode(inInterface: boolean, options?: {fovFactor?: number; blurSize?: number}) {
        if (inInterface) {
            const removeFovChange = this.requestCameraFOV(ECameraFovPriority.INTERFACE, this.initialFOV * (options?.fovFactor ?? 1.3), new TweenInfo(0.22, Enum.EasingStyle.Back, Enum.EasingDirection.Out));
            this.tweenBlurSize(options?.blurSize ?? 12, new TweenInfo(0.22, Enum.EasingStyle.Back, Enum.EasingDirection.Out));
            this.interfaceModeJanitor.Add(() => removeFovChange());
        } else {
            this.requestCameraFOV(ECameraFovPriority.DEFAULT, this.initialFOV, new TweenInfo(0.22, Enum.EasingStyle.Back, Enum.EasingDirection.Out));
            this.tweenBlurSize(0, new TweenInfo(0.22, Enum.EasingStyle.Back, Enum.EasingDirection.Out));
        }
    }

    public moveCameraTo(CFrame: CFrame, duration: number, easingStyle: Enum.EasingStyle): Promise<void> {
        const camera = Workspace.CurrentCamera;
        if (!camera) return Promise.resolve();

        if (camera.CameraType === Enum.CameraType.Custom) { /// Was controlled by player before
            this.positionBeforeForceMovement = camera.CFrame;
        }

        this.updateCameraType(Enum.CameraType.Scriptable);
        const tweenInfo = new TweenInfo(duration, easingStyle);
        const tween = TweenService.Create(camera, tweenInfo, { CFrame: CFrame });
        return new Promise((resolve) => {
            tween.Completed.Connect(() => resolve())
            tween.Play();
        })
    }

    public bringCameraBackToCharacter(duration: number, easingStyle: Enum.EasingStyle): Promise<void> {
        if (!this.positionBeforeForceMovement) return Promise.resolve();

        return this.moveCameraTo(this.positionBeforeForceMovement, duration, easingStyle).andThen(() => {
            this.updateCameraType(Enum.CameraType.Custom);
            this.positionBeforeForceMovement = undefined;
        });
    }

    public updateCameraType(cameraType: Enum.CameraType) {
        const camera = Workspace.CurrentCamera;
        if (!camera) return;

        camera.CameraType = cameraType;
    }
}