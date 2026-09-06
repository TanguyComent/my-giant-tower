import { Tags } from "@common/shared/Tags";
import { Component } from "@flamework/components";
import { OnStart } from "@flamework/core";
import { TowerCurrencyButtonAttributes, TowerCurrencyButtonInstance } from "@common/shared/data/components-instances/TowerCurrencyButton.instance";
import { DestroyableComponent } from "@common/shared/components/BaseComponents";
import { Players, RunService, TweenService } from "@rbxts/services";
import { Events } from "../Networking";
import { peek, subscribe } from "@rbxts/charm";
import { TowerCurrencySelector } from "@common/client/states/LocalSession.atom";
import { TowerCurrencyBillboard } from "../interfaces/billboards/tower-currency/TowerCurrencyBillboard";
import { TOWER_CURRENCY_SYNC_INTERVAL } from "@common/shared/GlobalConfig";

@Component({
    tag: Tags.PLAYER_CURRENCY_BUTTON_TAG(Players.LocalPlayer.User.Id)
})
export class PlayerTowerCurrencyButtonComponent extends DestroyableComponent<TowerCurrencyButtonAttributes, TowerCurrencyButtonInstance> implements OnStart {
    private billboard!: TowerCurrencyBillboard;
    private isPressAnimationPlaying = false;
    private displayedAmount = 0;
    private lerpToken = 0;

    onStart(): void {
        this.displayedAmount = peek(TowerCurrencySelector);
        this.billboard = new TowerCurrencyBillboard(this.instance.Button, this.displayedAmount);
        this.janitor.Add(() => this.billboard.destroy());

        const touchedConnection = this.instance.Button.Touched.Connect((hit) => this.onButtonTouched(hit));
        this.janitor.Add(touchedConnection, "Disconnect");
    }

    private onButtonTouched(hit: BasePart): void {
        if (this.isPressAnimationPlaying) return;
        if (!hit.Parent || Players.GetPlayerFromCharacter(hit.Parent) !== Players.LocalPlayer) return;

        this.isPressAnimationPlaying = true;
        this.playPressAnimation().then(() => {
            this.isPressAnimationPlaying = false;
        });

        Events.collectTowerCurrency();
    }

    private async playPressAnimation(): Promise<void> {
        const button = this.instance.Button;
        const restCFrame = button.CFrame;
        const pressedCFrame = restCFrame.mul(new CFrame(0, -button.Size.Y * 0.5, 0));

        const pressTween = TweenService.Create(button, new TweenInfo(0.08, Enum.EasingStyle.Quad, Enum.EasingDirection.Out), { CFrame: pressedCFrame });
        pressTween.Play();
        pressTween.Completed.Wait();

        const releaseTween = TweenService.Create(button, new TweenInfo(0.15, Enum.EasingStyle.Quad, Enum.EasingDirection.In), { CFrame: restCFrame });
        releaseTween.Play();
        releaseTween.Completed.Wait();
    }
}
