import { Wrapper } from "@common/shared/interfaces/components/Wrapper"
import { useBindingState } from "@rbxts/pretty-react-hooks"
import React, { useMemo } from "@rbxts/react"
import { CurrencyDisplay } from "./CurrencyDisplay/CurrencyDisplay";
import { usePx } from "@common/shared/interfaces/hooks/usePx";
import { GradientUtils } from "@common/shared/utils/Gradient.utils";
import { computed } from "@rbxts/charm";
import { LocalSessionAtom } from "@common/client/states/LocalSession.atom";
import { useAtom } from "@rbxts/react-charm";
import { backpackEquippedItemSelector } from "@common/client/states/Backpack.atom";
import { Tags } from "@common/shared/Tags";
import { DropEquippedTowerPartButton } from "./DropEquippedTowerPartButton";
import { CASH_ICON } from "@common/shared/Assets";

interface Props {
	shown: React.Binding<boolean>;
}

export function App({ shown }: Props) {
    const px = usePx();
	const shownValue = useBindingState(shown);
    
    return shownValue && (
        <Wrapper>
            <CurrencyDisplay 
                Position={new UDim2(0, px(10), 1, -px(20))}
                AnchorPoint={new Vector2(0, 1)}
                icon={CASH_ICON}
                textGradient={GradientUtils.Gradients.Green}
                currencySelector={computed(() => LocalSessionAtom().currency)}
            />

            <DropEquippedTowerPartButton />
        </Wrapper>
    )
}
