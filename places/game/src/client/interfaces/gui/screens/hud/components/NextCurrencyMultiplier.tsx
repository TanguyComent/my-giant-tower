import { LocalSessionAtom } from "@common/client/states/LocalSession.atom"
import { CURRENCY_MULTIPLIERS_DATA } from "@common/shared/data/currency-multipliers/CurrencyMultipliers.data"
import { AutomaticRatioLabel } from "@common/shared/interfaces/components/AutomaticRatioLabel"
import { DefaultTextLabel } from "@common/shared/interfaces/components/DefaultTextLabel"
import { RoundedButton } from "@common/shared/interfaces/components/RoundedButton"
import { usePx } from "@common/shared/interfaces/hooks/usePx"
import { Palette } from "@common/shared/Palette"
import { CurrencyMultiplierUtils } from "@common/shared/utils/CurrencyMultiplier.utils"
import { Events } from "@game/server/Networking"
import { sharedAtoms } from "@game/shared/atoms/SharedAtoms"
import { computed } from "@rbxts/charm"
import React, { useMemo } from "@rbxts/react"
import { useAtom } from "@rbxts/react-charm"
import { MarketplaceService, Players } from "@rbxts/services"

interface Props {

}

export function NextCurrencyMultiplier({}: Props) {
    const px = usePx();
    
    const currentMultiplier = useAtom(computed(() => LocalSessionAtom().currencyMultiplier));
    const nextMultiplier = useMemo(() => {
        return CurrencyMultiplierUtils.getNextCurrencyMultiplierName(currentMultiplier);
    }, [currentMultiplier]);
    const currentMultiplierDatum = useMemo(() => {
        return CURRENCY_MULTIPLIERS_DATA[currentMultiplier];
    }, [currentMultiplier]);
    const nextMultiplierDatum = useMemo(() => {
        if (!nextMultiplier) return undefined;
        return CURRENCY_MULTIPLIERS_DATA[nextMultiplier];
    }, [nextMultiplier])
    
    const productPrices = useAtom(sharedAtoms.DevProductsPricesAtom);
    const nextMultiplierPrice = useMemo(() => {
        if (!nextMultiplierDatum || !nextMultiplierDatum.productName) return undefined;
        return productPrices[nextMultiplierDatum.productName].priceText;
    }, [nextMultiplierDatum, productPrices]);
    
    return (
        <RoundedButton
            Size={new UDim2(0.8, 0, 1, 0)}
            aspectRatio={3}
            backgroundColorSequence={Palette.ColorSequences.yellow}
            Event={{
                Activated: () => {
                    if (!nextMultiplierDatum || !nextMultiplierDatum.productName) return;
                    MarketplaceService.PromptProductPurchase(Players.LocalPlayer, nextMultiplierDatum.productName);
                },
            }}
        >
            <uistroke Thickness={px(4)} />
            <DefaultTextLabel 
                Size={UDim2.fromScale(0.8, 0.8)}
                Position={UDim2.fromScale(0.5, 0.5)}
                AnchorPoint={new Vector2(0.5, 0.5)}
                Text={nextMultiplierDatum ? `X${nextMultiplierDatum.currencyMultiplier} Cash` : `X${currentMultiplierDatum.currencyMultiplier} Cash (MAX)`}
            >   
                <uistroke Thickness={px(4)} />
            </DefaultTextLabel>
            {nextMultiplierPrice !== undefined && <AutomaticRatioLabel 
                Size={UDim2.fromScale(0.8, 0.4)}
                Position={UDim2.fromScale(0.15, 0)}
                AnchorPoint={new Vector2(0.5, 0.5)}
                Text={`\u{E002}${nextMultiplierPrice} Only!`}
                Rotation={-15}
            >   
                <uistroke Thickness={px(4)} />
                <uigradient 
                    Color={Palette.ColorSequences.rainbow}
                />
            </AutomaticRatioLabel>}
        </RoundedButton>
    )
}