import { Component } from "@flamework/components";
import { BasePressButton, IPressButtonInstance } from "./BasePressButton.component";

@Component()
export abstract class BaseBurstButton<A extends {} = {}, I extends IPressButtonInstance = IPressButtonInstance> extends BasePressButton<A, I> {
    private firstPressDebounce = 1.5;
    private subsequentPressDebounce = 0.15;

    protected pressDebounceDuration = this.firstPressDebounce;
    protected pressAnimationDuration = 0.1;

    protected onZoneExit(): void {
        this.pressDebounceDuration = this.firstPressDebounce;
    }

    protected pressAction(pressStreak: number): void {
        if (pressStreak >= 2) {
            this.pressDebounceDuration = this.subsequentPressDebounce;
        }
    }
}