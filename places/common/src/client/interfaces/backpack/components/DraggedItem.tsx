import React, { useMemo } from "@rbxts/react"
import { useAtom } from "@rbxts/react-charm"
import { VisualItem } from "./backpack-item/VisualItem"
import { useMouse } from "@rbxts/pretty-react-hooks";
import { backpackDragInformationsSelector, backpackEquippedItemSelector } from "@common/client/states/Backpack.atom"

interface DraggedItemProps {
    itemSize: number;
}

export function DraggedItem({ itemSize }: DraggedItemProps) {
    const dragInformations = useAtom(backpackDragInformationsSelector);
    const equippedItem = useAtom(backpackEquippedItemSelector);
    const isEquipped = useMemo(() => {
        return dragInformations ? dragInformations.item.tool === equippedItem?.tool : false;
    }, [dragInformations, equippedItem]);
    const mouse = useMouse();

    return dragInformations && (
        <imagebutton
            key={"drag-overlay"}
            Position={mouse.map(m => new UDim2(0, m.X + dragInformations.dragAnchorPoint.X, 0, m.Y + dragInformations.dragAnchorPoint.Y))}
            Size={new UDim2(0, itemSize, 0, itemSize)}
            BackgroundTransparency={1}
            BorderSizePixel={0}
        >
            <VisualItem
                backpackItem={dragInformations.item}
                isHovered={true}
                isEquipped={isEquipped}
                backpackOpened={true}
                Size={new UDim2(1, 0, 1, 0)}
            >
                {dragInformations.draggedItemChildren}
            </VisualItem>
        </imagebutton>
    )
}