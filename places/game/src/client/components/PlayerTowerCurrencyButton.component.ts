import { Tags } from "@common/shared/Tags";
import { Component } from "@flamework/components";
import { OnRender, OnStart } from "@flamework/core";
import { TowerCurrencyButtonAttributes, TowerCurrencyButtonInstance } from "@common/shared/data/components-instances/TowerCurrencyButton.instance";
import { DestroyableComponent } from "@common/shared/components/BaseComponents";
import { Players, RunService, TweenService } from "@rbxts/services";
import { Events } from "../Networking";
import { peek, subscribe } from "@rbxts/charm";
import { TowerCurrencySelector } from "@common/client/states/LocalSession.atom";
import { TowerCurrencyBillboard } from "../interfaces/billboards/tower-currency/TowerCurrencyBillboard";
import { TOWER_CURRENCY_SYNC_INTERVAL } from "@common/shared/GlobalConfig";
import { FollowingImage } from "../interfaces/following-billboard/FollowingImage"
import { CASH_ICON } from "@common/shared/Assets"
import { BaseSinglePressButton } from "./abstract/button/BaseSinglePressButton.component"
import { BasePressButton } from "./abstract/button/BasePressButton.component"

@Component({
    tag: Tags.PLAYER_CURRENCY_BUTTON_TAG(Players.LocalPlayer.User.Id)
})
export class PlayerTowerCurrencyButtonComponent extends BaseSinglePressButton<TowerCurrencyButtonAttributes, TowerCurrencyButtonInstance> implements OnStart, OnRender {
    private billboard!: TowerCurrencyBillboard;
    private lastCurrencyState = 1; /// Pressable state

    onStart(): void {
        super.onStart();
        this.janitor.Add(() => this.billboard.destroy());
        
        const towerCurrencyAmount = peek(TowerCurrencySelector);
        this.billboard = new TowerCurrencyBillboard(this.instance.Button, towerCurrencyAmount);
        this.janitor.Add(() => this.billboard.destroy());
        this.onTowerCurrencyAmountUpdated(towerCurrencyAmount);
        const unsubscribe = subscribe(TowerCurrencySelector, (newAmount) => this.onTowerCurrencyAmountUpdated(newAmount));
        this.janitor.Add(() => unsubscribe());
    }

    onRender(dt: number): void {
        super.onRender(dt);
    }
    
    protected onZoneEnter = undefined

    protected override pressAction(_: number): void {
        super.pressAction(_);
        this.dropCashImages(8);
        Events.collectTowerCurrency();
    }

    private dropCashImages(amount: number) {
        for (let i = 0; i < amount; i++) {
            const initialCFrame = this.instance.Button.CFrame;
            const angle = i * (math.pi * 2 / amount);
            const offset = new Vector3(math.cos(angle), 0, math.sin(angle)).mul(4);
            const targetCFrame = initialCFrame.mul(new CFrame(offset));
            new FollowingImage(initialCFrame, targetCFrame, CASH_ICON);
        }
    }

    private onTowerCurrencyAmountUpdated(newAmount: number) {
        const isPressable = this.lastCurrencyState > 0;
        this.lastCurrencyState = newAmount;
        
        if (newAmount <= 0 && isPressable) {
            this.setPressable(false);
            this.animateColorTransition(BasePressButton.ButtonColors.Grey, 0.22);
        } 

        if (newAmount > 0 && !isPressable) {
            this.setPressable(true);
            this.animateColorTransition(BasePressButton.ButtonColors.Green, 0.22);
        }
    }
}
