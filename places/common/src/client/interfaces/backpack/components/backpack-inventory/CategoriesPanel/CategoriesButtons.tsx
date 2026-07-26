import React from "@rbxts/react";
import { CategoryButton } from "./CategoryButton";
import { usePx } from "@common/shared/interfaces/hooks/usePx"
import { Wrapper } from "@common/shared/interfaces/components/Wrapper"
import { OrderedBackpackCategories } from "@common/shared/data/backpack/BackpackCategories.data"

interface Props {

}

export function CategoriesButtons({}: Props) {
    const px = usePx();
    
    return (
        <Wrapper
            Position={new UDim2(0, -px(10), 0.5, 0)}
            AnchorPoint={new Vector2(1, 0.5)}
            Size={new UDim2(0.1, 0, 1, 0)}
        >
            <uilistlayout 
                FillDirection={Enum.FillDirection.Vertical}
                SortOrder={Enum.SortOrder.LayoutOrder}
                Padding={new UDim(0, px(10))}
            />

            {OrderedBackpackCategories.map((categoryName, index) => (
                <CategoryButton 
                    categoryName={categoryName}
                    layoutOrder={index}
                    padding={px(10)}
                />
            ))}
        </Wrapper>
    )
}