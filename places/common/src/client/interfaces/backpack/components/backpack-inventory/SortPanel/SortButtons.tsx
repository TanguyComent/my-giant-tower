import { BackpackController } from "@common/client/controllers/Backpack.controller"
import { usePx } from "@common/shared/interfaces/hooks/usePx"
import React from "@rbxts/react";

interface SortButtonsProps {
    backpackController: BackpackController;
}

export function SortButtons({ backpackController }: SortButtonsProps) {
    const px = usePx();

    return (
        <frame
            Size={new UDim2(0, px(200), 1, 0)}
            Position={new UDim2(1, px(40), 0.5, 0)}
            AnchorPoint={new Vector2(0, 0.5)}
            BackgroundTransparency={1}
        >
            <uilistlayout
                FillDirection={Enum.FillDirection.Vertical}
                Padding={new UDim(0, px(20))}
            />
            {/* <SortButton 
                text="Strength"
                onActivated={() => backpackController.sortInventoryByStrength()}
                textGradient={boilerColorSequences.red}
            />
            <SortButton 
                text="Speed"
                onActivated={() => backpackController.sortInventoryByStrength()}
                textGradient={boilerColorSequences.blue}
            />
            <SortButton 
                text="Multi"
                onActivated={() => backpackController.sortInventoryByMultiplier()}
                textGradient={boilerColorSequences.green}
            /> */}
        </frame>
    )
}