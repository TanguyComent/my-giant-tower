import { DestroyableComponent } from "@common/shared/components/BaseComponents"
import { Component } from "@flamework/components";
import { Janitor } from "@rbxts/janitor";
import { TweenService } from "@rbxts/services";
import { Zone } from "@rbxts/zone-plus";

export interface IPressButtonInstance extends Model {
    Zone: BasePart;
    Button: BasePart;
}

@Component()
export abstract class BasePressButton<A extends {} = {}, I extends IPressButtonInstance = IPressButtonInstance> extends DestroyableComponent<A, I> {
    protected static ButtonColors = {
        Green: Color3.fromRGB(0, 255, 0),
        Yellow: Color3.fromRGB(255, 213, 0),
        Red: Color3.fromRGB(202, 87, 87),
        Grey: Color3.fromRGB(149, 137, 123),
        White: Color3.fromRGB(255, 255, 255),
    }

    protected abstract pressDebounceDuration: number;
    protected resetDebounceOnEnter: boolean = true;
    
    protected isPlayerInZone: boolean = false;
    protected timeSinceLastPress: number = 0;
    protected pressStreak: number = 0;
    private pressable: boolean = true;
    
    protected pressAnimationDuration: number = 0.44;
    private upStateSize = this.instance.Button.Size;
    private downStateSize = new Vector3(this.upStateSize.X, this.upStateSize.Y * 0.7, this.upStateSize.Z);
    private buttonSizeAnimationJanitor = new Janitor();
    private buttonColorAnimationJanitor = new Janitor();

    protected onStart() {
        const zone = new Zone(this.instance.Zone);
        const c1 = zone.localPlayerEntered.Connect(() => {
            this.onZoneEnter?.();
            if (this.resetDebounceOnEnter) {
                this.timeSinceLastPress = this.pressDebounceDuration
            }
            this.isPlayerInZone = true
        })
        const c2 = zone.localPlayerExited.Connect(() => {
            this.onZoneExit?.();
            this.pressStreak = 0;
            this.isPlayerInZone = false
        })
        this.janitor.Add(c1, "Disconnect")
        this.janitor.Add(c2, "Disconnect")
    }

    protected onRender(dt: number) {
        this.timeSinceLastPress += dt;
        if (this.getPressable() && this.isPlayerInZone && this.timeSinceLastPress >= this.pressDebounceDuration) {
            this.timeSinceLastPress = 0;
            this.pressStreak++;
            this.pressAction(this.pressStreak);
            this.playPressAnimation(math.min(this.pressDebounceDuration, this.pressAnimationDuration));
            this.animateColorBackForward(BasePressButton.ButtonColors.White, math.min(this.pressDebounceDuration, this.pressAnimationDuration));
        }
    }

    protected abstract pressAction(pressStreak: number): void;
    protected abstract onZoneEnter?(): void;
    protected abstract onZoneExit?(): void;
    
    protected async animateColorBackForward(targetColor: Color3, duration: number) {
        const originalColor = this.instance.Button.Color;
        await this.animateColorTransition(targetColor, duration / 2);
        await this.animateColorTransition(originalColor, duration / 2);
    }

    protected async animateColorTransition(targetColor: Color3, duration: number) {
        const tweenInfo = new TweenInfo(duration, Enum.EasingStyle.Quad);
        const tween = TweenService.Create(this.instance.Button, tweenInfo, { Color: targetColor });
        this.buttonColorAnimationJanitor.Cleanup();
        tween.Play();
        this.buttonColorAnimationJanitor.Add(tween, "Destroy");
        tween.Completed.Wait();
    }

    protected async playPressAnimation(duration: number = this.pressAnimationDuration) {
        await this.toDownState(duration / 2);
        await this.toUpState(duration / 2);
    }

    protected async toDownState(duration: number = this.pressAnimationDuration / 2) {
        this.buttonSizeAnimationJanitor.Cleanup()
        const tweenInfo = new TweenInfo(duration, Enum.EasingStyle.Quad);
        const tween = TweenService.Create(this.instance.Button, tweenInfo, { Size: this.downStateSize });
        tween.Play();
        this.buttonSizeAnimationJanitor.Add(tween, "Destroy");
        tween.Completed.Wait();
    }

    protected async toUpState(duration: number = this.pressAnimationDuration / 2) {
        this.buttonSizeAnimationJanitor.Cleanup();
        const tweenInfo = new TweenInfo(duration, Enum.EasingStyle.Quad);
        const tween = TweenService.Create(this.instance.Button, tweenInfo, { Size: this.upStateSize });
        tween.Play();
        this.buttonSizeAnimationJanitor.Add(tween, "Destroy");
        tween.Completed.Wait();
    }

    protected setButtonColor(color: Color3) {
        this.instance.Button.Color = color;
    }

    protected setPressable(value: boolean) {
        this.pressable = value;
    }
    protected getPressable() {
        return this.pressable;
    }
} 