import React, { useEffect, useMemo } from "@rbxts/react"
import { useAtom } from "@rbxts/react-charm"
import { BackpackScrollingFrame } from "./BackpackScrollingFrame"
import { BackpackSearchBar } from "./BackpackSearchBar"
import { CloseButton } from "./CloseButton"
import { GamepadService } from "@rbxts/services"
import { SortButtons } from "./SortPanel/SortButtons"
import { CategoriesButtons } from "./CategoriesPanel/CategoriesButtons"
import { BackpackController } from "@common/client/controllers/Backpack.controller"
import { usePx } from "@common/shared/interfaces/hooks/usePx"
import { backpackOpenedSelector } from "@common/client/states/Backpack.atom"
import { Fonts } from "@common/shared/Fonts"

interface BackpackInventoryProps {
    backpackController: BackpackController;
    Position: UDim2;
    AnchorPoint: Vector2;
    itemSize: number;
    itemPadding: number;
}

export function BackpackInventory({ backpackController, Position, AnchorPoint, itemSize, itemPadding }: BackpackInventoryProps) {
    const px = usePx();
    const isBackpackOpened = useAtom(backpackOpenedSelector);

    // const capacityText = useMemo(() => {
    //     return `Capacity : ${values(petsBackpack).filter((pet) => !pet.slot).size()}/${BackpackUtils.getBackpackItemsLimit(gamePasses)}`
    // }, [gamePasses, petsBackpack])

    const gamepadCursorGuiRef = React.useRef<Frame>();

    useEffect(() => {
        const gamepadCursorGui = gamepadCursorGuiRef.current;
        if (!gamepadCursorGui || !isBackpackOpened) return;

        GamepadService.EnableGamepadCursor(gamepadCursorGui);

        return () => {
            GamepadService.DisableGamepadCursor();
        };
    }, [gamepadCursorGuiRef, isBackpackOpened]);

    return (
        <frame
            ref={gamepadCursorGuiRef}
            key={"inventory"}
            Position={Position}
            AnchorPoint={AnchorPoint}
            Size={new UDim2(0, backpackController.hotbarItemsCount * itemSize + (backpackController.hotbarItemsCount - 1) * itemPadding + px(20), 0, px(500))}
            BackgroundColor3={Color3.fromHex("#414141")}
            BackgroundTransparency={0.2}
            Visible={isBackpackOpened}
            BorderSizePixel={0}
            ZIndex={0}
        >
            <uicorner CornerRadius={new UDim(0.03, 0)} />
            <SortButtons backpackController={backpackController} />
            <CategoriesButtons />
            <BackpackSearchBar />
            <CloseButton />
            <BackpackScrollingFrame
                backpackController={backpackController}
                itemSize={itemSize}
                itemPadding={itemPadding}
            />
            <textlabel
                Size={new UDim2(1, 0, 0.1, 0)}
                Position={new UDim2(0.02, 0, 0.02, 0)}
                AnchorPoint={new Vector2(0, 0)}
                Text={'Your Bag'}
                TextScaled={true}
                FontFace={Fonts.FredokaOne}
                TextColor3={Color3.fromHex("#FFFFFF")}
                BackgroundTransparency={1}
                TextXAlignment={Enum.TextXAlignment.Left}
            >
                <uistroke Thickness={px(5)} Color={new Color3(0, 0, 0)} Transparency={0} />
            </textlabel>
        </frame>
    )
}