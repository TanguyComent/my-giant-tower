import React, { useImperativeHandle, useState } from "@rbxts/react";
import { ILineProperties } from "../ILineProperties";
import { Line } from "./Line";

export interface IAppHandle {
    updateLine: (index: number, properties: Partial<ILineProperties>) => void;
}

interface Props {
    lines: ILineProperties[];
}

export const App = React.forwardRef<IAppHandle, Props>(({ lines: initialLines }, ref) => {
    const [lines, setLines] = useState(initialLines);

    useImperativeHandle(ref, () => ({
        updateLine: (index, properties) => {
            setLines((currentLines) => {
                const line = currentLines[index];
                if (!line) {
                    return currentLines;
                }

                const nextLines = [...currentLines];
                nextLines[index] = { ...line, ...properties };
                return nextLines;
            });
        },
    }), []);

    const totalWeight = lines.reduce((sum, line) => sum + line.weightSize, 0);

    return (
        <frame
            Size={UDim2.fromScale(1, 1)}
            BackgroundTransparency={1}
        >
            <uilistlayout
                FillDirection={Enum.FillDirection.Vertical}
                HorizontalAlignment={Enum.HorizontalAlignment.Center}
                SortOrder={Enum.SortOrder.LayoutOrder}
            />
            {lines.map((line, index) => (
                <Line
                    key={`line_${index}`}
                    {...line}
                    LayoutOrder={index}
                    heightScale={totalWeight > 0 ? line.weightSize / totalWeight : 0}
                />
            ))}
        </frame>
    )
});
