import React from "@rbxts/react";
import { App, IAppHandle } from "./components/App";
import { ILineProperties } from "./ILineProperties";
import { BaseBillboard } from "@common/shared/interfaces/classes/BaseBillboard"

export { getGreenBillboardTextStyle, GREEN_BILLBOARD_TEXT_STROKE_THICKNESS, ILineProperties } from "./ILineProperties";

export class TextBillboard extends BaseBillboard {
    public billboard = this.billboardGui;

    public appRef = React.createRef<IAppHandle>();

    constructor(adornee: PVInstance, lines: ILineProperties[], size: UDim2) {
        super(adornee, "TextBillboard");
        this.billboardGui.Size = size;
        this.billboard.AlwaysOnTop = false;
        this.billboard.SizeOffset = new Vector2(0, 0.5);
        this.render(<App ref={this.appRef} lines={lines} />)
    }

    private waitForAppRef(): Promise<IAppHandle> {
        return new Promise((resolve) => {
            const checkRef = () => {
                if (this.appRef.current) {
                    resolve(this.appRef.current);
                } else {
                    task.wait(0.1);
                    checkRef();
                }
            };
            checkRef();
        });
    }

    public updateLine(index: number, properties: Partial<ILineProperties>) {
        this.waitForAppRef().then((app) => {
            app.updateLine(index, properties);
        });
    }
}
