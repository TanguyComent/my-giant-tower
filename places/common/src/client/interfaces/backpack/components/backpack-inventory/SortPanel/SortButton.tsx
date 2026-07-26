import { Fonts } from "@common/shared/Fonts"
import { RoundedButton } from "@common/shared/interfaces/components/RoundedButton"
import { usePx } from "@common/shared/interfaces/hooks/usePx"
import { Palette } from "@common/shared/Palette"
import React from "@rbxts/react";

interface SortButtonProps {
    textGradient: ColorSequence;
    text: string;
    onActivated: () => void;
}

export function SortButton({ textGradient, text, onActivated }: SortButtonProps) {
    const px = usePx();

    return (
        <RoundedButton 
            Size={new UDim2(1, 0, 1, 0)}
            aspectRatio={85/32}
            BackgroundColor3={Color3.fromHex("#191b1d")}
            BackgroundTransparency={0.2}

            Event={{
                Activated: () => onActivated()
            }}
        >
            <uistroke Color={Palette.Colors.black} Thickness={px(4)} />
            <textlabel
                Text={text}
                BackgroundTransparency={1}
                TextColor3={Palette.Colors.white}
                TextScaled={true}
                FontFace={Fonts.FredokaOne}
                Size={new UDim2(0.8, 0, 0.6, 0)}
                Position={new UDim2(0.5, 0, 0.5, 0)}
                AnchorPoint={new Vector2(0.5, 0.5)}
            >
                <uigradient Color={textGradient} Rotation={90} />
                <uistroke Color={Palette.Colors.black} Thickness={px(4)} />
            </textlabel>
        </RoundedButton>
    )
}