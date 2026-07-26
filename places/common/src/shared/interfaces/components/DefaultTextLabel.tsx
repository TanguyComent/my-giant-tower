import { Fonts } from "@common/shared/Fonts"
import { Palette } from "@common/shared/Palette"
import React from "@rbxts/react";

export function DefaultTextLabel(props: React.InstanceProps<TextLabel>) {
    return (
        <textlabel
            TextScaled={true}
            TextColor3={Palette.Colors.white}
            BackgroundTransparency={1}
            FontFace={Fonts.FredokaOne}
            {...props}
        />
    )
}