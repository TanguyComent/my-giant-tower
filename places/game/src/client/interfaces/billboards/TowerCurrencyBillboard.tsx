import React from "@rbxts/react";
import { BaseBillboard } from "@common/shared/interfaces/components/BaseBillboard";
import { FormatUtils } from "@common/shared/utils/Format.utils";
import { Palette } from "@common/shared/Palette";
import { Fonts } from "@common/shared/Fonts";

interface TowerCurrencyBillboardAppProps {
    text: React.Binding<string>;
}

function TowerCurrencyBillboardApp({ text }: TowerCurrencyBillboardAppProps) {
    return (
        <textlabel
            Size={UDim2.fromScale(1, 1)}
            BackgroundTransparency={1}
            Text={text}
            TextScaled={true}
            TextColor3={Palette.Colors.white}
            FontFace={Fonts.FredokaOne}
        >
            <uistroke Thickness={2} />
        </textlabel>
    );
}

export class TowerCurrencyBillboard extends BaseBillboard {
    private setText: (text: string) => void;

    constructor(adornee: PVInstance, initialAmount: number) {
        super(adornee, "TowerCurrencyBillboard");

        this.billboardGui.Size = UDim2.fromOffset(160, 50);
        this.billboardGui.StudsOffset = new Vector3(0, 2, 0);

        const [text, setText] = React.createBinding(FormatUtils.formatCurrency(math.floor(initialAmount)));
        this.setText = setText;

        this.render(<TowerCurrencyBillboardApp text={text} />);
    }

    public setAmount(amount: number): void {
        this.setText(FormatUtils.formatCurrency(math.floor(amount)));
    }
}
