export namespace Palette {
    export const Colors = {
        white: Color3.fromRGB(255, 255, 255),
        black: Color3.fromRGB(0, 0, 0),
        red300: Color3.fromRGB(255, 100, 100),
    }

    export const ColorSequences = {
        red: new ColorSequence([
            new ColorSequenceKeypoint(0, Color3.fromRGB(255, 120, 120)),
            new ColorSequenceKeypoint(0.5, Color3.fromRGB(230, 40, 40)),
            new ColorSequenceKeypoint(1, Color3.fromRGB(150, 0, 0)),
        ]),
        green: new ColorSequence([
            new ColorSequenceKeypoint(0, Color3.fromRGB(180, 255, 180)),
            new ColorSequenceKeypoint(0.5, Color3.fromRGB(100, 230, 120)),
            new ColorSequenceKeypoint(1, Color3.fromRGB(60, 200, 100)),
        ]),
        blue: new ColorSequence([
            new ColorSequenceKeypoint(0, Color3.fromRGB(170, 220, 255)),
            new ColorSequenceKeypoint(0.5, Color3.fromRGB(60, 140, 255)),
            new ColorSequenceKeypoint(1, Color3.fromRGB(0, 70, 200)),
        ]),
        yellow: new ColorSequence([
            new ColorSequenceKeypoint(0, Color3.fromHex("#EFFF3C")),
            new ColorSequenceKeypoint(0.5, Color3.fromHex("#FFDA3C")),
            new ColorSequenceKeypoint(1, Color3.fromHex("#FFAE00")),
        ]),
        orange: new ColorSequence([
            new ColorSequenceKeypoint(0, Color3.fromHex("#FFC46B")),
            new ColorSequenceKeypoint(0.5, Color3.fromHex("#FF8A30")),
            new ColorSequenceKeypoint(1, Color3.fromHex("#E65C00")),
        ]),
        purple: new ColorSequence([
            new ColorSequenceKeypoint(0, Color3.fromHex("#E29BFF")),
            new ColorSequenceKeypoint(0.5, Color3.fromHex("#B24BFF")),
            new ColorSequenceKeypoint(1, Color3.fromHex("#6A00A6")),
        ]),
        pink: new ColorSequence([
            new ColorSequenceKeypoint(0, Color3.fromHex("#FFC1E3")),
            new ColorSequenceKeypoint(0.5, Color3.fromHex("#FF6FB0")),
            new ColorSequenceKeypoint(1, Color3.fromHex("#D6006E")),
        ]),
        cyan: new ColorSequence([
            new ColorSequenceKeypoint(0, Color3.fromRGB(180, 255, 255)),
            new ColorSequenceKeypoint(0.5, Color3.fromRGB(0, 230, 230)),
            new ColorSequenceKeypoint(1, Color3.fromRGB(0, 130, 140)),
        ]),
        gold: new ColorSequence([
            new ColorSequenceKeypoint(0, Color3.fromHex("#FFE9A8")),
            new ColorSequenceKeypoint(0.5, Color3.fromHex("#FFC94A")),
            new ColorSequenceKeypoint(1, Color3.fromHex("#B8860B")),
        ]),
        black: new ColorSequence([
            new ColorSequenceKeypoint(0, Color3.fromRGB(90, 90, 90)),
            new ColorSequenceKeypoint(1, Color3.fromRGB(0, 0, 0)),
        ]),
        white: new ColorSequence(Color3.fromRGB(255, 255, 255)),
        rainbow: new ColorSequence([
            new ColorSequenceKeypoint(0, Color3.fromRGB(255, 0, 4)),
            new ColorSequenceKeypoint(0.207, Color3.fromRGB(234, 0, 255)),
            new ColorSequenceKeypoint(0.425, Color3.fromRGB(0, 55, 255)),
            new ColorSequenceKeypoint(0.648, Color3.fromRGB(0, 255, 247)),
            new ColorSequenceKeypoint(0.841, Color3.fromRGB(68, 255, 0)),
            new ColorSequenceKeypoint(1, Color3.fromRGB(255, 238, 0)),
        ]),
    }
}