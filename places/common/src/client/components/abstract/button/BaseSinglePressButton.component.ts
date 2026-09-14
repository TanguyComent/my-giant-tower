import { Component } from "@flamework/components";
import { BasePressButton, IPressButtonInstance } from "./BasePressButton.component";

@Component()
export abstract class BaseSinglePressButton<A extends {} = {}, I extends IPressButtonInstance = IPressButtonInstance> extends BasePressButton<A, I> {
    protected pressDebounceDuration = 1000;
    private hasBeenPressed: boolean = false;

    protected pressAction(_: number): void {
        this.hasBeenPressed = true;
    }

    protected onZoneExit(): void {
        this.hasBeenPressed = false;
    }

    protected override getPressable() {
        return super.getPressable() && !this.hasBeenPressed;
    };
}