import { Palette } from "@common/shared/Palette"

export interface ILineProperties {
    text: string;
    weightSize: number;
    gradientColor: ColorSequence;
    strokeColor: Color3;
    strokeSize: number;
    visible?: boolean;
    gradientRotationSpeed?: number;
    strokeLineJoinMode?: Enum.LineJoinMode;
    strokeSizingMode?: Enum.StrokeSizingMode;
}

export const GREEN_BILLBOARD_TEXT_STROKE_THICKNESS = 0.1;
export const GREEN_BILLBOARD_TEXT_STROKE_LINE_JOIN_MODE = Enum.LineJoinMode.Bevel;
export const GREEN_BILLBOARD_TEXT_STROKE_STROKE_SIZING_MODE = Enum.StrokeSizingMode.ScaledSize;

export function getGreenBillboardTextStyle(strokeSize = GREEN_BILLBOARD_TEXT_STROKE_THICKNESS): Pick<ILineProperties, "gradientColor" | "strokeColor" | "strokeSize" | "strokeLineJoinMode" | "strokeSizingMode"> {
    return {
        gradientColor: Palette.ColorSequences.green,
        strokeColor: Palette.Colors.black,
        strokeSize,
        strokeLineJoinMode: GREEN_BILLBOARD_TEXT_STROKE_LINE_JOIN_MODE,
        strokeSizingMode: GREEN_BILLBOARD_TEXT_STROKE_STROKE_SIZING_MODE,
    };
}
