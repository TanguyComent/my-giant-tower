import { Tags } from "@common/shared/Tags"
import { Component } from "@flamework/components"
import { Players } from "@rbxts/services"
import { BaseSinglePressButton } from "./abstract/button/BaseSinglePressButton.component"
import { FreeRewardButtonAttributes, FreeRewardButtonInstance } from "@common/shared/data/components-instances/FreeRewardButton.instance"
import { OnRender, OnStart } from "@flamework/core"
import { Events } from "../Networking"

@Component({
    tag: Tags.PLAYER_FREE_REWARD_BUTTON_TAG(Players.LocalPlayer.User.Id),
})
export class PlayerFreeRewardButtonComponent extends BaseSinglePressButton<FreeRewardButtonAttributes, FreeRewardButtonInstance> implements OnStart, OnRender {
    protected onZoneEnter = undefined;

    onStart(): void {
        super.onStart();
    }

    onRender(dt: number): void {
        super.onRender(dt);
    }

    protected pressAction(_: number): void {
        super.pressAction(_);
        Events.freeReward.claim();
    }
}