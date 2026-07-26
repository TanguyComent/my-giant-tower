import { BackpackAtom, backpackSelectedCategorySelector } from "@common/client/states/Backpack.atom"
import { BackpackCategoriesData, OrderedBackpackCategories } from "@common/shared/data/backpack/BackpackCategories.data"
import { EBackpackCategories } from "@common/shared/data/backpack/EBackpackCategories"
import { DefaultTextLabel } from "@common/shared/interfaces/components/DefaultTextLabel"
import { RoundedButton } from "@common/shared/interfaces/components/RoundedButton"
import { usePx } from "@common/shared/interfaces/hooks/usePx"
import { Palette } from "@common/shared/Palette"
import React, { useMemo } from "@rbxts/react";
import { useAtom } from "@rbxts/react-charm";

interface Props {
    categoryName: EBackpackCategories;
    layoutOrder: number;
    padding: number;
}

const amountOfCategories = OrderedBackpackCategories.size();

export function CategoryButton({ categoryName, layoutOrder, padding }: Props) {
    const px = usePx();
    const selectedCategory = useAtom(backpackSelectedCategorySelector);
    const categoryDatum = useMemo(() => BackpackCategoriesData[categoryName], [categoryName]);
    const isSelected = useMemo(() => selectedCategory === categoryName, [selectedCategory, categoryName]);

    return (
        <RoundedButton
            LayoutOrder={layoutOrder}
            Size={new UDim2(1, 0, 1 / amountOfCategories, -padding)}
            BackgroundColor3={Color3.fromHex("#191b1d")}
            BackgroundTransparency={isSelected ? 0 : 0.2}

            Event={{
                Activated: () => {
                    BackpackAtom((old) => ({
                        ...old,
                        selectedCategory: categoryName
                    }))
                }
            }}
        >
            <imagelabel 
                Size={UDim2.fromScale(0.7, 0.7)}
                Image={categoryDatum.icon}
                Position={UDim2.fromScale(0.5, 0.5)}
                AnchorPoint={new Vector2(0.5, 0.5)}
                BackgroundTransparency={1}  
            >
                <uiaspectratioconstraint AspectRatio={1} />
            </imagelabel>

            <DefaultTextLabel
                Text={categoryDatum.displayName}
                TextColor3={Palette.Colors.white}
                TextScaled={true}
                Size={UDim2.fromScale(0.8, 0.25)}
                Position={UDim2.fromScale(0.5, 0.85)}
                AnchorPoint={new Vector2(0.5, 0.5)}
            >
                <uistroke Color={Palette.Colors.black} Thickness={px(4)} />
            </DefaultTextLabel>

            <uistroke Color={isSelected ? Palette.Colors.white : Palette.Colors.black} Thickness={px(4)} />
        </RoundedButton>
    )
}