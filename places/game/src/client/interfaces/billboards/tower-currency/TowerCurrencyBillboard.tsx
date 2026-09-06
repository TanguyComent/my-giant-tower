import React from "@rbxts/react";
import { BaseBillboard } from "@common/shared/interfaces/components/BaseBillboard";
import { FormatUtils } from "@common/shared/utils/Format.utils";
import { App } from "./components/App"

export class TowerCurrencyBillboard extends BaseBillboard {
    constructor(adornee: PVInstance, initialAmount: number) {
        super(adornee, "TowerCurrencyBillboard");

        this.billboardGui.Size = UDim2.fromScale(5, 2);
        this.billboardGui.StudsOffset = new Vector3(0, 2, 0);
        this.billboardGui.AlwaysOnTop = false;

        this.render(<App />);
    }
}
