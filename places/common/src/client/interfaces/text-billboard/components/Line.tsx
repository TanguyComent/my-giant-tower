import React from "@rbxts/react";
import { ILineProperties } from "../ILineProperties";
import { GradientUtils } from "@common/shared/utils/Gradient.utils"
import { Fonts } from "@common/shared/Fonts"
import { Palette } from "@common/shared/Palette"

interface Props extends ILineProperties {
    LayoutOrder: number;
    heightScale: number;
}

export const Line = React.memo(({ text, gradientColor, strokeColor, strokeSize, LayoutOrder, heightScale, visible = true, gradientRotationSpeed, strokeLineJoinMode, strokeSizingMode }: Props) => {
    if (visible === false || heightScale <= 0) {
        return (
            <frame
                Size={UDim2.fromScale(1, 0)}
                BackgroundTransparency={1}
                LayoutOrder={LayoutOrder}
            />
        );
    }

    const gradient = gradientRotationSpeed !== undefined && gradientRotationSpeed > 0
        ? GradientUtils.createGradient({
            Color: gradientColor,
            Rotation: 90,
            RotationSpeed: gradientRotationSpeed,
        })
        : <uigradient Color={gradientColor} Rotation={90} />;

    return (
        <textlabel
            Size={UDim2.fromScale(1, heightScale)}
            BackgroundTransparency={1}
            Text={text}
            TextScaled={true}
            FontFace={Fonts.FredokaOne}
            TextColor3={Palette.Colors.white}
            LayoutOrder={LayoutOrder}
        >
            {gradient}
            <uistroke
                Color={strokeColor}
                Thickness={strokeSize}
                LineJoinMode={strokeLineJoinMode}
                StrokeSizingMode={strokeSizingMode}
            />
        </textlabel>
    )
});
