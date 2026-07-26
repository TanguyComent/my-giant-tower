import React from "@rbxts/react";

export function Wrapper(props: React.InstanceProps<Frame>) {
    return (
        <frame
            Size={UDim2.fromScale(1, 1)}
            BackgroundTransparency={1}
            Position={UDim2.fromScale(0.5, 0.5)}
            AnchorPoint={new Vector2(0.5, 0.5)} 
            {...props}
        />
    )
}