import { backpackEquippedItemSelector } from "@common/client/states/Backpack.atom";
import { DefaultTextLabel } from "@common/shared/interfaces/components/DefaultTextLabel";
import { RoundedButton } from "@common/shared/interfaces/components/RoundedButton";
import { usePx } from "@common/shared/interfaces/hooks/usePx";
import { Palette } from "@common/shared/Palette";
import { Tags } from "@common/shared/Tags";
import { Events } from "@game/client/Networking";
import React from "@rbxts/react";
import { useMemo } from "@rbxts/react";
import { useAtom } from "@rbxts/react-charm";

export function DropEquippedTowerPartButton() {
    const px = usePx();
    const equippedTool = useAtom(backpackEquippedItemSelector);
    const shouldShowDropTowerPartButton = useMemo(() => {
        return equippedTool?.tool && equippedTool.tool.HasTag(Tags.TOWER_PART_TOOL_TAG);
    }, [equippedTool?.tool])
    
    return shouldShowDropTowerPartButton && (
        <RoundedButton
            Position={UDim2.fromScale(0.5, 0.85)}
            AnchorPoint={new Vector2(0.5, 0.5)}
            Size={new UDim2(0.2, 0, 0.12, 0)}
            aspectRatio={3}
            backgroundColorSequence={Palette.ColorSequences.red}
            Event={{
                Activated: () => Events.towerPartStand.deleteInHandTowerPart(),
            }}
        >
            <uistroke Thickness={px(4)} />
            <DefaultTextLabel 
                Size={UDim2.fromScale(0.8, 0.8)}
                Position={UDim2.fromScale(0.5, 0.5)}
                AnchorPoint={new Vector2(0.5, 0.5)}
                Text={"Delete"}
                TextScaled={true}
            >   
                <uistroke Thickness={px(4)} />
            </DefaultTextLabel>
        </RoundedButton>
    )
}