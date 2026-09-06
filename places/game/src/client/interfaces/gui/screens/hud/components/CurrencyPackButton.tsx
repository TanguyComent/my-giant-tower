import { LocalSessionAtom } from "@common/client/states/LocalSession.atom"
import { CURRENCY_PACKS_DATA } from "@common/shared/data/currency-packs/CurrencyPacks.data"
import { DefaultTextLabel } from "@common/shared/interfaces/components/DefaultTextLabel"
import { RoundedButton } from "@common/shared/interfaces/components/RoundedButton"
import { usePx } from "@common/shared/interfaces/hooks/usePx"
import { ECurrencyPacksProducts, EDevProducts } from "@common/shared/marketplace/EDevProducts"
import { Palette } from "@common/shared/Palette"
import { FormatUtils } from "@common/shared/utils/Format.utils"
import { TowerPartsUtils } from "@common/shared/utils/TowerParts.utils"
import { computed } from "@rbxts/charm"
import React, { useMemo } from "@rbxts/react"
import { useAtom } from "@rbxts/react-charm"
import { MarketplaceService, Players } from "@rbxts/services"

interface Props {
    productName: ECurrencyPacksProducts;
}

export function CurrencyPackButton({ productName }: Props) {
    const px = usePx();
    const towerParts = useAtom(computed(() => LocalSessionAtom().towerParts));
    const currentMultiplier = useAtom(computed(() => LocalSessionAtom().currencyMultiplier));
    const productDatum = useMemo(() => CURRENCY_PACKS_DATA[productName], [productName]);
    const earnings = useMemo(() => {
        const towerGeneration = TowerPartsUtils.getTowerGeneration(towerParts, productDatum.duration, {
            premiumMultiplierName: currentMultiplier,
        });
        return math.max(productDatum.minimumAwarded, towerGeneration);
    }, [towerParts, productDatum, currentMultiplier]);

    return (
        <RoundedButton
            Size={new UDim2(0.8, 0, 1, 0)}
            aspectRatio={3}
            backgroundColorSequence={Palette.ColorSequences.green}
            Event={{
                Activated: () => {
                    MarketplaceService.PromptProductPurchase(Players.LocalPlayer, productName);
                },
            }}
        >
            <uistroke Thickness={px(4)} />
            <DefaultTextLabel 
                Size={UDim2.fromScale(0.8, 0.8)}
                Position={UDim2.fromScale(0.5, 0.5)}
                AnchorPoint={new Vector2(0.5, 0.5)}
                Text={`+$${FormatUtils.formatCurrency(earnings)}`}
            >   
                <uistroke Thickness={px(4)} />
            </DefaultTextLabel>
        </RoundedButton>
    )
}