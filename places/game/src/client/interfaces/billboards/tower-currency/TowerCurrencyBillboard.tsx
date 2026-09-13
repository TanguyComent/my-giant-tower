import React from "@rbxts/react";
import { App } from "./components/App"
import { BaseBillboard } from "@common/shared/interfaces/classes/BaseBillboard"

export class TowerCurrencyBillboard extends BaseBillboard {
    constructor(adornee: PVInstance, initialAmount: number) {
        super(adornee, "TowerCurrencyBillboard");

        this.billboardGui.Size = UDim2.fromScale(5, 2);
        this.billboardGui.StudsOffset = new Vector3(0, 2, 0);
        this.billboardGui.AlwaysOnTop = false;

        this.render(<App />);
    }
}
