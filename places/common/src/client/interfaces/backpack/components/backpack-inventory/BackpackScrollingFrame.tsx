import React, { useCallback, useMemo } from "@rbxts/react"
import { useAtom } from "@rbxts/react-charm"
import { BackpackItem } from "../backpack-item/BackpackItem"
import { BackpackController } from "@common/client/controllers/Backpack.controller"
import { backpackItemsSelector, backpackSearchbarTextSelector, backpackSelectedCategorySelector } from "@common/client/states/Backpack.atom"
import { usePx } from "@common/shared/interfaces/hooks/usePx"
import { BackpackCategoriesData } from "@common/shared/data/backpack/BackpackCategories.data"

interface BackpackScrollingFrameProps {
    backpackController: BackpackController;
    itemSize: number;
    itemPadding: number;
}

export function BackpackScrollingFrame({ backpackController, itemSize, itemPadding }: BackpackScrollingFrameProps) {
    const px = usePx();
    const backpackItems = useAtom(backpackItemsSelector);
    const searchbarText = useAtom(backpackSearchbarTextSelector);
    const selectedCategory = useAtom(backpackSelectedCategorySelector);

    const filteredItems = useMemo(() => backpackItems.filter((backpackItems) => {
        const categoryDatum = BackpackCategoriesData[selectedCategory];
        const searchBarFilter = !searchbarText || backpackItems.tool.Name.lower().find(searchbarText.lower(), 0, true).size() > 0;
        const categoryFilter = categoryDatum.isToolInCategory(backpackItems.tool);
        return searchBarFilter && categoryFilter;
    }), [backpackItems, searchbarText, selectedCategory]);

    const rowCount = math.ceil(filteredItems.size() / backpackController.hotbarItemsCount);

    const getItems = useCallback(() => {
        const items: JSX.Element[] = [];

        let index = 0;
        for (const backpackItem of backpackItems) {
            const row = math.floor(index / backpackController.hotbarItemsCount);
            const column = index % backpackController.hotbarItemsCount;
            const position = new UDim2(0, column * itemSize + (column) * itemPadding, 0, row * itemSize + (row) * itemPadding);
            const isVisible = filteredItems.includes(backpackItem);
            items.push(
                <BackpackItem
                    key={backpackItem.uuid}
                    index={index}
                    backpackItem={backpackItem}
                    Position={position}
                    context="inventory"
                    backpackController={backpackController}
                    Size={new UDim2(0, itemSize, 0, itemSize)}
                    uuid={backpackItem.uuid}
                    visible={isVisible}
                />
            )
            if (isVisible) {
                index++;
            }

        }

        return items;
    }, [backpackItems, filteredItems, backpackController, itemSize, itemPadding]);


    return (
        <scrollingframe
            key={"backpack-scrolling-frame"}
            Size={new UDim2(1, px(30), 0.7, px(20))}
            Position={new UDim2(0, 0, 0.95, -px(10))}
            AnchorPoint={new Vector2(0, 1)}
            BorderSizePixel={0}
            BackgroundTransparency={1}
            ScrollBarThickness={px(15)}
            CanvasSize={new UDim2(1, 0, 0, rowCount * itemSize + (rowCount - 1) * itemPadding + px(20))}
            ScrollingDirection={Enum.ScrollingDirection.Y}
            ClipsDescendants={true}
        >
            <uipadding
                PaddingTop={new UDim(0, px(10))}
                PaddingLeft={new UDim(0, px(10))}
                PaddingRight={new UDim(0, px(10))}
                PaddingBottom={new UDim(0, px(10))}
            />
            {getItems()}
        </scrollingframe>
    )
}